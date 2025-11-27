# ProU TaskBoard - Backend API

Express.js REST API for task management with MongoDB.

## 🚀 Quick Start

### Development
```bash
npm install
npm run dev
```

### Production
```bash
npm install
npm start
```

## 📋 Environment Variables

Create a `.env` file:

```env
PORT=5001
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/prou_taskboard
JWT_SECRET=your_secret_key_here
JWT_EXPIRES=7d
CLIENT_ORIGIN=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_client_id
```

## 🗂️ API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/google` - Google OAuth login

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create employee (admin only)
- `PUT /api/employees/:id` - Update employee (admin only)
- `DELETE /api/employees/:id` - Delete employee (admin only)

## 🔧 Tech Stack

- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + Google OAuth
- **Security**: bcrypt, cors, helmet (if added)

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/        # Database connection
│   ├── middleware/    # Auth middleware
│   ├── models/        # Mongoose schemas
│   ├── routes/        # API routes
│   ├── scripts/       # Utility scripts
│   └── app.js         # Express app setup
├── server.js          # Entry point
└── package.json
```

## 🔐 Authentication

Protected routes require JWT token in header:
```
Authorization: Bearer <token>
```

Admin-only routes require user role to be `admin`.

## 🌐 Deployment

See the main [RENDER_VERCEL_GUIDE.md](../RENDER_VERCEL_GUIDE.md) for deployment instructions.
