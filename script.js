const API_URL = "http://localhost:5000";
const API_BASE_URL="http://localhost:5000";
let isAdmin = false;
let adminPassword = 'thakur';


// Test connection
async function testBackend() {
    try {
        const response = await fetch(`${API_BASE_URL}/`);
        const data = await response.json();
        console.log("Backend connected:", data);
    } catch (error) {
        console.error("Backend connection failed:", error);
    }
}

// Example API call - update to match your portfolio endpoints
async function fetchSkills() {
    try {
        const response = await fetch(`${API_BASE_URL}/skills`);
        const skills = await response.json();
        return skills;
    } catch (error) {
        console.error("Error fetching skills:", error);
        return [];
    }
}

// Call on page load
document.addEventListener('DOMContentLoaded', () => {
    testBackend();
    fetchSkills().then(skills => {
        // Display skills
    });
});

// Helper to escape strings for JS calls in HTML attributes
function safeJS(str) {
    if (!str) return '';
    return str.toString().replace(/'/g, "\\'").replace(/\n/g, "\\n").replace(/\r/g, "\\r");
}

// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
body.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    if (!themeToggle) return;
    if (theme === 'dark') {
        themeToggle.classList.replace('fa-sun', 'fa-moon');
    } else {
        themeToggle.classList.replace('fa-moon', 'fa-sun');
    }
}

// Auth
async function login() {
    const password = document.getElementById('admin-password').value;
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });
        const data = await res.json();
        if (data.success) {
            console.log('Login successful');
            isAdmin = true;
            adminPassword = password;
            toggleAdminMode();
            closeModal('login-modal');
        } else {
            console.warn('Login failed: Invalid password');
            alert('Invalid password');
        }
    } catch (err) {
        console.error('Login error:', err);
    }
}

function logout() {
    isAdmin = false;
    adminPassword = '';
    toggleAdminMode();
}

function toggleAdminMode() {
    const adminElements = [
        'add-skill-btn', 'add-project-btn', 'edit-profile-btn', 'edit-objective-btn',
        'add-education-btn', 'add-experience-btn'
    ];

    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');

    if (isAdmin) {
        console.log('Admin mode enabled, showing admin elements');
        // Hide login button, show logout button
        if (loginBtn) loginBtn.classList.add('hidden');
        if (logoutBtn) logoutBtn.classList.remove('hidden');

        // Show all admin edit buttons
        adminElements.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                console.log(`Showing element: ${id}`);
                el.classList.remove('hidden');
            }
        });
    } else {
        console.log('Admin mode disabled, hiding admin elements');
        // Show login button, hide logout button
        if (loginBtn) loginBtn.classList.remove('hidden');
        if (logoutBtn) logoutBtn.classList.add('hidden');

        // Hide all admin edit buttons
        adminElements.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                console.log(`Hiding element: ${id}`);
                el.classList.add('hidden');
            }
        });
    }

    // Re-render lists to show/hide edit buttons
    fetchSkills();
    fetchProjects();
    fetchEducation();
    fetchExperience();
}

