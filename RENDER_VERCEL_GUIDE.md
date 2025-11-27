# 🚀 Deploy ProU TaskBoard: Render + Vercel Guide

**Your Stack:**
- 🗄️ Database: MongoDB Atlas (Free)
- 🖥️ Backend: Render (Free)
- 🎨 Frontend: Vercel (Free)

**Total Cost:** $0/month
**Setup Time:** ~30 minutes

---

## ⚠️ Important Note About Render Free Tier

**Cold Starts:** Render's free tier spins down your backend after 15 minutes of inactivity. The first request after inactivity will take **10-30 seconds** to wake up the server.

**This is acceptable for:**
- ✅ Portfolio/demo projects
- ✅ Internship submissions
- ✅ Low-traffic applications

**Pro Tip:** Keep a tab open or use a service like UptimeRobot to ping your backend every 10 minutes to keep it active.

---

## 📋 Phase 1: Setup MongoDB Atlas (5 minutes)

### Step 1: Create MongoDB Atlas Account

1. Go to **https://mongodb.com/cloud/atlas**
2. Click **"Try Free"**
3. Sign up with email or Google
4. Verify your email

### Step 2: Create a Free Cluster

1. After login, click **"Build a Database"**
2. Choose **"M0 FREE"** tier
3. Cloud Provider: **AWS** (recommended)
4. Region: Choose closest to you (e.g., US East or Europe)
5. Cluster Name: `prou-taskboard` (or keep default)
6. Click **"Create"** (takes 2-3 minutes)

### Step 3: Create Database User

1. Click **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. Authentication Method: **Password**
4. Username: `taskboard-admin`
5. Password: Click **"Autogenerate Secure Password"** and **SAVE IT**
6. Database User Privileges: **"Read and write to any database"**
7. Click **"Add User"**

### Step 4: Configure Network Access

1. Click **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (adds 0.0.0.0/0)
4. Click **"Confirm"**

**Note:** This allows connections from any IP. For production, you'd restrict this.

### Step 5: Get Connection String

1. Go back to **"Database"** (left sidebar)
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Driver: **Node.js**
5. Version: **5.5 or later**
6. Copy the connection string (looks like):
   ```
   mongodb+srv://taskboard-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
7. **Important:** Replace `<password>` with your actual password
8. Add database name at the end: `/prou_taskboard`

**Final connection string should look like:**
```
mongodb+srv://taskboard-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/prou_taskboard?retryWrites=true&w=majority
```

✅ **Save this connection string - you'll need it for Render!**

---

## 🖥️ Phase 2: Deploy Backend on Render (10 minutes)

### Step 1: Create Render Account

1. Go to **https://render.com**
2. Click **"Get Started"**
3. Sign up with **GitHub** (easiest option)
4. Authorize Render to access your GitHub account

### Step 2: Create New Web Service

1. Click **"New +"** (top right)
2. Select **"Web Service"**
3. Click **"Connect GitHub"** if not already connected
4. Find and select **"sahithkasam/proU-TASKBOARD"** repository
5. Click **"Connect"**

### Step 3: Configure Web Service

Fill in the following settings:

**Basic Settings:**
- **Name:** `prou-taskboard-backend` (or your choice)
- **Region:** Choose closest region (e.g., Oregon/Frankfurt)
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** `Node`

**Build & Deploy:**
- **Build Command:** `npm install`
- **Start Command:** `npm start`

**Instance Type:**
- Select **"Free"** ($0/month)

### Step 4: Add Environment Variables

Scroll down to **"Environment Variables"** section and click **"Add Environment Variable"**

Add these variables one by one:

| Key | Value |
|-----|-------|
| `PORT` | `5001` |
| `NODE_ENV` | `production` |
| `MONGO_URI` | Your MongoDB Atlas connection string from Phase 1 |
| `JWT_SECRET` | Generate using method below |
| `JWT_EXPIRES` | `7d` |
| `CLIENT_ORIGIN` | `https://prou-taskboard.vercel.app` (or your chosen name) |
| `GOOGLE_CLIENT_ID` | Your Google Client ID (optional - leave empty if not using) |

**Generate JWT_SECRET:**

