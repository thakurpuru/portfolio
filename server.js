const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
    origin: '*', 
    credentials: true,
    optionsSuccessStatus: 200
}));;
app.use(express.json());
app.use(express.static('public'));

// Database Connection
// Database Connection - CORRECT VERSION
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'railway',
    port: process.env.DB_PORT || 3306,
    ssl: {
        rejectUnauthorized: false  // REQUIRED for Railway
    }
});;

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        console.log('Ensure MySQL is running and credentials in .env are correct.');
    } else {
        console.log('Connected to MySQL database.');
    }
});
// Test database connection
app.get('/api/test-db', (req, res) => {
    db.query('SELECT NOW() as current_time, DATABASE() as db_name', (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            res.status(500).json({ 
                error: 'Database connection failed',
                message: err.message 
            });
        } else {
            res.json({ 
                success: true, 
                data: results[0],
                message: 'Database connected successfully!' 
            });
        }
    });
});

// Routes
app.get('/', (req, res) => {
    res.json({ 
        message: 'Backend API is running',
        database: process.env.DB_NAME || 'Not connected',
        timestamp: new Date().toISOString()
    });
});

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Profile
app.get('/profile', (req, res) => {
    db.query('SELECT * FROM profile LIMIT 1', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0] || {});
    });
});

// Skills
app.get('/skills', (req, res) => {
    db.query('SELECT * FROM skills', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/skills/top', (req, res) => {
    db.query('SELECT * FROM skills WHERE is_top = TRUE OR proficiency > 80 ORDER BY proficiency DESC', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Projects
app.get('/projects', (req, res) => {
    const skill = req.query.skill;
    const filter = req.query.filter;
    const q = req.query.q; // New search parameter
    
    let baseQuery = 'SELECT * FROM projects';
    let whereClauses = [];
    let params = [];

    // Handle search parameter (q)
    if (q) {
        // Search by title or tech stack
        whereClauses.push('(title LIKE ? OR tech_stack LIKE ?)');
        params.push(`%${q}%`);
        params.push(`%${q}%`);
    }
    
    // Handle skill parameter (backward compatibility)
    if (skill) {
        whereClauses.push('tech_stack LIKE ?');
        params.push(`%${skill}%`);
    }
    
    // Handle filter parameter
    if (filter && filter !== 'all') {
        // Add filtering logic based on the filter parameter
        switch(filter) {
            case 'main':
                whereClauses.push('id <= 10'); // Example: first 10 projects as main projects
                break;
            case 'react':
                whereClauses.push('tech_stack LIKE ?');
                params.push('%react%');
                break;
            case 'javascript':
                whereClauses.push('tech_stack LIKE ?');
                params.push('%javascript%');
                break;
            case 'htmlcss':
                whereClauses.push('(tech_stack LIKE ? OR tech_stack LIKE ?)');
                params.push('%html%');
                params.push('%css%');
                break;
            case 'bootstrap':
                whereClauses.push('tech_stack LIKE ?');
                params.push('%bootstrap%');
                break;
            case 'react-native':
                whereClauses.push('tech_stack LIKE ?');
                params.push('%react native%');
                break;
            case 'group':
                whereClauses.push('title LIKE ?');
                params.push('%group%');
                break;
        }
    }
    
    let query = baseQuery;
    if (whereClauses.length > 0) {
        query += ' WHERE ' + whereClauses.join(' AND ');
    }

    db.query(query, params, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Middleware for Admin Auth
const authenticate = (req, res, next) => {
    const password = req.headers['x-admin-password'];
    if (password === process.env.ADMIN_PASSWORD) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// Login Check
app.post('/auth/login', (req, res) => {
    const { password } = req.body;
    if (password === process.env.ADMIN_PASSWORD) {
        res.json({ success: true });
    } else {
        res.status(401).json({ error: 'Invalid password' });
    }
});

// Profile - Update
app.put('/profile', authenticate, (req, res) => {
    const { name, email, bio, education, github_link, linkedin_link, portfolio_link, leetcode_link, profile_link, objective, interests, availability } = req.body;
    const query = `UPDATE profile SET name=?, email=?, bio=?, education=?, github_link=?, linkedin_link=?, portfolio_link=?, leetcode_link=?, profile_link=?, objective=?, interests=?, availability=? ORDER BY id LIMIT 1`;
    db.query(query, [name, email, bio, education, github_link, linkedin_link, portfolio_link, leetcode_link, profile_link, objective, interests, availability], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Profile updated successfully' });
    });
});

// Education Routes
app.get('/education', (req, res) => {
    db.query('SELECT * FROM education_details ORDER BY start_year DESC', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/education', authenticate, (req, res) => {
    const { institution, degree, start_year, end_year, cgpa, coursework } = req.body;
    db.query('INSERT INTO education_details (institution, degree, start_year, end_year, cgpa, coursework) VALUES (?, ?, ?, ?, ?, ?)',
        [institution, degree, start_year, end_year, cgpa, coursework], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: result.insertId, message: 'Education added' });
        });
});

app.put('/education/:id', authenticate, (req, res) => {
    const { institution, degree, start_year, end_year, cgpa, coursework } = req.body;
    db.query('UPDATE education_details SET institution=?, degree=?, start_year=?, end_year=?, cgpa=?, coursework=? WHERE id=?',
        [institution, degree, start_year, end_year, cgpa, coursework, req.params.id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Education updated' });
        });
});

app.delete('/education/:id', authenticate, (req, res) => {
    db.query('DELETE FROM education_details WHERE id=?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Education deleted' });
    });
});

// Experience Routes
app.get('/experience', (req, res) => {
    db.query('SELECT * FROM experience ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/experience', authenticate, (req, res) => {
    const { role, organization, duration, description } = req.body;
    db.query('INSERT INTO experience (role, organization, duration, description) VALUES (?, ?, ?, ?)',
        [role, organization, duration, description], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: result.insertId, message: 'Experience added' });
        });
});

app.put('/experience/:id', authenticate, (req, res) => {
    const { role, organization, duration, description } = req.body;
    db.query('UPDATE experience SET role=?, organization=?, duration=?, description=? WHERE id=?',
        [role, organization, duration, description, req.params.id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Experience updated' });
        });
});

app.delete('/experience/:id', authenticate, (req, res) => {
    db.query('DELETE FROM experience WHERE id=?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Experience deleted' });
    });
});

