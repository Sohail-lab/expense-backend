import express from 'express';
import { db } from './db/db.js';
import { createRoutes } from './routes/routes.js';

const app = express();

app.use(express.json());

app.use(createRoutes());

app.listen(3000, "0.0.0.0", async () => {
    console.log('Server is running on port 3000');
});