Open Terminal and run:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use it as your JWT_SECRET.

**Example JWT_SECRET:**
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

**Note:** You'll update `CLIENT_ORIGIN` after deploying the frontend.

### Step 5: Deploy

1. Click **"Create Web Service"** at the bottom
2. Render will start building and deploying (5-10 minutes)
3. You'll see build logs in real-time
4. Wait for status to show **"Live"** (green dot)

### Step 6: Get Your Backend URL

1. Once deployed, you'll see your service URL at the top:
   ```
   https://prou-taskboard-backend.onrender.com
   ```
2. **Copy this URL - you'll need it for Vercel!**

### Step 7: Test Your Backend

Open a new browser tab and test:

```
https://prou-taskboard-backend.onrender.com/api/health
```

You should see:
```json
{"status":"ok","message":"API is running"}
```

✅ **Backend is live!**

**Note:** First request might take 30 seconds if the service was asleep.

---

## 🎨 Phase 3: Deploy Frontend on Vercel (10 minutes)

### Step 1: Create Vercel Account

1. Go to **https://vercel.com**
2. Click **"Start Deploying"**
3. Sign up with **GitHub** (easiest option)
4. Authorize Vercel to access your GitHub account

### Step 2: Import Your Project

1. Click **"Add New..."** → **"Project"**
2. Find **"sahithkasam/proU-TASKBOARD"** in the list
3. Click **"Import"**

### Step 3: Configure Project Settings

**Configure Project:**
- **Framework Preset:** Vite (should auto-detect)
- **Root Directory:** Click **"Edit"** → Enter `frontend`
- **Build Command:** `npm run build` (default is fine)
- **Output Directory:** `dist` (default is fine)
- **Install Command:** `npm install` (default is fine)

### Step 4: Add Environment Variables

Click **"Environment Variables"** section and add:

| Name | Value |
|------|-------|
| `VITE_API_BASE` | Your Render backend URL (without trailing slash) |
| `VITE_GOOGLE_CLIENT_ID` | Your Google Client ID (optional - leave empty if not using) |

**Example:**
```
VITE_API_BASE=https://prou-taskboard-backend.onrender.com
```

**Important:** 
- No trailing slash at the end
- Must start with `VITE_` for Vite to recognize it
- Use your actual Render URL from Phase 2

### Step 5: Deploy

1. Click **"Deploy"**
2. Vercel will build and deploy (2-3 minutes)
3. You'll see build logs
4. Wait for **"Congratulations!"** message

### Step 6: Get Your Frontend URL

1. After deployment, you'll see your live URL:
   ```
   https://prou-taskboard-abc123.vercel.app
   ```
2. Click the URL to open your deployed app!

✅ **Frontend is live!**

---

## 🔄 Phase 4: Update Backend CORS (5 minutes)

Now that you have your Vercel URL, you need to update the backend CORS settings.

### Step 1: Update CLIENT_ORIGIN in Render

1. Go back to **Render Dashboard**
2. Click on your **prou-taskboard-backend** service
3. Go to **"Environment"** tab
4. Find **`CLIENT_ORIGIN`** variable
5. Click the **"Edit"** icon
6. Update value to your actual Vercel URL:
   ```
   https://prou-taskboard-abc123.vercel.app
   ```
7. **Important:** No trailing slash!
8. Click **"Save Changes"**

### Step 2: Trigger Redeploy

1. Render will automatically redeploy when environment variables change
2. Wait 2-3 minutes for redeploy to complete
3. Status will show **"Live"** again

---

## 🧪 Phase 5: Test Everything (5 minutes)

### Test Checklist:

1. **Open your Vercel URL** in browser
   ```
   https://prou-taskboard-abc123.vercel.app
   ```

2. **Test Registration:**
   - Click "Sign Up" or "Register"
   - Fill in name, email, password
   - Click "Register"
   - Should redirect to login or dashboard

3. **Test Login:**
   - Enter your credentials
   - Click "Login"
   - Should see the dashboard/board

4. **Test Task Creation:**
   - Click "Add Task" or "+"
   - Fill in task details
   - Click "Create"
   - Task should appear on board

