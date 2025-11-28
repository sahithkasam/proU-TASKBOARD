# 🎯 ProU TaskBoard - Professional Task Management System

A modern, full-stack MERN application for managing employees and tasks with an intuitive Kanban-style board. Features enterprise-grade UI/UX design, real-time updates, advanced task management capabilities, and comprehensive role-based access control.

## 🚀 Live Demo

- **Frontend**: https://pro-u-taskboard-frontend.vercel.app/
- **Backend API**: https://prou-taskboard-backend.onrender.com/api/health
- **Demo Link** : https://drive.google.com/file/d/1unsLD7zVk9cYiVZREYB7alLPFrt4cGxh/view?usp=sharing

> 💡 **Note**: First load may take 10-15 seconds if backend was idle. Subsequent requests are instant!

---



## ✨ Features Overview

### Core Features (Required)
| Category | Implementation |
|----------|----------------|
| **Authentication** | JWT-based auth with bcrypt password hashing, Google OAuth integration |
| **User Management** | Role-based system (admin/member), complete CRUD operations |
| **Task Management** | Full CRUD with Kanban board, drag & drop, status workflow (Todo/In Progress/Done) |
| **Kanban Board** | Interactive board with react-beautiful-dnd, visual status columns |
| **Security** | Protected routes, JWT middleware, role-based authorization |
| **Responsive Design** | Mobile-first approach, works on all devices |

### 🚀 Bonus Features Implemented

#### 1. **Toast Notification System**
- Real-time feedback for all CRUD operations
- Success, error, info, and warning message types
- Auto-dismiss with customizable duration
- Smooth slide-in/fade-out animations

#### 2. **Advanced Search & Filtering**
- Live search by title and description
- Filter by status (All/Todo/In Progress/Done)
- Filter by priority (All/Low/Medium/High)
- Filter by assignee
- Date range filtering
- Results counter

#### 3. **Task Comments & Activity Log**
- Add comments to tasks with timestamps
- Automatic activity tracking for all changes
- Author information with each comment
- Chronological timeline view
- Tabbed interface in task modal

