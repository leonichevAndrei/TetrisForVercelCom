import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // Middleware for parsing JSON in requests

// Middleware for requests logging:
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Serve the static files from the Vue app
app.use(express.static(path.join(__dirname, '../dist')));

// API endpoint:
const filePath = path.join(__dirname, 'data.json');

// GET endpoint for retrieving data from the file
app.get('/api/handleData', (req, res) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Error reading file' });
      return;
    }
    try {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch (parseErr) {
      res.status(500).json({ error: 'Error parsing JSON' });
    }
  });
});

// POST endpoint for updating data in the file
app.post('/api/handleData', (req, res) => {
  const newData = req.body;

  fs.writeFile(filePath, JSON.stringify(newData, null, 2), 'utf8', (err) => {
    if (err) {
      res.status(500).json({ error: 'Error writing to file' });
      return;
    }
    res.status(200).json({ message: 'File updated successfully' });
  });
});

// Fallback to index.html for other requests:
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
