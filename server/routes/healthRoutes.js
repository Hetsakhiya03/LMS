const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Import Models
const User = require('../models/User');
const Category = require('../models/Category');
const Course = require('../models/Course');
const Section = require('../models/Section');
const Lecture = require('../models/Lecture');
const Enrollment = require('../models/Enrollment');
const Progress = require('../models/Progress');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Review = require('../models/Review');
const Wishlist = require('../models/Wishlist');
const Assignment = require('../models/Assignment');
const Notification = require('../models/Notification');
const Certificate = require('../models/Certificate');
const QuizAttempt = require('../models/QuizAttempt');
const AssignmentSubmission = require('../models/AssignmentSubmission');

/**
 * @route   GET /api/health
 * @desc    Get API & DB status
 * @access  Public
 */
router.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    success: true,
    message: 'LearnPulse LMS API is running smooth',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    version: '1.0.0',
  });
});

/**
 * @route   POST /api/seed
 * @desc    Seed the database with demo data (protected by secret key)
 * @access  Private (secret key required)
 */
router.post('/seed', async (req, res) => {
  const { secret } = req.body;
  if (secret !== 'LEARNPULSE_SEED_2026') {
    return res.status(403).json({ success: false, message: 'Forbidden: Invalid seed secret.' });
  }

  try {
    // Clean all collections
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Course.deleteMany({}),
      Section.deleteMany({}),
      Lecture.deleteMany({}),
      Enrollment.deleteMany({}),
      Progress.deleteMany({}),
      Quiz.deleteMany({}),
      Question.deleteMany({}),
      QuizAttempt.deleteMany({}),
      Assignment.deleteMany({}),
      AssignmentSubmission.deleteMany({}),
      Review.deleteMany({}),
      Wishlist.deleteMany({}),
      Certificate.deleteMany({}),
      Notification.deleteMany({}),
    ]);

    // --- Users ---
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@learnpulse.com',
      password: 'password123',
      role: 'admin',
      bio: 'Head administrator managing LearnPulse LMS platform governance.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    });

    const instructor1 = await User.create({
      name: 'Alex Rivera',
      email: 'alex@learnpulse.com',
      password: 'password123',
      role: 'instructor',
      headline: 'Principal Full Stack Architect & MERN Educator',
      bio: 'Over 10 years of software engineering experience leading cloud enterprise solutions.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    });

    const instructor2 = await User.create({
      name: 'Dr. Vikram Seth',
      email: 'vikram@learnpulse.com',
      password: 'password123',
      role: 'instructor',
      headline: 'Algorithms Specialist & Computer Science PhD',
      bio: 'Passionate computer science educator specializing in DSA, C++, and competitive programming.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    });

    const instructor3 = await User.create({
      name: 'Sophia Chen',
      email: 'sophia@learnpulse.com',
      password: 'password123',
      role: 'instructor',
      headline: 'AI & Data Science Lead',
      bio: 'Machine learning scientist building intelligent models and mentoring engineers worldwide.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    });

    const studentNames = [
      'Riya Sharma', 'Arjun Mehta', 'Priya Patel', 'Karan Joshi', 'Sneha Gupta',
      'Rohan Das', 'Ananya Singh', 'Dev Kapoor', 'Meera Nair', 'Vivek Kumar',
    ];
    const students = [];
    for (let i = 0; i < 10; i++) {
      const student = await User.create({
        name: studentNames[i],
        email: `student${i + 1}@learnpulse.com`,
        password: 'password123',
        role: 'student',
        bio: 'Enthusiastic learner mastering modern technology skills.',
        avatar: `https://i.pravatar.cc/150?img=${i + 10}`,
      });
      students.push(student);
    }

    // --- Categories ---
    const categoryData = [
      { name: 'Web Development', icon: 'Code', description: 'HTML, CSS, JavaScript, React, Node.js & Full-stack frameworks.' },
      { name: 'Programming', icon: 'Cpu', description: 'Core computer science fundamentals, C++, Java, and Python.' },
      { name: 'Data Science', icon: 'BarChart3', description: 'Data analysis, visualization, Pandas, and statistics.' },
      { name: 'Artificial Intelligence', icon: 'Sparkles', description: 'Machine learning, deep learning, neural networks, and AI APIs.' },
      { name: 'Database', icon: 'Database', description: 'Relational SQL, PostgreSQL, and NoSQL MongoDB document databases.' },
      { name: 'Cloud Computing', icon: 'Layers', description: 'AWS, Docker, Kubernetes, DevOps, and cloud deployment.' },
      { name: 'Cyber Security', icon: 'Lock', description: 'Ethical hacking, network security, and vulnerability assessment.' },
      { name: 'Software Engineering', icon: 'CheckCircle2', description: 'System design, testing, architecture, and agile practices.' },
    ];
    const categories = await Category.insertMany(categoryData);
    const webDevCat = categories.find((c) => c.name === 'Web Development');
    const progCat = categories.find((c) => c.name === 'Programming');
    const aiCat = categories.find((c) => c.name === 'Artificial Intelligence');
    const cloudCat = categories.find((c) => c.name === 'Cloud Computing');
    const dsCat = categories.find((c) => c.name === 'Data Science');
    const dbCat = categories.find((c) => c.name === 'Database');

    // --- Courses ---
    const courseSeeds = [
      {
        title: 'Complete JavaScript & MERN Stack Masterclass',
        description: 'Master modern full-stack web development from scratch using React, Node.js, Express, and MongoDB. Build real-world production projects with authentication, REST APIs, and cloud deployment.',
        thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&auto=format&fit=crop&q=80',
        instructor: instructor1._id,
        category: webDevCat._id,
        level: 'Intermediate',
        price: 49.99,
        isFree: false,
        duration: '42 Hours',
        requirements: ['Basic HTML & CSS knowledge', 'A laptop running Windows/Mac/Linux'],
        learningObjectives: ['Build full-stack MERN apps', 'Implement JWT Authentication & RBAC', 'Integrate MongoDB with Mongoose', 'Deploy to cloud with CI/CD'],
        sections: [
          {
            title: 'Section 1: Modern JavaScript (ES6+)',
            lectures: [
              { title: 'Arrow Functions & Rest/Spread Operators', duration: '12:45', isFreePreview: true },
              { title: 'Promises, Async/Await & Fetch API', duration: '18:20', isFreePreview: true },
              { title: 'Destructuring, Modules & Classes', duration: '15:00', isFreePreview: false },
            ],
            quiz: {
              title: 'ES6 Modern JavaScript Quiz',
              questions: [
                { questionText: 'Which keyword declares a block-scoped variable that can be reassigned?', options: ['const', 'let', 'var', 'global'], correctAnswerIndex: 1, explanation: 'let is block-scoped and mutable.' },
                { questionText: 'What does Async/Await return?', options: ['String', 'Promise', 'Boolean', 'Object'], correctAnswerIndex: 1, explanation: 'Async functions always return a Promise.' },
              ],
            },
            assignment: { title: 'Build a JS Weather API Dashboard', description: 'Create a responsive web app that fetches weather data using async/await and updates the DOM dynamically.', maxMarks: 100 },
          },
          {
            title: 'Section 2: Node.js & Express REST APIs',
            lectures: [
              { title: 'Express Server Setup & Router Middleware', duration: '15:10', isFreePreview: false },
              { title: 'MongoDB Schema Design with Mongoose', duration: '22:00', isFreePreview: false },
              { title: 'JWT Authentication & Protected Routes', duration: '28:00', isFreePreview: false },
            ],
          },
          {
            title: 'Section 3: React.js Frontend',
            lectures: [
              { title: 'React Hooks — useState, useEffect, useContext', duration: '20:30', isFreePreview: false },
              { title: 'React Router v6 & Protected Pages', duration: '17:45', isFreePreview: false },
              { title: 'Axios API Integration with JWT', duration: '14:20', isFreePreview: false },
            ],
          },
        ],
      },
      {
        title: 'Data Structures & Algorithms in C++',
        description: 'Comprehensive guide to arrays, linked lists, trees, graphs, dynamic programming, and competitive coding. Crack FAANG interviews with confidence.',
        thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=80',
        instructor: instructor2._id,
        category: progCat._id,
        level: 'Intermediate',
        price: 39.99,
        isFree: false,
        duration: '36 Hours',
        requirements: ['Basic understanding of C++ programming syntax'],
        learningObjectives: ['Analyze time and space complexity O(N)', 'Implement binary trees and graphs', 'Solve Big-Tech coding interview questions', 'Master Dynamic Programming patterns'],
        sections: [
          {
            title: 'Section 1: Time Complexity & Recursion',
            lectures: [
              { title: 'Big-O Notation & Asymptotic Analysis', duration: '20:15', isFreePreview: true },
              { title: 'Recursion Fundamentals & Memory Stack', duration: '25:00', isFreePreview: false },
            ],
            quiz: {
              title: 'Complexity & Recursion Quiz',
              questions: [
                { questionText: 'What is the time complexity of Binary Search?', options: ['O(n)', 'O(log n)', 'O(n^2)', 'O(1)'], correctAnswerIndex: 1, explanation: 'Binary search halves the search space each step.' },
                { questionText: 'Which data structure uses LIFO order?', options: ['Queue', 'Array', 'Stack', 'Linked List'], correctAnswerIndex: 2, explanation: 'Stack follows Last In, First Out.' },
              ],
            },
          },
          {
            title: 'Section 2: Arrays, Strings & Hashing',
            lectures: [
              { title: 'Two Pointer & Sliding Window Technique', duration: '30:00', isFreePreview: false },
              { title: 'HashMap & HashSet Problem Patterns', duration: '26:15', isFreePreview: false },
            ],
          },
          {
            title: 'Section 3: Trees & Graph Algorithms',
            lectures: [
              { title: 'Binary Tree BFS & DFS Traversals', duration: '35:00', isFreePreview: false },
              { title: 'Graph — Dijkstra & Bellman-Ford', duration: '40:00', isFreePreview: false },
            ],
          },
        ],
      },
      {
        title: 'Machine Learning & Python Data Science Essentials',
        description: 'Learn Python, NumPy, Pandas, Scikit-Learn, and build predictive machine learning models for real datasets. From data wrangling to model deployment.',
        thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&auto=format&fit=crop&q=80',
        instructor: instructor3._id,
        category: aiCat._id,
        level: 'Beginner',
        price: 0,
        isFree: true,
        duration: '28 Hours',
        requirements: ['No prior programming background required', 'Curiosity and willingness to learn'],
        learningObjectives: ['Perform data wrangling with Pandas', 'Train Supervised & Unsupervised Models', 'Evaluate model performance metrics', 'Visualize data with Matplotlib & Seaborn'],
        sections: [
          {
            title: 'Section 1: Python for Data Analysis',
            lectures: [
              { title: 'NumPy Vectorized Calculations', duration: '14:30', isFreePreview: true },
              { title: 'Data Cleaning & Preprocessing with Pandas', duration: '21:10', isFreePreview: true },
              { title: 'Data Visualization with Matplotlib', duration: '18:00', isFreePreview: false },
            ],
          },
          {
            title: 'Section 2: Machine Learning Models',
            lectures: [
              { title: 'Linear & Logistic Regression from Scratch', duration: '32:00', isFreePreview: false },
              { title: 'Decision Trees & Random Forest', duration: '28:00', isFreePreview: false },
              { title: 'Model Evaluation — Accuracy, Precision, Recall', duration: '20:00', isFreePreview: false },
            ],
            quiz: {
              title: 'ML Fundamentals Quiz',
              questions: [
                { questionText: 'Which algorithm is used for classification problems?', options: ['Linear Regression', 'Logistic Regression', 'K-Means', 'PCA'], correctAnswerIndex: 1, explanation: 'Logistic Regression is used for binary/multi-class classification.' },
                { questionText: 'What does overfitting mean?', options: ['Model performs well on all data', 'Model memorizes training data but fails on new data', 'Model is too simple', 'Model has low accuracy'], correctAnswerIndex: 1, explanation: 'Overfitting means the model learned the training data too specifically.' },
              ],
            },
          },
        ],
      },
      {
        title: 'AWS Certified Cloud Practitioner & Architecture',
        description: 'Pass the AWS Cloud Practitioner exam. Master EC2, S3, IAM, VPC, Lambda, RDS, and cloud security best practices with hands-on labs.',
        thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
        instructor: instructor1._id,
        category: cloudCat._id,
        level: 'All Levels',
        price: 59.99,
        isFree: false,
        duration: '30 Hours',
        requirements: ['Basic IT fundamentals', 'No prior AWS experience needed'],
        learningObjectives: ['Understand AWS core services & infrastructure', 'Design fault-tolerant cloud architectures', 'Manage IAM security and access keys', 'Pass the AWS CLF-C02 certification exam'],
        sections: [
          {
            title: 'Section 1: AWS Core Cloud Infrastructure',
            lectures: [
              { title: 'Introduction to Cloud Computing & AWS IAM', duration: '16:00', isFreePreview: true },
              { title: 'EC2 Virtual Servers & S3 Object Storage', duration: '24:15', isFreePreview: false },
              { title: 'VPC, Subnets & Security Groups', duration: '20:00', isFreePreview: false },
            ],
          },
          {
            title: 'Section 2: Serverless & Databases',
            lectures: [
              { title: 'AWS Lambda & API Gateway', duration: '22:00', isFreePreview: false },
              { title: 'RDS, DynamoDB & ElastiCache', duration: '18:30', isFreePreview: false },
            ],
            assignment: { title: 'Deploy a Node.js App to AWS EC2', description: 'Set up an EC2 instance, install Node.js, deploy a REST API, and configure a Security Group to allow HTTP traffic.', maxMarks: 100 },
          },
        ],
      },
      {
        title: 'React.js — From Zero to Advanced (2026 Edition)',
        description: 'The most comprehensive React course. Learn hooks, context, Redux Toolkit, React Query, performance optimization, and testing.',
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
        instructor: instructor1._id,
        category: webDevCat._id,
        level: 'Beginner',
        price: 44.99,
        isFree: false,
        duration: '38 Hours',
        requirements: ['Basic JavaScript knowledge', 'HTML & CSS fundamentals'],
        learningObjectives: ['Master all React hooks', 'Build SPAs with React Router v6', 'Manage global state with Redux Toolkit', 'Write unit tests with Jest & Testing Library'],
        sections: [
          {
            title: 'Section 1: React Fundamentals',
            lectures: [
              { title: 'JSX, Components & Props', duration: '15:00', isFreePreview: true },
              { title: 'useState & useEffect Hooks', duration: '22:00', isFreePreview: true },
              { title: 'Event Handling & Conditional Rendering', duration: '18:00', isFreePreview: false },
            ],
          },
          {
            title: 'Section 2: Advanced React Patterns',
            lectures: [
              { title: 'useContext & Custom Hooks', duration: '25:00', isFreePreview: false },
              { title: 'React Query for Server State', duration: '30:00', isFreePreview: false },
              { title: 'Performance — useMemo, useCallback, lazy', duration: '20:00', isFreePreview: false },
            ],
          },
        ],
      },
      {
        title: 'SQL & PostgreSQL — Complete Database Mastery',
        description: 'Learn SQL from absolute basics to advanced queries. Master joins, indexes, stored procedures, transactions, and PostgreSQL administration.',
        thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80',
        instructor: instructor2._id,
        category: dbCat._id,
        level: 'Beginner',
        price: 29.99,
        isFree: false,
        duration: '24 Hours',
        requirements: ['No prior database experience needed'],
        learningObjectives: ['Write complex SQL queries with JOINs', 'Design normalized relational schemas', 'Optimize queries with indexes', 'Manage PostgreSQL databases in production'],
        sections: [
          {
            title: 'Section 1: SQL Fundamentals',
            lectures: [
              { title: 'SELECT, WHERE, ORDER BY & LIMIT', duration: '12:00', isFreePreview: true },
              { title: 'JOINs — INNER, LEFT, RIGHT, FULL OUTER', duration: '20:00', isFreePreview: true },
              { title: 'GROUP BY, HAVING & Aggregate Functions', duration: '15:00', isFreePreview: false },
            ],
          },
          {
            title: 'Section 2: Advanced PostgreSQL',
            lectures: [
              { title: 'Indexes, Query Plans & EXPLAIN ANALYZE', duration: '22:00', isFreePreview: false },
              { title: 'Stored Procedures, Views & Triggers', duration: '25:00', isFreePreview: false },
            ],
          },
        ],
      },
      {
        title: 'Deep Learning & Neural Networks with TensorFlow',
        description: 'Build and train deep neural networks using TensorFlow & Keras. Cover CNNs, RNNs, transformers, and deploy AI models to production.',
        thumbnail: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&auto=format&fit=crop&q=80',
        instructor: instructor3._id,
        category: aiCat._id,
        level: 'Advanced',
        price: 69.99,
        isFree: false,
        duration: '45 Hours',
        requirements: ['Python programming proficiency', 'Basic machine learning knowledge', 'Understanding of linear algebra'],
        learningObjectives: ['Build CNNs for image classification', 'Train RNNs for sequence modeling', 'Fine-tune transformer models (BERT, GPT)', 'Deploy AI models as REST APIs'],
        sections: [
          {
            title: 'Section 1: Neural Network Fundamentals',
            lectures: [
              { title: 'Perceptrons, Activation Functions & Backpropagation', duration: '28:00', isFreePreview: true },
              { title: 'Building Your First Neural Net with Keras', duration: '22:00', isFreePreview: false },
            ],
          },
          {
            title: 'Section 2: Convolutional Neural Networks',
            lectures: [
              { title: 'CNN Architecture — Conv, Pool & Flatten Layers', duration: '35:00', isFreePreview: false },
              { title: 'Transfer Learning with ResNet & VGG', duration: '30:00', isFreePreview: false },
            ],
          },
        ],
      },
      {
        title: 'Python for Beginners — Complete Bootcamp',
        description: 'The perfect first programming course. Learn Python syntax, OOP, file handling, APIs, and build real projects like web scrapers and automation scripts.',
        thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=80',
        instructor: instructor2._id,
        category: progCat._id,
        level: 'Beginner',
        price: 0,
        isFree: true,
        duration: '20 Hours',
        requirements: ['A computer with internet connection', 'No prior programming experience'],
        learningObjectives: ['Understand Python syntax & data types', 'Write functions, loops & conditions', 'Work with files, APIs & JSON data', 'Build automation scripts & web scrapers'],
        sections: [
          {
            title: 'Section 1: Python Basics',
            lectures: [
              { title: 'Variables, Data Types & Operators', duration: '10:00', isFreePreview: true },
              { title: 'If/Else, Loops & Functions', duration: '14:00', isFreePreview: true },
              { title: 'Lists, Dictionaries & Tuples', duration: '16:00', isFreePreview: false },
            ],
            quiz: {
              title: 'Python Basics Quiz',
              questions: [
                { questionText: 'Which function prints output in Python?', options: ['console.log()', 'echo()', 'print()', 'System.out.println()'], correctAnswerIndex: 2, explanation: 'Python uses print() to display output.' },
                { questionText: 'What data type is [1, 2, 3] in Python?', options: ['Tuple', 'Set', 'Dictionary', 'List'], correctAnswerIndex: 3, explanation: 'Square brackets denote a List in Python.' },
              ],
            },
          },
          {
            title: 'Section 2: Object-Oriented Programming',
            lectures: [
              { title: 'Classes, Objects & Inheritance', duration: '20:00', isFreePreview: false },
              { title: 'File I/O & Exception Handling', duration: '18:00', isFreePreview: false },
            ],
          },
        ],
      },
    ];

    const createdCourses = [];

    for (const cSeed of courseSeeds) {
      const { sections, ...courseData } = cSeed;
      const course = await Course.create(courseData);
      const sectionIds = [];

      for (let i = 0; i < sections.length; i++) {
        const sData = sections[i];
        const section = await Section.create({ title: sData.title, course: course._id, order: i + 1 });
        const lectureIds = [];

        for (let j = 0; j < sData.lectures.length; j++) {
          const lData = sData.lectures[j];
          const lecture = await Lecture.create({
            title: lData.title,
            section: section._id,
            course: course._id,
            duration: lData.duration,
            isFreePreview: lData.isFreePreview,
            order: j + 1,
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            resources: [{ title: 'Lecture Notes PDF', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', fileType: 'pdf' }],
          });
          lectureIds.push(lecture._id);
        }

        section.lectures = lectureIds;

        if (sData.quiz) {
          const quiz = await Quiz.create({ title: sData.quiz.title, course: course._id, section: section._id, totalMarks: sData.quiz.questions.length * 5, passingScore: 70, timeLimitMinutes: 15 });
          const questionIds = [];
          for (const qData of sData.quiz.questions) {
            const question = await Question.create({ quiz: quiz._id, questionText: qData.questionText, options: qData.options, correctAnswerIndex: qData.correctAnswerIndex, explanation: qData.explanation, marks: 5 });
            questionIds.push(question._id);
          }
          quiz.questions = questionIds;
          await quiz.save();
          section.quiz = quiz._id;
        }

        if (sData.assignment) {
          const assignment = await Assignment.create({ title: sData.assignment.title, course: course._id, section: section._id, description: sData.assignment.description, maxMarks: sData.assignment.maxMarks, dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) });
          section.assignment = assignment._id;
        }

        await section.save();
        sectionIds.push(section._id);
      }

      course.sections = sectionIds;
      await course.save();
      createdCourses.push(course);
    }

    // --- Enrollments, Progress & Reviews ---
    const reviewComments = [
      'Absolutely brilliant course! Clear explanations and real-world projects.',
      'Best investment I made this year. The instructor explains everything perfectly.',
      'Loved the hands-on approach. I got a job offer after completing this course!',
      'Extremely detailed and well-structured. Highly recommended for beginners.',
      'The quizzes and assignments really helped me solidify my understanding.',
    ];

    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      const course = createdCourses[i % createdCourses.length];
      const secondCourse = createdCourses[(i + 2) % createdCourses.length];

      await Enrollment.create({ student: student._id, course: course._id, status: 'active' });
      await Enrollment.create({ student: student._id, course: secondCourse._id, status: 'active' });

      const section = await Section.findById(course.sections[0]).populate('lectures');
      if (section && section.lectures.length > 0) {
        await Progress.create({
          student: student._id,
          course: course._id,
          completedLectures: [section.lectures[0]._id],
          overallPercentage: Math.floor(Math.random() * 60) + 20,
          lastAccessedLecture: section.lectures[0]._id,
        });
      }

      await Review.create({ course: course._id, student: student._id, rating: [4, 5, 5, 4, 5][i % 5], comment: reviewComments[i % reviewComments.length] });
      await Wishlist.create({ student: student._id, courses: [createdCourses[(i + 3) % createdCourses.length]._id, createdCourses[(i + 5) % createdCourses.length]._id] });

      await Notification.create({ user: student._id, title: 'Welcome to LearnPulse! 🎉', message: `Hi ${student.name}! You have been enrolled in ${course.title}. Happy learning!`, type: 'enrollment' });
    }

    // Update student counts
    for (const course of createdCourses) {
      const count = await Enrollment.countDocuments({ course: course._id });
      await Course.findByIdAndUpdate(course._id, { totalStudents: count });
    }

    return res.status(200).json({
      success: true,
      message: '🎉 Database seeded successfully!',
      data: {
        users: { admin: 1, instructors: 3, students: 10 },
        courses: createdCourses.length,
        categories: categories.length,
        logins: {
          admin: 'admin@learnpulse.com / password123',
          instructor: 'alex@learnpulse.com / password123',
          student: 'student1@learnpulse.com / password123',
        },
      },
    });
  } catch (err) {
    console.error('[Seed Error]', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
