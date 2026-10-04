import { Router } from "express";
import { executeQuery, LOG } from "../helpers/helper.js";
import { getUserByEmail, updateUserSession } from '../queries/authQueries.js';
import { authenticate } from '../middleware/auth.js';
import crypto from 'crypto';

export const createAuthRouter = () => {
    const router = Router();

    router.post('/login', async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await getUserByEmail(email);
            if (!user) {
                return res.status(401).json({
                    error: "Invalid email or password"
                });
            }

            const passwordValid = password == user[0].password;

            if (!passwordValid) {
                return res.status(401).json({
                    error: "Invalid email or password"
                });
            }

            const sessionId = crypto.randomBytes(8).toString("hex");

            const expiresAt = new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
            );

            await updateUserSession(
                user[0].user_id,
                sessionId,
                expiresAt
            );

            res.status(200).json({
                message: "Login successful",
                sessionId,
                expiresAt,
                userId: user.user_id
            });
        } catch (error: any) {
            LOG("Login error", true, error);

            res.status(500).json({
                error: "Internal Server Error"
            });
        }
    });

    router.post("/logout", authenticate, async (req, res) => {
        try {
            const userId = (req as any).userId;

            await updateUserSession(userId, null, null);

            res.status(200).json({
                message: "Logout successful"
            });

        } catch (error) {
            res.status(500).json({
                error: "Logout failed"
            });
        }
    });

    return router;
};