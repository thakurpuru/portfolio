# 🚀 Personal Portfolio API

A backend-first personal profile service that exposes resume and portfolio data via clean REST APIs, with a minimal web UI to view and manage the information.

This project acts as a **personal resume backend**, allowing dynamic management of profile details, skills, projects, and search functionality.

---

## ✨ Features

- **Profile Management** – Store and fetch personal info (bio, education, links)
- **Skills Management** – Track skills with categories and proficiency
- **Projects Management** – Showcase projects with tech stack & links
- **Global Search** – Search across all portfolio data
- **Health Check** – Monitor backend status
- **Minimal Frontend** – Clean UI using HTML, CSS, JS

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js  
- **Database:** MongoDB Atlas  
- **ODM:** Mongoose  
- **Frontend:** HTML, CSS, JavaScript  

---

## 🗄 Database Schema (MongoDB)

The database **portfolio_db** uses MongoDB collections.

### 👤 Profile
- name, email, education  
- github_link, linkedin_link, portfolio_link  
- bio, objective, interests, availability  

### 🛠 Skills
- name, category  
- proficiency (Number)  
- is_top (Boolean)  

### 🚀 Projects
- title, description  
- tech_stack (Array of Strings)  
- live_link, github_link  

### 🎓 Education
- institution, degree  
- start_year, end_year  
- cgpa, coursework  

### 💼 Experience
- role, organization  
- duration, description  

---

## 🔑 Notes
- MongoDB uses `_id` instead of `id`  
- Data stored as flexible JSON documents  

---

## 🔗 API Endpoints

### Profile
- `GET /profile` → Fetch profile

### Skills
- `GET /skills` → All skills  
- `GET /skills/top` → Top skills  

### Projects
- `GET /projects` → All projects  
- `GET /projects?skill=javascript` → Filter projects  

### Search
- `GET /search?q=query` → Global search  

### Health
- `GET /health` → API status  

---

## ⚙️ Setup & Installation

### 1. Clone repository
```bash
git clone <repository-url>
cd personal-portfolio-api
