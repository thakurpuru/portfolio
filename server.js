const express=require("express");
const mongoose=require("mongoose");
const Profile=require("./models/profile.js");
const Education=require("./models/edcation.js");
const Project=require("./models/project.js");
const Skill=require("./models/skills.js");
const cors=require("cors");
const Experience=require("./models/Experience.js");
require("dotenv").config();
const app=express();

app.use(cors({
    origin: '*', 
    credentials: true,
    optionsSuccessStatus: 200
}));;

async function startServer() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("MongoDB Connected ✅");

    app.listen(process.env.PORT || 5000, () => {
      console.log("Server running 🚀");
    });

  } catch (err) {
    console.log("DB Error:", err);
  }
}

startServer();
app.use(express.json());

// Middleware for Admin Auth
const authenticate = (req, res, next) => {
    const password = req.headers['x-admin-password'];
    if (password === process.env.ADMIN_PASSWORD) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};
app.get("/",(req,res)=>{
    res.json("running");
})

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
// profile
app.get('/profile', async (req, res) => {
  const profile = await Profile.findOne();
  res.json(profile || {});
});

// update profile
app.put('/profile', authenticate, async (req, res) => {
  await Profile.findOneAndUpdate({}, req.body, { upsert: true });
  res.json({ message: "Profile updated" });
});

// skill
app.get('/skills', async (req, res) => {
  const skills = await Skill.find();
  res.json(skills);
});

// top skills
app.get('/skills/top', async (req, res) => {
  const skills = await Skill.find({
    $or: [{ is_top: true }, { proficiency: { $gt: 80 } }]
  }).sort({ proficiency: -1 });

  res.json(skills);
});

// add skill
app.post('/skills', authenticate, async (req, res) => {
  const skill = await Skill.create(req.body);
  res.json(skill);
});

//update skill
app.put('/skills/:id', authenticate, async (req, res) => {
  await Skill.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Skill updated" });
});


// delete skills
app.delete('/skills/:id', authenticate, async (req, res) => {
    console.log("DELETE ID:", req.params.id);
  await Skill.findByIdAndDelete(req.params.id);
  res.json({ message: "Skill deleted" });
});

// bulk skills
app.post('/skills/bulk', authenticate, async (req, res) => {
  await Skill.insertMany(req.body.skills);
  res.json({ message: "Skills added" });
});

// projects
app.get('/projects', async (req, res) => {
  const { q, skill, filter } = req.query;

  let query = {};

  if (q) {
    query.$or = [
      { title: { $regex: q, $options: "i" } },
      { tech_stack: { $regex: q, $options: "i" } }
    ];
  }

  if (skill) {
    query.tech_stack = { $regex: skill, $options: "i" };
  }

  const projects = await Project.find(query);
  res.json(projects);
});

// Create Project
app.post('/projects', authenticate, async (req, res) => {
  const project = await Project.create(req.body);
  res.json(project);
});

//Update project
app.put('/projects/:id', authenticate, async (req, res) => {
  await Project.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Updated" });
});

//Delete Project
app.delete('/projects/:id', authenticate, async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

//Education
app.get('/education', async (req, res) => {
  const data = await Education.find().sort({ start_year: -1 });
  res.json(data);
});

// Create Education
app.post('/education', authenticate, async (req, res) => {
  const edu = await Education.create(req.body);
  res.json(edu);
});

// Update Education
app.put('/education/:id', authenticate, async (req, res) => {
  await Education.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Updated" });
});

//Delete Education
app.delete('/education/:id', authenticate, async (req, res) => {
  await Education.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

//Experience
app.get('/experience', async (req, res) => {
  const data = await Experience.find().sort({ _id: -1 });
  res.json(data);
});

//Add experience
app.post('/experience', authenticate, async (req, res) => {
  const exp = await Experience.create(req.body);
  res.json(exp);
});

//Update experience
app.put('/experience/:id', authenticate, async (req, res) => {
  await Experience.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Updated" });
});

//Delete experience
app.delete('/experience/:id', authenticate, async (req, res) => {
  await Experience.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// Stats
app.get('/stats', async (req, res) => {
  const totalProjects = await Project.countDocuments();
  const liveDemos = await Project.countDocuments({ live_link: { $ne: "" } });

  const projects = await Project.find();

  let techSet = new Set();
  projects.forEach(p => {
    if (p.tech_stack) {
      p.tech_stack.forEach(t => techSet.add(t));
    }
  });

  res.json({
    total_projects: totalProjects,
    total_technologies: techSet.size,
    live_demos: liveDemos
  });
});

//search
app.get('/search', async (req, res) => {
  const q = req.query.q;

  const projects = await Project.find({ title: { $regex: q, $options: "i" } });
  const skills = await Skill.find({ name: { $regex: q, $options: "i" } });
  const experience = await Experience.find({ role: { $regex: q, $options: "i" } });

  res.json([...projects, ...skills, ...experience]);
});

// Login Check
app.post('/auth/login', (req, res) => {
    const { password } = req.body;
    if (password === process.env.ADMIN_PASSWORD) {
        res.json({ success: true });
    } else {
        res.status(401).json({ error: 'Invalid password' });
    }
});

