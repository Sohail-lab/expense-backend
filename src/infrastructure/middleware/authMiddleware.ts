import { Request, Response, NextFunction } from 'express';
import { db } from '../database/db.js';
import { LOG } from '../database/helper.js';

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        const [scheme, sessionId] = authHeader.split(' ');

        if (scheme !== 'Bearer' || !sessionId) {
            res.status(401).json({ error: 'Invalid authentication header' });
            return;
        }

        const [rows]: any = await db.execute(
            `SELECT user_id, session_expires_at FROM users WHERE session_id = ?`,
            [sessionId]
        );

        if (rows.length === 0) {
            res.status(401).json({ error: 'Invalid session' });
            return;
        }

        const user = rows[0];

        // Check expiry
        if (
            !user.session_expires_at ||
            new Date(user.session_expires_at) <= new Date()
        ) {
            res.status(401).json({ error: 'Session expired' });
            return;
        }

        (req as any).userId = user.user_id;
        next();
    } catch (error) {
        LOG('Authentication error', true, error);
        res.status(500).json({ error: 'Authentication failed' });
    }
};

export const secureAuthenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        const [scheme, sessionId] = authHeader.split(' ');

        if (scheme !== 'Bearer' || !sessionId) {
            res.status(401).json({ error: 'Invalid authentication header' });
            return;
        }

        const [rows]: any = await db.execute(
            `SELECT user_id, session_expires_at, super_user FROM users WHERE session_id = ?`,
            [sessionId]
        );

        if (rows.length === 0) {
            res.status(401).json({ error: 'Invalid session' });
            return;
        }

        const user = rows[0];

        // Check expiry
        if (
            !user.session_expires_at ||
            new Date(user.session_expires_at) <= new Date()
        ) {
            res.status(401).json({ error: 'Session expired' });
            return;
        }

        if (user.super_user === 0) {
            res.status(403).json({ error: 'Super User Access Required' });
            return;
        }

        (req as any).userId = user.user_id;
        next();
    } catch (error) {
        LOG('Authentication error', true, error);
        res.status(500).json({ error: 'Authentication failed' });
    }
};
