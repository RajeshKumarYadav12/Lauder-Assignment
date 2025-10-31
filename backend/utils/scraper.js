import axios from "axios";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer";
import Event from "../models/Event.js";

/**
 * Scrape events from Eventbrite using Puppeteer (JavaScript-rendered content)
 */
const scrapeEventbrite = async () => {
  let browser;
  try {
    console.log("🔍 Starting Eventbrite scraper with Puppeteer...");

    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    );

    // Navigate to Eventbrite Sydney events
    const url = "https://www.eventbrite.com.au/d/australia--sydney/events/";
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

    // Wait for events to load
    await page
      .waitForSelector('[data-testid="search-results-list"]', {
        timeout: 10000,
      })
      .catch(() => {});

    // Extract event data
    const events = await page.evaluate(() => {
      const eventElements = document.querySelectorAll(
        '[data-testid="search-event-card"]'
      );
      const results = [];

      eventElements.forEach((element, index) => {
        if (index >= 30) return; // Limit to 30 events

        try {
          const titleEl = element.querySelector('h3, h2, [class*="title"]');
          const linkEl = element.querySelector("a");
          const imageEl = element.querySelector("img");
          const dateEl = element.querySelector('[class*="date"], time');
          const locationEl = element.querySelector('[class*="location"]');
          const priceEl = element.querySelector('[class*="price"]');

          const title = titleEl?.textContent?.trim();
          const url = linkEl?.href;
          const image = imageEl?.src || imageEl?.getAttribute("data-src");
          const dateText =
            dateEl?.textContent?.trim() || dateEl?.getAttribute("datetime");
          const location = locationEl?.textContent?.trim();
          const price = priceEl?.textContent?.trim();

          if (title && url) {
            results.push({
              title,
              url,
              image:
                image ||
                "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
              dateText,
              location: location || "Sydney, Australia",
              price: price || "Free",
              description: title,
            });
          }
        } catch (err) {
          console.error("Error parsing event:", err);
        }
      });

      return results;
    });

    await browser.close();

    // Format events for database
    const formattedEvents = events.map((event) => ({
      title: event.title,
      date: parseDateString(event.dateText) || getUpcomingDate(),
      location: event.location,
      image: event.image,
      description: `${event.title}. ${
        event.price ? "Price: " + event.price : "Check website for pricing."
      }`,
      url: event.url,
      source: "eventbrite",
      externalId: `eventbrite_${event.url.split("/").pop().split("?")[0]}`,
    }));

    console.log(`✅ Found ${formattedEvents.length} events from Eventbrite`);
    return formattedEvents;
  } catch (error) {
    console.error("❌ Error scraping Eventbrite:", error.message);
    if (browser) await browser.close();
    return [];
  }
};

/**
 * Scrape events from TimeOut Sydney using Axios + Cheerio
 */
const scrapeTimeOutSydney = async () => {
  try {
    console.log("🔍 Starting TimeOut Sydney scraper...");

    const url =
      "https://www.timeout.com/sydney/things-to-do/whats-on-in-sydney-today";

    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      timeout: 15000,
    });

    const $ = cheerio.load(response.data);
    const events = [];

    // Parse TimeOut Sydney events
    $('article, .card, [class*="event"]').each((index, element) => {
      if (index >= 20) return false;

      const $el = $(element);
      const title = $el
        .find('h3, h2, .title, [class*="title"]')
        .first()
        .text()
        .trim();
      const link = $el.find("a").first().attr("href");
      const image =
        $el.find("img").first().attr("src") ||
        $el.find("img").first().attr("data-src");
      const description = $el
        .find('p, .description, [class*="desc"]')
        .first()
        .text()
        .trim();
      const location = $el
        .find('[class*="location"], [class*="venue"]')
        .first()
        .text()
        .trim();

      if (title && link) {
        const fullUrl = link.startsWith("http")
          ? link
          : `https://www.timeout.com${link}`;
        events.push({
          title: title.substring(0, 200),
          date: getUpcomingDate(),
          location: location || "Sydney, NSW",
          image:
            image ||
            "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
          description: description.substring(0, 300) || title,
          url: fullUrl,
          source: "timeout",
          externalId: `timeout_${link.split("/").pop()}`,
        });
      }
    });

    console.log(`✅ Found ${events.length} events from TimeOut Sydney`);
    return events;
  } catch (error) {
    console.error("❌ Error scraping TimeOut Sydney:", error.message);
    return [];
  }
};