// Skills - Create
app.post('/skills', authenticate, (req, res) => {
    const { name, category, proficiency, is_top } = req.body;
    db.query('INSERT INTO skills (name, category, proficiency, is_top) VALUES (?, ?, ?, ?)',
        [name, category, proficiency, is_top], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: result.insertId, message: 'Skill added' });
        });
});

// Skills - Update
app.put('/skills/:id', authenticate, (req, res) => {
    const { name, category, proficiency, is_top } = req.body;
    db.query('UPDATE skills SET name=?, category=?, proficiency=?, is_top=? WHERE id=?',
        [name, category, proficiency, is_top, req.params.id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Skill updated' });
        });
});

// Skills - Delete
app.delete('/skills/:id', authenticate, (req, res) => {
    db.query('DELETE FROM skills WHERE id=?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Skill deleted' });
    });
});

// Skills - Clear All
app.delete('/skills', authenticate, (req, res) => {
    db.query('DELETE FROM skills', [], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'All skills deleted' });
    });
});

// Skills - Bulk Add
app.post('/skills/bulk', authenticate, (req, res) => {
    const skills = req.body.skills;
    if (!Array.isArray(skills)) {
        return res.status(400).json({ error: 'Skills must be an array' });
    }
    
    // Prepare the values for insertion
    const values = skills.map(skill => [
        skill.name, 
        skill.category, 
        skill.proficiency || 80, 
        skill.is_top || 0
    ]);
    
    // Flatten the array for the SQL query
    const flattenedValues = [];
    values.forEach(value => flattenedValues.push(...value));
    
    // Create placeholders for the INSERT query
    const placeholders = values.map(() => '(?, ?, ?, ?)').join(',');
    
    const query = `INSERT INTO skills (name, category, proficiency, is_top) VALUES ${placeholders}`;
    
    db.query(query, flattenedValues, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Skills added successfully' });
    });
});

