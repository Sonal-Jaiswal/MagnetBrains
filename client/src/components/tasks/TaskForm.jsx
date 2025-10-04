import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Calendar, User, Tag, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const TaskForm = ({ taskId, isEdit = false }) => {
  const navigate = useNavigate();
  const { createTask, updateTask, getTaskById } = useTasks();
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    assignedTo: '',
    tags: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch users for assignment
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/auth/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();

    // If editing, fetch task data
    if (isEdit && taskId) {
      const fetchTask = async () => {
        const result = await getTaskById(taskId);
        if (result.success) {
          const task = result.task;
          setFormData({
            title: task.title,
            description: task.description,
            dueDate: new Date(task.dueDate).toISOString().split('T')[0],
            priority: task.priority,
            assignedTo: task.assignedTo?._id || '',
            tags: task.tags.join(', '),
          });
        }
      };
      fetchTask();
    }
  }, [isEdit, taskId, getTaskById]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const taskData = {
        title: formData.title,
        description: formData.description,
        dueDate: new Date(formData.dueDate).toISOString(),
        priority: formData.priority,
        assignedTo: formData.assignedTo || null,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      };

      let result;
      if (isEdit) {
        result = await updateTask(taskId, taskData);
      } else {
        result = await createTask(taskData);
      }

      if (result.success) {
        toast.success(isEdit ? 'Task updated successfully!' : 'Task created successfully!');
        navigate('/tasks');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {isEdit ? 'Edit Task' : 'Create New Task'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="input-field"
              placeholder="Enter task title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              className="input-field"
              placeholder="Enter task description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
              Due Date *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                required
                className="input-field pl-10"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <AlertCircle className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="priority"
                name="priority"
                className="input-field pl-10"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent Priority</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-2">
              Assign To
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="assignedTo"
                name="assignedTo"
                className="input-field pl-10"
                value={formData.assignedTo}
                onChange={handleChange}
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Tag className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="tags"
                name="tags"
                className="input-field pl-10"
                placeholder="Enter tags separated by commas"
                value={formData.tags}
                onChange={handleChange}
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">Separate tags with commas</p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/tasks')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50"
            >
              {loading ? 'Saving...' : (isEdit ? 'Update Task' : 'Create Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
