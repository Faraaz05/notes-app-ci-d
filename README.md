# 📝 Modern Note-Taking App

A full-stack, production-ready SaaS-style note-taking application with a Supabase-inspired dark UI.

## 🚀 Quick Start Guide

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free tier works)
- Git

### Step 1: Clone and Setup

```bash
# You're already in the project directory
cd /home/faraaz/Development/DOCKER\ PRACTICE/ocr-notes-app
```

### Step 2: Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env with your MongoDB Atlas URI
nano .env  # or use your preferred editor
```

**Configure your `.env` file:**
```env
MONGODB_URI=your_mongodb_atlas_connection_string_here
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

**Get MongoDB Atlas URI:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (if you haven't)
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `notesapp` or your preferred name

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/notesapp?retryWrites=true&w=majority
```

### Step 3: Frontend Setup

```bash
# Open a new terminal, navigate to frontend
cd /home/faraaz/Development/DOCKER\ PRACTICE/ocr-notes-app/frontend

# Install dependencies
npm install

# Create .env file
touch .env
```

**Configure frontend `.env` file:**
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 4: Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

You should see:
```
🚀 Server running on port 5000
✅ MongoDB connected successfully
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 5: Open the App

Open your browser and go to: **http://localhost:5173**

## 🎯 Testing the App

1. **Landing Page** - Should load with hero section and features
2. **Register** - Create a new account at `/register`
3. **Login** - Sign in at `/login`
4. **Dashboard** - View your notes dashboard
5. **Create Note** - Click "New Note" button
6. **Edit Note** - Click on any note card

## 📁 Project Structure

```
ocr-notes-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js     # Auth request handlers
│   │   │   └── noteController.js     # Notes request handlers
│   │   ├── middleware/
│   │   │   └── authMiddleware.js     # JWT verification
│   │   ├── models/
│   │   │   ├── User.js               # User schema
│   │   │   └── Note.js               # Note schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # Auth endpoints
│   │   │   └── noteRoutes.js         # Notes endpoints
│   │   ├── services/
│   │   │   ├── authService.js        # Auth business logic
│   │   │   └── noteService.js        # Notes business logic
│   │   └── server.js                 # Express app entry
│   ├── .env                          # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                   # shadcn/ui components
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   ├── FeatureSection.jsx
│   │   │   ├── CTASection.jsx
│   │   │   ├── NoteCard.jsx
│   │   │   ├── TagFilter.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js            # Auth state management
│   │   │   └── useNotes.js           # Notes state management
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx
│   │   ├── lib/
│   │   │   ├── api.js                # Axios instance + API calls
│   │   │   └── utils.js              # Utility functions
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Editor.jsx
│   │   ├── styles/
│   │   │   └── globals.css           # Tailwind + custom styles
│   │   ├── App.jsx                   # Main app with routing
│   │   └── main.jsx                  # Entry point
│   ├── .env                          # Frontend env variables
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

## 🛠️ Available Scripts

### Backend
```bash
npm run dev      # Run with nodemon (auto-reload)
npm start        # Run production mode
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🐛 Troubleshooting

### Backend won't start
- ✅ Check MongoDB URI is correct in `.env`
- ✅ Ensure MongoDB Atlas IP whitelist includes your IP (or use 0.0.0.0/0 for testing)
- ✅ Verify all dependencies installed: `npm install`

### Frontend won't connect to backend
- ✅ Check backend is running on port 5000
- ✅ Verify `VITE_API_URL` in frontend `.env`
- ✅ Check browser console for CORS errors

### Login/Register not working
- ✅ Check network tab in browser DevTools
- ✅ Verify backend logs for errors
- ✅ Ensure MongoDB connection is successful

### Notes not loading
- ✅ Verify you're logged in (check localStorage for token)
- ✅ Check backend logs for authentication errors
- ✅ Ensure JWT_SECRET matches between requests

## 🎨 Features

✅ User authentication (JWT)  
✅ Rich text note editor  
✅ Tag management  
✅ Search functionality  
✅ Dark modern UI (Supabase-inspired)  
✅ Responsive design  
✅ Smooth animations  
✅ Protected routes  

## 🚢 Next Steps (Optional)

- [ ] Add Docker configuration
- [ ] Setup CI/CD with GitHub Actions
- [ ] Deploy backend to Railway/Render
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Add image upload to notes
- [ ] Add note sharing functionality
- [ ] Add export to PDF/Markdown

## 📝 License

MIT License - feel free to use this project for learning or portfolio purposes!