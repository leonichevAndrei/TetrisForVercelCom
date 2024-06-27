const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for requests logging:
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Sample data to be sent to the frontend
const data = [
  { name: 'Tom Hanks', points: 100 },
  { name: 'Sarah Jessica Parker', points: 200 },
  { name: 'Michael J. Fox', points: 300 }
];

// Serve the static files from the Vue app
app.use(express.static(path.join(__dirname, '../dist')));

// API endpoint to get data
app.get('/api/data', (req, res) => {
  res.json(data);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});