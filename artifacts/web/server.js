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
const CATEGORIES_FILE = path.join(__dirname, 'categories.json');
// We are adding the users file here so the server knows where it is!
const USERS_FILE = path.join(__dirname, 'users.json'); 

// Serve categories.json
app.get('/categories.json', (req, res) => {
  fs.readFile(CATEGORIES_FILE, 'utf8', (err, data) => {
    if (err) {
      // Fallback: Return default categories if file doesn't exist
      const defaultCategories = [
        { id: '1', name: 'Modern' },
        { id: '2', name: 'Vintage' },
        { id: '3', name: 'Industrial' }
      ];
      return res.json(defaultCategories);
    }
    try {
      res.json(JSON.parse(data));
    } catch (e) {
      res.status(500).json({ error: 'Invalid categories file.' });
    }
  });
});

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

// --- NEW CODE: This tells the server how to fetch users ---
app.get('/api/users', (req, res) => {
  fs.readFile(USERS_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Could not read users database.' });
    res.json(JSON.parse(data || '[]'));
  });
});

// --- NEW CODE: This tells the server how to save user profile updates ---
app.post('/api/users/update', (req, res) => {
  const updatedUser = req.body;

  fs.readFile(USERS_FILE, 'utf8', (err, data) => {
    let users = [];
    if (!err && data) {
      try { users = JSON.parse(data); } catch (e) { users = []; }
    }

    // Find the user who is editing their profile and update their information
    let userExists = false;
    users = users.map(user => {
      if (user.username === updatedUser.username) {
        userExists = true;
        return { ...user, ...updatedUser }; // This merges the old info with the new info
      }
      return user;
    });

    // If for some reason they aren't in the database yet, add them
    if (!userExists) {
      users.push(updatedUser);
    }

    // Save the new list back to the users.json file
    fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), (writeErr) => {
      if (writeErr) return res.status(500).json({ error: 'Failed to save user.' });
      res.status(200).json({ success: true, message: 'Profile updated successfully!', user: updatedUser });
    });
  });
});

// Explicitly bind to 0.0.0.0
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Chairish backend active on port ${PORT}`);
});