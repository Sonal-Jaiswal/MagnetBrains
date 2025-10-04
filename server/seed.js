const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Task = require('./models/Task');
const connectDB = require('./config/database');

// Connect to database
connectDB();

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Create demo users
    const users = await User.create([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'admin'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'user'
      },
      {
        name: 'Bob Johnson',
        email: 'bob@example.com',
        password: 'password123',
        role: 'user'
      }
    ]);

    console.log('👥 Created demo users');

    // Create demo tasks
    const tasks = await Task.create([
      {
        title: 'Complete project proposal',
        description: 'Write and submit the project proposal for the new client by the end of the week.',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        priority: 'high',
        status: 'in-progress',
        createdBy: users[0]._id,
        assignedTo: users[1]._id,
        tags: ['work', 'proposal', 'client']
      },
      {
        title: 'Review team performance',
        description: 'Conduct quarterly performance reviews for all team members.',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        priority: 'medium',
        status: 'pending',
        createdBy: users[0]._id,
        assignedTo: users[0]._id,
        tags: ['hr', 'performance', 'quarterly']
      },
      {
        title: 'Update website content',
        description: 'Update the company website with new product information and pricing.',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        priority: 'urgent',
        status: 'pending',
        createdBy: users[1]._id,
        assignedTo: users[2]._id,
        tags: ['website', 'content', 'marketing']
      },
      {
        title: 'Organize team building event',
        description: 'Plan and organize a team building event for next month.',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        priority: 'low',
        status: 'pending',
        createdBy: users[1]._id,
        assignedTo: users[1]._id,
        tags: ['team', 'event', 'planning']
      },
      {
        title: 'Fix critical bug in production',
        description: 'Investigate and fix the critical bug reported by users in the production environment.',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        priority: 'urgent',
        status: 'in-progress',
        createdBy: users[2]._id,
        assignedTo: users[2]._id,
        tags: ['bug', 'production', 'critical']
      },
      {
        title: 'Complete training module',
        description: 'Complete the new employee training module on company policies.',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        priority: 'medium',
        status: 'completed',
        createdBy: users[0]._id,
        assignedTo: users[1]._id,
        tags: ['training', 'policies', 'employee']
      },
      {
        title: 'Prepare quarterly report',
        description: 'Compile and prepare the quarterly business report for stakeholders.',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        priority: 'high',
        status: 'pending',
        createdBy: users[0]._id,
        assignedTo: users[0]._id,
        tags: ['report', 'quarterly', 'business']
      },
      {
        title: 'Research new technologies',
        description: 'Research and evaluate new technologies that could benefit the company.',
        dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
        priority: 'low',
        status: 'pending',
        createdBy: users[2]._id,
        assignedTo: users[2]._id,
        tags: ['research', 'technology', 'innovation']
      }
    ]);

    console.log('📋 Created demo tasks');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Demo Data Summary:');
    console.log(`👥 Users: ${users.length}`);
    console.log(`📋 Tasks: ${tasks.length}`);
    console.log('\n🔑 Demo Login Credentials:');
    console.log('Admin: john@example.com / password123');
    console.log('User: jane@example.com / password123');
    console.log('User: bob@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
