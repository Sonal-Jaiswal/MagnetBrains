import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../../context/TaskContext';
import { format } from 'date-fns';
import { 
  Calendar, 
  User, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Filter,
  Search
} from 'lucide-react';
import toast from 'react-hot-toast';

const TaskList = () => {
  const { 
    tasks, 
    pagination, 
    loading, 
    error, 
    fetchTasks, 
    deleteTask, 
    updateTaskStatus,
    setFilters,
    filters 
  } = useTasks();
  
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const handleStatusChange = async (taskId, newStatus) => {
    const result = await updateTaskStatus(taskId, newStatus);
    if (result.success) {
      toast.success('Task status updated!');
    } else {
      toast.error(result.error);
    }
  };

  const handleDelete = async (taskId) => {
    const result = await deleteTask(taskId);
    if (result.success) {
      toast.success('Task deleted successfully!');
      setShowDeleteModal(null);
    } else {
      toast.error(result.error);
    }
  };

  const handleSearch = () => {
    const newFilters = {};
    if (searchTerm) newFilters.search = searchTerm;
    if (statusFilter) newFilters.status = statusFilter;
    if (priorityFilter) newFilters.priority = priorityFilter;
    
    setFilters(newFilters);
    fetchTasks(1, newFilters);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setPriorityFilter('');
    setFilters({});
    fetchTasks(1, {});
  };


  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'priority-low';
      case 'medium': return 'priority-medium';
      case 'high': return 'priority-high';
      case 'urgent': return 'priority-urgent';
      default: return 'priority-medium';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-600" />;
      default: return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6 bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
        {filters.priority ? (
          <>
            <h1 className="text-2xl font-bold text-primary-900 capitalize">
              {filters.priority} Priority Tasks
            </h1>
            <p className="text-primary-700 mt-1">
              Viewing tasks with {filters.priority} priority level
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-primary-900">
              All Tasks
            </h1>
            <p className="text-primary-700 mt-1">
              View all your tasks
            </p>
          </>
        )}
      </div>
      
      {/* Filters - Only show when NOT viewing priority-specific lists */}
      {!filters.priority && (
        <div className="card p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search tasks..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="input-field"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          
          <select
            className="input-field"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          
          <div className="flex space-x-2">
            <button onClick={handleSearch} className="btn-primary flex-1">
              Apply
            </button>
            <button onClick={clearFilters} className="btn-secondary">
              Clear
            </button>
          </div>
        </div>
        </div>
      )}

      {/* Task List */}
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new task.
            </p>
            <div className="mt-6">
              <Link to="/tasks/create" className="btn-primary">
                Create Task
              </Link>
            </div>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      <Link 
                        to={`/tasks/${task._id}`}
                        className="hover:text-primary-600 transition-colors"
                      >
                        {task.title}
                      </Link>
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                      {task.priority.toUpperCase()}
                    </span>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(task.status)}
                      <span className="text-sm text-gray-600 capitalize">{task.status.replace('-', ' ')}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{task.description}</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
                    </div>
                    
                    {task.assignedTo && (
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>Assigned to: {task.assignedTo.name}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>Created by: {task.createdBy.name}</span>
                    </div>
                  </div>
                  
                  {task.tags && task.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {task.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  
                  <Link
                    to={`/tasks/${task._id}/edit`}
                    className="p-2 text-gray-400 hover:text-primary-600"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  
                  <button
                    onClick={() => setShowDeleteModal(task._id)}
                    className="p-2 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => fetchTasks(pagination.currentPage - 1, filters)}
              disabled={!pagination.hasPrevPage}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => fetchTasks(pagination.currentPage + 1, filters)}
              disabled={!pagination.hasNextPage}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">
                  {(pagination.currentPage - 1) * 10 + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(pagination.currentPage * 10, pagination.totalTasks)}
                </span>{' '}
                of{' '}
                <span className="font-medium">{pagination.totalTasks}</span>{' '}
                results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => fetchTasks(pagination.currentPage - 1, filters)}
                  disabled={!pagination.hasPrevPage}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => fetchTasks(pagination.currentPage + 1, filters)}
                  disabled={!pagination.hasNextPage}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">Delete Task</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this task? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-center space-x-3 mt-4">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteModal)}
                  className="btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
