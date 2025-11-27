import { useMemo } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useEmployees } from '../hooks/useEmployees';
import { useAuth } from '../hooks/useAuth';
import '../styles/Dashboard.css';

const DashboardImproved = () => {
  const { currentUser } = useAuth();
  const { tasks = [], isLoading: tasksLoading } = useTasks();
  const { employees = [], isLoading: employeesLoading } = useEmployees();

  // Calculate statistics
  const stats = useMemo(() => {
    const total = tasks.length;
    const todoCount = tasks.filter(t => t.status === 'todo').length;
    const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;
    const doneCount = tasks.filter(t => t.status === 'done').length;

    const highPriority = tasks.filter(t => t.priority === 'high').length;
    const mediumPriority = tasks.filter(t => t.priority === 'medium').length;
    const lowPriority = tasks.filter(t => t.priority === 'low').length;

    const myTasks = tasks.filter(t => 
      t.assignedTo && t.assignedTo._id === currentUser?._id
    ).length;

    const overdueTasks = tasks.filter(t => {
      if (!t.dueDate || t.status === 'done') return false;
      return new Date(t.dueDate) < new Date();
    }).length;

    const completionRate = total > 0 ? ((doneCount / total) * 100).toFixed(1) : 0;

    return {
      total,
      todoCount,
      inProgressCount,
      doneCount,
      highPriority,
      mediumPriority,
      lowPriority,
      myTasks,
      overdueTasks,
      completionRate,
    };
  }, [tasks, currentUser]);

  // Team performance
  const teamPerformance = useMemo(() => {
    return employees.map(employee => {
      const assignedTasks = tasks.filter(t => 
        t.assignedTo && t.assignedTo._id === employee._id
      );
      const completedTasks = assignedTasks.filter(t => t.status === 'done');
      
      return {
        name: employee.name,
        assigned: assignedTasks.length,
        completed: completedTasks.length,
        completionRate: assignedTasks.length > 0 
          ? ((completedTasks.length / assignedTasks.length) * 100).toFixed(1)
          : 0,
      };
    }).sort((a, b) => b.completed - a.completed);
  }, [tasks, employees]);

  // Recent activity (last 5 tasks updated or created)
  const recentActivity = useMemo(() => {
    return [...tasks]
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5)
      .map(task => ({
        ...task,
        timeAgo: getTimeAgo(task.updatedAt),
      }));
  }, [tasks]);

  // Helper function for time formatting
  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const getStatusEmoji = (status) => {
    switch (status) {
      case 'todo': return '📋';
      case 'in-progress': return '⚡';
      case 'done': return '✅';
      default: return '📄';
    }
  };

  const getPriorityEmoji = (priority) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  if (tasksLoading || employeesLoading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">📊 Dashboard</h1>
        <p className="dashboard-subtitle">
          Welcome back, <strong>{currentUser?.name}</strong>! Here's your overview.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="stats-grid">
        <div className="stat-card stat-card-primary">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.total}</h3>
            <p className="stat-label">Total Tasks</p>
          </div>
        </div>

        <div className="stat-card stat-card-todo">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.todoCount}</h3>
            <p className="stat-label">To Do</p>
          </div>
        </div>

        <div className="stat-card stat-card-progress">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.inProgressCount}</h3>
            <p className="stat-label">In Progress</p>
          </div>
        </div>

        <div className="stat-card stat-card-done">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.doneCount}</h3>
            <p className="stat-label">Completed</p>
          </div>
        </div>

        <div className="stat-card stat-card-user">
          <div className="stat-icon">👤</div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.myTasks}</h3>
            <p className="stat-label">My Tasks</p>
          </div>
        </div>

        <div className="stat-card stat-card-warning">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.overdueTasks}</h3>
            <p className="stat-label">Overdue</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Status Distribution Chart */}
        <div className="chart-card">
          <h2 className="chart-title">📈 Task Status Distribution</h2>
          <div className="chart-content">
            <div className="pie-chart">
              <div className="pie-segment pie-todo" style={{ '--percentage': (stats.todoCount / stats.total * 100) || 0 }}>
                <span className="pie-label">
                  {stats.todoCount > 0 && `${((stats.todoCount / stats.total) * 100).toFixed(0)}%`}
                </span>
              </div>
              <div className="pie-segment pie-progress" style={{ '--percentage': (stats.inProgressCount / stats.total * 100) || 0 }}>
                <span className="pie-label">
                  {stats.inProgressCount > 0 && `${((stats.inProgressCount / stats.total) * 100).toFixed(0)}%`}
                </span>
              </div>
              <div className="pie-segment pie-done" style={{ '--percentage': (stats.doneCount / stats.total * 100) || 0 }}>
                <span className="pie-label">
                  {stats.doneCount > 0 && `${((stats.doneCount / stats.total) * 100).toFixed(0)}%`}
                </span>
              </div>
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-color legend-todo"></span>
                <span>To Do ({stats.todoCount})</span>
              </div>
              <div className="legend-item">
                <span className="legend-color legend-progress"></span>
                <span>In Progress ({stats.inProgressCount})</span>
              </div>
              <div className="legend-item">
                <span className="legend-color legend-done"></span>
                <span>Done ({stats.doneCount})</span>
              </div>
            </div>
          </div>
          <div className="completion-rate">
            <div className="completion-text">
              Completion Rate: <strong>{stats.completionRate}%</strong>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${stats.completionRate}%` }}></div>
            </div>
          </div>
        </div>

        {/* Priority Distribution Chart */}
        <div className="chart-card">
          <h2 className="chart-title">🎯 Priority Distribution</h2>
          <div className="chart-content">
            <div className="bar-chart">
              <div className="bar-item">
                <div className="bar-label">
                  <span className="bar-emoji">🔴</span>
                  <span>High</span>
                </div>
                <div className="bar-track">
                  <div 
                    className="bar-fill bar-high" 
                    style={{ width: `${stats.total > 0 ? (stats.highPriority / stats.total * 100) : 0}%` }}
                  >
                    <span className="bar-count">{stats.highPriority}</span>
                  </div>
                </div>
              </div>
              <div className="bar-item">
                <div className="bar-label">
                  <span className="bar-emoji">🟡</span>
                  <span>Medium</span>
                </div>
                <div className="bar-track">
                  <div 
                    className="bar-fill bar-medium" 
                    style={{ width: `${stats.total > 0 ? (stats.mediumPriority / stats.total * 100) : 0}%` }}
                  >
                    <span className="bar-count">{stats.mediumPriority}</span>
                  </div>
                </div>
              </div>
              <div className="bar-item">
                <div className="bar-label">
                  <span className="bar-emoji">🟢</span>
                  <span>Low</span>
                </div>
                <div className="bar-track">
                  <div 
                    className="bar-fill bar-low" 
                    style={{ width: `${stats.total > 0 ? (stats.lowPriority / stats.total * 100) : 0}%` }}
                  >
                    <span className="bar-count">{stats.lowPriority}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Performance & Recent Activity */}
      <div className="bottom-grid">
        {/* Team Performance */}
        <div className="team-card">
          <h2 className="section-title">👥 Team Performance</h2>
          <div className="team-list">
            {teamPerformance.length === 0 ? (
              <p className="empty-state">No team members yet</p>
            ) : (
              teamPerformance.map((member, index) => (
                <div key={index} className="team-member">
                  <div className="member-info">
                    <div className="member-avatar">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="member-details">
                      <h4 className="member-name">{member.name}</h4>
                      <p className="member-stats">
                        {member.completed} of {member.assigned} tasks completed
                      </p>
                    </div>
                  </div>
                  <div className="member-progress">
                    <div className="member-rate">{member.completionRate}%</div>
                    <div className="mini-progress-bar">
                      <div 
                        className="mini-progress-fill" 
                        style={{ width: `${member.completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="activity-card">
          <h2 className="section-title">🕐 Recent Activity</h2>
          <div className="activity-list">
            {recentActivity.length === 0 ? (
              <p className="empty-state">No recent activity</p>
            ) : (
              recentActivity.map((task) => (
                <div key={task._id} className="activity-item">
                  <div className="activity-icon">
                    {getStatusEmoji(task.status)}
                  </div>
                  <div className="activity-content">
                    <h4 className="activity-title">
                      {getPriorityEmoji(task.priority)} {task.title}
                    </h4>
                    <p className="activity-meta">
                      {task.assignedTo ? (
                        <>Assigned to <strong>{task.assignedTo.name}</strong> • </>
                      ) : (
                        <>Unassigned • </>
                      )}
                      <span className="activity-status status-{task.status}">
                        {task.status.replace('-', ' ')}
                      </span>
                    </p>
                  </div>
                  <div className="activity-time">
                    {task.timeAgo}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardImproved;
