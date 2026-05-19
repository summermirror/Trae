import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import flowusRouter from './routes/flowus.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/flowus', flowusRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
