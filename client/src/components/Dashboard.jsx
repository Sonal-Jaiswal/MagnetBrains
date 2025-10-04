import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { 
  Plus, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  TrendingUp,
  Calendar,
  User,
  BarChart3
} from 'lucide-react';

const Dashboard = () => {
  const { tasks, fetchTasks } = useTasks();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
  });

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    if (tasks.length > 0) {
      const now = new Date();
      const taskStats = tasks.reduce((acc, task) => {
        acc.total++;
        acc[task.status]++;
        
        if (new Date(task.dueDate) < now && task.status !== 'completed') {
          acc.overdue++;
        }
        
        return acc;
      }, {
        total: 0,
        pending: 0,
        'in-progress': 0,
        completed: 0,
        overdue: 0,
      });
      
      setStats(taskStats);
    }
  }, [tasks]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      case 'urgent': return 'text-red-800 bg-red-200';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-600" />;
      default: return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const recentTasks = tasks.slice(0, 5);
  const upcomingTasks = tasks
    .filter(task => new Date(task.dueDate) > new Date() && task.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-primary-100">
          Here's an overview of your tasks and productivity.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{stats['in-progress']}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">{stats.overdue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link to="/tasks/create" className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Create New Task
          </Link>
          <Link to="/tasks" className="btn-secondary">
            View All Tasks
          </Link>
          <Link to="/tasks/priority/high" className="btn-secondary">
            High Priority Tasks
          </Link>
          <Link to="/tasks/priority/urgent" className="btn-secondary">
            Urgent Tasks
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Tasks</h2>
          {recentTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No tasks yet</p>
          ) : (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div key={task._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <Link
                      to={`/tasks/${task._id}`}
                      className="font-medium text-gray-900 hover:text-primary-600"
                    >
                      {task.title}
                    </Link>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusIcon(task.status)}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {format(new Date(task.dueDate), 'MMM dd')}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4">
            <Link to="/tasks" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View all tasks →
            </Link>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Deadlines</h2>
          {upcomingTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No upcoming deadlines</p>
          ) : (
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div key={task._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <Link
                      to={`/tasks/${task._id}`}
                      className="font-medium text-gray-900 hover:text-primary-600"
                    >
                      {task.title}
                    </Link>
                    <div className="flex items-center space-x-2 mt-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4">
            <Link to="/tasks" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View all tasks →
            </Link>
          </div>
        </div>
      </div>

      {/* Priority Overview */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Priority Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {['urgent', 'high', 'medium', 'low'].map((priority) => {
            const priorityTasks = tasks.filter(task => task.priority === priority);
            return (
              <Link
                key={priority}
                to={`/tasks/priority/${priority}`}
                className="p-4 rounded-lg border-2 border-dashed hover:border-solid transition-all duration-200 hover:shadow-md"
              >
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-2 ${getPriorityColor(priority)}`}>
                    <span className="text-lg font-bold">
                      {priorityTasks.length}
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-900 capitalize">{priority} Priority</h3>
                  <p className="text-sm text-gray-500">
                    {priorityTasks.filter(task => task.status !== 'completed').length} active
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
