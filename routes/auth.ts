import { Router } from "express";
import { executeQuery, LOG } from "../helpers/helper.js";
import { getUserByEmail, updateUserSession } from '../queries/authQueries.js';
import { createGoogleUser } from '../queries/userQueries.js';
import { authenticate } from '../middleware/auth.js';
import { getUserByGoogleId, updateUserGoogleId } from '../queries/authQueries.js';
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

            // 1. Verify token with Google
            const googleRes = await fetch(
                `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
            );

            if (!googleRes.ok) {
                return res.status(401).json({ error: "Invalid Google token" });
            }

            const googleData = await googleRes.json() as any;

            const googleId: string = googleData.sub;   // ← unique, permanent Google ID
            const email: string = googleData.email;
            const name: string = googleData.name ?? email.split('@')[0];

            if (!googleId || !email) {
                return res.status(401).json({ error: "Could not retrieve user info from token" });
            }

            // 2. Find user by google_id first, then fall back to email
            let userRows = await getUserByGoogleId(googleId);

            if (!userRows || userRows.length === 0) {
                // Check if they already have an account with this email (email/password signup)
                userRows = await getUserByEmail(email);

                if (userRows && userRows.length > 0) {
                    // Existing email user — link their Google ID
                    await updateUserGoogleId(userRows[0].user_id, googleId);
                } else {
                    // Brand new user — create account with google_id, no password
                    await createGoogleUser(name, email, googleId);
                    userRows = await getUserByGoogleId(googleId);
                }
            }

            const user = userRows[0];

            // 3. Generate session (same as /login)
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