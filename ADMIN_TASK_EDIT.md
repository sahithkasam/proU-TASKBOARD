# Admin Task Edit Feature

## Overview
Added admin-only task editing capability allowing admins to change task status (todo/in-progress/done) and other task properties through the task modal.

## Changes Made

### 1. TaskModal.jsx (`frontend/src/shared/TaskModal.jsx`)
**Purpose**: Enhanced task modal to support admin-only editing with status control

**Key Changes**:
- Added `currentUser` and `employees` props
- Added admin check: `isAdmin = currentUser?.role === 'admin'`
- Added `status` and `assignee` to form state
- **Admin-only status dropdown**: Allows changing task status between todo/in-progress/done
- **Admin-only assignee selector**: Allows reassigning tasks to employees
- **Role-based UI**: 
  - Admins: All fields editable, can save and delete
  - Members: Read-only view with disabled inputs, "(View Only)" label
- Updated `onSave` handler to include status and assignee in updates

**New Props**:
```javascript
{
  task,           // Task object to display/edit
  employees,      // Array of employees for assignee dropdown
  currentUser,    // Current logged-in user (for role check)
  onClose,        // Close modal handler
  onSave,         // Save handler (admin only)
  onDelete        // Delete handler (admin only)
}
```

### 2. BoardImproved.jsx (`frontend/src/pages/BoardImproved.jsx`)
**Purpose**: Wire up TaskModal with admin editing capability

**Key Changes**:
- Imported `useAuth` hook
- Destructured `currentUser` from `useAuth()`
- Destructured `updateTask` from `useTasks()` hook
- Passed `currentUser={currentUser}` to TaskModal
- Added `onSave` prop to TaskModal that calls `updateTask({ id, updates })`

**Integration**:
```javascript
const { currentUser } = useAuth();
const { updateTask } = useTasks();

<TaskModal
  task={modalTask}
  employees={employees}
  currentUser={currentUser}
  onSave={(updatedData) => {
    updateTask({ id: modalTask._id, updates: updatedData });
    setModalTask(null);
  }}
  // ... other props
/>
```

## How It Works

### For Admins:
1. Click on any task card to open modal
2. Modal shows all fields as **editable**:
   - Title, Description, Priority, Due Date
   - **Status dropdown** (todo/in-progress/done)
   - **Assignee selector** (list of employees)
3. Make changes and click **Save**
4. Task updates across the board
5. Can also **Delete** task

### For Members:
1. Click on any task card to open modal
2. Modal shows "(View Only)" indicator
3. All fields are **disabled/read-only**
4. No Save or Delete buttons visible
5. Only **Close** button available

## Technical Details

### Authorization Flow:
```
BoardImproved.jsx (gets currentUser)
    ↓
TaskModal.jsx (receives currentUser prop)
    ↓
isAdmin = currentUser?.role === 'admin'
    ↓
Conditional rendering based on isAdmin
```

### Data Flow (Admin Save):
```
User edits task in modal
    ↓
Clicks "Save" button
    ↓
onSave({ title, description, priority, dueDate, status, assignee })
    ↓
BoardImproved calls updateTask({ id, updates })
    ↓
useTasks hook: PUT /api/tasks/:id
    ↓
Backend updates task in MongoDB
    ↓
React Query invalidates cache and refetches
    ↓
Board updates with new task data
```

### Status Change Methods:
1. **Drag-and-Drop**: Anyone can drag tasks between columns (calls `updateStatus`)
2. **Admin Edit Modal**: Admin explicitly selects status from dropdown (calls `updateTask`)

Both methods update the task status and trigger board refresh.

## Testing Instructions

### Test as Admin:
1. Login with admin credentials (e.g., `admin@example.com` / `admin123`)
2. Click on any task card
3. Verify:
   - Status dropdown is visible and enabled
   - Assignee selector is visible and enabled
   - All input fields are editable
   - Delete and Save buttons are visible
4. Change status from "todo" to "in-progress"
5. Click Save
6. Verify task moved to "In Progress" column

### Test as Member:
1. Login with member credentials (e.g., `user@example.com` / `user123`)
2. Click on any task card
3. Verify:
   - "(View Only)" appears in modal heading
   - All input fields are disabled (grayed out)
   - Status dropdown is disabled
   - Assignee selector is disabled
   - Only "Close" button is visible (no Save or Delete)
4. Click Close

## API Endpoints Used

- **GET /api/tasks**: Fetch all tasks
- **PUT /api/tasks/:id**: Update task (includes status and assignee)
- **PATCH /api/tasks/:id/status**: Update only task status (used by drag-and-drop)
- **DELETE /api/tasks/:id**: Delete task (admin only)

## File Locations

- Frontend Modal Component: `frontend/src/shared/TaskModal.jsx`
- Board Page: `frontend/src/pages/BoardImproved.jsx`
- Tasks Hook: `frontend/src/hooks/useTasks.js`
- Auth Hook: `frontend/src/hooks/useAuth.js`
- Backend Task Routes: `backend/src/routes/task.routes.js`

## Notes

- Status dropdown options: `todo`, `in-progress`, `done` (must match backend enum)
- Assignee can be null (unassigned task)
- All task updates go through React Query with automatic cache invalidation
- Optimistic updates are used for drag-and-drop, but not for modal edits (waits for server response)
- Role check happens on frontend for UI, but backend should also enforce authorization (already implemented with `requireRole` middleware)
