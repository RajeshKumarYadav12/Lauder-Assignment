# Louder Events - Project Submission Report

**Student Project**: Full-Stack Web Development Assignment
**Project Name**: Louder Events - Sydney Event Aggregator
**Tech Stack**: MERN (MongoDB, Express, React, Node.js) + TailwindCSS
**Date**: October 31, 2025

---

## 1. Executive Summary

Louder Events is a full-stack web application that automatically aggregates and displays live events happening in Sydney, Australia. The application scrapes event data from multiple sources (Eventbrite, Meetup, etc.), stores it in a MongoDB database, and presents it through a beautiful, responsive React interface. Users can browse events, search by keywords, and click through to purchase tickets after providing their email address.

---

## 2. Project Approach & Architecture

### 2.1 System Architecture

The application follows a modern three-tier architecture:

1. **Presentation Layer (Frontend)**

   - React 18 with Vite for fast development
   - TailwindCSS for responsive, utility-first styling
   - Axios for API communication
   - Custom hooks for state management

2. **Application Layer (Backend API)**

   - Node.js with Express framework
   - RESTful API design
   - CORS enabled for cross-origin requests
   - Error handling middleware

3. **Data Layer**
   - MongoDB Atlas for cloud database
   - Mongoose ODM for schema validation
   - Indexed queries for performance

### 2.2 Data Flow

```
[Event Sources] → [Scraper] → [MongoDB] → [Express API] → [React Frontend] → [User]
       ↑                                         ↓
       └─────────── [Cron Job - Every 6hrs] ────┘
```

1. **Data Collection**: Scraper fetches events from external sources
2. **Data Storage**: Events stored/updated in MongoDB (deduplication via externalId)
3. **Data Serving**: Express API exposes events through RESTful endpoints
4. **Data Display**: React frontend fetches and displays events
5. **Automation**: Cron job runs every 6 hours to refresh data

### 2.3 Key Design Decisions

**Why MERN Stack?**

- **MongoDB**: Flexible schema for varying event data structures
- **Express**: Lightweight, fast API development
- **React**: Component-based UI, excellent for dynamic content
- **Node.js**: JavaScript everywhere, easy integration

**Why TailwindCSS?**

- Rapid UI development with utility classes
- Consistent design system
- Smaller bundle size than traditional CSS frameworks
- Easy to customize and maintain

**Why Vite?**

- Lightning-fast hot module replacement (HMR)
- Optimized production builds
- Better developer experience than Create React App

---

## 3. Technical Implementation

### 3.1 Backend Features

**Event Model** (`models/Event.js`)

- Schema validation with Mongoose
- Unique external IDs to prevent duplicates
- Timestamps for tracking
- Virtual properties for computed values

**Scraper** (`utils/scraper.js`)

- Uses Cheerio for HTML parsing
- Axios for HTTP requests
- Fallback to sample data when scraping fails
- Flexible date parsing
- Error handling for each source

**Cron Job** (`cron/updateEvents.js`)

- Scheduled with node-cron
- Configurable interval (default: 6 hours)
- Automatic deduplication
- Runs initial scrape on server start

**API Routes** (`routes/eventRoutes.js`)

- RESTful design (GET, POST, PUT, DELETE)
- Query parameters for filtering
- Proper HTTP status codes
- Consistent response format

### 3.2 Frontend Features

**Custom Hook** (`hooks/useFetchEvents.js`)

- Encapsulates API logic
- Loading and error states
- Automatic data fetching
- Refetch capability

**Components**

- **EventCard**: Reusable event display with hover effects
- **EmailModal**: Email capture with validation
- **Navbar**: Sticky navigation with branding
- **Footer**: Links and social media
- **Home**: Main page with search and grid layout

**State Management**

- React hooks (useState, useEffect)
- Local component state
- Props drilling for simple data flow

**Styling**

- Tailwind utility classes
- Custom CSS for animations
- Responsive breakpoints
- Dark mode ready (footer)

### 3.3 Advanced Features

1. **Search Functionality**

   - Real-time client-side filtering
   - Searches title, location, and description
   - Case-insensitive matching

