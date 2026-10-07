import { Router } from 'express';
import { LOG } from '../../infrastructure/database/helper.js';
import { checkDBConnection } from '../../infrastructure/database/db.js';
import { createTables, deleteTables, insertTestData } from '../../test/test.js';
import { secureAuthenticate } from '../../infrastructure/middleware/authMiddleware.js';

const router = Router();

router.get('/', secureAuthenticate, async (req, res) => {
    try {
        const result = await checkDBConnection();
        res.json(result);
    } catch (error: any) {
        LOG('Error checking DB connection', true, error);
        res.status(500).json({ error: 'Database connection check failed' });
    }
});

router.get('/test-start', secureAuthenticate, async (req, res) => {
    try {
        const result = await createTables();
        res.json(result);
    } catch (error: any) {
        LOG('Error creating tables', true, error);
        res.status(500).json({ error: 'Failed to create tables' });
    }
});

router.get('/test-delete', secureAuthenticate, async (req, res) => {
    try {
        const result = await deleteTables();
        res.json(result);
    } catch (error: any) {
        LOG('Error deleting tables', true, error);
        res.status(500).json({ error: 'Failed to delete tables' });
    }
});

router.get('/insert-test-data', secureAuthenticate, async (req, res) => {
    try {
        const result = await insertTestData();
        res.json(result);
    } catch (error: any) {
        LOG('Error inserting test data', true, error);
        res.status(500).json({ error: 'Failed to insert test data' });
    }
});

export { router as testRoutes };
