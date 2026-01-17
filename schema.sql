CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;

-- Profile Table
CREATE TABLE IF NOT EXISTS profile (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    education TEXT,
    github_link VARCHAR(255),
    linkedin_link VARCHAR(255),
    portfolio_link VARCHAR(255),
    leetcode_link VARCHAR(255),
    profile_link VARCHAR(255),
    bio TEXT,
    objective TEXT,
    interests TEXT,
    availability VARCHAR(255)
);

-- Skills Table
CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    category VARCHAR(50),
    proficiency INT DEFAULT 0,
    is_top BOOLEAN DEFAULT FALSE
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    tech_stack VARCHAR(255),
    live_link VARCHAR(255),
    github_link VARCHAR(255)
);

-- Education Table
CREATE TABLE IF NOT EXISTS education_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    institution VARCHAR(255) NOT NULL,
    degree VARCHAR(255) NOT NULL,
    start_year VARCHAR(20),
    end_year VARCHAR(20),
    cgpa VARCHAR(50),
    coursework TEXT
);

-- Experience Table
CREATE TABLE IF NOT EXISTS experience (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role VARCHAR(255) NOT NULL,
    organization VARCHAR(255) NOT NULL,
    duration VARCHAR(100),
    description TEXT
);

-- Seed Data for Purushottam Thakur
INSERT INTO profile (name, email, education, github_link, linkedin_link, portfolio_link, leetcode_link, profile_link, bio, objective, interests, availability) 
VALUES ('Purushottam Thakur', 'purushottamthakur78@gmail.com', 'B.Tech in Computer Science Engineering, National Institute of Technology, Meghalaya', 
'https://github.com/thakurpuru', 'https://linkedin.com/in/purushottam-thakur-66229528b', NULL, 'https://leetcode.com/Purushottam', 
'https://linkedin.com/in/purushottam-thakur-66229528b', 
'Motivated and detail-oriented Computer Science undergraduate with strong skills in Python, backend development, and robotics-related applications. Quick learner with hands-on experience in web development, API building, and club technical activities.',
'Seeking opportunities in backend development, robotics, and software engineering to apply technical skills and contribute to innovative projects.',
'Backend Development, APIs, Robotics, System Design, Competitive Programming, Hackathons',
'Available for internships starting 2024');

INSERT INTO skills (name, category, proficiency, is_top) VALUES 
('Python', 'Programming Language', 85, TRUE),
('C', 'Programming Language', 80, TRUE),
('C++', 'Programming Language', 80, TRUE),
('HTML', 'Web Technologies', 85, TRUE),
('CSS', 'Web Technologies', 85, TRUE),
('JavaScript', 'Web Technologies', 80, TRUE),
('Node.js', 'Backend Framework', 75, TRUE),
('Express.js', 'Backend Framework', 75, FALSE),
('MySQL', 'Database', 80, TRUE),
('Git', 'Tools', 85, TRUE),
('GitHub', 'Tools', 85, TRUE),
('VS Code', 'Tools', 90, TRUE);

INSERT INTO projects (title, description, tech_stack, live_link, github_link) VALUES 
('Robotics Club Website (NIT Meghalaya)', 'Developed the official website for the Robotics Club using HTML, CSS, JavaScript. Added sections for events, gallery, achievements, and club activities. Planning backend integration using Node.js + MySQL for dynamic updates.',
'HTML, CSS, JavaScript, Node.js, MySQL',
'Live link not specified',
'GitHub link not specified'),
('Portfolio Website', 'Created a clean and responsive personal portfolio showcasing projects and skills.',
'HTML, CSS',
'Live link not specified',
'GitHub link not specified');

INSERT INTO education_details (institution, degree, start_year, end_year, cgpa, coursework) VALUES 
('National Institute of Technology, Meghalaya — Sohra', 'B.Tech in Computer Science Engineering', '2023', '2027', '8.3/10', 'Data Structures & Algorithms, Object-Oriented Programming, Database Management, Web Technologies, Software Engineering, Operating Systems, Computer Networks');

INSERT INTO experience (role, organization, duration, description) VALUES 
('Robotics Club Coordinator — Web Development Team', 'NIT Meghalaya', '2023 - Present', 
'• Leading contributions to the Robotics Club website and managing web updates.
• Built robots using Arduino for club demonstrations and technical projects.
• Assisted in organizing robotics workshops, competitions, and events.
• Solved 150+ problems on LeetCode focusing on arrays, strings, linked lists, trees, and dynamic programming.');