#### 4. **Bulk Actions & Keyboard Shortcuts**
- Select multiple tasks with checkboxes
- Bulk delete functionality
- Bulk status updates
- Keyboard shortcuts:
  - \`Ctrl/Cmd + A\` - Select all tasks
  - \`Escape\` - Clear selection
  - \`Delete\` - Delete selected
  - \`?\` - Show shortcuts help
- Visual selection indicators

#### 5. **Dark Mode**
- Toggle between light and dark themes
- Floating theme toggle button (🌙/☀️)
- Persistent preference (localStorage)
- Smooth CSS transitions
- Full app coverage including modals

#### 6. **Subtasks/Checklists**
- Add multiple subtasks to any task
- Mark subtasks as complete with checkboxes
- Visual progress bar showing completion
- Independent CRUD operations
- Progress counter (e.g., "3/5 completed")

#### 7. **Task Labels/Tags**
- Create custom colored labels
- Color picker for label customization
- Multiple labels per task
- Visual badges on task cards
- Filter by labels

#### 8. **Professional Authentication UI**
- Modern split-screen design
- Gradient backgrounds with animations
- Icon-labeled input fields
- Floating brand section with feature highlights
- Shimmer button effects
- Fully responsive with mobile optimizations

#### 9. **Professional Employee Management Dashboard**
- Statistics cards (Total, Admins, Members)
- Live search by name or email
- Role-based filtering
- Employee avatars with initials
- Gradient role badges
- Modern card-based layout
- Empty state handling

---

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js 4.19
- **Database**: MongoDB (Mongoose 8.5)
- **Authentication**: JWT (jsonwebtoken), bcrypt 5.1
- **OAuth**: Google Auth Library 9.10
- **Environment**: dotenv
- **Security**: CORS, helmet
- **Module System**: ES Modules (ESM)

### Frontend
- **Library**: React 18
- **Build Tool**: Vite 5.4.21
- **Routing**: React Router v6
- **State Management**: 
  - Context API (AuthContext, ToastContext)
  - React Query (@tanstack/react-query 5.56.2)
- **Forms**: React Hook Form 7.53
- **Drag & Drop**: react-beautiful-dnd 13.1
- **HTTP Client**: Axios
- **Styling**: Pure CSS with CSS Variables (no frameworks - 2000+ lines custom CSS)
- **Icons**: Emoji-based (no external icon library)

### Development Tools
- **Concurrency**: concurrently (run backend + frontend together)
- **Backend Dev**: nodemon (auto-restart on changes)
- **Frontend Dev**: Vite HMR (Hot Module Replacement)
- **Code Organization**: Monorepo structure

---

## 📁 Project Structure

\`\`\`
/Users/user/Desktop/Taskmanagement/
├── README.md (this file)
├── package.json (root - runs both servers)
├── NEW_FEATURES.md (Dark mode, subtasks, labels documentation)
├── LOGIN_REDESIGN.md (Authentication UI documentation)
├── EMPLOYEES_REDESIGN.md (Employee management documentation)
│
├── backend/
│   ├── package.json
│   ├── server.js (entry point)
│   ├── .env (environment variables)
│   └── src/
│       ├── config/
│       │   └── db.js (MongoDB connection)
│       ├── models/
│       │   ├── Employee.js (User model with roles)
│       │   └── Task.js (Task model with subtasks, labels, comments)
│       ├── middleware/
│       │   └── auth.js (JWT verification)
│       ├── routes/
│       │   ├── auth.routes.js (login, register, Google OAuth)
│       │   ├── task.routes.js (CRUD + subtasks + labels + comments)
│       │   └── employee.routes.js (employee management)
│       ├── scripts/
│       │   ├── seed.js (sample data generator)
│       │   ├── fix-status.js (data migration utility)
│       │   └── view-data.js (database viewer)
│       └── utils/
│           └── jwt.js (token generation)
│
└── frontend/
    ├── package.json
    ├── index.html
    ├── vite.config.js
    ├── .env (API base URL, Google Client ID)
    └── src/
        ├── main.jsx (React entry point)
        ├── App.jsx (routing configuration)
        ├── styles.css (2000+ lines of custom CSS)
        ├── api/
        │   ├── axios.js (configured Axios instance)
        │   ├── auth.js (auth API calls)
        │   └── tasks.js (task API calls)
        ├── state/
        │   ├── AuthContext.jsx (authentication state)
        │   └── ToastContext.jsx (notification state)
        ├── hooks/
        │   ├── useAuth.js (auth hook)
        │   ├── useTasks.js (React Query tasks)
        │   ├── useEmployees.js (React Query employees)
        │   └── useToast.js (toast notifications)
        ├── pages/
        │   ├── LoginImproved.jsx (modern login page)
        │   ├── RegisterImproved.jsx (modern register page)
        │   ├── BoardImproved.jsx (Kanban board with all features)
        │   └── EmployeesImproved.jsx (employee management dashboard)
        ├── components/
        │   ├── Header.jsx (navigation bar)
        │   ├── Layout.jsx (app layout wrapper)
        │   ├── LoadingSpinner.jsx (loading indicator)
        │   ├── ToastContainer.jsx (notification display)
        │   ├── ThemeToggle.jsx (dark mode toggle)
        │   └── GoogleSignInButton.jsx (Google OAuth button)
        └── shared/
            └── TaskModal.jsx (task details modal with tabs)
\`\`\`

---

## 🚀 Setup Instructions

### Prerequisites
- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **MongoDB**: Local installation OR MongoDB Atlas account
- **Google OAuth** (optional): Client ID from Google Cloud Console

### Step 1: Clone and Install

\`\`\`bash
# Navigate to project directory
cd /Users/user/Desktop/Taskmanagement

# Install all dependencies (root, backend, frontend)
npm install
\`\`\`

### Step 2: Database Setup

#### Option A: Local MongoDB (Recommended for Development)

**macOS:**
\`\`\`bash
# Install MongoDB via Homebrew
brew tap mongodb/brew
brew install mongodb-community@7.0

# Start MongoDB service
brew services start mongodb-community@7.0

# Verify it's running
mongosh --eval "db.runCommand({ ping: 1 })"
\`\`\`

**Windows:**
- Download MongoDB Community Server from mongodb.com
- Install and run as a service
- Default connection: \`mongodb://localhost:27017\`

**Linux:**
\`\`\`bash
# Ubuntu/Debian
sudo apt-get install mongodb

# Start service
sudo systemctl start mongodb
sudo systemctl enable mongodb
\`\`\`

#### Option B: MongoDB Atlas (Cloud)

1. Create free account at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a new cluster (free M0 tier available)
3. Create database user with password
4. Whitelist IP address (0.0.0.0/0 for development)
5. Get connection string (SRV format)

### Step 3: Environment Variables

#### Backend Configuration

Create \`backend/.env\`:
\`\`\`env
# Server
PORT=5001
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/prou_taskboard
# OR for Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/prou_taskboard

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES=7d

# CORS
CLIENT_ORIGIN=http://localhost:5173

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
\`\`\`

#### Frontend Configuration

Create \`frontend/.env\`:
\`\`\`env
# Backend API
VITE_API_BASE=http://localhost:5001

# Google OAuth (optional - must match backend)
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
\`\`\`

### Step 4: Seed Sample Data (Optional)

\`\`\`bash
# From project root
cd backend
npm run seed
\`\`\`

This creates:
- **Admin User**: \`admin@example.com\` / \`admin123\`
- **Member User**: \`member@example.com\` / \`member123\`
- **Sample Tasks**: Demo tasks across all statuses

### Step 5: Run the Application

#### Option A: Run Both Servers Together (Recommended)
\`\`\`bash
# From project root
npm run start:all
\`\`\`

#### Option B: Run Separately
\`\`\`bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
\`\`\`

### Step 6: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001
- **API Health Check**: http://localhost:5001/api/health

### Step 7: Login

Use seeded credentials or create a new account:
- **Admin**: \`admin@example.com\` / \`admin123\`
- **Member**: \`member@example.com\` / \`member123\`

---

## 🎯 Assumptions & Design Decisions

### Authentication
- **JWT Storage**: Tokens stored in localStorage for simplicity
  - Production consideration: Could use httpOnly cookies for enhanced security
- **Token Expiration**: 7 days default, configurable
- **Password Requirements**: Minimum 6 characters (adjustable in validation)
- **Google OAuth**: Optional feature, app works fully without it

### User Roles
- **Two-tier System**: Admin and Member roles
  - Admin: Full access to employee management
  - Member: Can manage tasks, view employees
- **Self-management**: Users cannot delete themselves
- **Role Assignment**: Only admins can assign/change roles

### Task Workflow
- **Three-stage Pipeline**: Todo → In Progress → Done
  - Flexible: Can move tasks to any status directly
  - No enforced workflow sequence
- **Assignee Optional**: Tasks can be unassigned
- **Due Dates Optional**: Not all tasks require deadlines

### Data Management
- **Soft Delete Not Implemented**: Deletions are permanent
  - Enhancement opportunity: Add trash/archive feature
- **No Pagination**: All data loaded at once
  - Consideration: Implement pagination for large datasets (>100 items)
- **Real-time Sync**: React Query handles cache invalidation and refetching

### UI/UX Decisions
- **Mobile-first**: Responsive design prioritizes mobile experience
- **No External UI Framework**: Custom CSS for full control and learning
- **Emoji Icons**: Used instead of icon libraries to avoid dependencies
- **Animations**: Subtle animations for professional feel without distraction

### Security
- **Password Hashing**: bcrypt with salt rounds
- **JWT Verification**: All protected routes verify token
- **CORS**: Configured for development and production origins
- **Input Validation**: Both client and server-side validation
- **No Rate Limiting**: Should be added for production
- **No HTTPS Enforcement**: Development assumes HTTP, production needs HTTPS

### Performance
- **React Query**: Automatic caching and background updates
- **Optimistic Updates**: Some operations update UI before server response
- **Debouncing**: Search inputs debounced to reduce API calls
- **Code Splitting**: Could be implemented for larger apps

---

## 🎁 Bonus Features Summary

### Implemented (9 Bonus Features)
1. ✅ **Toast Notification System** - Real-time user feedback
2. ✅ **Advanced Search & Filtering** - Multiple filter types
3. ✅ **Task Comments & Activity Log** - Full audit trail
4. ✅ **Bulk Actions & Keyboard Shortcuts** - Power user features
5. ✅ **Dark Mode** - Theme toggle with persistence
6. ✅ **Subtasks/Checklists** - Task breakdown capability
7. ✅ **Task Labels/Tags** - Color-coded categorization
8. ✅ **Professional Authentication UI** - Modern split-screen design
9. ✅ **Professional Employee Dashboard** - Statistics and search

### Technical Achievements
- **No External CSS Framework**: 2000+ lines of custom CSS
- **Comprehensive State Management**: Context API + React Query
- **Full TypeScript-ready**: Code structure supports TS migration
- **Production-ready Architecture**: Clean separation of concerns
- **Extensive Documentation**: 3 markdown guides + inline comments

---

## 🌐 Deployment

### Live Application

- **Frontend**: Deployed on Vercel
- **Backend**: Deployed on Render (with cron job to prevent cold starts)
- **Database**: MongoDB Atlas (Free M0 tier)

### Deployment Stack

```
Frontend (Vercel)
    ↓
