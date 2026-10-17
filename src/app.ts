import express from 'express';
import { createRoutes } from '../routes/index.js';

const app = express();

app.use(express.json());

app.use(createRoutes());

export default app;