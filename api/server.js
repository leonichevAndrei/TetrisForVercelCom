import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import lockFile from 'lockfile';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
// Middleware for requests logging:
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Serve the static files from the Vue app
app.use(express.static(path.join(__dirname, '../dist')));

// API endpoint:
const filePath = path.join(__dirname, 'data.json');
const lockPath = filePath + '.lock';
const retriesValue = 50;
const delayValue = 20;

const withRetry = (fn, retries = retriesValue, delay = delayValue) => {
  return new Promise((resolve, reject) => {
    const attempt = () => {
      fn()
        .then(resolve)
        .catch((err) => {
          if (retries === 0) {
            reject(err);
          } else {
            retries -= 1;
            setTimeout(attempt, delay);
          }
        });
    };
    attempt();
  });
};

app.get('/api/handleData', (req, res) => {
  withRetry(
    () =>
      new Promise((resolve, reject) => {
        lockFile.lock(lockPath, { wait: 1000 }, (err) => {
          if (err) {
            return reject(new Error('Could not acquire lock'));
          }
          fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
              lockFile.unlock(lockPath, (unlockErr) => {
                if (unlockErr) console.error('Error unlocking file:', unlockErr);
              });
              return reject(new Error('Error reading file'));
            }
            try {
              const jsonData = JSON.parse(data);
              res.json(jsonData);
              lockFile.unlock(lockPath, (unlockErr) => {
                if (unlockErr) console.error('Error unlocking file:', unlockErr);
              });
              resolve();
            } catch (parseErr) {
              lockFile.unlock(lockPath, (unlockErr) => {
                if (unlockErr) console.error('Error unlocking file:', unlockErr);
              });
              return reject(new Error('Error parsing JSON'));
            }
          });
        });
      })
  ).catch((err) => {
    res.status(500).json({ error: err.message });
  });
});

// Fallback to index.html for other requests:
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
