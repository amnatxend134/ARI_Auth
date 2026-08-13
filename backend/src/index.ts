import express from 'express';
import 'dotenv/config';
import http from 'http';
import cors from 'cors';

import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use(notFound);
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 5000;

async function start(): Promise<void> {
  await connectDB();
  server.listen(PORT, '0.0.0.0', () => {console.log(`Server running on port ${PORT}`);});
}

start();