/**
 * Scrape events from Eventfinda Sydney
 */
const scrapeEventfinda = async () => {
  try {
    console.log("🔍 Starting Eventfinda scraper...");

    const url = "https://www.eventfinda.com.au/whatson/events/sydney";

    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      timeout: 15000,
    });

    const $ = cheerio.load(response.data);
    const events = [];

    // Parse Eventfinda events
    $('.event-item, .event-card, [class*="event"]').each((index, element) => {
      if (index >= 20) return false;

      const $el = $(element);
      const title = $el
        .find('h3, h2, .event-title, [class*="title"]')
        .first()
        .text()
        .trim();
      const link = $el.find("a").first().attr("href");
      const image =
        $el.find("img").first().attr("src") ||
        $el.find("img").first().attr("data-src");
      const dateText = $el
        .find('.date, [class*="date"], time')
        .first()
        .text()
        .trim();
      const location = $el
        .find('.venue, [class*="venue"], [class*="location"]')
        .first()
        .text()
        .trim();

      if (title && link) {
        const fullUrl = link.startsWith("http")
          ? link
          : `https://www.eventfinda.com.au${link}`;
        events.push({
          title: title.substring(0, 200),
          date: parseDateString(dateText) || getUpcomingDate(),
          location: location || "Sydney, NSW",
          image:
            image ||
            "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4",
          description: title,
          url: fullUrl,
          source: "eventfinda",
          externalId: `eventfinda_${link.split("/").pop()}`,
        });
      }
    });

    console.log(`✅ Found ${events.length} events from Eventfinda`);
    return events;
  } catch (error) {
    console.error("❌ Error scraping Eventfinda:", error.message);
    return [];
  }
};

/**
 * Scrape events from Sydney.com (Destination NSW)
 */
const scrapeSydneyDotCom = async () => {
  try {
    console.log("🔍 Starting Sydney.com scraper...");

    const url = "https://www.sydney.com/things-to-do/events";

    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      timeout: 15000,
    });

    const $ = cheerio.load(response.data);
    const events = [];

    // Parse Sydney.com events
    $('article, .event, .card, [class*="listing"]').each((index, element) => {
      if (index >= 15) return false;

      const $el = $(element);
      const title = $el
        .find('h3, h2, h4, [class*="title"]')
        .first()
        .text()
        .trim();
      const link = $el.find("a").first().attr("href");
      const image =
        $el.find("img").first().attr("src") ||
        $el.find("img").first().attr("data-src");
      const description = $el.find('p, [class*="desc"]').first().text().trim();

      if (title && link) {
        const fullUrl = link.startsWith("http")
          ? link
          : `https://www.sydney.com${link}`;
        events.push({
          title: title.substring(0, 200),
          date: getUpcomingDate(),
          location: "Sydney, NSW",
          image:
            image ||
            "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9",
          description: description.substring(0, 300) || title,
          url: fullUrl,
          source: "sydney.com",
          externalId: `sydneycom_${link.split("/").pop()}`,
        });
      }
    });

    console.log(`✅ Found ${events.length} events from Sydney.com`);
    return events;
  } catch (error) {
    console.error("❌ Error scraping Sydney.com:", error.message);
    return [];
  }
};

/**
 * Scrape events from Meetup
 * Note: Meetup now requires authentication for most data
 */
const scrapeMeetup = async () => {
  try {
    console.log("🔍 Starting Meetup scraper...");

    // Since Meetup requires auth, we'll return mock data or skip
    // In production, you'd use Meetup API with authentication
    console.log("⚠️  Meetup requires API authentication - skipping for now");

    return [];
  } catch (error) {
    console.error("❌ Error scraping Meetup:", error.message);
    return [];
  }
};

/**
 * Generate sample/fallback events for Sydney
 * Useful when scrapers fail or for initial testing
 */
