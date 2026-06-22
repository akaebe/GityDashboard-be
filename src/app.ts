import express from 'express';
import cors from 'cors';
import logRoutes from './routes/log.routes';

const app = express();

// Set high limit for bulk JSON payloads up to 10,000 records
app.use(express.json({ limit: '10mb' }));
app.use(cors());

app.use('/api/logs', logRoutes);

export default app;