// Navigation
function showSection(sectionId) {
    document.getElementById('hero').classList.add('hidden');
    document.getElementById('home-menu').classList.add('hidden');
    document.getElementById('home-footer').classList.add('hidden'); // Hide footer on section pages
    document.getElementById('main-content').classList.remove('hidden');

    document.querySelectorAll('.content-section').forEach(el => el.classList.add('hidden'));
    const target = document.getElementById(sectionId);
    if (target) target.classList.remove('hidden');

    // If opening personal details, ensure we fetch/refresh profile
    if (sectionId === 'personal-details-section') {
        fetchProfile();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showHome() {
    document.getElementById('main-content').classList.add('hidden');
    document.getElementById('hero').classList.remove('hidden');
    document.getElementById('home-menu').classList.remove('hidden');
    document.getElementById('home-footer').classList.remove('hidden'); // Show footer on home page
    document.querySelectorAll('.content-section').forEach(el => el.classList.add('hidden'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Data Fetching
async function fetchProfile() {
    try {
        const res = await fetch(`${API_URL}/profile`);
        const data = await res.json();

        // Hero Section
        document.getElementById('header-name').textContent = data.name || 'Your Name';
        const bio = data.bio || 'Portfolio';
        document.getElementById('header-title').textContent = bio.length > 100 ? bio.substring(0, Math.floor(bio.length / 2)) + '...' : bio;

        // Hero Socials
        if (data.github_link) document.getElementById('hero-github').href = data.github_link;
        if (data.linkedin_link) document.getElementById('hero-linkedin').href = data.linkedin_link;
        if (data.leetcode_link) document.getElementById('hero-leetcode').href = data.leetcode_link;
        if (data.profile_link) document.getElementById('hero-profile').href = data.profile_link;
        if (data.email) document.getElementById('hero-email-link').href = `mailto:${data.email}`;

        // Personal Details Section
        document.getElementById('name').textContent = data.name || 'Your Name';
        document.getElementById('bio').textContent = data.bio || 'Developer';
        document.getElementById('email').textContent = data.email || 'No email';
        document.getElementById('interests').textContent = data.interests || 'None';
        document.getElementById('availability').textContent = data.availability || 'Unknown';

        // Objective Section
        document.getElementById('objective').textContent = data.objective || 'No objective set.';

        // Footer
        document.getElementById('footer-email').textContent = data.email || 'No email';

        // Social Links (Personal Details & Footer)
        const linksHtml = `
            ${data.github_link ? `<a href="${data.github_link}" target="_blank"><i class="fab fa-github"></i> GitHub</a>` : ''}
            ${data.linkedin_link ? `<a href="${data.linkedin_link}" target="_blank"><i class="fab fa-linkedin"></i> LinkedIn</a>` : ''}
            ${data.portfolio_link ? `<a href="${data.portfolio_link}" target="_blank"><i class="fas fa-globe"></i> Portfolio</a>` : ''}
            ${data.profile_link ? `<a href="${data.profile_link}" target="_blank"><i class="fas fa-user"></i> Profile</a>` : ''}
            ${data.leetcode_link ? `<a href="${data.leetcode_link}" target="_blank"><i class="fas fa-code"></i> LeetCode</a>` : ''}
        `;

        const socialLinksContainer = document.getElementById('social-links');
        if (socialLinksContainer) socialLinksContainer.innerHTML = linksHtml;

        const footerLinksContainer = document.getElementById('footer-links');
        if (footerLinksContainer) footerLinksContainer.innerHTML = linksHtml;

        // Populate Edit Modal
        if (document.getElementById('profile-name')) document.getElementById('profile-name').value = data.name || '';
        if (document.getElementById('profile-email')) document.getElementById('profile-email').value = data.email || '';
        if (document.getElementById('profile-bio')) document.getElementById('profile-bio').value = data.bio || '';
        if (document.getElementById('profile-objective')) document.getElementById('profile-objective').value = data.objective || '';
        if (document.getElementById('profile-interests')) document.getElementById('profile-interests').value = data.interests || '';
        if (document.getElementById('profile-availability')) document.getElementById('profile-availability').value = data.availability || '';
        if (document.getElementById('profile-education')) document.getElementById('profile-education').value = data.education || '';
        if (document.getElementById('profile-github')) document.getElementById('profile-github').value = data.github_link || '';
        if (document.getElementById('profile-linkedin')) document.getElementById('profile-linkedin').value = data.linkedin_link || '';
        if (document.getElementById('profile-portfolio')) document.getElementById('profile-portfolio').value = data.portfolio_link || '';
        if (document.getElementById('profile-leetcode')) document.getElementById('profile-leetcode').value = data.leetcode_link || '';
        if (document.getElementById('profile-profile')) document.getElementById('profile-profile').value = data.profile_link || '';

    } catch (err) {
        console.error('Error fetching profile:', err);
    }
}

async function fetchEducation() {
    try {
        const res = await fetch(`${API_URL}/education`);
        const data = await res.json();

        const container = document.getElementById('education-list');
        if (container) {
            container.innerHTML = data.map(edu => `
                <div class="timeline-item card">
                    <h3>${edu.institution}</h3>
                    <p><strong>${edu.degree}</strong> (${edu.start_year} - ${edu.end_year})</p>
                    <p>CGPA: ${edu.cgpa}</p>
                    <p>${edu.coursework}</p>
                    ${isAdmin ? `
                    <div class="card-actions">
                        <button onclick="editEducation(${edu.id}, '${safeJS(edu.institution)}', '${safeJS(edu.degree)}', '${safeJS(edu.start_year)}', '${safeJS(edu.end_year)}', '${safeJS(edu.cgpa)}', '${safeJS(edu.coursework)}')" class="btn-icon">✎</button>
                        <button onclick="deleteEducation(${edu.id})" class="btn-icon btn-delete">🗑</button>
                    </div>` : ''}
                </div>
            `).join('');
        }
    } catch (err) {
        console.error('Error fetching education:', err);
    }
}

async function fetchExperience() {
    try {
        const res = await fetch(`${API_URL}/experience`);
        const data = await res.json();

        const container = document.getElementById('experience-list');
        if (container) {
            container.innerHTML = data.map(exp => `
                <div class="timeline-item card">
                    <h3>${exp.role}</h3>
                    <p><strong>${exp.organization}</strong> (${exp.duration})</p>
                    <p style="white-space: pre-line;">${exp.description}</p>
                    ${isAdmin ? `
                    <div class="card-actions">
                        <button onclick="editExperience(${exp.id}, '${safeJS(exp.role)}', '${safeJS(exp.organization)}', '${safeJS(exp.duration)}', '${safeJS(exp.description)}')" class="btn-icon">✎</button>
                        <button onclick="deleteExperience(${exp.id})" class="btn-icon btn-delete">🗑</button>
                    </div>` : ''}
                </div>
            `).join('');
        }
    } catch (err) {
        console.error('Error fetching experience:', err);
    }
}

async function fetchSkills() {
    try {
        const res = await fetch(`${API_URL}/skills`); // Fetch all skills
        const data = await res.json();

        const container = document.getElementById('skills-list');
        if (container) {
            container.innerHTML = data.map(skill => `
                <div class="card">
                    <h3>${skill.name}</h3>
                    <p>${skill.category}</p>
                    <div class="progress-bar" style="background: #334155; height: 6px; border-radius: 3px; margin-top: 10px;">
                        <div style="width: ${skill.proficiency}%; background: var(--accent); height: 100%; border-radius: 3px;"></div>
                    </div>
                    ${isAdmin ? `
                    <div class="card-actions">
                        <button onclick="editSkill(${skill.id}, '${safeJS(skill.name)}', '${safeJS(skill.category)}', ${skill.proficiency}, ${skill.is_top})" class="btn-icon">✎</button>
                        <button onclick="deleteSkill(${skill.id})" class="btn-icon btn-delete">🗑</button>
                    </div>` : ''}
                </div>
            `).join('');
        }
        
        // Update total skills count
        const totalSkillsCount = document.getElementById('total-skills-count');
        if (totalSkillsCount) {
            totalSkillsCount.textContent = data.length;
        }
    } catch (err) {
        console.error('Error fetching skills:', err);
    }
}

async function fetchProjects(query = '') {
    // If there's an active filter, use that instead
    const activeFilterButton = document.querySelector('.filter-btn.active');
    if (activeFilterButton && activeFilterButton.dataset.filter !== 'all') {
        const filter = activeFilterButton.dataset.filter;
        filterProjects(filter, query); // Pass query along with filter
    } else {
        // Otherwise, use the search query
        try {
            let url = `${API_URL}/projects`;
            if (query) url += `?q=${encodeURIComponent(query)}`; // Changed from 'skill' to 'q' for general search
    
            const res = await fetch(url);
            const data = await res.json();
    
            const container = document.getElementById('projects-list');
            if (container) {
                container.innerHTML = data.map(project => `
                    <div class="card">
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                        <div class="tech-stack">
                            ${project.tech_stack ? project.tech_stack.split(',').map(t => `<span class="tag">${t.trim()}</span>`).join('') : ''}
                        </div>
                        <div class="project-links">
                            ${project.live_link ? `<a href="${project.live_link}" target="_blank">Live Demo</a>` : ''}
                            ${project.github_link ? `<a href="${project.github_link}" target="_blank">GitHub</a>` : ''}
                        </div>
                        ${isAdmin ? `
                        <div class="card-actions">
                            <button onclick="editProject(${project.id}, '${safeJS(project.title)}', '${safeJS(project.description)}', '${safeJS(project.tech_stack)}', '${safeJS(project.live_link)}', '${safeJS(project.github_link)}')" class="btn-icon">✎</button>
                            <button onclick="deleteProject(${project.id})" class="btn-icon btn-delete">🗑</button>
                        </div>` : ''}
                    </div>
                `).join('');
            }
        } catch (err) {
            console.error('Error fetching projects:', err);
        }
    }
}

// Filter Projects
async function filterProjects(filter, query = '') {
    try {
        let url = `${API_URL}/projects`;
        
        // Build query parameters
        const params = new URLSearchParams();
        if (filter && filter !== 'all') {
            params.append('filter', filter);
        }
        if (query) {
            params.append('q', query);
        }
        
        if (params.toString()) {
            url += '?' + params.toString();
        }

        const res = await fetch(url);
        const data = await res.json();

        const container = document.getElementById('projects-list');
        if (container) {
            container.innerHTML = data.map(project => `
                <div class="card">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="tech-stack">
                        ${project.tech_stack ? project.tech_stack.split(',').map(t => `<span class="tag">${t.trim()}</span>`).join('') : ''}
                    </div>
                    <div class="project-links">
                        ${project.live_link ? `<a href="${project.live_link}" target="_blank">Live Demo</a>` : ''}
                        ${project.github_link ? `<a href="${project.github_link}" target="_blank">GitHub</a>` : ''}
                    </div>
                    ${isAdmin ? `
                    <div class="card-actions">
                        <button onclick="editProject(${project.id}, '${safeJS(project.title)}', '${safeJS(project.description)}', '${safeJS(project.tech_stack)}', '${safeJS(project.live_link)}', '${safeJS(project.github_link)}')" class="btn-icon">✎</button>
                        <button onclick="deleteProject(${project.id})" class="btn-icon btn-delete">🗑</button>
                    </div>` : ''}
                </div>
            `).join('');
        }
    } catch (err) {
        console.error('Error filtering projects:', err);
    }
}

// Fetch Stats
async function fetchStats() {
    try {
        const res = await fetch(`${API_URL}/stats`);
        const data = await res.json();
        
        // Update the project stats in the DOM (specifically in the projects section)
        const totalProjectsEl = document.querySelector('#projects-section .stats-container .stat-card:nth-child(1) h3');
        const technologiesEl = document.querySelector('#projects-section .stats-container .stat-card:nth-child(2) h3');
        const liveDemosEl = document.querySelector('#projects-section .stats-container .stat-card:nth-child(3) h3');
        
        if (totalProjectsEl) totalProjectsEl.textContent = data.total_projects;
        if (technologiesEl) technologiesEl.textContent = data.total_technologies;
        if (liveDemosEl) liveDemosEl.textContent = data.live_demos;
    } catch (err) {
        console.error('Error fetching stats:', err);
    }
}

// CRUD Operations
async function saveProfile() {
    console.log('saveProfile function called');
    const body = {
        name: document.getElementById('profile-name').value,
        email: document.getElementById('profile-email').value,
        bio: document.getElementById('profile-bio').value,
        objective: document.getElementById('profile-objective').value,
        interests: document.getElementById('profile-interests').value,
        availability: document.getElementById('profile-availability').value,
        education: document.getElementById('profile-education').value,
        github_link: document.getElementById('profile-github').value,
        linkedin_link: document.getElementById('profile-linkedin').value,
        portfolio_link: document.getElementById('profile-portfolio').value,
        leetcode_link: document.getElementById('profile-leetcode').value,
        profile_link: document.getElementById('profile-profile').value
    };
    console.log('Profile body to save:', body);

    try {
        const res = await fetch(`${API_URL}/profile`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'x-admin-password': adminPassword },
            body: JSON.stringify(body)
        });

        if (res.ok) {
            alert('Profile updated successfully!');
            closeModal('profile-modal');
            fetchProfile();
        } else {
            alert('Failed to update profile.');
        }
    } catch (err) {
        console.error('Error saving profile:', err);
        alert('An error occurred while saving.');
    }
}

async function saveEducation() {
    const id = document.getElementById('education-id').value;
    const body = {
        institution: document.getElementById('edu-institution').value,
        degree: document.getElementById('edu-degree').value,
        start_year: document.getElementById('edu-start').value,
        end_year: document.getElementById('edu-end').value,
        cgpa: document.getElementById('edu-cgpa').value,
        coursework: document.getElementById('edu-coursework').value
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/education/${id}` : `${API_URL}/education`;

    try {
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', 'x-admin-password': adminPassword },
            body: JSON.stringify(body)
        });
        if (res.ok) {
            alert('Education saved successfully!');
            closeModal('education-modal');
            fetchEducation();
        } else {
            alert('Failed to save education.');
        }
    } catch (err) {
        console.error('Error saving education:', err);
    }
}

async function deleteEducation(id) {
    if (!confirm('Are you sure?')) return;
    await fetch(`${API_URL}/education/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': adminPassword }
    });
    fetchEducation();
}

async function saveExperience() {
    const id = document.getElementById('experience-id').value;
    const body = {
        role: document.getElementById('exp-role').value,
        organization: document.getElementById('exp-org').value,
        duration: document.getElementById('exp-duration').value,
        description: document.getElementById('exp-desc').value
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/experience/${id}` : `${API_URL}/experience`;

    try {
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', 'x-admin-password': adminPassword },
            body: JSON.stringify(body)
        });
        if (res.ok) {
            alert('Experience saved successfully!');
            closeModal('experience-modal');
            fetchExperience();
        } else {
            alert('Failed to save experience.');
        }
    } catch (err) {
        console.error('Error saving experience:', err);
    }
}

async function deleteExperience(id) {
    if (!confirm('Are you sure?')) return;
    await fetch(`${API_URL}/experience/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': adminPassword }
    });
    fetchExperience();
}

async function saveSkill() {
    const id = document.getElementById('skill-id').value;
    const body = {
        name: document.getElementById('skill-name').value,
        category: document.getElementById('skill-category').value,
        proficiency: document.getElementById('skill-proficiency').value,
        is_top: document.getElementById('skill-top').checked
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/skills/${id}` : `${API_URL}/skills`;

    try {
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', 'x-admin-password': adminPassword },
            body: JSON.stringify(body)
        });
        if (res.ok) {
            alert('Skill saved successfully!');
            closeModal('skill-modal');
            fetchSkills();
        } else {
            alert('Failed to save skill.');
        }
    } catch (err) {
        console.error('Error saving skill:', err);
    }
}

async function deleteSkill(id) {
    if (!confirm('Are you sure?')) return;
    await fetch(`${API_URL}/skills/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': adminPassword }
    });
    fetchSkills();
}

