# LearnPulse — Modern MERN Learning Management System (LMS)

![LearnPulse LMS](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge) ![Vite](https://img.shields.io/badge/Frontend-Vite%20%2B%20React-purple?style=for-the-badge) ![Express](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green?style=for-the-badge) ![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%2B%20Mongoose-emerald?style=for-the-badge)

LearnPulse is a production-grade, full-stack **Learning Management System (LMS)** designed for multi-role educational experiences (**Students**, **Instructors**, **Admins**). Built with MongoDB, Express.js, React.js (Vite), and Node.js.

---

## 🌟 Key Features

* **Multi-Role User Governance**: Dedicated experience & dashboard views for Students, Instructors, and Admins.
* **Interactive Video Learning**: Embedded video streaming with section navigation, note-taking, and resource downloading.
* **Automated Progress Tracking**: Real-time lecture tracking and progress percentage calculation.
* **Quizzes & Assignments**: Interactive quiz engine with automated grading & timer; assignment submission & feedback portal.
* **Verifiable PDF Certificates**: Automatic certificate generation upon 100% course completion with public `/verify-certificate/:id` lookup.
* **Course Marketplace**: Rich course discovery with search, multi-faceted filtering (category, difficulty, price, rating), and sorting.
* **Analytics Dashboards**: Visual charts for revenue, enrollment metrics, quiz scores, and user growth using Recharts.

---

## 🏗️ Architecture & Folder Structure

```text
LMS/
├── client/          # Vite + React Frontend SPA (Tailwind CSS, Lucide, Recharts)
├── server/          # Node.js + Express REST API (Mongoose, Auth, Cloudinary, Mailer)
├── README.md        # Main Project Documentation
└── .gitignore       # Root Git Ignore rules
```

---

## 🚀 Quick Start (Phase 1 Setup)

### 1. Server Setup
```bash
cd server
npm install
npm run dev
```
Server running at `http://localhost:5000` (Health Check: `http://localhost:5000/api/health`).

### 2. Client Setup
```bash
cd client
npm install
npm run dev
```
Client running at `http://localhost:5173`.

---

## 🔐 Environment Variables

### Backend (`server/.env`)
- `PORT=5000`
- `MONGO_URI=mongodb://localhost:27017/lms_db`
- `JWT_SECRET=your_super_secret_jwt_key_learnpulse_2026`
- `JWT_EXPIRE=7d`
- `CLIENT_URL=http://localhost:5173`

### Frontend (`client/.env`)
- `VITE_API_BASE_URL=http://localhost:5000/api`
