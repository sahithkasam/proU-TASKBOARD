# Status Field Fix

## Issue
Tasks with "in-progress" status were not updating correctly. The issue was caused by a mismatch between backend and frontend status values:

- **Backend model** (Task.js): Used `'in_progress'` (underscore)
- **Frontend code**: Used `'in-progress'` (hyphen)

When updating a task status to "in-progress" from the frontend, the backend validation would reject it because `'in-progress'` was not in the allowed enum values `['todo', 'in_progress', 'done']`.

## Root Cause
The Task model schema had:
```javascript
const STATUS = ['todo', 'in_progress', 'done'];  // ❌ Wrong
```

But the frontend was sending:
```javascript
status: 'in-progress'  // Uses hyphen
```

This caused Mongoose validation to fail silently or reject the update for "in-progress" status.

## Solution
Updated the backend Task model to match the frontend convention:

### Files Changed:

1. **backend/src/models/Task.js**
   - Changed: `const STATUS = ['todo', 'in_progress', 'done'];`
   - To: `const STATUS = ['todo', 'in-progress', 'done'];`

2. **backend/src/scripts/seed.js**
   - Changed: `status: 'in_progress'`
   - To: `status: 'in-progress'`

3. **backend/src/scripts/fix-status.js** (NEW)
   - Created migration script to update existing database records
   - Converts any `'in_progress'` values to `'in-progress'`

## Migration
Ran the migration script to fix existing data:
```bash
node backend/src/scripts/fix-status.js
```

Result: Updated any existing tasks with old format to new format.

## Verification
After the fix, all three status values work correctly:
- ✅ `todo` - Tasks in "To Do" column
- ✅ `in-progress` - Tasks in "In Progress" column  
- ✅ `done` - Tasks in "Done" column

## Testing
1. Login as admin (`admin@example.com` / `admin123`)
2. Open any task modal
3. Change status to "In Progress" using the dropdown
4. Click "Save"
5. Verify task moves to the "In Progress" column
6. Repeat for other status values to confirm all work

## Future Prevention
- Keep status values consistent between frontend and backend
- Consider using constants file shared between frontend/backend
- Add validation tests to catch schema mismatches early
- Document the enum values in API documentation

## Related Files
- `backend/src/models/Task.js` - Task schema definition
- `backend/src/scripts/seed.js` - Database seeding script
- `backend/src/scripts/fix-status.js` - Migration script
- `frontend/src/pages/BoardImproved.jsx` - Board columns definition
- `frontend/src/shared/TaskModal.jsx` - Status dropdown