async function saveProject() {
    const id = document.getElementById('project-id').value;
    const body = {
        title: document.getElementById('project-title').value,
        description: document.getElementById('project-desc').value,
        tech_stack: document.getElementById('project-tech').value,
        live_link: document.getElementById('project-live').value,
        github_link: document.getElementById('project-github').value
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/projects/${id}` : `${API_URL}/projects`;

    try {
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', 'x-admin-password': adminPassword },
            body: JSON.stringify(body)
        });
        if (res.ok) {
            alert('Project saved successfully!');
            closeModal('project-modal');
            fetchProjects();
        } else {
            alert('Failed to save project.');
        }
    } catch (err) {
        console.error('Error saving project:', err);
    }
}

async function deleteProject(id) {
    if (!confirm('Are you sure?')) return;
    await fetch(`${API_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': adminPassword }
    });
    fetchProjects();
}

// Modal Helpers
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('hidden');
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('hidden');
}

function editEducation(id, inst, degree, start, end, cgpa, course) {
    console.log('editEducation called', { id, inst, degree });
    document.getElementById('education-id').value = id;
    document.getElementById('edu-institution').value = inst;
    document.getElementById('edu-degree').value = degree;
    document.getElementById('edu-start').value = start;
    document.getElementById('edu-end').value = end;
    document.getElementById('edu-cgpa').value = cgpa;
    document.getElementById('edu-coursework').value = course;
    document.getElementById('education-modal-title').textContent = 'Edit Education';
    openModal('education-modal');
}

