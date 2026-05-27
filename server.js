const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

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

app.listen(PORT, () => {
  console.log(`Chairish backend active on port ${PORT}`);
});
