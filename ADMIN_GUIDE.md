# 👑 Admin Account Setup Guide

## 🎯 How to Create and Use Admin Accounts

Your ProU TaskBoard now has **role-based access control** with two types of users:

### **User Roles:**

1. **👑 Administrator (Admin)**
   - Full access to all features
   - Can manage employees (add, edit, delete)
   - Can edit and delete any tasks
   - Can manage subtasks, labels, and comments
   - Can see employee statistics
   - Has all permissions

2. **👤 Team Member (Member)**
   - Can view all tasks
   - Can view task details (read-only)
   - Cannot edit or delete tasks
   - Cannot manage employees
   - Limited permissions

---

## 📝 Creating an Admin Account

### **Option 1: Register as Admin (Recommended)**

1. **Go to your app** (deployed or local)
2. **Click "Sign Up"** or **"Create Account"**
3. Fill in the registration form:
   - **Full Name:** Your name
   - **Email:** Your email
   - **Password:** Choose a secure password (min 6 characters)
   - **Confirm Password:** Re-enter password
   - **Account Type:** Select **"👑 Administrator"**
4. **Click "Create Account"**
5. You'll be logged in automatically as an admin! 🎉

### **Option 2: Create Admin via Database (For Testing)**

If you need to test quickly, you can create an admin directly in MongoDB Atlas:

1. Go to **MongoDB Atlas** (https://cloud.mongodb.com)
2. Click **"Database"** → Your cluster
3. Click **"Browse Collections"**
4. Find the **"users"** collection
5. Find your user document
6. Click **"Edit"**
7. Change `"role": "member"` to `"role": "admin"`
8. Click **"Update"**
9. Log out and log back in to see admin features

---

## 🔍 How to Tell if You're an Admin

### **Visual Indicators:**

✅ **In the Employee Management Page:**
- You can see **"Add New Employee"** button
- You can see **Edit** and **Delete** buttons for each employee
- Statistics show total employees, admins, and members

✅ **In Task Details:**
- You can **edit** task title and description
- You can **delete** tasks
- You can **add/edit/delete** subtasks
- You can **add/edit/delete** labels
- You can **add** comments
- **Save Changes** button is enabled

✅ **As a Member (non-admin):**
- Tasks show **(View Only)** label
- All fields are disabled/read-only
- No delete buttons
- No edit buttons

---

## 🚀 Admin Features

### **1. Employee Management** (`/employees`)

Access this by clicking **"Employees"** in the navigation.

**Admin can:**
- ✅ View all employees
- ✅ See statistics (total, admins, members)
- ✅ Add new employees
- ✅ Edit employee details
- ✅ Delete employees
- ✅ Search employees
- ✅ Filter by role (All, Admins, Members)

**Members can:**
- ❌ View only (no add/edit/delete)

### **2. Task Management** (Main Board)

**Admin can:**
- ✅ Create tasks
- ✅ Edit any task
- ✅ Delete any task
- ✅ Drag and drop tasks
- ✅ Add subtasks
- ✅ Add labels
- ✅ Add comments
- ✅ Change task status

**Members can:**
- ✅ View tasks (read-only)
- ✅ Drag and drop tasks
- ❌ Cannot edit or delete

---

## 🧪 Testing Admin vs Member Accounts

### **Create Test Accounts:**

**Admin Account:**
```
Name: Admin User
Email: admin@test.com
Password: admin123
Role: Administrator
```

**Member Account:**
```
Name: Team Member
Email: member@test.com
Password: member123
Role: Team Member
```

### **Test Scenarios:**

1. **Login as Admin** → Go to Employees → Should see add/edit/delete buttons
2. **Login as Admin** → Click a task → Should be able to edit and delete
3. **Login as Member** → Go to Employees → Should see view-only mode
4. **Login as Member** → Click a task → Should see "(View Only)" label
5. **Login as Member** → Try to edit task → Fields should be disabled

---

## 🎨 Registration Page Changes

### **What's New:**

✅ **Role Selection Field Added**
- Users can choose between "Team Member" or "Administrator"
- Default is "Team Member" if not selected
- Clear icons (👤 for member, 👑 for admin)

### **Login Page Changes:**

✅ **Helpful Tip Added**
- Blue info box with tip about admin registration
- Helps new users understand role system

---

## 🔐 Security Notes

### **For Demo/Portfolio:**
- ✅ Anyone can register as admin (fine for demo)
- ✅ Perfect for showcasing features
- ✅ Easy for evaluators to test

### **For Production (Real Users):**
- ⚠️ **Don't allow anyone to register as admin!**
- ⚠️ Make first user admin, then disable admin registration
- ⚠️ Or require admin approval for new admins
- ⚠️ Add email verification

---

## 📋 Quick Reference

### **URLs:**
- **Registration:** `/register`
- **Login:** `/login`
- **Board:** `/board`
- **Employees:** `/employees`

### **API Endpoints:**
- **Register:** `POST /api/auth/register` (with role field)
- **Login:** `POST /api/auth/login`
- **Get Employees:** `GET /api/employees` (admin only)
- **Create Employee:** `POST /api/employees` (admin only)
- **Update Employee:** `PUT /api/employees/:id` (admin only)
- **Delete Employee:** `DELETE /api/employees/:id` (admin only)

### **Default Test Credentials:**

If you used the seed script, these accounts exist:

**Admin:**
```
Email: admin@test.com
Password: admin123
Role: admin
```

**Member:**
```
Email: member@test.com
Password: member123
Role: member
```

---

## ✅ Deployment Checklist

When deploying to Render + Vercel:

- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] MongoDB Atlas configured
- [ ] CORS configured (already done - allows all origins)
- [ ] Environment variables set correctly
- [ ] Test registration with admin role
- [ ] Test registration with member role
- [ ] Test admin features (employees management)
- [ ] Test member features (view-only mode)
- [ ] Test login/logout flow

---

## 🎉 You're All Set!

Your ProU TaskBoard now has **complete role-based access control**!

**What Changed:**
- ✅ Registration page has role selection dropdown
- ✅ Login page has helpful admin tip
- ✅ Admin users get full permissions
- ✅ Member users get view-only access
- ✅ Employee management only for admins
- ✅ Task editing only for admins

**Next Steps:**
1. Deploy to Vercel (if not done)
2. Test both admin and member accounts
3. Show off your awesome project! 🚀

---

**Questions?**
- Admin features not working? Make sure you registered as "Administrator"
- Still seeing view-only? Check your user role in MongoDB Atlas
- Need help? Check the main README.md for setup instructions
