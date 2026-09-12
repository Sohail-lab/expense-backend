import express from 'express';
import { db } from './db.js';
import { createRoutes } from './routes.js';

const app = express();

app.use(express.json());

app.use(createRoutes(db));

app.listen(3000, "0.0.0.0", async () => {
    console.log('Server is running on port 3000');
});