function editExperience(id, role, org, dur, desc) {
    console.log('editExperience called', { id, role, org });
    document.getElementById('experience-id').value = id;
    document.getElementById('exp-role').value = role;
    document.getElementById('exp-org').value = org;
    document.getElementById('exp-duration').value = dur;
    document.getElementById('exp-desc').value = desc;
    document.getElementById('experience-modal-title').textContent = 'Edit Experience';
    openModal('experience-modal');
}

function editSkill(id, name, category, proficiency, isTop) {
    console.log('editSkill called', { id, name, category });
    const skillIdEl = document.getElementById('skill-id');
    if (skillIdEl) skillIdEl.value = id;
    const skillNameEl = document.getElementById('skill-name');
    if (skillNameEl) skillNameEl.value = name;
    const skillCategoryEl = document.getElementById('skill-category');
    if (skillCategoryEl) skillCategoryEl.value = category;
    const skillProficiencyEl = document.getElementById('skill-proficiency');
    if (skillProficiencyEl) skillProficiencyEl.value = proficiency;
    const skillTopEl = document.getElementById('skill-top');
    if (skillTopEl) skillTopEl.checked = isTop;
    const skillModalTitleEl = document.getElementById('skill-modal-title');
    if (skillModalTitleEl) skillModalTitleEl.textContent = 'Edit Skill';
    openModal('skill-modal');
}

