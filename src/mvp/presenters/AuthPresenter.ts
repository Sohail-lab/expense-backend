import crypto from 'crypto';
import { AuthModel } from '../models/AuthModel.js';

export class AuthPresenter {
    constructor(private model: AuthModel) {}

    async login(email: string, password: string) {
        const users = await this.model.findUserByEmail(email);

        if (!users || users.length === 0) {
            throw new Error('Invalid email or password');
        }

        const user = users[0];
        if (password !== user.password) {
            throw new Error('Invalid email or password');
        }

        const sessionId = crypto.randomBytes(8).toString('hex');
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await this.model.updateUserSession(user.user_id, sessionId, expiresAt);

        return {
            message: 'Login successful',
            sessionId,
            expiresAt,
            userId: user.user_id,
        };
    }

    async logout(userId: number) {
        await this.model.updateUserSession(userId, null, null);
        return { message: 'Logout successful' };
    }

    async loginWithGoogle(idToken: string) {
        if (!idToken) {
            throw new Error('Missing idToken');
        }

        const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
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

        let userRows = await this.model.findUserByGoogleId(googleId);

        if (!userRows || userRows.length === 0) {
            userRows = await this.model.findUserByEmail(email);

            if (userRows && userRows.length > 0) {
                await this.model.linkGoogleIdToUser(userRows[0].user_id, googleId);
            } else {
                await this.model.createGoogleUser(name, email, googleId);
                userRows = await this.model.findUserByGoogleId(googleId);
            }
        }

        const user = userRows[0];
        const sessionId = crypto.randomBytes(8).toString('hex');
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await this.model.updateUserSession(user.user_id, sessionId, expiresAt);

        return {
            message: 'Login successful',
            sessionId,
            expiresAt,
            userId: user.user_id,
        };
    }
}
