import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import flowusRouter from './routes/flowus.js';
import exportRouter from './routes/export.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Improved CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5177', 'http://127.0.0.1:5173'],
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('Health check request received');
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Simple test endpoint
app.get('/api/test', (req, res) => {
  console.log('Test endpoint called');
  res.json({ 
    success: true, 
    message: 'API is working',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/flowus', flowusRouter);
app.use('/api/export', exportRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API test: http://localhost:${PORT}/api/test`);
  console.log(`Export API: http://localhost:${PORT}/api/export/papers`);
});
