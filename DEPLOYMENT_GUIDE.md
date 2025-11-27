# 🚀 Deployment Guide - ProU TaskBoard

This guide will walk you through deploying your ProU TaskBoard application to production.

---

## 📋 Deployment Architecture

**Recommended Setup:**
- **Backend**: Railway or Render
- **Frontend**: Vercel or Netlify
- **Database**: MongoDB Atlas (Cloud)

---

## 🗄️ Step 1: Setup MongoDB Atlas (Database)

### 1.1 Create MongoDB Atlas Account

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Click "Try Free" and create an account
3. Verify your email

### 1.2 Create a Cluster

1. After login, click **"Build a Database"**
2. Choose **"M0 Free"** tier
3. Select a cloud provider and region (choose closest to your users)
4. Cluster Name: `prou-taskboard-cluster`
5. Click **"Create"**

### 1.3 Create Database User

1. Go to **Database Access** (left sidebar)
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Username: `taskboard-admin` (or your choice)
5. Password: Generate a strong password (save it!)
6. Database User Privileges: **"Read and write to any database"**
7. Click **"Add User"**

### 1.4 Configure Network Access

1. Go to **Network Access** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Note: In production, restrict to specific IPs
4. Click **"Confirm"**

### 1.5 Get Connection String

1. Go to **Database** → Click **"Connect"**
2. Choose **"Connect your application"**
3. Driver: **Node.js**, Version: **5.5 or later**
4. Copy the connection string:
   ```
   mongodb+srv://taskboard-admin:<password>@prou-taskboard-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add database name: `prou_taskboard`
   ```
   mongodb+srv://taskboard-admin:YOUR_PASSWORD@prou-taskboard-cluster.xxxxx.mongodb.net/prou_taskboard?retryWrites=true&w=majority
   ```

---

## 🖥️ Step 2: Deploy Backend (Railway)

### Option A: Railway (Recommended - Easier)

#### 2.1 Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Sign in with GitHub

#### 2.2 Deploy from GitHub

1. Click **"Deploy from GitHub repo"**
2. Connect your GitHub account
3. Select **"sahithkasam/proU-TASKBOARD"** repository
4. Railway will detect it's a Node.js project

#### 2.3 Configure Backend Service

1. Click on your deployed service
2. Go to **"Settings"**
3. **Root Directory**: Set to `backend`
4. **Start Command**: `npm start`

#### 2.4 Add Environment Variables

1. Go to **"Variables"** tab
2. Add these variables:

```env
PORT=5001
NODE_ENV=production
MONGO_URI=mongodb+srv://taskboard-admin:YOUR_PASSWORD@cluster.mongodb.net/prou_taskboard?retryWrites=true&w=majority
JWT_SECRET=your_super_secure_random_string_min_32_chars_long
JWT_EXPIRES=7d
CLIENT_ORIGIN=https://your-frontend-url.vercel.app
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

**Important Notes:**
- Replace `MONGO_URI` with your actual MongoDB Atlas connection string
- Generate a strong `JWT_SECRET`: Use a password generator or run:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- `CLIENT_ORIGIN` will be updated after deploying frontend

#### 2.5 Deploy

1. Railway will automatically deploy
2. Wait for build to complete (2-3 minutes)
3. Copy your backend URL: `https://your-app.up.railway.app`

---

### Option B: Render (Alternative)

#### 2.1 Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub

#### 2.2 Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect GitHub repository: **sahithkasam/proU-TASKBOARD**
3. Configure:
   - **Name**: `prou-taskboard-backend`
   - **Region**: Choose closest region
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

#### 2.3 Add Environment Variables

Click **"Advanced"** and add:

```env
PORT=5001
NODE_ENV=production
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_random_string
JWT_EXPIRES=7d
CLIENT_ORIGIN=https://your-frontend-url.vercel.app
GOOGLE_CLIENT_ID=your_google_client_id
```

#### 2.4 Deploy

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Copy your backend URL: `https://prou-taskboard-backend.onrender.com`

---

## 🎨 Step 3: Deploy Frontend (Vercel)

### Option A: Vercel (Recommended)

#### 3.1 Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub

#### 3.2 Import Project

1. Click **"Add New"** → **"Project"**
2. Import **sahithkasam/proU-TASKBOARD** repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

#### 3.3 Add Environment Variables

Click **"Environment Variables"** and add:

```env
VITE_API_BASE=https://your-backend-url.up.railway.app
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

**Important**: Replace `VITE_API_BASE` with your actual Railway/Render backend URL

#### 3.4 Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Your frontend will be live at: `https://prou-taskboard.vercel.app`

---

### Option B: Netlify (Alternative)

#### 3.1 Create Netlify Account

1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub

#### 3.2 Import Project

1. Click **"Add new site"** → **"Import an existing project"**
2. Choose GitHub and select **sahithkasam/proU-TASKBOARD**
3. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

#### 3.3 Add Environment Variables

Go to **Site settings** → **Environment variables**:

```env
VITE_API_BASE=https://your-backend-url.up.railway.app
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

#### 3.4 Deploy

1. Click **"Deploy site"**
2. Wait for deployment
3. Your site will be live at: `https://your-site-name.netlify.app`

---

## 🔄 Step 4: Update CORS and Google OAuth

### 4.1 Update Backend CORS

Go back to Railway/Render and update `CLIENT_ORIGIN`:

```env
CLIENT_ORIGIN=https://prou-taskboard.vercel.app
```

Redeploy if necessary.