2. **Email Collection**

   - Modal-based flow
   - Email validation
   - Local storage for tracking user interests
   - Graceful error handling

3. **Loading States**

   - Spinner animation while fetching
   - Skeleton screens could be added
   - Error boundaries for crash protection

4. **Responsive Design**
   - Mobile-first approach
   - Grid adapts: 1 col (mobile) → 2 cols (tablet) → 3 cols (desktop)
   - Touch-friendly buttons
   - Sticky navigation and search bar

---

## 4. Challenges Faced & Solutions

### Challenge 1: Website Scraping Complexity

**Problem**: Modern event websites (Eventbrite, Meetup) use:

- JavaScript rendering (React, Vue)
- API authentication requirements
- Rate limiting
- Dynamic content loading

**Solution**:

- Implemented Cheerio for static HTML parsing
- Created sample data fallback for testing/demo
- Documented upgrade path to Puppeteer for JS-rendered sites
- Implemented respectful scraping with delays

**Learning**: Web scraping requires careful consideration of:

- Website terms of service
- Legal and ethical implications
- Technical limitations
- API alternatives when available

### Challenge 2: Data Consistency & Duplication

**Problem**: Same events from different sources could create duplicates with:

- Different formats
- Different IDs
- Slightly different titles or dates

**Solution**:

- Created `externalId` field combining source and ID
- Implemented upsert logic (update if exists, create if not)
- Added source tracking to know where events came from
- Used Mongoose schema validation

**Learning**: Database design is critical for data integrity.

### Challenge 3: Date Format Variations

**Problem**: Event dates come in many formats:

- "Nov 15, 2025"
- "15th November 2025, 10:00 AM"
- ISO 8601: "2025-11-15T10:00:00Z"
- Relative: "Tomorrow at 7 PM"

**Solution**:

- Created flexible date parser with try-catch
- Default to current date if parsing fails
- Store dates in ISO format in database
- Format dates consistently in frontend

**Learning**: Always normalize data at ingestion.

### Challenge 4: Environment Configuration

**Problem**: Different URLs for development vs. production:

- Local: `localhost:5000` and `localhost:5173`
- Production: `render.com` and `vercel.app`

**Solution**:

- Used environment variables (.env files)
- Vite's `import.meta.env` for frontend
- process.env for backend
- Clear documentation in .env.example files

**Learning**: Never hardcode URLs or sensitive data.

### Challenge 5: CORS Issues

**Problem**: Browser blocks requests from frontend (port 5173) to backend (port 5000)

**Solution**:

- Configured CORS middleware in Express
- Allowed specific origin from environment variable
- Enabled credentials for future authentication

**Learning**: CORS is essential for modern web apps.

---

## 5. Testing Approach

### Manual Testing Performed

1. **Backend Testing**

   - ✅ MongoDB connection successful
   - ✅ API endpoints return correct data
   - ✅ Scraper successfully fetches/creates events
   - ✅ Cron job runs on schedule
   - ✅ Error handling for invalid requests

2. **Frontend Testing**

   - ✅ Events display correctly
   - ✅ Search filters events
   - ✅ Modal opens/closes properly
   - ✅ Email validation works
   - ✅ Redirect to event site successful
   - ✅ Responsive on mobile, tablet, desktop

3. **Integration Testing**
   - ✅ Frontend successfully fetches from backend
   - ✅ Loading states display correctly
   - ✅ Error messages show when backend is down
   - ✅ Refresh button re-fetches data

### Testing Tools Used

- **Postman**: API endpoint testing
- **Browser DevTools**: Network requests, console errors
- **React DevTools**: Component state inspection
- **MongoDB Compass**: Database queries and data inspection

---

## 6. Deployment Strategy

### 6.1 Backend Deployment (Render)

**Steps**:

1. Connect GitHub repository
2. Configure build settings
3. Add environment variables
4. Deploy

**Considerations**:

- Free tier has cold starts (30s delay on first request)
- Cron job remains active
- MongoDB Atlas connection from Render IP

### 6.2 Frontend Deployment (Vercel)

**Steps**:

1. Import GitHub repository
2. Detect Vite framework automatically
3. Add backend URL to environment
4. Deploy

