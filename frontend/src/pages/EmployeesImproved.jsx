// src/pages/EmployeesImproved.jsx
// Modern Employees Management with Professional Design
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useEmployees } from '../hooks/useEmployees';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';

export default function EmployeesImproved() {
  const { currentUser } = useAuth();
  const { employees, isLoading, createEmployee, updateEmployee, deleteEmployee } = useEmployees();
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const isAdmin = currentUser?.role === 'admin';

  const onSubmit = (data) => {
    if (editingId) {
      updateEmployee({ id: editingId, updates: data });
      setEditingId(null);
    } else {
      createEmployee(data);
    }
    reset();
  };

  const handleEdit = (employee) => {
    setEditingId(employee._id);
    setValue('name', employee.name);
    setValue('email', employee.email);
    setValue('role', employee.role);
  };

  const handleCancel = () => {
    setEditingId(null);
    reset();
  };

  // Filter employees based on search and role
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || emp.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const stats = {
    total: employees.length,
    admins: employees.filter(e => e.role === 'admin').length,
    members: employees.filter(e => e.role === 'member').length,
  };

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <div className="employees-page">
      {/* Header Section */}
      <div className="employees-header">
        <div className="employees-header-content">
          <div className="employees-title-section">
            <div className="employees-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h1 className="employees-page-title">Team Management</h1>
              <p className="employees-page-subtitle">Manage your team members and permissions</p>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="employees-stats">
            <div className="stat-card stat-card-primary">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <div className="stat-value">{stats.total}</div>
                <div className="stat-label">Total Members</div>
              </div>
            </div>
            <div className="stat-card stat-card-warning">
              <div className="stat-icon">👑</div>
              <div className="stat-info">
                <div className="stat-value">{stats.admins}</div>
                <div className="stat-label">Administrators</div>
              </div>
            </div>
            <div className="stat-card stat-card-success">
              <div className="stat-icon">🎯</div>
              <div className="stat-info">
                <div className="stat-value">{stats.members}</div>
                <div className="stat-label">Team Members</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="employees-content">
        {/* Add/Edit Employee Form */}
        {isAdmin && (
          <div className="employee-form-card">
            <div className="form-card-header">
              <h3 className="form-card-title">
                {editingId ? '✏️ Edit Employee' : '➕ Add New Employee'}
              </h3>
              <p className="form-card-subtitle">
                {editingId ? 'Update employee information' : 'Create a new team member account'}
              </p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="employee-form-modern">
              <div className="form-row">
                <div className="form-group-modern">
                  <label className="form-label-modern">
                    <span className="label-icon">👤</span>
                    Full Name
                  </label>
                  <input
                    className="form-input-modern"
                    placeholder="Enter full name"
                    {...register('name', { required: 'Name is required', minLength: 2 })}
                  />
                  {errors.name && <span className="error-msg-modern">{errors.name.message}</span>}
                </div>

                <div className="form-group-modern">
                  <label className="form-label-modern">
                    <span className="label-icon">📧</span>
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-input-modern"
                    placeholder="email@example.com"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Invalid email format',
                      },
                    })}
                  />
                  {errors.email && <span className="error-msg-modern">{errors.email.message}</span>}
                </div>
              </div>

              <div className="form-row">
                {!editingId && (
                  <div className="form-group-modern">
                    <label className="form-label-modern">
                      <span className="label-icon">🔒</span>
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-input-modern"
                      placeholder="Min 6 characters"
                      {...register('password', {
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Minimum 6 characters required' },
                      })}
                    />
                    {errors.password && <span className="error-msg-modern">{errors.password.message}</span>}
                  </div>
                )}

                <div className="form-group-modern">
                  <label className="form-label-modern">
                    <span className="label-icon">🎭</span>
                    Role
                  </label>
                  <select {...register('role')} className="form-select-modern">
                    <option value="member">👤 Member</option>
                    <option value="admin">👑 Administrator</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-submit-modern">
                  {editingId ? '💾 Update Employee' : '✨ Create Employee'}
                </button>
                {editingId && (
                  <button type="button" onClick={handleCancel} className="btn-cancel-modern">
                    ❌ Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Employees Table Section */}
        <div className="employees-table-card">
          <div className="table-card-header">
            <h3 className="table-card-title">Team Members Directory</h3>
            
            {/* Search and Filter Bar */}
            <div className="table-filters">
              <div className="search-box-modern">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  className="search-input-modern"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="filter-group">
                <label className="filter-label">Filter by Role:</label>
                <select
                  className="filter-select-modern"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admins Only</option>
                  <option value="member">Members Only</option>
                </select>
              </div>
            </div>
          </div>

          {filteredEmployees.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">👥</div>
              <h3 className="empty-state-title">No employees found</h3>
              <p className="empty-state-text">
                {searchTerm || roleFilter !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Start by adding your first team member'}
              </p>
            </div>
          ) : (
            <div className="table-container-modern">
              <table className="employees-table-modern">
                <thead>
                  <tr>
                    <th className="table-header-modern">
                      <div className="th-content">
                        <span>👤</span> Employee
                      </div>
                    </th>
                    <th className="table-header-modern">
                      <div className="th-content">
                        <span>📧</span> Email
                      </div>
                    </th>
                    <th className="table-header-modern">
                      <div className="th-content">
                        <span>🎭</span> Role
                      </div>
                    </th>
                    {isAdmin && (
                      <th className="table-header-modern table-header-actions">
                        <div className="th-content">
                          <span>⚙️</span> Actions
                        </div>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((emp) => (
                    <tr key={emp._id} className="table-row-modern">
                      <td className="table-cell-modern">
                        <div className="employee-cell">
                          <div className="employee-avatar">
                            {emp.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="employee-info">
                            <div className="employee-name">{emp.name}</div>
                            {emp._id === currentUser?._id && (
                              <span className="badge-you">You</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="table-cell-modern">
                        <span className="employee-email">{emp.email}</span>
                      </td>
                      <td className="table-cell-modern">
                        <span className={`role-badge role-badge-${emp.role}`}>
                          {emp.role === 'admin' ? '👑' : '👤'} {emp.role}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="table-cell-modern table-cell-actions">
                          <div className="action-buttons">
                            <button 
                              onClick={() => handleEdit(emp)} 
                              className="btn-action btn-action-edit"
                              title="Edit employee"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete ${emp.name}?`)) {
                                  deleteEmployee(emp._id);
                                }
                              }}
                              className="btn-action btn-action-delete"
                              title="Delete employee"
                              disabled={emp._id === currentUser?._id}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="table-footer">
            <p className="table-footer-text">
              Showing {filteredEmployees.length} of {employees.length} employees
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
