import express from 'express';
import cors from 'cors';
import logRoutes from './routes/log.routes';
import compression from 'compression';

const app = express();

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(cors());

app.use('/api/logs', logRoutes);

export default app;