**Considerations**:

- Automatic deployments on git push
- Preview deployments for pull requests
- CDN for global distribution
- SSL/HTTPS by default

### 6.3 Database (MongoDB Atlas)

**Configuration**:

- Free tier (512MB storage)
- Cluster in Sydney region for low latency
- IP whitelist includes deployment platforms
- Database user with read/write permissions

---

## 7. Future Improvements

### 7.1 AI & Machine Learning Integration

**Event Recommendations**

- Track user browsing history
- Use collaborative filtering
- Suggest events based on preferences

**Smart Search**

- Natural language processing (NLP)
- Understand queries like "concerts this weekend"
- Semantic search vs. keyword matching

**Chatbot Assistant**

- Help users find events
- Answer questions about venues
- Provide directions and timing

### 7.2 User Features

**Authentication**

- User registration and login
- Social login (Google, Facebook)
- Profile management

**Personalization**

- Save favorite events
- Create event lists
- Set preferences (music, food, tech, etc.)

**Notifications**

- Email reminders before events
- SMS alerts for last-minute tickets
- Push notifications (PWA)

### 7.3 Enhanced Data Collection

**More Sources**

- Facebook Events
- TimeOut Sydney
- Eventfinda
- Official venue websites

**API Integration**

- Use official APIs (Eventbrite API)
- Real-time event updates
- Ticket availability status

**User-Generated Content**

- Allow users to submit events
- Community moderation
- Event ratings and reviews

### 7.4 Technical Improvements

**Performance**

- Redis caching for API responses
- Image optimization and lazy loading
- Server-side rendering (Next.js)
- Progressive Web App (PWA)

**Features**

- Advanced filters (price, category, time)
- Calendar view of events
- Map view with venue locations
- Export events to Google Calendar

**DevOps**

- CI/CD pipeline (GitHub Actions)
- Automated testing (Jest, Cypress)
- Monitoring and logging (Sentry)
- Database backups

---

## 8. Lessons Learned

### Technical Lessons

1. **Plan Before Coding**: A clear architecture saves time debugging
2. **Component Design**: Small, reusable components are easier to maintain
3. **Error Handling**: Always expect things to fail and handle gracefully
4. **Environment Variables**: Essential for secure, flexible deployment
5. **Version Control**: Commit often with clear messages

### Project Management

1. **Break Down Tasks**: Large features into small, manageable pieces
2. **Documentation**: Write docs as you code, not after
3. **Testing Early**: Test each feature before moving to the next
4. **User Experience**: Simple, intuitive design beats complex features

### Web Scraping Insights

1. **Respect Website Rules**: Check robots.txt and terms of service
2. **Use APIs When Available**: More reliable than scraping
3. **Handle Failures**: Websites change, scrapers break
4. **Be Ethical**: Don't overload servers with requests

---

## 9. Conclusion

This project successfully demonstrates a full-stack web application using the MERN stack. The application automatically aggregates event data, stores it efficiently, and presents it through a modern, user-friendly interface. Key achievements include:

✅ **Functional scraper** with automatic updates
✅ **RESTful API** with proper error handling
✅ **Responsive UI** with TailwindCSS
✅ **Email collection** before ticket purchase
✅ **Production-ready** deployment strategy
✅ **Comprehensive documentation** for future development

The project provides a solid foundation for a real-world event aggregation platform and demonstrates proficiency in:

- Full-stack JavaScript development
- Database design and management
- Web scraping and automation
- Modern frontend development
- API design and development
- Deployment and DevOps

### Time Investment

- **Backend Development**: ~8 hours
- **Frontend Development**: ~10 hours
- **Integration & Testing**: ~4 hours
- **Documentation**: ~3 hours
- **Total**: ~25 hours

### Final Thoughts

This project showcases the power of the MERN stack for building modern web applications. The modular architecture allows for easy extension and maintenance, while the clean code and documentation ensure that future developers can quickly understand and contribute to the project.

---

**GitHub Repository**: [Your GitHub URL]
**Live Demo**: [Your Vercel URL]
**API Endpoint**: [Your Render URL]

**Prepared by**: [Your Name]
**Date**: October 31, 2025
