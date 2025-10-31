# 🎉 Louder Events - Sydney Event Aggregator

A full-stack MERN application that automatically scrapes and displays live events happening in Sydney, Australia. Built with React, Node.js, Express, MongoDB, and TailwindCSS.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Future Improvements](#future-improvements)

## ✨ Features

- 🔄 **Automatic Event Scraping** - Scrapes events from Eventbrite and other sources
- ⏰ **Scheduled Updates** - Cron job updates events every 6 hours
- 🎨 **Beautiful UI** - Modern, responsive design with TailwindCSS
- 📧 **Email Collection** - Collects user email before redirecting to event sites
- 🔍 **Search & Filter** - Real-time event search functionality
- 📱 **Responsive Design** - Works perfectly on all devices
- 🚀 **Fast Performance** - Built with Vite for lightning-fast development

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Icons** - Icon library

### Backend

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Cheerio** - Web scraping
- **Node-cron** - Task scheduling

## 📁 Project Structure

```
Assignment3/
│
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   └── eventController.js    # Event CRUD operations
│   ├── cron/
│   │   └── updateEvents.js       # Scheduled scraping job
│   ├── models/
│   │   └── Event.js              # Event schema
│   ├── routes/
│   │   └── eventRoutes.js        # API routes
│   ├── utils/
│   │   └── scraper.js            # Web scraping logic
│   ├── .env.example              # Environment variables template
│   ├── package.json
│   └── server.js                 # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── EventCard.jsx     # Event display card
│   │   │   ├── EmailModal.jsx    # Email capture modal
│   │   │   ├── Navbar.jsx        # Navigation bar
│   │   │   └── Footer.jsx        # Footer component
│   │   ├── pages/
│   │   │   └── Home.jsx          # Home page
│   │   ├── hooks/
│   │   │   └── useFetchEvents.js # Custom hook for API calls
│   │   ├── services/
│   │   │   └── api.js            # API service layer
│   │   ├── App.jsx               # Main app component
│   │   ├── main.jsx              # Entry point
│   │   └── index.css             # Global styles
│   ├── .env.example              # Environment variables template
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
│
└── README.md                     # This file
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone the Repository

```bash
cd Assignment3
```

### 2. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env with your MongoDB URI
# MONGODB_URI=your_mongodb_connection_string
# PORT=5000
# FRONTEND_URL=http://localhost:5173

# Start the server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env with your backend URL
# VITE_API_URL=http://localhost:5000/api

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### 4. MongoDB Setup

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Click "Connect" and get your connection string
4. Replace `<password>` with your database user password
5. Update the `MONGODB_URI` in backend `.env` file

## 📦 Deployment

### Backend Deployment (Render)

1. Create account on [Render](https://render.com)
2. Create new **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variables from `.env.example`
6. Deploy!

### Frontend Deployment (Vercel)

1. Create account on [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
4. Add environment variable:
   - `VITE_API_URL`: Your Render backend URL
5. Deploy!

### Alternative Deployment Options

- **Backend**: Heroku, Railway, AWS, DigitalOcean
- **Frontend**: Netlify, GitHub Pages, Cloudflare Pages

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Endpoints

#### Get All Events

```http
GET /events
```

Query Parameters:

- `upcoming` (boolean) - Filter for upcoming events only
- `limit` (number) - Limit results (default: 50)

Response:

```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "_id": "...",
      "title": "Event Title",
      "date": "2025-11-15T10:00:00Z",
      "location": "Sydney, NSW",
      "image": "https://...",
      "description": "Event description",
      "url": "https://...",
      "source": "eventbrite"
    }
  ]
}
```

#### Get Single Event

```http
GET /events/:id
```

#### Create Event

```http
POST /events
Content-Type: application/json

{
  "title": "Event Title",
  "date": "2025-11-15T10:00:00Z",
  "location": "Sydney, NSW",
  "image": "https://...",
  "description": "Description",
  "url": "https://...",
  "source": "manual"
}
```

#### Health Check

```http
GET /health
```

## 🔧 Configuration

### Backend Environment Variables

```env
MONGODB_URI=mongodb+srv://...
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
SCRAPER_INTERVAL_HOURS=6
```

### Frontend Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
```

## 🎯 Key Features Explained

### 1. Web Scraping

The scraper (`utils/scraper.js`) uses:

- **Axios** for HTTP requests
- **Cheerio** for HTML parsing
- Fallback to sample data if scraping fails

### 2. Automatic Updates

Cron job (`cron/updateEvents.js`):

- Runs every 6 hours (configurable)
- Updates existing events
- Adds new events
- Prevents duplicates using `externalId`

### 3. Email Collection

Before redirecting to event site:

1. User clicks "Get Tickets"
2. Modal opens requesting email
3. Email validated and stored in localStorage
4. User redirected to original event URL

### 4. Responsive Design

- Mobile-first approach
- Grid layout adapts to screen size
- Touch-friendly buttons and navigation
- Optimized images

## 🐛 Troubleshooting

### Backend won't start

- Check MongoDB connection string
- Ensure all dependencies are installed
- Check port 5000 is not in use

### Frontend won't start

- Verify backend is running
- Check `VITE_API_URL` in `.env`
- Clear node_modules and reinstall

### No events showing

- Backend may still be scraping (check console)
- Sample events load if scraping fails
- Check browser console for errors

## 📈 Future Improvements

1. **AI-Powered Features**

   - Event recommendations based on user preferences
   - Smart search with NLP
   - Chatbot for event discovery

2. **Enhanced Functionality**

   - User authentication
   - Favorite events
   - Calendar integration
   - Event reminders via email/SMS

3. **Data Sources**

   - Add more event sources (Facebook Events, TimeOut)
   - Use official APIs with authentication
   - Real-time event updates

4. **User Experience**

   - City selection (Melbourne, Brisbane, etc.)
   - Advanced filters (price, category, date range)
   - Event ratings and reviews
   - Social sharing

5. **Performance**
   - Redis caching
   - CDN for images
   - Server-side rendering
   - Progressive Web App (PWA)

## 📝 Technical Challenges & Solutions

### Challenge 1: Dynamic Website Scraping

**Problem**: Modern event sites use JavaScript rendering
**Solution**: Used Cheerio for static HTML; ready to upgrade to Puppeteer for dynamic sites

### Challenge 2: Rate Limiting

**Problem**: Too many requests to event sites
**Solution**: Implemented cron job with reasonable intervals and request delays

### Challenge 3: Data Consistency

**Problem**: Duplicate events from different sources
**Solution**: Created `externalId` field to track and prevent duplicates

### Challenge 4: Date Parsing

**Problem**: Different date formats from various sources
**Solution**: Created flexible date parser with fallbacks

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👨‍💻 Author

Built with ❤️ by the Louder Team

## 🙏 Acknowledgments

- Event data sourced from public event platforms
- Icons from React Icons
- Images from Unsplash
- Deployed on Vercel and Render

---

**Note**: This is a student project for educational purposes. For production use, implement proper error handling, security measures, and respect website terms of service when scraping.
#   L a u d e r - A s s i g n m e n t  
 