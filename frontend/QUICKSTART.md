# 🚀 Quick Start Guide - Improved Frontend

## What Changed?

Your frontend now has **production-grade architecture** with:
- ✅ React Query (automatic caching & optimistic updates)
- ✅ React Hook Form (clean validation)
- ✅ Custom hooks (useAuth, useTasks, useEmployees)
- ✅ Error boundaries (no more white screens)
- ✅ Global axios interceptors (auto-logout on 401)

## Start the App

```bash
# From project root
cd /Users/user/Desktop/Taskmanagement
npm run start:all
```

Or separately:
```bash
npm run start:backend   # Port 5001
npm run start:frontend  # Port 5173
```

## Test the Improvements

### 1. Login Page (http://localhost:5173/login)
- Try empty fields → See instant validation
- Try invalid email → See format error
- Wrong password → Clear error message
- Success → Auto-navigate to board

**New**: Google Sign-In button (if `VITE_GOOGLE_CLIENT_ID` set)

### 2. Register Page
- Password confirmation with match validation
- Duplicate email detection
- All fields validated on blur

### 3. Board (Drag & Drop)
**Old behavior**: Drag task → Loading → Update
**New behavior**: Drag task → **Instant update** → Background sync

Try this:
1. Drag a task to "In Progress"
2. Notice it moves **immediately** (optimistic)
3. If API fails, it rolls back automatically

### 4. React Query DevTools
- Look for floating **React Query** icon (bottom-left)
- Click to see:
  - Active queries
  - Cache status
  - Refetch controls

### 5. Error Handling
Test automatic 401 handling:
1. Login
2. In DevTools → Application → Local Storage → Delete `token`
3. Try to create a task
4. **Auto-redirects to login** (no manual logout needed)

## File Tour

### Core Configuration
```
src/lib/
├── queryClient.js    ← React Query config (5min stale, 10min cache)
└── axios.js          ← Single axios instance with auth interceptor
```

### Business Logic (Hooks)
```
src/hooks/
├── useAuth.js        ← login, register, googleLogin, logout
├── useTasks.js       ← CRUD + optimistic status updates
└── useEmployees.js   ← CRUD for admin
```

### UI Components
```
src/pages/
├── LoginImproved.jsx      ← react-hook-form + useAuth
├── RegisterImproved.jsx   ← Validation + password match
├── BoardImproved.jsx      ← useTasks + optimistic DnD
└── EmployeesImproved.jsx  ← useEmployees + admin checks
```

## Common Tasks

### Add a New Feature (Example: Task Comments)

**Old way** (8 files, 200 lines):
```
1. Create src/api/comments.js
2. Add useState in component
3. Add useEffect for fetching
4. Add loading/error states
5. Add error handling
6. Add manual cache invalidation
7. Update component render
8. Test everything manually
```

**New way** (2 files, 50 lines):
```javascript
// 1. Create src/hooks/useComments.js
export function useComments(taskId) {
  return useQuery({
    queryKey: ['comments', taskId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/tasks/${taskId}/comments`);
      return data;
    },
  });
}

// 2. Use in component
const { data: comments, isLoading } = useComments(taskId);
```

Done! Auto-caching, loading states, error handling all included.

### Debugging Tips

#### API calls not working?
```bash
# Check backend is running
curl http://localhost:5001/api/health
```

#### Token expired errors?
- Check `localStorage.token` in DevTools
- Re-login to get fresh token

#### Form not submitting?
- Check validation errors (red text under fields)
- React Hook Form prevents submit if invalid

#### React Query not refetching?
- Check staleTime in `lib/queryClient.js`
- Manually invalidate: `queryClient.invalidateQueries(['tasks'])`

## Performance Tips

### Current Config (lib/queryClient.js)
```javascript
staleTime: 5 minutes   // Data fresh for 5min
cacheTime: 10 minutes  // Keep in memory for 10min
```

**Adjust based on your needs**:
- Real-time app? → Lower staleTime (1 min)
- Static data? → Higher staleTime (30 min)

### Prefetching (Future)
```javascript
// Preload employees when mounting board
useEffect(() => {
  queryClient.prefetchQuery(['employees'], fetchEmployees);
}, []);
```

## Migration Checklist

- [x] Dependencies installed
- [x] React Query provider added
- [x] Error boundary wrapping app
- [x] Custom hooks created
- [x] Improved pages created
- [x] App.jsx updated to use new pages
- [x] Build successful
- [ ] Test all flows (login, CRUD, DnD)
- [ ] Remove old files (optional, after testing)

## Cleanup (Optional)

Once you've tested everything:

```bash
cd frontend/src

# Remove old pages
rm pages/Login.jsx pages/Register.jsx pages/Board.jsx pages/Employees.jsx

# Remove old API layer (replaced by hooks)
rm -rf api/

# Remove old auth context (replaced by useAuth)
rm state/AuthContext.jsx
```

**Note**: Keep a git branch/backup before deleting!

## Documentation

- **ARCHITECTURE.md** - Full technical docs
- **IMPROVEMENTS.md** - What was added
- **COMPARISON.md** - Before/after code examples
- **This file** - Quick start

## Next Steps

1. **Test thoroughly** - Try all user flows
2. **TypeScript** (optional) - Add .ts/.tsx for type safety
3. **Tests** - Unit test hooks with @testing-library/react-hooks
4. **UI library** - Consider MUI/Chakra for components
5. **Monitoring** - Add Sentry for production error tracking

## Questions?

Check the docs above or examine the code patterns:
- `useAuth` → How to handle mutations
- `useTasks` → How to do optimistic updates
- `LoginImproved` → How to use react-hook-form
- `lib/axios` → How interceptors work

---

**Status**: ✅ Ready to use
**Tested**: Build successful, no errors
**Safe**: Old code still present (can rollback)
