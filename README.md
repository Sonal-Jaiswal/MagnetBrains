p# Task Management System

A comprehensive task management system built with React, Node.js, Express, and MongoDB. This application provides a complete solution for managing tasks with user authentication, priority management, task assignment, and real-time updates.

## 🚀 Features

### Core Functionality
- **Task Creation**: Create tasks with title, description, due date, priority, and assignment
- **Task Management**: View, edit, update, and delete tasks
- **Task Status Tracking**: Mark tasks as pending, in-progress, or completed
- **Priority Management**: Organize tasks by priority levels (Low, Medium, High, Urgent)
- **Task Assignment**: Assign tasks to specific users
- **User Authentication**: Secure login and registration system
- **Pagination**: Efficient task listing with pagination support
- **Search & Filters**: Search tasks and filter by status, priority, and assignment

### User Interface
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, intuitive interface built with Tailwind CSS
- **Color-coded Priority Lists**: Visual priority identification with color coding
- **Dashboard**: Comprehensive overview of tasks and productivity metrics
- **Real-time Updates**: Instant feedback with toast notifications
- **Confirmation Dialogs**: Safe deletion with confirmation prompts

### Technical Features
- **AJAX Operations**: Smooth, asynchronous data operations
- **JWT Authentication**: Secure token-based authentication
- **RESTful API**: Well-structured backend API
- **Database Integration**: MongoDB for data persistence
- **Context Management**: React Context for state management
- **Form Validation**: Client and server-side validation
- **Error Handling**: Comprehensive error handling and user feedback

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern React with hooks and context
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API requests
- **React Hook Form**: Form management
- **React Hot Toast**: Toast notifications
- **Date-fns**: Date manipulation library
- **Lucide React**: Icon library

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Token authentication
- **Bcryptjs**: Password hashing
- **Express Validator**: Input validation
- **CORS**: Cross-origin resource sharing

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **MongoDB** (v4.4 or higher)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd task-management-system
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install all dependencies (root, server, and client)
npm run install-all
```

### 3. Environment Setup

Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task_management
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

### 4. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Ubuntu/Debian
sudo systemctl start mongod

# On Windows
net start MongoDB
```

### 5. Run the Application

#### Development Mode (Recommended)
```bash
# Run both frontend and backend concurrently
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:3000`

#### Production Mode
```bash
# Build the frontend
npm run build

# Start the backend server
npm start
```

## 📱 Usage Guide

### Getting Started

1. **Register an Account**: Visit `/register` to create a new account
2. **Login**: Use your credentials to log in at `/login`
3. **Dashboard**: View your task overview and quick actions
4. **Create Tasks**: Click "Create New Task" to add tasks
5. **Manage Tasks**: View, edit, and organize your tasks

### Task Management

#### Creating Tasks
- **Title**: Brief, descriptive task title
- **Description**: Detailed task description
- **Due Date**: Set a deadline for the task
- **Priority**: Choose from Low, Medium, High, or Urgent
- **Assignment**: Assign the task to yourself or another user
- **Tags**: Add relevant tags for better organization

#### Task Operations
- **View Details**: Click on any task to see full details
- **Edit**: Modify task information using the edit button
- **Status Update**: Change task status using the dropdown
- **Priority Change**: Update task priority as needed
- **Delete**: Remove tasks with confirmation dialog

#### Priority Management
- **Color Coding**: Each priority level has a distinct color
- **Priority Lists**: Navigate to specific priority views
- **Quick Access**: Use dashboard priority overview for quick access

### User Management
- **User Roles**: Support for regular users and administrators
- **Task Assignment**: Assign tasks to any registered user
- **User Permissions**: Users can only modify their own tasks (unless admin)

## 🏗️ Project Structure

```
task-management-system/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── auth/      # Authentication components
│   │   │   ├── tasks/     # Task-related components
│   │   │   ├── Layout.jsx # Main layout component
│   │   │   └── Dashboard.jsx
│   │   ├── context/       # React Context providers
│   │   ├── App.jsx        # Main App component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   ├── middleware/       # Express middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── index.js          # Server entry point
│   └── package.json
├── package.json          # Root package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `GET /api/auth/users` - Get all users (for assignment)

### Tasks
- `GET /api/tasks` - Get tasks with pagination and filters
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PUT /api/tasks/:id/status` - Update task status
- `PUT /api/tasks/:id/priority` - Update task priority

## 🎨 Design Approach

### User Experience
- **Intuitive Navigation**: Clear sidebar navigation with priority-based organization
- **Visual Hierarchy**: Color-coded priorities and status indicators
- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Accessibility**: Proper ARIA labels and keyboard navigation support

### Performance
- **Lazy Loading**: Components loaded as needed
- **Pagination**: Efficient data loading with pagination
- **Optimistic Updates**: Immediate UI feedback for better UX
- **Error Boundaries**: Graceful error handling

### Security
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **Input Validation**: Both client and server-side validation
- **CORS Configuration**: Proper cross-origin resource sharing setup

## 🚀 Deployment

### Environment Variables
Ensure the following environment variables are set in production:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://your-mongodb-connection-string
JWT_SECRET=your-secure-jwt-secret-key
```

### Build for Production
```bash
# Build the frontend
npm run build

# The built files will be in client/dist/
```

### Database Setup
- Ensure MongoDB is running and accessible
- The application will create the database and collections automatically
- Consider setting up MongoDB Atlas for cloud deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the console for error messages
2. Ensure MongoDB is running
3. Verify all environment variables are set correctly
4. Check that all dependencies are installed

## 🔮 Future Enhancements

- **Real-time Collaboration**: WebSocket integration for real-time updates
- **File Attachments**: Support for task attachments
- **Task Templates**: Predefined task templates
- **Advanced Reporting**: Detailed analytics and reporting
- **Mobile App**: React Native mobile application
- **Email Notifications**: Automated email reminders
- **Calendar Integration**: Sync with external calendars
- **Team Management**: Enhanced team and project management features

---

**Built with ❤️ using React, Node.js, and MongoDB**
# MagnetBrains