// Projects - Create
app.post('/projects', authenticate, (req, res) => {
    const { title, description, tech_stack, live_link, github_link } = req.body;
    db.query('INSERT INTO projects (title, description, tech_stack, live_link, github_link) VALUES (?, ?, ?, ?, ?)',
        [title, description, tech_stack, live_link, github_link], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: result.insertId, message: 'Project added' });
        });
});

// Projects - Update
app.put('/projects/:id', authenticate, (req, res) => {
    const { title, description, tech_stack, live_link, github_link } = req.body;
    db.query('UPDATE projects SET title=?, description=?, tech_stack=?, live_link=?, github_link=? WHERE id=?',
        [title, description, tech_stack, live_link, github_link, req.params.id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Project updated' });
        });
});

// Projects - Delete
app.delete('/projects/:id', authenticate, (req, res) => {
    db.query('DELETE FROM projects WHERE id=?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Project deleted' });
    });
});

// Stats
app.get('/stats', (req, res) => {
    // Get total projects
    const totalProjectsQuery = 'SELECT COUNT(*) AS count FROM projects';
    
    // Get live demos count
    const liveDemosQuery = 'SELECT COUNT(*) AS count FROM projects WHERE live_link IS NOT NULL AND live_link != ""';
    
    // Get technologies count
    const technologiesQuery = `SELECT GROUP_CONCAT(tech_stack SEPARATOR ',') AS all_techs FROM projects`;
    
    // Execute all queries
    db.query(totalProjectsQuery, (err, totalProjectsResult) => {
        if (err) return res.status(500).json({ error: err.message });
        
        db.query(liveDemosQuery, (err, liveDemosResult) => {
            if (err) return res.status(500).json({ error: err.message });
            
            db.query(technologiesQuery, (err, techResult) => {
                if (err) return res.status(500).json({ error: err.message });
                
                let totalTechnologies = 0;
                if (techResult[0].all_techs) {
                    const allTechs = techResult[0].all_techs.split(',');
                    const uniqueTechs = [...new Set(allTechs.map(tech => tech.trim()))];
                    totalTechnologies = uniqueTechs.filter(tech => tech !== '').length;
                }
                
                const stats = {
                    total_projects: totalProjectsResult[0].count,
                    total_technologies: totalTechnologies,
                    live_demos: liveDemosResult[0].count
                };
                
                res.json(stats);
            });
        });
    });
});

// Search
app.get('/search', (req, res) => {
    const q = req.query.q;
    if (!q) return res.status(400).json({ error: 'Query parameter q is required' });

    const searchQuery = `
        SELECT 'project' as type, title as name, description as details FROM projects WHERE title LIKE ? OR description LIKE ?
        UNION
        SELECT 'skill' as type, name as name, category as details FROM skills WHERE name LIKE ?
        UNION
        SELECT 'education' as type, education as name, bio as details FROM profile WHERE education LIKE ? OR bio LIKE ?
        UNION
        SELECT 'experience' as type, role as name, organization as details FROM experience WHERE role LIKE ? OR organization LIKE ?
        UNION
        SELECT 'education_detail' as type, institution as name, degree as details FROM education_details WHERE institution LIKE ? OR degree LIKE ?
    `;
    const wild = `%${q}%`;

    db.query(searchQuery, [wild, wild, wild, wild, wild, wild, wild, wild, wild], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