function editProject(id, title, desc, tech, live, github) {
    console.log('editProject called', { id, title });
    const projectIdEl = document.getElementById('project-id');
    if (projectIdEl) projectIdEl.value = id;
    const projectTitleEl = document.getElementById('project-title');
    if (projectTitleEl) projectTitleEl.value = title;
    const projectDescEl = document.getElementById('project-desc');
    if (projectDescEl) projectDescEl.value = desc;
    const projectTechEl = document.getElementById('project-tech');
    if (projectTechEl) projectTechEl.value = tech;
    const projectLiveEl = document.getElementById('project-live');
    if (projectLiveEl) projectLiveEl.value = live;
    const projectGithubEl = document.getElementById('project-github');
    if (projectGithubEl) projectGithubEl.value = github;
    const projectModalTitleEl = document.getElementById('project-modal-title');
    if (projectModalTitleEl) projectModalTitleEl.textContent = 'Edit Project';
    openModal('project-modal');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    fetchProfile();
    fetchEducation();
    fetchExperience();
    fetchSkills();
    fetchProjects();

    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.addEventListener('input', handleSearch);
    
    // Fetch stats
    fetchStats();
    
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filter = button.dataset.filter;
            filterProjects(filter);
        });
    });

    // Auth
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) loginBtn.onclick = () => openModal('login-modal');
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.onclick = logout;
    const submitLoginBtn = document.getElementById('submit-login');
    if (submitLoginBtn) submitLoginBtn.onclick = login;

    // Modals
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.onclick = function () {
            const modal = this.closest('.modal');
            if (modal) modal.classList.add('hidden');
        }
    });

    // Add Buttons
    const addSkillBtn = document.getElementById('add-skill-btn');
    if (addSkillBtn) {
        addSkillBtn.onclick = () => {
            document.getElementById('skill-id').value = '';
            document.getElementById('skill-modal-title').textContent = 'Add Skill';
            document.getElementById('skill-name').value = '';
            document.getElementById('skill-category').value = '';
            document.getElementById('skill-proficiency').value = '';
            document.getElementById('skill-top').checked = false;
            openModal('skill-modal');
        };
    }

    const addProjectBtn = document.getElementById('add-project-btn');
    if (addProjectBtn) {
        addProjectBtn.onclick = () => {
            document.getElementById('project-id').value = '';
            document.getElementById('project-modal-title').textContent = 'Add Project';
            document.getElementById('project-title').value = '';
            document.getElementById('project-desc').value = '';
            document.getElementById('project-tech').value = '';
            document.getElementById('project-live').value = '';
            document.getElementById('project-github').value = '';
            openModal('project-modal');
        };
    }

    const addEduBtn = document.getElementById('add-education-btn');
    if (addEduBtn) {
        addEduBtn.onclick = () => {
            document.getElementById('education-id').value = '';
            document.getElementById('education-modal-title').textContent = 'Add Education';
            document.getElementById('edu-institution').value = '';
            document.getElementById('edu-degree').value = '';
            document.getElementById('edu-start').value = '';
            document.getElementById('edu-end').value = '';
            document.getElementById('edu-cgpa').value = '';
            document.getElementById('edu-coursework').value = '';
            openModal('education-modal');
        };
    }

    const addExpBtn = document.getElementById('add-experience-btn');
    if (addExpBtn) {
        addExpBtn.onclick = () => {
            document.getElementById('experience-id').value = '';
            document.getElementById('experience-modal-title').textContent = 'Add Experience';
            document.getElementById('exp-role').value = '';
            document.getElementById('exp-org').value = '';
            document.getElementById('exp-duration').value = '';
            document.getElementById('exp-desc').value = '';
            openModal('experience-modal');
        };
    }

    // Save Buttons - Event listeners are handled separately below to prevent duplicates

    // Initialize admin mode state
    toggleAdminMode();
});