5. **Test Drag & Drop:**
   - Drag a task from "Todo" to "In Progress"
   - Should update smoothly

6. **Test Other Features:**
   - Add subtasks
   - Add labels
   - Add comments
   - Toggle dark mode
   - Test on mobile device

### Expected First Load:
- ⚠️ First request to backend might take 10-30 seconds (cold start)
- ⚠️ Subsequent requests will be fast
- ✅ Frontend loads instantly

---

## ⚠️ Managing Render Cold Starts

### Option 1: Accept It (Simplest)
Just let it sleep. Fine for demos and portfolios.

### Option 2: Keep It Awake with UptimeRobot (Free)

1. Go to **https://uptimerobot.com**
2. Sign up for free account
3. Click **"Add New Monitor"**
4. Monitor Type: **HTTP(s)**
5. Friendly Name: `ProU Backend`
6. URL: `https://prou-taskboard-backend.onrender.com/api/health`
7. Monitoring Interval: **10 minutes**
8. Click **"Create Monitor"**

This will ping your backend every 10 minutes to keep it awake.

### Option 3: Upgrade to Paid ($7/month)
If you need 24/7 uptime without cold starts, upgrade Render to paid tier.

---

## 🔐 Optional: Setup Google OAuth

If you want Google Sign-In to work:

### Step 1: Update Google Cloud Console

1. Go to **https://console.cloud.google.com**
2. Select your project
3. Navigate to **APIs & Services** → **Credentials**
4. Click on your OAuth 2.0 Client ID
5. Add to **Authorized JavaScript origins:**
   ```
   https://prou-taskboard-abc123.vercel.app
   ```
6. Add to **Authorized redirect URIs:**
   ```
   https://prou-taskboard-abc123.vercel.app
   ```
7. Click **"Save"**

### Step 2: Update Environment Variables

**Render (Backend):**
- Update `GOOGLE_CLIENT_ID` with your Client ID

**Vercel (Frontend):**
- Update `VITE_GOOGLE_CLIENT_ID` with the same Client ID

### Step 3: Redeploy

Both platforms will auto-redeploy when you change env vars.

---

## 🎨 Optional: Custom Domain

### For Vercel (Frontend):

1. Go to your project in Vercel
2. Click **"Settings"** → **"Domains"**
3. Enter your domain: `taskboard.yourdomain.com`
4. Follow DNS configuration instructions
5. Vercel provides free SSL automatically

### For Render (Backend):

1. Go to your service in Render
2. Click **"Settings"** → **"Custom Domains"**
3. Add your domain: `api.yourdomain.com`
4. Follow DNS configuration instructions
5. Render provides free SSL automatically

**Then update:**
- `CLIENT_ORIGIN` in Render → Your custom frontend domain
- `VITE_API_BASE` in Vercel → Your custom backend domain

---

## 📊 Monitor Your Deployments

### Render Dashboard:
- **Logs:** See all backend logs in real-time
- **Metrics:** View CPU, memory, and bandwidth usage
- **Events:** Track deployments and restarts

### Vercel Dashboard:
- **Deployments:** View all deployments and previews
- **Analytics:** See visitor stats (in paid tier)
- **Functions:** Monitor serverless function usage

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to database"

**Solution 1:** Check MongoDB Atlas IP whitelist
- Go to Network Access
- Ensure 0.0.0.0/0 is whitelisted

**Solution 2:** Check connection string
- Verify password is correct (no < > brackets)
- Verify database name is included: `/prou_taskboard`

### Issue: "CORS error in browser console"

**Error message:** `Access to XMLHttpRequest at 'https://backend.com' from origin 'https://frontend.com' has been blocked by CORS policy`

**Solution:**
1. Go to Render → Environment variables
2. Update `CLIENT_ORIGIN` to exact Vercel URL
3. No trailing slash!
4. Wait for automatic redeploy

### Issue: "Backend not responding / timeout"

**Cause:** Cold start (backend was asleep)

**Solution:**
- Wait 30 seconds and try again
- Use UptimeRobot to keep backend awake
- Or accept cold starts for demo purposes

### Issue: "Environment variables not working"