Backend (Render)
    ↓
MongoDB Atlas
    +
Cron Job (keeps backend awake)
```

### How This Project Was Deployed

#### 1. **Database Setup (MongoDB Atlas)**
- Created free M0 cluster on MongoDB Atlas
- Configured database user with password
- Whitelisted all IPs (0.0.0.0/0) for accessibility
- Obtained connection string

#### 2. **Backend Deployment (Render)**
- Connected GitHub repository to Render
- Configured root directory: `backend`
- Set build command: `npm install`
- Set start command: `npm start`
- Added environment variables:
  - `PORT=5001`
  - `NODE_ENV=production`
  - `MONGO_URI=<MongoDB connection string>`
  - `JWT_SECRET=<generated secret>`
  - `JWT_EXPIRES=7d`
  - `CLIENT_ORIGIN=*` (open CORS for demo)
- Auto-deploys on GitHub push

#### 3. **Frontend Deployment (Vercel)**
- Imported project from GitHub
- Configured root directory: `frontend`
- Framework preset: Vite
- Environment variables:
  - `VITE_API_BASE=<Render backend URL>`
- Auto-deploys on GitHub push
- Instant global CDN delivery

#### 4. **Preventing Cold Starts**
- Set up Cron-job.org to ping backend every 10 minutes
- Endpoint: `https://backend-url/api/health`
- Keeps Render free tier always awake
- No 30-second cold start delays

