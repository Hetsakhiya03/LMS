require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');

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
const QuizAttempt = require('../models/QuizAttempt');
const Assignment = require('../models/Assignment');
const AssignmentSubmission = require('../models/AssignmentSubmission');
const Review = require('../models/Review');
const Wishlist = require('../models/Wishlist');
const Certificate = require('../models/Certificate');
const Notification = require('../models/Notification');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lms_db';

const seedDatabase = async () => {
  try {
    console.log(`\n===================================================`);
    console.log(`  🌱 Starting LearnPulse Database Seeding Script`);
    console.log(` 📍 Target Database: ${MONGO_URI}`);
    console.log(`===================================================\n`);

    await mongoose.connect(MONGO_URI);
    console.log(`[1/6] Connected to MongoDB...`);

    // Clean existing collections
    console.log(`[2/6] Cleaning existing database collections...`);
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

    // 1. Create Users
    console.log(`[3/6] Seeding Users (1 Admin, 3 Instructors, 10 Students)...`);
    
    // Admin
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@learnpulse.com',
      password: 'password123',
      role: 'admin',
      bio: 'Head administrator managing LearnPulse LMS platform governance.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    });

    // Instructors
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

    // Students
    const students = [];
    for (let i = 1; i <= 10; i++) {
      const student = await User.create({
        name: `Student User ${i}`,
        email: `student${i}@learnpulse.com`,
        password: 'password123',
        role: 'student',
        bio: `Enthusiastic computer science student mastering modern web technologies.`,
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80`,
      });
      students.push(student);
    }

    // 2. Create Categories
    console.log(`[4/6] Seeding Categories...`);
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

    // 3. Create Courses with Sections, Lectures, Quizzes, and Assignments
    console.log(`[5/6] Seeding 8 Realistic Courses with Sections & Content...`);

    const courseSeeds = [
      {
        title: 'Complete JavaScript & MERN Stack Masterclass',
        description: 'Master modern full-stack web development from scratch using React, Node.js, Express, and MongoDB. Build real-world production projects.',
        thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&auto=format&fit=crop&q=80',
        instructor: instructor1._id,
        category: webDevCat._id,
        level: 'Intermediate',
        price: 49.99,
        isFree: false,
        duration: '42 Hours',
        requirements: ['Basic HTML & CSS knowledge', 'A laptop running Windows/Mac/Linux'],
        learningObjectives: ['Build full-stack MERN apps', 'Implement JWT Authentication & RBAC', 'Integrate MongoDB with Mongoose'],
        sections: [
          {
            title: 'Section 1: Modern JavaScript (ES6+)',
            lectures: [
              { title: 'Arrow Functions & Rest/Spread Operators', duration: '12:45', isFreePreview: true },
              { title: 'Promises, Async/Await & Fetch API', duration: '18:20', isFreePreview: true },
            ],
            quiz: {
              title: 'ES6 Modern JavaScript Quiz',
              questions: [
                { questionText: 'Which keyword declares a block-scoped variable that can be reassigned?', options: ['const', 'let', 'var', 'global'], correctAnswerIndex: 1, explanation: 'let is block-scoped and mutable.' },
                { questionText: 'What does Async/Await return?', options: ['String', 'Promise', 'Boolean', 'Object'], correctAnswerIndex: 1, explanation: 'Async functions always return a Promise.' },
              ],
            },
            assignment: {
              title: 'Build a JS Weather API Dashboard',
              description: 'Create a responsive web app that fetches weather data using async/await and updates the DOM.',
              maxMarks: 100,
              dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          },
          {
            title: 'Section 2: Node.js & Express REST APIs',
            lectures: [
              { title: 'Express Server Setup & Router Middleware', duration: '15:10', isFreePreview: false },
              { title: 'MongoDB Schema Design with Mongoose', duration: '22:00', isFreePreview: false },
            ],
          },
        ],
      },
      {
        title: 'Data Structures & Algorithms in C++',
        description: 'Comprehensive guide to arrays, linked lists, trees, graphs, dynamic programming, and competitive coding techniques.',
        thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=80',
        instructor: instructor2._id,
        category: progCat._id,
        level: 'Intermediate',
        price: 39.99,
        isFree: false,
        duration: '36 Hours',
        requirements: ['Basic understanding of C++ programming syntax'],
        learningObjectives: ['Analyze time and space complexity O(N)', 'Implement binary trees and graphs', 'Solve Big-Tech coding interview questions'],
        sections: [
          {
            title: 'Section 1: Time Complexity & Recursion',
            lectures: [
              { title: 'Big-O Notation & Asymptotic Analysis', duration: '20:15', isFreePreview: true },
              { title: 'Recursion Fundamentals & Memory Stack', duration: '25:00', isFreePreview: false },
            ],
          },
        ],
      },
      {
        title: 'Machine Learning & Python Data Science Essentials',
        description: 'Learn Python, NumPy, Pandas, Scikit-Learn, and build predictive machine learning models for real datasets.',
        thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&auto=format&fit=crop&q=80',
        instructor: instructor3._id,
        category: aiCat._id,
        level: 'Beginner',
        price: 0,
        isFree: true,
        duration: '28 Hours',
        requirements: ['No prior programming background required'],
        learningObjectives: ['Perform Data wrangling with Pandas', 'Train Supervised & Unsupervised Models', 'Evaluate model performance metrics'],
        sections: [
          {
            title: 'Section 1: Python for Data Analysis',
            lectures: [
              { title: 'NumPy Vectorized Calculations', duration: '14:30', isFreePreview: true },
              { title: 'Data Cleaning & Preprocessing with Pandas', duration: '21:10', isFreePreview: true },
            ],
          },
        ],
      },
      {
        title: 'AWS Certified Cloud Practitioner & Architecture',
        description: 'Pass the AWS Cloud Practitioner exam. Understand EC2, S3, IAM, VPC, Lambda, and cloud security best practices.',
        thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
        instructor: instructor1._id,
        category: cloudCat._id,
        level: 'All Levels',
        price: 59.99,
        isFree: false,
        duration: '30 Hours',
        requirements: ['Basic IT fundamentals'],
        learningObjectives: ['Understand AWS core services & infrastructure', 'Design fault-tolerant cloud architectures', 'Manage IAM security and access keys'],
        sections: [
          {
            title: 'Section 1: AWS Core Cloud Infrastructure',
            lectures: [
              { title: 'Introduction to Cloud Computing & AWS IAM', duration: '16:00', isFreePreview: true },
              { title: 'EC2 Virtual Servers & S3 Object Storage', duration: '24:15', isFreePreview: false },
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
        const section = await Section.create({
          title: sData.title,
          course: course._id,
          order: i + 1,
        });

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
            resources: [
              { title: 'Lecture Notes PDF', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', fileType: 'pdf' },
            ],
          });
          lectureIds.push(lecture._id);
        }

        section.lectures = lectureIds;

        // Quiz creation if defined
        if (sData.quiz) {
          const quiz = await Quiz.create({
            title: sData.quiz.title,
            course: course._id,
            section: section._id,
            totalMarks: sData.quiz.questions.length * 5,
            passingScore: 70,
            timeLimitMinutes: 15,
          });

          const questionIds = [];
          for (const qData of sData.quiz.questions) {
            const question = await Question.create({
              quiz: quiz._id,
              questionText: qData.questionText,
              options: qData.options,
              correctAnswerIndex: qData.correctAnswerIndex,
              explanation: qData.explanation,
              marks: 5,
            });
            questionIds.push(question._id);
          }
          quiz.questions = questionIds;
          await quiz.save();
          section.quiz = quiz._id;
        }

        // Assignment creation if defined
        if (sData.assignment) {
          const assignment = await Assignment.create({
            title: sData.assignment.title,
            course: course._id,
            section: section._id,
            description: sData.assignment.description,
            maxMarks: sData.assignment.maxMarks,
            dueDate: sData.assignment.dueDate,
          });
          section.assignment = assignment._id;
        }

        await section.save();
        sectionIds.push(section._id);
      }

      course.sections = sectionIds;
      await course.save();
      createdCourses.push(course);
    }

    // 4. Create Sample Enrollments, Progress, and Reviews
    console.log(`[6/6] Seeding Student Enrollments, Reviews, and Wishlists...`);

    // Enroll students in courses
    for (let i = 0; i < 5; i++) {
      const student = students[i];
      const course = createdCourses[0]; // JavaScript MERN Masterclass

      const enrollment = await Enrollment.create({
        student: student._id,
        course: course._id,
        status: 'active',
      });

      // Get first lecture of section 1
      const firstSection = await Section.findById(course.sections[0]).populate('lectures');
      const firstLecture = firstSection.lectures[0];

      await Progress.create({
        student: student._id,
        course: course._id,
        completedLectures: [firstLecture._id],
        overallPercentage: 25,
        lastAccessedLecture: firstLecture._id,
      });

      // Review
      await Review.create({
        course: course._id,
        student: student._id,
        rating: 5,
        comment: 'Outstanding MERN stack course! The hands-on project explanation is second to none.',
      });

      // Wishlist
      await Wishlist.create({
        student: student._id,
        courses: [createdCourses[1]._id, createdCourses[2]._id],
      });
    }

    // Update total students count on course
    await Course.findByIdAndUpdate(createdCourses[0]._id, { totalStudents: 5 });

    console.log(`\n===================================================`);
    console.log(` 🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!`);
    console.log(` 👤 Demo Admin      : admin@learnpulse.com / password123`);
    console.log(` 👨‍🏫 Demo Instructor : alex@learnpulse.com / password123`);
    console.log(` 🎓 Demo Student    : student1@learnpulse.com / password123`);
    console.log(`===================================================\n`);

    process.exit(0);
  } catch (error) {
    console.error(`❌ [Seed Error]: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
};

seedDatabase();
