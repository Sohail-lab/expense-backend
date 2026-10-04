import { Router } from "express";
import { executeQuery, LOG } from "../helpers/helper.js";
import { getUserByEmail, updateUserSession } from '../queries/authQueries.js';
import { createUser } from '../queries/userQueries.js';
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

    router.post('/google', async (req, res) => {
        try {
            const { idToken } = req.body;

            if (!idToken) {
                return res.status(400).json({ error: "Missing idToken" });
            }

            // 1. Verify the token with Google's tokeninfo endpoint (no extra packages needed)
            const googleRes = await fetch(
                `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
            );

            if (!googleRes.ok) {
                return res.status(401).json({ error: "Invalid Google token" });
            }

            const googleData = await googleRes.json() as any;

            // 2. Extract user info from the verified token
            const email: string = googleData.email;
            const name: string = googleData.name ?? email.split('@')[0];

            if (!email) {
                return res.status(401).json({ error: "Could not retrieve email from token" });
            }

            // 3. Find existing user, or create a new one
            let userRows = await getUserByEmail(email);

            if (!userRows || userRows.length === 0) {
                // New Google user — create account (no password)
                await createUser(name, email, '');
                userRows = await getUserByEmail(email);
            }

            const user = userRows[0];

            // 4. Generate session (same as /login)
            const sessionId = crypto.randomBytes(8).toString("hex");
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

            await updateUserSession(user.user_id, sessionId, expiresAt);

            return res.status(200).json({
                message: "Login successful",
                sessionId,
                expiresAt,
                userId: user.user_id,
            });

        } catch (error: any) {
            LOG("Google login error", true, error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    });


    return router;
};