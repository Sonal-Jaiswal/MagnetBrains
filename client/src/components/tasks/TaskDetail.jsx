import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  ArrowLeft,
  Tag
} from 'lucide-react';
import toast from 'react-hot-toast';

const TaskDetail = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { getTaskById, updateTaskStatus, updateTaskPriority, deleteTask } = useTasks();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      const result = await getTaskById(taskId);
      if (result.success) {
        setTask(result.task);
      } else {
        toast.error(result.error);
        navigate('/tasks');
      }
      setLoading(false);
    };

    fetchTask();
  }, [taskId, getTaskById, navigate]);

  const handleStatusChange = async (newStatus) => {
    const result = await updateTaskStatus(taskId, newStatus);
    if (result.success) {
      setTask(result.task);
      toast.success('Task status updated!');
    } else {
      toast.error(result.error);
    }
  };

  const handlePriorityChange = async (newPriority) => {
    const result = await updateTaskPriority(taskId, newPriority);
    if (result.success) {
      setTask(result.task);
      toast.success('Task priority updated!');
    } else {
      toast.error(result.error);
    }
  };

  const handleDelete = async () => {
    const result = await deleteTask(taskId);
    if (result.success) {
      toast.success('Task deleted successfully!');
      navigate('/tasks');
    } else {
      toast.error(result.error);
    }
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
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in-progress': return <Clock className="h-5 w-5 text-blue-600" />;
      default: return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Task not found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The task you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <div className="mt-6">
          <Link to="/tasks" className="btn-primary">
            Back to Tasks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/tasks"
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <Link
            to={`/tasks/${task._id}/edit`}
            className="btn-secondary"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="btn-danger"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Task Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
          </div>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status and Priority */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Task Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(task.status)}
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="flex-1 text-sm border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                    {task.priority.toUpperCase()}
                  </span>
                  <select
                    value={task.priority}
                    onChange={(e) => handlePriorityChange(e.target.value)}
                    className="flex-1 text-sm border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent Priority</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Due Date */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Due Date</h2>
            <div className="flex items-center space-x-2 text-gray-700">
              <Calendar className="h-5 w-5" />
              <span>{format(new Date(task.dueDate), 'EEEE, MMMM dd, yyyy')}</span>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              {format(new Date(task.dueDate), 'h:mm a')}
            </div>
          </div>

          {/* Assignment */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Assignment</h2>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Created by</label>
                <div className="flex items-center space-x-2 mt-1">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">{task.createdBy.name}</span>
                </div>
                <div className="text-sm text-gray-500">{task.createdBy.email}</div>
              </div>

              {task.assignedTo && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Assigned to</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">{task.assignedTo.name}</span>
                  </div>
                  <div className="text-sm text-gray-500">{task.assignedTo.email}</div>
                </div>
              )}
            </div>
          </div>

          {/* Timestamps */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Timestamps</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <div>
                <span className="font-medium">Created:</span>{' '}
                {format(new Date(task.createdAt), 'MMM dd, yyyy h:mm a')}
              </div>
              <div>
                <span className="font-medium">Last updated:</span>{' '}
                {format(new Date(task.updatedAt), 'MMM dd, yyyy h:mm a')}
              </div>
            </div>
          </div>
        </div>
      </div>

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
                  Are you sure you want to delete "{task.title}"? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-center space-x-3 mt-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
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

export default TaskDetail;
