import express from 'express';
import { createRoutes } from './src/mvp/routes/index.js';

const app = express();

app.use(express.json());
app.use(createRoutes());

app.listen(3000, '0.0.0.0', () => {
    console.log('Server is running on port 3000');
});