const generateSampleEvents = () => {
  const sampleEvents = [
    {
      title: "Sydney Harbour Bridge Climb Experience",
      date: new Date("2025-11-15T10:00:00"),
      location: "Sydney Harbour Bridge, Sydney NSW",
      image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9",
      description:
        "Experience breathtaking views of Sydney from the iconic Harbour Bridge. A guided climb suitable for all fitness levels.",
      url: "https://www.bridgeclimb.com/",
      source: "manual",
      externalId: "sample_bridge_climb",
    },
    {
      title: "Vivid Sydney Festival 2025",
      date: new Date("2025-11-20T18:00:00"),
      location: "Circular Quay, Sydney NSW",
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3",
      description:
        "Annual festival of light, music, and ideas transforming Sydney into a creative canvas of innovation and inspiration.",
      url: "https://www.vividsydney.com/",
      source: "manual",
      externalId: "sample_vivid_sydney",
    },
    {
      title: "Sydney Food Festival - Bondi Beach",
      date: new Date("2025-11-25T12:00:00"),
      location: "Bondi Beach, Sydney NSW",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
      description:
        "Celebrate Sydney's diverse culinary scene with food stalls, cooking demos, and live entertainment by the beach.",
      url: "https://www.eventbrite.com.au/d/australia--sydney/food-festival/",
      source: "manual",
      externalId: "sample_food_festival",
    },
    {
      title: "Sydney Opera House Concert - Classical Night",
      date: new Date("2025-12-01T19:30:00"),
      location: "Sydney Opera House, Sydney NSW",
      image: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b",
      description:
        "Experience world-class orchestral performance in the iconic Sydney Opera House. Featuring Mozart and Beethoven.",
      url: "https://www.sydneyoperahouse.com/events.html",
      source: "manual",
      externalId: "sample_opera_concert",
    },
    {
      title: "Sydney Tech Meetup - AI & Machine Learning",
      date: new Date("2025-12-05T18:00:00"),
      location: "Tech Hub, Barangaroo, Sydney NSW",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998",
      description:
        "Join Sydney's tech community for talks on AI, ML, and the future of technology. Networking and refreshments included.",
      url: "https://www.meetup.com/find/?location=au--sydney&source=EVENTS",
      source: "manual",
      externalId: "sample_tech_meetup",
    },
    {
      title: "Coastal Walk & Picnic - Manly to Spit",
      date: new Date("2025-12-08T09:00:00"),
      location: "Manly Beach, Sydney NSW",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
      description:
        "Guided coastal walk from Manly to Spit Bridge. Enjoy stunning views, native wildlife, and a beachside picnic.",
      url: "https://www.eventbrite.com.au/d/australia--sydney/walks/",
      source: "manual",
      externalId: "sample_coastal_walk",
    },
    {
      title: "Sydney Startup Weekend",
      date: new Date("2025-12-10T09:00:00"),
      location: "Stone & Chalk, Sydney NSW",
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd",
      description:
        "54-hour weekend event where entrepreneurs and aspiring entrepreneurs pitch ideas, form teams, and launch startups.",
      url: "https://www.eventbrite.com.au/d/australia--sydney/startup-weekend/",
      source: "manual",
      externalId: "sample_startup_weekend",
    },
    {
      title: "Christmas Market at The Rocks",
      date: new Date("2025-12-15T10:00:00"),
      location: "The Rocks, Sydney NSW",
      image: "https://images.unsplash.com/photo-1482818817648-c000317eb062",
      description:
        "Festive Christmas market featuring local artisans, food vendors, live music, and holiday cheer in historic The Rocks.",
      url: "https://www.therocks.com/whats-on/",
      source: "manual",
      externalId: "sample_christmas_market",
    },
  ];

  return sampleEvents;
};

/**
 * Parse various date string formats
 */
const parseDateString = (dateStr) => {
  if (!dateStr) return null;

  try {
    // Clean the date string
    let cleaned = dateStr.replace(/\s+/g, " ").trim();

    // Try to parse the date string
    const date = new Date(cleaned);
    if (!isNaN(date.getTime()) && date > new Date()) {
      return date;
    }

    // Try common patterns
    const patterns = [
      /(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{4})/i,
      /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{1,2}),?\s+(\d{4})/i,
    ];

    for (const pattern of patterns) {
      const match = cleaned.match(pattern);
      if (match) {
        const parsed = new Date(match[0]);
        if (!isNaN(parsed.getTime())) {
          return parsed;
        }
      }
    }
  } catch (error) {
    console.error("Error parsing date:", dateStr);
  }

  return null;
};

/**
 * Generate upcoming date (used when real date not available)
 */
const getUpcomingDate = () => {
  const dates = [
    new Date("2025-11-15T10:00:00"),
    new Date("2025-11-20T18:00:00"),
    new Date("2025-11-25T12:00:00"),
    new Date("2025-12-01T19:30:00"),
    new Date("2025-12-05T18:00:00"),
    new Date("2025-12-08T09:00:00"),
    new Date("2025-12-10T09:00:00"),
    new Date("2025-12-15T10:00:00"),
    new Date("2025-12-20T14:00:00"),
    new Date("2026-01-05T11:00:00"),
  ];

  return dates[Math.floor(Math.random() * dates.length)];
};