**For Vercel:**
- Ensure variables start with `VITE_`
- Redeploy after adding variables
- Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+F5)

**For Render:**
- Check variables are saved correctly
- Trigger manual redeploy if needed

### Issue: "Build failed on Render"

**Check:**
1. Root directory is set to `backend`
2. Build command is `npm install`
3. Start command is `npm start`
4. Check build logs for errors

### Issue: "Build failed on Vercel"

**Check:**
1. Root directory is set to `frontend`
2. Framework is set to Vite
3. Environment variables are correct
4. Check build logs for errors

---

## 📈 Performance Tips

### Backend (Render):
- ✅ Keep services under 512 MB memory
- ✅ Optimize database queries
- ✅ Use indexes in MongoDB
- ✅ Enable gzip compression (already enabled in Express)

### Frontend (Vercel):
- ✅ Images are optimized
- ✅ Code splitting enabled by Vite
- ✅ CSS is minified
- ✅ Vercel CDN handles caching automatically

---

## 💰 Cost Breakdown

### Current Setup (Free):
- **MongoDB Atlas:** $0 (512 MB M0 tier)
- **Render:** $0 (with cold starts)
- **Vercel:** $0 (100 GB bandwidth)
- **Total:** $0/month ✅

### If You Need More:
- **Render Starter:** $7/month (no cold starts, better performance)
- **Vercel Pro:** $20/month (more features, not needed for demo)
- **MongoDB M2:** $9/month (2 GB storage, faster performance)

---

## ✅ Deployment Checklist

### MongoDB Atlas:
- [x] Account created
- [x] M0 cluster created
- [x] Database user created with password
- [x] Network access configured (0.0.0.0/0)
- [x] Connection string copied and saved

### Render Backend:
- [x] Account created with GitHub
- [x] Web service created from repository
- [x] Root directory set to `backend`
- [x] Build command: `npm install`
- [x] Start command: `npm start`
- [x] Environment variables added:
  - [x] PORT
  - [x] NODE_ENV
  - [x] MONGO_URI
  - [x] JWT_SECRET (generated)
  - [x] JWT_EXPIRES
  - [x] CLIENT_ORIGIN
- [x] Service deployed successfully
- [x] Backend URL copied
- [x] Health endpoint tested

### Vercel Frontend:
- [x] Account created with GitHub
- [x] Project imported from repository
- [x] Root directory set to `frontend`
- [x] Framework set to Vite
- [x] Environment variables added:
  - [x] VITE_API_BASE
- [x] Project deployed successfully
- [x] Frontend URL copied
- [x] Site loads correctly

### Final Configuration:
- [x] CLIENT_ORIGIN updated in Render with Vercel URL
- [x] Backend redeployed
- [x] All features tested:
  - [x] Registration works
  - [x] Login works
  - [x] Tasks can be created
  - [x] Drag and drop works
  - [x] Subtasks work
  - [x] Labels work
  - [x] Comments work
  - [x] Dark mode toggles
  - [x] Employee management works (admin)

---

## 🎉 Success!

Your ProU TaskBoard is now **LIVE** on the internet!

**Your Live URLs:**
- 🎨 Frontend: `https://prou-taskboard-abc123.vercel.app`
- 🖥️ Backend: `https://prou-taskboard-backend.onrender.com`
- 🗄️ Database: MongoDB Atlas (cloud)

### Share Your Project:
1. ✅ Add live URL to GitHub README
2. ✅ Include in your resume/portfolio
3. ✅ Submit to ProU Technology for internship
4. ✅ Share on LinkedIn

---

## 📞 Support Resources

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com

---

## 🚀 What's Next?

1. **Test thoroughly** on different devices
2. **Monitor** your deployments
3. **Consider** UptimeRobot for keeping backend awake
4. **Submit** your project to ProU Technology
5. **Celebrate** your successful deployment! 🎊

---

**Congratulations on deploying your full-stack MERN application!** 🌟

You've successfully deployed a production-ready application with:
- ✅ Professional task management system
- ✅ Modern UI/UX design
- ✅ 9 bonus features
- ✅ Secure authentication
- ✅ Cloud database
- ✅ Global CDN delivery

Good luck with your internship application! 🚀
