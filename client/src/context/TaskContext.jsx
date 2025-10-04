import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

const taskReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_TASKS':
      return {
        ...state,
        tasks: action.payload.tasks,
        pagination: action.payload.pagination,
        loading: false,
        error: null,
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task._id === action.payload._id ? action.payload : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task._id !== action.payload),
      };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'CLEAR_FILTERS':
      return { ...state, filters: {} };
    default:
      return state;
  }
};

const initialState = {
  tasks: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalTasks: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  loading: false,
  error: null,
  filters: {},
};

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const { isAuthenticated } = useAuth();

  const fetchTasks = useMemo(() => async (page = 1, filters = {}) => {
    if (!isAuthenticated) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...filters,
      });

      const response = await axios.get(`/api/tasks?${params}`);
      dispatch({
        type: 'SET_TASKS',
        payload: {
          tasks: response.data.tasks,
          pagination: response.data.pagination,
        },
      });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Failed to fetch tasks',
      });
    }
  }, [isAuthenticated]);

  const createTask = async (taskData) => {
    try {
      const response = await axios.post('/api/tasks', taskData);
      dispatch({ type: 'ADD_TASK', payload: response.data });
      return { success: true, task: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create task',
      };
    }
  };

  const updateTask = async (taskId, updateData) => {
    try {
      const response = await axios.put(`/api/tasks/${taskId}`, updateData);
      dispatch({ type: 'UPDATE_TASK', payload: response.data });
      return { success: true, task: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update task',
      };
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      dispatch({ type: 'DELETE_TASK', payload: taskId });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete task',
      };
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      const response = await axios.put(`/api/tasks/${taskId}/status`, { status });
      dispatch({ type: 'UPDATE_TASK', payload: response.data });
      return { success: true, task: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update task status',
      };
    }
  };

  const updateTaskPriority = async (taskId, priority) => {
    try {
      const response = await axios.put(`/api/tasks/${taskId}/priority`, { priority });
      dispatch({ type: 'UPDATE_TASK', payload: response.data });
      return { success: true, task: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update task priority',
      };
    }
  };

  const getTaskById = async (taskId) => {
    try {
      const response = await axios.get(`/api/tasks/${taskId}`);
      return { success: true, task: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch task',
      };
    }
  };

  const setFilters = useMemo(() => (filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  const clearFilters = useMemo(() => () => {
    dispatch({ type: 'CLEAR_FILTERS' });
  }, []);

  // Memoize filters to prevent infinite loops
  const memoizedFilters = useMemo(() => state.filters, [
    state.filters.priority,
    state.filters.status,
    state.filters.assignedTo,
    state.filters.createdBy
  ]);

  // Fetch tasks when filters change
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks(1, memoizedFilters);
    }
  }, [isAuthenticated, memoizedFilters, fetchTasks]);

  const value = {
    ...state,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskPriority,
    getTaskById,
    setFilters,
    clearFilters,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
