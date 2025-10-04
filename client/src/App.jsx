import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider, useTasks } from './context/TaskContext';
import Layout from './components/Layout';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import Dashboard from './components/Dashboard';
import TaskList from './components/tasks/TaskList';
import TaskDetail from './components/tasks/TaskDetail';
import TaskForm from './components/tasks/TaskForm';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return isAuthenticated ? <Navigate to="/" /> : children;
};

// Priority Task List Component - must be inside Router context
const PriorityTaskListWrapper = () => {
  const { setFilters } = useTasks();
  const { priority } = useParams();

  React.useEffect(() => {
    if (priority) {
      setFilters({ priority });
    }
  }, [priority, setFilters]);
  
  return <TaskList />;
};

// Task Detail Component - extract taskId from URL params
const TaskDetailWrapper = () => {
  const { taskId } = useParams();
  
  return <TaskDetail taskId={taskId} />;
};

// All Tasks Component - must clear any existing filters
const AllTasksWrapper = () => {
  const { setFilters } = useTasks();
  
  React.useEffect(() => {
    // Clear any existing filters when accessing /tasks
    setFilters({});
  }, [setFilters]);
  
  return <TaskList />;
};

// Edit Task Component - extract taskId from URL params
const EditTaskWrapper = () => {
  const { taskId } = useParams();
  
  return <TaskForm isEdit={true} taskId={taskId} />;
};

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <Router>
          <div className="App">
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
            
            <Routes>
              {/* Public Routes */}
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <LoginForm />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PublicRoute>
                    <RegisterForm />
                  </PublicRoute>
                } 
              />
              
              {/* Protected Routes */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tasks" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <AllTasksWrapper key="all-tasks" />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tasks/create" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <TaskForm />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tasks/:taskId" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <TaskDetailWrapper />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tasks/:taskId/edit" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <EditTaskWrapper />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tasks/priority/:priority" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <PriorityTaskListWrapper key="priority-tasks" />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Router>
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;
