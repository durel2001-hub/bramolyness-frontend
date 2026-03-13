-- ================================================
-- BRAMO LYNESS LMS - MySQL Database Schema
-- Run this in MySQL Workbench or CLI
-- ================================================

CREATE DATABASE IF NOT EXISTS bramo_lms;
USE bramo_lms;

-- Users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  role ENUM('student','admin') DEFAULT 'student',
  status ENUM('active','suspended') DEFAULT 'active',
  avatar VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Password Resets
CREATE TABLE IF NOT EXISTS password_resets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(150) NOT NULL,
  token VARCHAR(255) NOT NULL,
  expiresAt DATETIME NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Courses
CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  categoryId INT,
  duration VARCHAR(50),
  instructor VARCHAR(100),
  thumbnail VARCHAR(255),
  popularityCount INT DEFAULT 0,
  isPublished BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL
);

-- Modules
CREATE TABLE IF NOT EXISTS modules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  courseId INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  orderNumber INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE
);

-- Lessons
CREATE TABLE IF NOT EXISTS lessons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  moduleId INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  videoUrl VARCHAR(500),
  content TEXT,
  pdfUrl VARCHAR(255),
  orderNumber INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (moduleId) REFERENCES modules(id) ON DELETE CASCADE
);

-- Enrollments
CREATE TABLE IF NOT EXISTS enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  courseId INT NOT NULL,
  progress FLOAT DEFAULT 0,
  status ENUM('pending','active','completed') DEFAULT 'active',
  completedLessons TEXT DEFAULT '[]',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE KEY unique_enrollment (userId, courseId)
);

-- Quizzes
CREATE TABLE IF NOT EXISTS quizzes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  courseId INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  passingScore INT DEFAULT 70,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE
);

-- Quiz Questions
CREATE TABLE IF NOT EXISTS quiz_questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quizId INT NOT NULL,
  question TEXT NOT NULL,
  optionA VARCHAR(255),
  optionB VARCHAR(255),
  optionC VARCHAR(255),
  optionD VARCHAR(255),
  correctAnswer ENUM('A','B','C','D') NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (quizId) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- Quiz Results
CREATE TABLE IF NOT EXISTS quiz_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  quizId INT NOT NULL,
  score FLOAT,
  passed BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (quizId) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- Events
CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  date DATETIME,
  location VARCHAR(255),
  price DECIMAL(10,2) DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Event Registrations
CREATE TABLE IF NOT EXISTS event_registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  eventId INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(20),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (eventId) REFERENCES events(id) ON DELETE CASCADE
);

-- Certificates
CREATE TABLE IF NOT EXISTS certificates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  courseId INT NOT NULL,
  certificateUrl VARCHAR(500),
  certificateId VARCHAR(50),
  issuedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  title VARCHAR(200),
  message TEXT,
  isRead BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Settings
CREATE TABLE IF NOT EXISTS settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  `key` VARCHAR(100) NOT NULL UNIQUE,
  value TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed: Default Admin
INSERT IGNORE INTO users (name, email, phone, password, role) VALUES
('Admin', 'admin@bramolyness.co.ke', '+254700000000',
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj8c5yvM5/Gi', 'admin');
-- Default admin password: Admin@1234

-- Seed: Categories
INSERT IGNORE INTO categories (name) VALUES
('Technology'), ('Business'), ('Life Skills'), ('Communication'), ('Management');

-- Seed: Sample Courses
INSERT IGNORE INTO courses (title, description, categoryId, duration, instructor, isPublished) VALUES
('Cyber Security', 'Learn to protect systems and networks from digital attacks.', 1, '8 Weeks', 'Bramo Lyness Institute', TRUE),
('Web Design', 'Master HTML, CSS and modern web design principles.', 1, '6 Weeks', 'Bramo Lyness Institute', TRUE),
('Software Development', 'Full stack software development from scratch.', 1, '12 Weeks', 'Bramo Lyness Institute', TRUE),
('Customer Care', 'Excellence in customer service and relations.', 2, '4 Weeks', 'Bramo Lyness Institute', TRUE),
('Life Skills', 'Essential skills for personal and professional growth.', 3, '4 Weeks', 'Bramo Lyness Institute', TRUE),
('Public Relations', 'Strategic communication and public relations.', 4, '6 Weeks', 'Bramo Lyness Institute', TRUE),
('Office Management', 'Modern office administration and management.', 5, '6 Weeks', 'Bramo Lyness Institute', TRUE),
('Data Analysis', 'Data analytics tools and techniques.', 1, '8 Weeks', 'Bramo Lyness Institute', TRUE),
('Artificial Intelligence', 'Introduction to AI and machine learning.', 1, '10 Weeks', 'Bramo Lyness Institute', TRUE),
('Mindset Change', 'Transform your mindset for success.', 3, '3 Weeks', 'Bramo Lyness Institute', TRUE),
('Computer Packages', 'Microsoft Office and essential computer skills.', 1, '4 Weeks', 'Bramo Lyness Institute', TRUE),
('PC Maintenance', 'Hardware and software troubleshooting.', 1, '5 Weeks', 'Bramo Lyness Institute', TRUE);

-- Default Settings
INSERT IGNORE INTO settings (`key`, value) VALUES
('site_name', 'Bramo Lyness LMS'),
('site_logo', ''),
('smtp_host', 'smtp.gmail.com'),
('smtp_port', '587'),
('smtp_user', ''),
('smtp_pass', ''),
('cert_signature', 'Director, Bramo Lyness Training Institute');

SELECT 'Database setup complete!' AS message;
