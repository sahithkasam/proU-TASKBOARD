# 🚀 Quick Deployment Steps - ProU TaskBoard

## Phase 1: Database Setup (5 minutes)

1. **Create MongoDB Atlas Account**
   - Go to: https://mongodb.com/cloud/atlas
   - Sign up for free account
   - Verify email

2. **Create Cluster**
   - Click "Build a Database"
   - Choose M0 Free tier
   - Select region closest to you
   - Name: `prou-taskboard-cluster`

3. **Create Database User**
   - Go to "Database Access"
   - Add user with password
   - Save username and password securely

4. **Configure Network Access**
   - Go to "Network Access"
   - Add IP: 0.0.0.0/0 (allow all)

5. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<password>` with your actual password
   - Add database name: `/prou_taskboard`

---

## Phase 2: Deploy Backend (10 minutes)

### Using Railway (Recommended)

1. **Sign up**: https://railway.app
   - Use GitHub to sign in

2. **Deploy from GitHub**
   - Click "Deploy from GitHub repo"
   - Select: sahithkasam/proU-TASKBOARD
   - Railway auto-detects Node.js

3. **Configure Service**
   - Settings → Root Directory: `backend`
   - Start Command: `npm start`

4. **Add Environment Variables**
   ```
   PORT=5001
   NODE_ENV=production
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=generate_strong_random_string
   JWT_EXPIRES=7d
   CLIENT_ORIGIN=https://your-frontend.vercel.app
   GOOGLE_CLIENT_ID=your_google_client_id
   ```

5. **Deploy**
   - Railway deploys automatically
   - Copy backend URL: `https://xxx.up.railway.app`

---

## Phase 3: Deploy Frontend (10 minutes)

### Using Vercel (Recommended)

1. **Sign up**: https://vercel.com
   - Use GitHub to sign in

2. **Import Project**
   - Click "Add New" → "Project"
   - Select: sahithkasam/proU-TASKBOARD
   - Framework: Vite
   - Root Directory: `frontend`

3. **Add Environment Variables**
   ```
   VITE_API_BASE=https://your-backend.up.railway.app
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Copy frontend URL: `https://xxx.vercel.app`

---

## Phase 4: Final Configuration (5 minutes)

1. **Update Backend CORS**
   - Go back to Railway
   - Update CLIENT_ORIGIN with your Vercel URL
   - Redeploy

2. **Update Google OAuth** (if using)
   - Go to Google Cloud Console
   - Add Vercel URL to authorized origins
   - Add Vercel URL to redirect URIs

3. **Test Everything**
   - Visit your Vercel URL
   - Register a new account
   - Login and create a task
   - Test drag and drop
   - Test all features

---

## 🎯 Total Time: ~30 minutes

## ✅ Deployment Checklist

### MongoDB Atlas
- [ ] Account created
- [ ] Cluster created (M0 Free)
- [ ] Database user created
- [ ] IP whitelist configured (0.0.0.0/0)
- [ ] Connection string copied

### Backend (Railway)
- [ ] Account created
- [ ] Repository connected
- [ ] Root directory set to `backend`
- [ ] Environment variables added:
  - [ ] PORT
  - [ ] NODE_ENV
  - [ ] MONGO_URI
  - [ ] JWT_SECRET
  - [ ] JWT_EXPIRES
  - [ ] CLIENT_ORIGIN
  - [ ] GOOGLE_CLIENT_ID (optional)
- [ ] Deployment successful
- [ ] Backend URL copied

### Frontend (Vercel)
- [ ] Account created
- [ ] Repository connected
- [ ] Root directory set to `frontend`
- [ ] Environment variables added:
  - [ ] VITE_API_BASE
  - [ ] VITE_GOOGLE_CLIENT_ID (optional)
- [ ] Deployment successful
- [ ] Frontend URL copied

### Final Steps
- [ ] Backend CORS updated with frontend URL
- [ ] Google OAuth URLs updated (if using)
- [ ] Registration tested
- [ ] Login tested
- [ ] Task creation tested
- [ ] Drag and drop tested
- [ ] All features working

---

## 🆘 Common Issues & Fixes

**Issue**: "Cannot connect to database"
- **Fix**: Check MongoDB IP whitelist is set to 0.0.0.0/0

**Issue**: "CORS error in browser console"
- **Fix**: Update CLIENT_ORIGIN in Railway with exact Vercel URL (no trailing slash)

**Issue**: "Environment variables not working"
- **Fix**: Redeploy after adding environment variables
- **Fix**: For Vite, ensure variables start with `VITE_`

**Issue**: "Build failed"
- **Fix**: Check start script in package.json
- **Fix**: Ensure dependencies (not devDependencies) are correct

---

## 📞 Quick Links

- **MongoDB Atlas**: https://mongodb.com/cloud/atlas
- **Railway**: https://railway.app
- **Vercel**: https://vercel.com
- **Google Cloud Console**: https://console.cloud.google.com

---

## 🎉 Success!

Once all checkboxes are complete, your application is LIVE! 🚀

Share your deployed URL: `https://your-app.vercel.app`
