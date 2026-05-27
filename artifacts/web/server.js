const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON payloads
app.use(express.json());

// Serve static frontend assets (HTML, CSS, JS) from the root folder
app.use(express.static(__dirname));

const CHAIRS_FILE = path.join(__dirname, 'chairs.json');

// 1. GET Endpoint: Send current chairs list to clients
app.get('/api/chairs', (req, res) => {
  fs.readFile(CHAIRS_FILE, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Could not read chairs database.' });
    }
    res.json(JSON.parse(data || '[]'));
  });
});

// 2. POST Endpoint: Safely append new chair items to the file
app.post('/api/chairs', (req, res) => {
  const newChair = req.body;

  fs.readFile(CHAIRS_FILE, 'utf8', (err, data) => {
    let chairs = [];
    if (!err && data) {
      try {
        chairs = JSON.parse(data);
      } catch (e) {
        chairs = [];
      }
    }

    // Append the freshly posted chair object
    chairs.push(newChair);

    // Save modifications back to storage
    fs.writeFile(CHAIRS_FILE, JSON.stringify(chairs, null, 2), (writeErr) => {
      if (writeErr) {
        return res.status(500).json({ error: 'Failed to save to database.' });
      }
      res.status(201).json({ success: true, message: 'Chair added successfully!' });
    });
  });
});

// Fire up the node backend
app.listen(PORT, () => {
  console.log(`Chairish backend active on port ${PORT}`);
});