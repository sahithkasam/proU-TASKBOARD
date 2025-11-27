# Frontend Architecture Documentation

## Overview
Modern React architecture with separation of concerns, custom hooks, React Query for server state, and form validation.

## Key Improvements

### 1. Server State Management (React Query)
- **Before**: Manual useState, useEffect, loading/error state in every component
- **After**: Centralized cache with `@tanstack/react-query`
- **Benefits**:
  - Automatic caching, refetching, and background updates
  - Optimistic updates for drag-and-drop
  - Reduced boilerplate (no manual loading/error states)
  - DevTools for debugging queries

### 2. Custom Hooks Layer
**Location**: `src/hooks/`

- `useAuth.js` - Authentication mutations (login, register, Google) and current user
- `useTasks.js` - Tasks CRUD with optimistic status updates
- `useEmployees.js` - Employees CRUD (admin operations)

**Pattern**:
```javascript
const { tasks, isLoading, createTask, updateStatus } = useTasks();
// vs old pattern:
const [tasks, setTasks] = useState([]);
const [loading, setLoading] = useState(true);
```

### 3. Enhanced Axios Instance
**Location**: `src/lib/axios.js`

- Global request interceptor: auto-attach JWT token
- Global response interceptor: handle 401 (logout + redirect)
- Centralized baseURL configuration

### 4. Form Validation (React Hook Form)
**Before**: Manual state + validation logic scattered in components
**After**: Declarative validation with `react-hook-form`

Example:
```javascript
const { register, handleSubmit, formState: { errors } } = useForm();
<input {...register('email', { 
  required: 'Email is required',
  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' }
})} />
```

### 5. Error Boundaries
**Location**: `src/components/ErrorBoundary.jsx`

- Catches React rendering errors globally
- Displays friendly fallback UI
- Prevents white screen of death

### 6. Loading States
**Location**: `src/components/LoadingSpinner.jsx`

- Reusable spinner with size variants
- fullScreen mode for page-level loading
- Consistent UX across all async operations

## Folder Structure

```
src/
├── lib/                    # Core configuration
│   ├── queryClient.js      # React Query setup
│   └── axios.js            # Enhanced axios instance
├── hooks/                  # Custom hooks (business logic)
│   ├── useAuth.js
│   ├── useTasks.js
│   └── useEmployees.js
├── components/             # Reusable UI components
│   ├── ErrorBoundary.jsx
│   ├── LoadingSpinner.jsx
│   ├── TaskCard.jsx
│   └── Column.jsx
├── pages/                  # Route-level components
│   ├── LoginImproved.jsx
│   ├── RegisterImproved.jsx
│   ├── BoardImproved.jsx
│   └── EmployeesImproved.jsx
├── shared/                 # Shared complex components
│   └── TaskModal.jsx
├── state/                  # Legacy context (kept for compatibility)
│   └── AuthContext.jsx
├── api/                    # Legacy API helpers (can be removed)
│   ├── auth.js
│   ├── tasks.js
│   └── employees.js
├── App.jsx                 # Root component + routing
├── main.jsx                # Entry point with providers
└── styles.css              # Global styles
```

## Migration Notes

### Old vs New Pages
- `Login.jsx` → `LoginImproved.jsx` (react-hook-form + useAuth)
- `Register.jsx` → `RegisterImproved.jsx` (validation + useAuth)
- `Board.jsx` → `BoardImproved.jsx` (useTasks + optimistic updates)
- `Employees.jsx` → `EmployeesImproved.jsx` (useEmployees + react-hook-form)

### Legacy Code
**Can be removed after testing**:
- `src/api/` folder (replaced by hooks using lib/axios directly)
- `src/state/AuthContext.jsx` (replaced by useAuth hook)
- Old page components (Login.jsx, Register.jsx, Board.jsx, Employees.jsx)

## Best Practices Applied

### 1. Separation of Concerns
- **Data fetching**: Custom hooks (useTasks, useEmployees)
- **UI logic**: Page components
- **Reusable UI**: Components folder
- **Configuration**: lib folder

### 2. DRY (Don't Repeat Yourself)
- Single axios instance with interceptors
- Reusable LoadingSpinner component
- Centralized error handling via ErrorBoundary

### 3. Performance
- React Query caching reduces redundant requests
- Optimistic updates for immediate UI feedback
- Proper staleTime/cacheTime configuration

### 4. Developer Experience
- React Query DevTools in dev mode
- TypeScript-ready structure (add .ts/.tsx later)
- Clear folder hierarchy

## Usage Examples

### Creating a Task
```javascript
const { createTask, isCreating } = useTasks();
createTask({ title: 'New task', status: 'todo' });
// Auto-refetches task list on success
```

### Optimistic Status Update
```javascript
const { updateStatus } = useTasks();
updateStatus({ id: taskId, status: 'done' });
// UI updates immediately, rolls back on error
```

### Form with Validation
```javascript
const { register, handleSubmit, formState: { errors } } = useForm();
const onSubmit = (data) => createTask(data);
<form onSubmit={handleSubmit(onSubmit)}>
  <input {...register('title', { required: true })} />
  {errors.title && <span>Required</span>}
</form>
```

## Next Steps (Optional Enhancements)

1. **TypeScript Migration**
   - Add types for API responses, hook returns
   - Catch errors at compile time

2. **React Query Prefetching**
   - Prefetch employees list on board mount
   - Faster perceived performance

3. **Suspense Boundaries**
   - Wrap routes in Suspense for loading states
   - Cleaner async component code

4. **Custom Form Components**
   - Wrap react-hook-form inputs with styled components
   - Add field-level error tooltips

5. **Testing**
   - Mock React Query for unit tests
   - Test custom hooks with @testing-library/react-hooks

6. **State Persistence**
   - Persist React Query cache to localStorage
   - Restore on page reload

## Running the Improved App

```bash
# From project root
npm run start:all

# Or separately
npm run start:backend  # Port 5001
npm run start:frontend # Port 5173
```

Visit http://localhost:5173 and test:
- Login/Register with validation
- Board with drag-and-drop (optimistic updates)
- Employees CRUD (admin only)
- Google Sign-In (if VITE_GOOGLE_CLIENT_ID set)
- React Query DevTools (bottom-left floating icon)
