import { Request, Response, NextFunction } from "express";
import { db } from "../db/db.js";

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                error: "Authentication required"
            });
        }

        const [scheme, sessionId] = authHeader.split(" ");

        if (scheme !== "Bearer" || !sessionId) {
            return res.status(401).json({
                error: "Invalid authentication header"
            });
        }

        const [rows]: any = await db.execute(
            `
            SELECT user_id, session_expires_at
            FROM users
            WHERE session_id = ?
            `,
            [sessionId]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                error: "Invalid session"
            });
        }

        const user = rows[0];

        // Check expiry
        if (
            !user.session_expires_at ||
            new Date(user.session_expires_at) <= new Date()
        ) {
            return res.status(401).json({
                error: "Session expired"
            });
        }

        // Authentication successful
        (req as any).userId = user.user_id;

        next();

    } catch (error) {
        console.error("Authentication error:", error);

        return res.status(500).json({
            error: "Authentication failed"
        });
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
            return res.status(401).json({
                error: "Authentication required"
            });
        }

        const [scheme, sessionId] = authHeader.split(" ");

        if (scheme !== "Bearer" || !sessionId) {
            return res.status(401).json({
                error: "Invalid authentication header"
            });
        }

        const [rows]: any = await db.execute(
            `
            SELECT user_id, session_expires_at, super_user
            FROM users
            WHERE session_id = ?
            `,
            [sessionId]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                error: "Invalid session"
            });
        }

        const user = rows[0];

        // Check expiry
        if (
            !user.session_expires_at ||
            new Date(user.session_expires_at) <= new Date()
        ) {
            return res.status(401).json({
                error: "Session expired"
            });
        }

        if (user.super_user === 0) {
            return res.status(403).json({
                error: "Super User Access Required"
            });
        }

        // Authentication successful
        (req as any).userId = user.user_id;

        next();

    } catch (error) {
        console.error("Authentication error:", error);

        return res.status(500).json({
            error: "Authentication failed"
        });
    }
};