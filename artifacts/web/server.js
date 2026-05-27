const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
// Hardcoded to 3001 to avoid colliding with Vite
const PORT = 3001; 

// This acts as the VIP pass (CORS) to let your frontend talk to your backend
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use(express.json());
app.use(express.static(__dirname));

const CHAIRS_FILE = path.join(__dirname, 'chairs.json');

app.get('/api/chairs', (req, res) => {
  fs.readFile(CHAIRS_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Could not read chairs database.' });
    res.json(JSON.parse(data || '[]'));
  });
});

app.post('/api/chairs', (req, res) => {
  const newChair = req.body;
  fs.readFile(CHAIRS_FILE, 'utf8', (err, data) => {
    let chairs = [];
    if (!err && data) {
      try { chairs = JSON.parse(data); } catch (e) { chairs = []; }
    }
    chairs.push(newChair);
    fs.writeFile(CHAIRS_FILE, JSON.stringify(chairs, null, 2), (writeErr) => {
      if (writeErr) return res.status(500).json({ error: 'Failed to save.' });
      res.status(201).json({ success: true, message: 'Chair added successfully!' });
    });
  });
});

// Explicitly bind to 0.0.0.0
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Chairish backend active on port ${PORT}`);
});