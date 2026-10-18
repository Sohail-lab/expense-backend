import { Request, Response } from "express";
import crypto from "crypto";
import { LOG } from "../helpers/helper.js";
import {
    getUserByEmail,
    getUserByGoogleId,
    updateUserGoogleId,
    updateUserSession
} from "../queries/authQueries.js";
import { createGoogleUser, createUser } from "../queries/userQueries.js";

interface AuthenticatedRequest extends Request {
    userId?: number;
}

export const login = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const { email, password } = req.body;

        const user = await getUserByEmail(email);
        if (!user || user.length === 0) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        const passwordValid = password === user[0].password;
        if (!passwordValid) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        const sessionId = crypto.randomBytes(8).toString("hex");
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await updateUserSession(user[0].user_id, sessionId, expiresAt);

        return res.status(200).json({
            message: "Login successful",
            sessionId,
            expiresAt,
            userId: user[0].user_id
        });
    } catch (error: any) {
        LOG("Login error", true, error);
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
};

export const logout = async (req: AuthenticatedRequest, res: Response): Promise<Response | void> => {
    try {
        const userId = req.userId as number;

        await updateUserSession(userId, null, null);

        return res.status(200).json({
            message: "Logout successful"
        });
    } catch (error) {
        return res.status(500).json({
            error: "Logout failed"
        });
    }
};

export const signUp = async (req: Request, res: Response): Promise<Response | void> => {
        try {
            const { name, email, password } = req.body;
            const result = await createUser(name, email, password);
            res.status(201).json({ message: "Create user succeeded", result });
        } catch (error: any) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    };

export const googleAuth = async (req: Request, res: Response): Promise<Response | void> => {
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

        const googleData = (await googleRes.json()) as any;
        const googleId: string = googleData.sub;
        const email: string = googleData.email;
        const name: string = googleData.name ?? email.split("@")[0];

        if (!googleId || !email) {
            return res.status(401).json({
                error: "Could not retrieve user info from token"
            });
        }

        // 2. Find user by google_id first, then fall back to email
        let userRows = await getUserByGoogleId(googleId);

        if (!userRows || userRows.length === 0) {
            userRows = await getUserByEmail(email);

            if (userRows && userRows.length > 0) {
                // Link Google account to existing email user
                await updateUserGoogleId(userRows[0].user_id, googleId);
            } else {
                // Register new Google-authenticated user
                await createGoogleUser(name, email, googleId);
                userRows = await getUserByGoogleId(googleId);
            }
        }

        const user = userRows[0];

        // 3. Generate session
        const sessionId = crypto.randomBytes(8).toString("hex");
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await updateUserSession(user.user_id, sessionId, expiresAt);

        return res.status(200).json({
            message: "Login successful",
            sessionId,
            expiresAt,
            email,
            userId: user.user_id
        });
    } catch (error: any) {
        LOG("Google login error", true, error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};