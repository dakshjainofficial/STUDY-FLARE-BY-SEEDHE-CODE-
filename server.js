const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory session store
let sessions = [
    { id: '101', subject: 'Advanced Mathematics', learners: 12, status: 'active' },
    { id: '102', subject: 'Neural Networks 101', learners: 8, status: 'starting' },
    { id: '103', subject: 'Philosophy & Logic', learners: 5, status: 'active' }
];

// Routes
app.get('/api/sessions', (req, res) => {
    res.json(sessions);
});

app.post('/api/start-session', (req, res) => {
    const { subject } = req.body;
    const newSession = {
        id: Math.random().toString(36).substr(2, 9),
        subject: subject || 'Focused Study',
        learners: 1,
        status: 'matching'
    };
    sessions.push(newSession);
    
    // Simulate matching logic delay
    setTimeout(() => {
        newSession.status = 'active';
        newSession.learners = Math.floor(Math.random() * 5) + 2;
    }, 3000);

    res.status(201).json(newSession);
});

app.post('/api/join-session', (req, res) => {
    const { sessionId } = req.body;
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
        session.learners += 1;
        res.json({ success: true, session });
    } else {
        res.status(404).json({ success: false, message: 'Session not found' });
    }
});

// Fallback to index.html for SPA-like feel
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`StudyFlare Server running at http://localhost:${PORT}`);
});