/**
 * Save or update events in database
 * Prevents duplicates using externalId
 */
const saveEvents = async (events) => {
  let savedCount = 0;
  let updatedCount = 0;

  for (const eventData of events) {
    try {
      if (eventData.externalId) {
        // Try to find existing event
        const existing = await Event.findOne({
          externalId: eventData.externalId,
        });

        if (existing) {
          // Update existing event
          await Event.findByIdAndUpdate(existing._id, eventData);
          updatedCount++;
        } else {
          // Create new event
          await Event.create(eventData);
          savedCount++;
        }
      } else {
        // No externalId, create new
        await Event.create(eventData);
        savedCount++;
      }
    } catch (error) {
      console.error(`Error saving event "${eventData.title}":`, error.message);
    }
  }

  return { savedCount, updatedCount };
};

/**
 * Main scraper function
 * Orchestrates all scrapers and saves results
 */
export const scrapeAllEvents = async () => {
  try {
    console.log("🚀 Starting event scraping process...");
    console.log("📍 Target city: Sydney, Australia");
    console.log("⏰ Time:", new Date().toLocaleString());
    console.log("");

    // Run all scrapers in parallel for faster execution
    const [
      eventbriteEvents,
      timeoutEvents,
      eventfindaEvents,
      sydneyComEvents,
      meetupEvents,
    ] = await Promise.all([
      scrapeEventbrite().catch((err) => {
        console.error("Eventbrite failed:", err.message);
        return [];
      }),
      scrapeTimeOutSydney().catch((err) => {
        console.error("TimeOut failed:", err.message);
        return [];
      }),
      scrapeEventfinda().catch((err) => {
        console.error("Eventfinda failed:", err.message);
        return [];
      }),
      scrapeSydneyDotCom().catch((err) => {
        console.error("Sydney.com failed:", err.message);
        return [];
      }),
      scrapeMeetup().catch((err) => {
        console.error("Meetup failed:", err.message);
        return [];
      }),
    ]);

    // Combine all events
    let allEvents = [
      ...eventbriteEvents,
      ...timeoutEvents,
      ...eventfindaEvents,
      ...sydneyComEvents,
      ...meetupEvents,
    ];

    console.log("");
    console.log("📊 Scraping Summary:");
    console.log(`   Eventbrite: ${eventbriteEvents.length} events`);
    console.log(`   TimeOut Sydney: ${timeoutEvents.length} events`);
    console.log(`   Eventfinda: ${eventfindaEvents.length} events`);
    console.log(`   Sydney.com: ${sydneyComEvents.length} events`);
    console.log(`   Meetup: ${meetupEvents.length} events`);
    console.log(`   Total scraped: ${allEvents.length} events`);
    console.log("");

    // If no events scraped, use sample data as fallback
    if (allEvents.length === 0) {
      console.log("⚠️  No events scraped from live sources, using sample data");
      allEvents = generateSampleEvents();
    }

    // Remove duplicates based on similar titles
    allEvents = removeDuplicates(allEvents);
    console.log(`✅ After deduplication: ${allEvents.length} unique events`);

    // Save to database
    const { savedCount, updatedCount } = await saveEvents(allEvents);

    console.log("");
    console.log("✅ Scraping complete!");
    console.log(`   New events: ${savedCount}`);
    console.log(`   Updated events: ${updatedCount}`);
    console.log(`   Total in database: ${savedCount + updatedCount}`);
    console.log("");

    return {
      success: true,
      total: allEvents.length,
      saved: savedCount,
      updated: updatedCount,
      sources: {
        eventbrite: eventbriteEvents.length,
        timeout: timeoutEvents.length,
        eventfinda: eventfindaEvents.length,
        sydneycom: sydneyComEvents.length,
        meetup: meetupEvents.length,
      },
    };
  } catch (error) {
    console.error("❌ Error in scraping process:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Remove duplicate events based on title similarity
 */
const removeDuplicates = (events) => {
  const seen = new Map();
  const unique = [];

  for (const event of events) {
    // Create a normalized key from title
    const key = event.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .substring(0, 50);

    if (!seen.has(key)) {
      seen.set(key, true);
      unique.push(event);
    }
  }

  return unique;
};

export default scrapeAllEvents;
