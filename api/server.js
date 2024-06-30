import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { initializeApp } 


from 'firebase/app';
import { getDatabase, ref, get, set } from 'firebase/database';
import admin from 'firebase-admin';

// Get the current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import service account JSON file with assertion
const serviceAccount = await import(
  path.resolve(__dirname, 'serviceAccountKey.json'),
  {
    assert: { type: 'json' },
  }
);

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAWvScjjrF5h8AdyWtepnKu1bndH4_kHvQ',
  authDomain: 'leonichevtetrisdb.firebaseapp.com',
  projectId: 'leonichevtetrisdb',
  storageBucket: 'leonichevtetrisdb.appspot.com',
  messagingSenderId: '535945416783',
  appId: '1:535945416783:web:5a4086a95807f91ebe9a3a',
  databaseURL: 'https://leonichevtetrisdb-default-rtdb.firebaseio.com/',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount.default),
  databaseURL: firebaseConfig.databaseURL,
});

const server = express();
const port = process.env.PORT || 3000;

server.use(cors());
server.use(express.json()); // Middleware for parsing JSON in requests

// Middleware for requests logging:
server.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Serve the static files from the Vue app
server.use(express.static(path.join(__dirname, '../dist')));

// API endpoint:
const dataRef = ref(database, 'data');

// GET endpoint for retrieving data from the Firebase
server.get('/api/handleData', (req, res) => {
  get(dataRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        res.json(snapshot.val());
      } else {
        res.status(404).json({ error: 'No data available' });
      }
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error: 'Error reading data from Firebase', details: error });
    });
});

// POST endpoint for updating data in the Firebase
server.post('/api/handleData', (req, res) => {
  const newData = req.body;

  set(dataRef, newData)
    .then(() => {
      res.status(200).json({ message: 'Data updated successfully' });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error: 'Error writing data to Firebase', details: error });
    });
});

// Fallback to index.html for other requests:
server.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