async function handleSearch(e) {
    const q = e.target.value;
    if (q.length < 2) {
        const searchResults = document.getElementById('search-results');
        if (searchResults) searchResults.innerHTML = '';
        return;
    }

    try {
        const res = await fetch(`${API_URL}/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();

        const container = document.getElementById('search-results');
        if (container) {
            if (data.length === 0) {
                container.innerHTML = '<p>No results found.</p>';
                return;
            }

            container.innerHTML = data.map(item => `
                <div class="card" style="padding: 1rem;">
                    <strong>${item.type.toUpperCase()}</strong>: ${item.name}
                    <p style="margin: 0.5rem 0 0;">${item.details}</p>
                </div>
            `).join('');
        }
    } catch (err) {
        console.error('Search error:', err);
    }
}

// Canvas Animation
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.6 - 0.3;
        this.speedY = Math.random() * 0.6 - 0.3;
        this.color = `rgba(168, 85, 247, ${Math.random() * 0.4 + 0.3})`;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
initParticles();
animateParticles();

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Logo Click Handler - Always go to home page
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.removeEventListener('click', showHome); // Remove any existing listener
        logo.addEventListener('click', function(e) {
            e.preventDefault();
            showHome();
        });
    }

    // Admin Login/Logout
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const modal = document.getElementById('login-modal');
            if (modal) modal.classList.remove('hidden');
        });
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', logout);

    const submitLoginBtn = document.getElementById('submit-login');
    if (submitLoginBtn) submitLoginBtn.addEventListener('click', login);

    // Close Modals
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) modal.classList.add('hidden');
        });
    });

    // CRUD Event Listeners
    const editProfileBtn = document.getElementById('edit-profile-btn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', async () => {
            console.log('Edit Profile button clicked');
            try {
                const res = await fetch(`${API_URL}/profile`);
                if (!res.ok) throw new Error('Failed to fetch profile data');
                const data = await res.json();
                console.log('Profile data fetched:', data);

                document.getElementById('profile-name').value = data.name || '';
                document.getElementById('profile-email').value = data.email || '';
                document.getElementById('profile-bio').value = data.bio || '';
                document.getElementById('profile-objective').value = data.objective || '';
                document.getElementById('profile-interests').value = data.interests || '';
                document.getElementById('profile-availability').value = data.availability || '';
                document.getElementById('profile-education').value = data.education || '';
                document.getElementById('profile-github').value = data.github_link || '';
                document.getElementById('profile-linkedin').value = data.linkedin_link || '';
                document.getElementById('profile-portfolio').value = data.portfolio_link || '';
                document.getElementById('profile-leetcode').value = data.leetcode_link || '';
                document.getElementById('profile-profile').value = data.profile_link || '';

                openModal('profile-modal');
            } catch (err) {
                console.error('Error opening profile modal:', err);
                alert('Could not load profile data. Please check the console for details.');
            }
        });
    }

    const editObjectiveBtn = document.getElementById('edit-objective-btn');
    if (editObjectiveBtn) {
        editObjectiveBtn.addEventListener('click', async () => {
            console.log('Edit Objective button clicked');
            try {
                const res = await fetch(`${API_URL}/profile`);
                if (!res.ok) throw new Error('Failed to fetch profile data');
                const data = await res.json();
                console.log('Profile data fetched for objective:', data);

                document.getElementById('profile-name').value = data.name || '';
                document.getElementById('profile-email').value = data.email || '';
                document.getElementById('profile-bio').value = data.bio || '';
                document.getElementById('profile-objective').value = data.objective || '';
                document.getElementById('profile-interests').value = data.interests || '';
                document.getElementById('profile-availability').value = data.availability || '';
                document.getElementById('profile-education').value = data.education || '';
                document.getElementById('profile-github').value = data.github_link || '';
                document.getElementById('profile-linkedin').value = data.linkedin_link || '';
                document.getElementById('profile-portfolio').value = data.portfolio_link || '';
                document.getElementById('profile-leetcode').value = data.leetcode_link || '';
                document.getElementById('profile-profile').value = data.profile_link || '';

                openModal('profile-modal');
                document.getElementById('profile-objective').focus();
            } catch (err) {
                console.error('Error opening profile modal for objective:', err);
                alert('Could not load profile data. Please check the console for details.');
            }
        });
    }

    const saveProfileBtn = document.getElementById('save-profile');
    if (saveProfileBtn) saveProfileBtn.addEventListener('click', saveProfile);

    const addSkillBtn = document.getElementById('add-skill-btn');
    if (addSkillBtn) {
        addSkillBtn.addEventListener('click', () => {
            document.getElementById('skill-id').value = '';
            document.getElementById('skill-name').value = '';
            document.getElementById('skill-category').value = '';
            document.getElementById('skill-proficiency').value = '';
            document.getElementById('skill-top').checked = false;
            document.getElementById('skill-modal-title').textContent = 'Add Skill';
            openModal('skill-modal');
        });
    }
    const saveSkillBtn = document.getElementById('save-skill');
    if (saveSkillBtn) saveSkillBtn.addEventListener('click', saveSkill);

    const addProjectBtn = document.getElementById('add-project-btn');
    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', () => {
            document.getElementById('project-id').value = '';
            document.getElementById('project-title').value = '';
            document.getElementById('project-desc').value = '';
            document.getElementById('project-tech').value = '';
            document.getElementById('project-live').value = '';
            document.getElementById('project-github').value = '';
            document.getElementById('project-modal-title').textContent = 'Add Project';
            openModal('project-modal');
        });
    }
    const saveProjectBtn = document.getElementById('save-project');
    if (saveProjectBtn) saveProjectBtn.addEventListener('click', saveProject);

    const addEducationBtn = document.getElementById('add-education-btn');
    if (addEducationBtn) {
        addEducationBtn.addEventListener('click', () => {
            document.getElementById('education-id').value = '';
            document.getElementById('edu-institution').value = '';
            document.getElementById('edu-degree').value = '';
            document.getElementById('edu-start').value = '';
            document.getElementById('edu-end').value = '';
            document.getElementById('edu-cgpa').value = '';
            document.getElementById('edu-coursework').value = '';
            document.getElementById('education-modal-title').textContent = 'Add Education';
            openModal('education-modal');
        });
    }
    const saveEducationBtn = document.getElementById('save-education');
    if (saveEducationBtn) saveEducationBtn.addEventListener('click', saveEducation);

    const addExperienceBtn = document.getElementById('add-experience-btn');
    if (addExperienceBtn) {
        addExperienceBtn.addEventListener('click', () => {
            document.getElementById('experience-id').value = '';
            document.getElementById('exp-role').value = '';
            document.getElementById('exp-org').value = '';
            document.getElementById('exp-duration').value = '';
            document.getElementById('exp-desc').value = '';
            document.getElementById('experience-modal-title').textContent = 'Add Experience';
            openModal('experience-modal');
        });
    }
    const saveExperienceBtn = document.getElementById('save-experience');
    if (saveExperienceBtn) saveExperienceBtn.addEventListener('click', saveExperience);

    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.addEventListener('input', (e) => fetchProjects(e.target.value));
    
    // Fetch stats
    fetchStats();
    
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');
                
                const filter = button.dataset.filter;
                filterProjects(filter);
            });
        });
    }

    // Initial Fetch
    fetchProfile();
    fetchSkills();
    fetchProjects();
    fetchEducation();
    fetchExperience();
});

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('hidden');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('hidden');
}

function goToHome() {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Hide main content container
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.classList.add('hidden');
    }
    
    // Show home menu and footer
    const homeMenu = document.getElementById('home-menu');
    const homeFooter = document.getElementById('home-footer');
    
    if (homeMenu) homeMenu.classList.remove('hidden');
    if (homeFooter) homeFooter.classList.remove('hidden');
    
    // Scroll to home menu
    if (homeMenu) {
        homeMenu.scrollIntoView({ behavior: 'smooth' });
    }
}

// Also update the existing showSection function to ensure home menu/footer are hidden:
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show the selected section
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.remove('hidden');
    }
    
    // Hide home menu and footer
    const homeMenu = document.getElementById('home-menu');
    const homeFooter = document.getElementById('home-footer');
    
    if (homeMenu) homeMenu.classList.add('hidden');
    if (homeFooter) homeFooter.classList.add('hidden');
    
    // Show main content container
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.classList.remove('hidden');
    }
    
    // Scroll to the top of the section
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}