### 4.2 Update Google OAuth Settings (If using Google Sign-In)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Edit your OAuth 2.0 Client ID
5. Add to **Authorized JavaScript origins**:
   - `https://prou-taskboard.vercel.app`
6. Add to **Authorized redirect URIs**:
   - `https://prou-taskboard.vercel.app`
7. Save changes

---

## 🌱 Step 5: Seed Production Database (Optional)

You can seed your production database with sample data:

1. Update `backend/.env` locally with production `MONGO_URI`
2. Run seed script:
   ```bash
   cd backend
   npm run seed
   ```
3. Revert `backend/.env` to local settings

---

## ✅ Step 6: Test Your Deployment

### 6.1 Test Backend

```bash
# Health check
curl https://your-backend-url.up.railway.app/api/health

# Should return: {"status":"ok","message":"API is running"}
```

### 6.2 Test Frontend

1. Visit: `https://prou-taskboard.vercel.app`
2. Test registration and login
3. Create a task
4. Test drag and drop
5. Test all features

### 6.3 Test Integration

1. Register a new account
2. Login successfully
3. Create tasks and move them between columns
4. Add subtasks, labels, comments
5. Test employee management (as admin)
6. Toggle dark mode
7. Test on mobile device

---

## 🔍 Troubleshooting

### Backend Issues

**Problem**: "Cannot connect to database"
- **Solution**: Check MongoDB Atlas IP whitelist (0.0.0.0/0)
- **Solution**: Verify `MONGO_URI` has correct password
- **Solution**: Check database user has read/write permissions

**Problem**: "CORS error"
- **Solution**: Update `CLIENT_ORIGIN` in backend env vars
- **Solution**: Ensure frontend URL is correct (no trailing slash)

**Problem**: "Build failed"
- **Solution**: Check `package.json` has correct start script
- **Solution**: Verify all dependencies are in `dependencies`, not `devDependencies`

### Frontend Issues

**Problem**: "API calls failing"
- **Solution**: Verify `VITE_API_BASE` has correct backend URL
- **Solution**: Check backend is running (visit health endpoint)
- **Solution**: Check browser console for CORS errors

**Problem**: "Environment variables not working"
- **Solution**: Ensure variables start with `VITE_`
- **Solution**: Redeploy after adding environment variables
- **Solution**: Hard refresh browser (Cmd+Shift+R)

**Problem**: "Google Sign-In not working"
- **Solution**: Update Google OAuth authorized origins
- **Solution**: Verify `VITE_GOOGLE_CLIENT_ID` matches backend
- **Solution**: Check browser console for errors

---

## 📊 Monitoring and Logs

### Railway Logs
1. Go to your Railway project
2. Click on service
3. View **"Logs"** tab
4. Monitor for errors

### Render Logs
1. Go to your Render dashboard
2. Click on service
3. View **"Logs"** section

### Vercel Logs
1. Go to your Vercel project
2. Click **"Deployments"**
3. Click on latest deployment
4. View **"Function Logs"**

---

## 🔐 Security Checklist

Before going live, ensure:

- ✅ JWT_SECRET is a strong random string (32+ characters)
- ✅ MongoDB password is strong
- ✅ Environment variables are not committed to Git
- ✅ CORS is configured correctly (not allowing all origins)
- ✅ HTTPS is enabled (automatically by hosting platforms)
- ✅ Google OAuth URLs are updated
- ✅ Rate limiting is considered for production
- ✅ Input validation is in place (already implemented)

---

## 🎯 Custom Domain (Optional)

### Vercel Custom Domain

1. Go to your Vercel project settings
2. Click **"Domains"**
3. Add your domain: `taskboard.yourdomain.com`
4. Follow DNS configuration instructions
5. Wait for DNS propagation (5-60 minutes)

### Railway Custom Domain

1. Go to your Railway service settings
2. Click **"Settings"** → **"Domains"**
3. Click **"Generate Domain"** for free Railway subdomain
4. Or add custom domain and configure DNS

---

## 💰 Cost Estimate

**Free Tier (Perfect for Demo/Portfolio):**
- MongoDB Atlas: Free (512 MB storage, shared)
- Railway: $5 credit free/month (may need to upgrade)
- Vercel: Free (100 GB bandwidth/month)
- **Total**: FREE (or ~$5/month for Railway if needed)

**Paid Tier (Production):**
- MongoDB Atlas: $9/month (Shared M10)
- Railway: $5/month (500 hrs)
- Vercel: Free or $20/month (Pro)
- **Total**: ~$14-34/month

---

## 🚀 Quick Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with password saved
- [ ] IP whitelist configured (0.0.0.0/0)
- [ ] Connection string copied and password replaced
- [ ] Backend deployed to Railway/Render
- [ ] Backend environment variables added
- [ ] Backend health check passing
- [ ] Frontend deployed to Vercel/Netlify
- [ ] Frontend environment variables added
- [ ] CORS updated with frontend URL
- [ ] Google OAuth URLs updated (if using)
- [ ] Test login and registration
- [ ] Test task creation and management
- [ ] Test on mobile device
- [ ] Check browser console for errors

---

## 📞 Support Resources

- **Railway**: [docs.railway.app](https://docs.railway.app)
- **Render**: [render.com/docs](https://render.com/docs)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Netlify**: [docs.netlify.com](https://docs.netlify.com)
- **MongoDB Atlas**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)

---

## 🎉 Congratulations!

Your ProU TaskBoard is now live and accessible to the world! 🌍

**Live URLs:**
- Frontend: `https://prou-taskboard.vercel.app`
- Backend API: `https://your-app.up.railway.app`

Share your project and good luck with your internship submission! 🚀
