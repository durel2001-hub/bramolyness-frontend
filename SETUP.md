# Bramo Lyness LMS - Local Setup Guide

## Prerequisites
- Node.js v18+ installed
- MySQL 8.0+ installed and running
- Git installed

---

## Step 1: Database Setup

1. Open MySQL Workbench or terminal
2. Run the database schema:
```sql
source /path/to/bramo-lms/database.sql
```
Or paste the contents of `database.sql` into MySQL Workbench and execute.

**Default Admin Login:**
- Email: admin@bramolyness.co.ke
- Password: Admin@1234

---

## Step 2: Backend Setup

```bash
cd bramo-lms/backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your MySQL credentials and SMTP settings
# DB_USER=root
# DB_PASSWORD=yourpassword
# SMTP_USER=your_email@gmail.com
# SMTP_PASS=your_app_password

# Start backend server
npm run dev
```

Backend runs on: http://localhost:5000

Test: http://localhost:5000/api/health

---

## Step 3: Frontend Setup

```bash
cd bramo-lms/frontend

# Install dependencies
npm install

# Start React app
npm start
```

Frontend runs on: http://localhost:3000

---

## Step 4: Test the API

Use Postman or browser to test:

- GET  http://localhost:5000/api/health
- GET  http://localhost:5000/api/courses
- GET  http://localhost:5000/api/events
- POST http://localhost:5000/api/auth/register

---

## Project Structure

```
bramo-lms/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Business logic
│   ├── middleware/      # JWT auth middleware
│   ├── models/          # Sequelize models
│   ├── routes/          # API routes
│   ├── utils/           # Email utility
│   ├── uploads/         # File uploads
│   ├── .env.example     # Environment variables template
│   ├── server.js        # Main server entry
│   └── package.json
├── frontend/            # React app (next phase)
├── database.sql         # MySQL schema + seed data
└── SETUP.md             # This file
```

---

## API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register student |
| POST | /api/auth/login | Login |
| POST | /api/auth/forgot-password | Request reset |
| POST | /api/auth/reset-password/:token | Reset password |
| GET | /api/courses | All courses |
| GET | /api/courses/:id | Course details |
| POST | /api/courses/enroll/:courseId | Enroll (auth) |
| GET | /api/quiz/:courseId | Get quiz |
| POST | /api/quiz/:quizId/submit | Submit quiz |
| GET | /api/certificates | My certificates |
| GET | /api/certificates/:courseId | Download PDF |
| GET | /api/events | All events |
| POST | /api/events/register | Register for event |
| GET | /api/notifications | My notifications |
| GET | /api/admin/analytics | Admin dashboard stats |
| ... | /api/admin/... | Full admin API |

---

## Gmail SMTP Setup (for emails)
1. Go to Google Account > Security
2. Enable 2-Step Verification
3. Create App Password (Mail > Windows Computer)
4. Use that 16-character password as SMTP_PASS in .env
