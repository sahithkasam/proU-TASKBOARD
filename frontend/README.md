# ProU TaskBoard - Frontend

Modern React task management application with drag-and-drop, built with Vite.

## 🚀 Quick Start

### Development
```bash
npm install
npm run dev
```

### Build for Production
```bash
npm run build
npm run preview  # Preview production build
```

## 📋 Environment Variables

Create a `.env` file:

```env
VITE_API_BASE=http://localhost:5001
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## 🎨 Features

- 📊 **Kanban Board** - Drag & drop task management
- 👥 **Team Management** - Employee/admin roles
- 🎯 **Task Details** - Subtasks, labels, comments
- 🌙 **Dark Mode** - Toggle light/dark theme
- 📱 **Responsive** - Mobile-friendly design
- 🔐 **Authentication** - JWT + Google OAuth

## 🔧 Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite 5.4
- **State Management**: Context API + React Query
- **Forms**: React Hook Form
- **Drag & Drop**: react-beautiful-dnd
- **HTTP Client**: Axios
- **Styling**: Custom CSS (no frameworks)

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/    # Reusable components
│   ├── context/       # Context providers
│   ├── hooks/         # Custom hooks
│   ├── lib/           # Axios config
│   ├── pages/         # Page components
│   ├── shared/        # Shared components (modals, etc)
│   ├── App.jsx        # Main app component
│   ├── main.jsx       # Entry point
│   └── styles.css     # Global styles
├── index.html
└── package.json
```

## 🎭 User Roles

### Administrator (admin)
- Full access to all features
- Can manage employees
- Can edit/delete any task
- Can manage subtasks, labels, comments

### Team Member (member)
- View tasks (read-only)
- Can drag tasks between columns
- Cannot edit or delete tasks

## 🌐 Deployment

See the main [RENDER_VERCEL_GUIDE.md](../RENDER_VERCEL_GUIDE.md) for deployment instructions.

## 🔗 API Integration

The frontend connects to the backend API via `VITE_API_BASE` environment variable.

All API calls are made through axios with automatic token injection from localStorage.
