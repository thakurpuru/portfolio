# 🚀 Personal Portfolio API

A backend-first personal profile service that exposes resume and portfolio data via clean REST APIs, with a minimal web UI to view and query the information.

This project is designed to act as a **personal resume backend**, allowing dynamic management of profile details, skills, projects, and search functionality.

---

## ✨ Features

* **Profile Management**
  Store and fetch personal information such as name, bio, education, and social links.

* **Skills Management**
  Track technical skills with categories and proficiency levels.

* **Projects Management**
  Showcase projects with descriptions, tech stacks, and live/GitHub links.

* **Global Search**
  Search across projects, skills, education, and profile data.

* **Health Check**
  Monitor backend service status.

* **Minimal Frontend**
  Clean, responsive UI built with vanilla HTML, CSS, and JavaScript.

---

## 🛠 Tech Stack

**Backend:** Node.js, Express
**Database:** MongoDB
**Frontend:** HTML, CSS, JavaScript (Vanilla)

---

## 🗄 Database Schema (MongoDB)

The database **portfolio_db** uses MongoDB collections to store data in JSON format.

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
- Data is stored as flexible JSON documents  

## 🔗 API Endpoints

### Profile

* `GET /profile` → Fetch personal profile details

### Skills

* `GET /skills` → List all skills
* `GET /skills/top` → Get top/featured skills

### Projects

* `GET /projects` → List all projects
* `GET /projects?skill=javascript` → Filter projects by skill

### Search

* `GET /search?q=query` → Global search across portfolio data

### Health

* `GET /health` → Check API status

---

## ⚙️ Setup & Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd personal-portfolio-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Database

* Ensure **MySQL** is running
* Create a database named `portfolio_db` (or update `.env`)
* Import schema:

```bash
mysql -u root -p portfolio_db < schema.sql
```

* Create a `.env` file and update credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=portfolio_db
PORT=5000
ADMIN_PASSWORD=your_admin_password
```

---

### 4. Run the server

```bash
npm start
```

For development (with nodemon):

```bash
npm run dev
```

---

### 5. Access the app

Frontend UI:
👉 [http://localhost:3000](http://localhost:3000)

API base URL:
👉 [http://localhost:5000](http://localhost:5000)

Health check:
👉 [http://localhost:5000/health](http://localhost:5000/health)

---

## 🌍 Live Deployment

🔗 **Live API / Portfolio:**
[Add your deployed link here]

---

## 📌 Future Improvements

* JWT-based authentication
* Image upload support
* Admin dashboard
* Resume PDF export
* Docker support

---

## 👤 Author

**Your Name**
GitHub: [https://github.com/your-username](https://github.com/your-username)
LinkedIn: [https://linkedin.com/in/your-profile](https://linkedin.com/in/your-profile)

---

⭐ If you like this project, give it a star!