### Deployment Features

✅ **Zero Downtime**: Cron job keeps backend active 24/7
✅ **Automatic Deployments**: GitHub push triggers deploy
✅ **Global CDN**: Vercel serves frontend worldwide
✅ **SSL Enabled**: HTTPS on both frontend and backend
✅ **Environment Isolation**: Separate dev/prod configs
✅ **100% Free**: No credit card required

### Cost Breakdown

| Service | Plan | Cost |
|---------|------|------|
| **Vercel** | Hobby (Free) | $0/month |
| **Render** | Free Tier | $0/month |
| **MongoDB Atlas** | M0 Free | $0/month |
| **Cron-job.org** | Free | $0/month |
| **Total** | | **$0/month** |

### Deployment Guides

For detailed step-by-step instructions, see:
- **[RENDER_VERCEL_GUIDE.md](./RENDER_VERCEL_GUIDE.md)** - Complete deployment walkthrough
- **[ADMIN_GUIDE.md](./ADMIN_GUIDE.md)** - Admin features and role setup

---

## 📖 Additional Documentation

- **[RENDER_VERCEL_GUIDE.md](./RENDER_VERCEL_GUIDE.md)**: Step-by-step deployment guide
- **[ADMIN_GUIDE.md](./ADMIN_GUIDE.md)**: Admin account setup and features
- **[backend/README.md](./backend/README.md)**: Backend API documentation
- **[frontend/README.md](./frontend/README.md)**: Frontend app documentation

---

## 🎓 Learning Outcomes

This project demonstrates:
- **Full-stack Development**: MERN stack implementation
- **RESTful API Design**: Proper endpoint structure and HTTP methods
- **Authentication & Authorization**: JWT implementation with role-based access
- **State Management**: Context API and React Query patterns
- **React Best Practices**: Hooks, custom hooks, component composition
- **Modern CSS**: Flexbox, Grid, animations without frameworks
- **Responsive Design**: Mobile-first approach
- **User Experience**: Toast notifications, keyboard shortcuts, smooth animations
- **Code Organization**: Clean architecture and separation of concerns
- **Git Workflow**: Proper version control practices

---

---

## 👨‍💻 Author

K.SAHITH

**Features Implemented**: 6 core features + 9 bonus features = **15 total features**
**Lines of Code**: 5000+ (Backend: ~1500, Frontend: ~3500)
**Development Time**: Optimized for quality and best practices
**Code Quality**: Production-ready with comprehensive error handling

---


