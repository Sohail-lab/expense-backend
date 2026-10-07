import crypto from 'crypto';
import { executeQuery, executeTransaction, LOG } from '../../infrastructure/database/helper.js';

interface LoginCredentials {
    email: string;
    password: string;
}

interface GoogleAuthData {
    idToken: string;
}

export class AuthService {
    private readonly SESSION_EXPIRY_DAYS = 7;

    /**
     * Login user with email and password
     */
    async login(credentials: LoginCredentials) {
        const { email, password } = credentials;

        const users = await executeQuery(
            `SELECT * FROM users WHERE email = ?;`,
            [email]
        );

        if (!users || users.length === 0) {
            throw new Error('Invalid email or password');
        }

        const user = users[0];
        const passwordValid = password === user.password;

        if (!passwordValid) {
            throw new Error('Invalid email or password');
        }

        // Generate session
        const sessionId = crypto.randomBytes(8).toString('hex');
        const expiresAt = new Date(Date.now() + this.SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

        await executeQuery(
            `UPDATE users SET session_id = ?, session_expires_at = ? WHERE user_id = ?`,
            [sessionId, expiresAt, user.user_id]
        );

        return {
            message: 'Login successful',
            sessionId,
            expiresAt,
            userId: user.user_id,
        };
    }

    /**
     * Logout user by clearing session
     */
    async logout(userId: number) {
        await executeQuery(
            `UPDATE users SET session_id = ?, session_expires_at = ? WHERE user_id = ?`,
            [null, null, userId]
        );

        return { message: 'Logout successful' };
    }

    /**
     * Authenticate with Google OAuth
     */
    async authenticateWithGoogle(authData: GoogleAuthData) {
        const { idToken } = authData;

        if (!idToken) {
            throw new Error('Missing idToken');
        }

        // Verify token with Google
        const googleRes = await fetch(
            `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
        );

        if (!googleRes.ok) {
            throw new Error('Invalid Google token');
        }

        const googleData = await googleRes.json() as any;
        const googleId: string = googleData.sub;
        const email: string = googleData.email;
        const name: string = googleData.name ?? email.split('@')[0];

        if (!googleId || !email) {
            throw new Error('Could not retrieve user info from token');
        }

        // Find user by google_id first
        let userRows = await executeQuery(
            `SELECT * FROM users WHERE google_id = ?;`,
            [googleId]
        );

        if (!userRows || userRows.length === 0) {
            // Check if they already have an account with this email
            userRows = await executeQuery(
                `SELECT * FROM users WHERE email = ?;`,
                [email]
            );

            if (userRows && userRows.length > 0) {
                // Link their Google ID to existing account
                await executeQuery(
                    `UPDATE users SET google_id = ? WHERE user_id = ?;`,
                    [googleId, userRows[0].user_id]
                );
            } else {
                // Create new user with Google ID
                await executeTransaction(
                    `INSERT INTO users (name, email, google_id, password, super_user) VALUES (?, ?, ?, '', FALSE);`,
                    [name, email, googleId]
                );
                userRows = await executeQuery(
                    `SELECT * FROM users WHERE google_id = ?;`,
                    [googleId]
                );
            }
        }

        const user = userRows[0];

        // Generate session
        const sessionId = crypto.randomBytes(8).toString('hex');
        const expiresAt = new Date(Date.now() + this.SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

        await executeQuery(
            `UPDATE users SET session_id = ?, session_expires_at = ? WHERE user_id = ?`,
            [sessionId, expiresAt, user.user_id]
        );

        return {
            message: 'Login successful',
            sessionId,
            expiresAt,
            userId: user.user_id,
        };
    }
}
