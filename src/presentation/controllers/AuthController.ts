import { Request, Response } from 'express';
import { AuthService } from '../../application/services/AuthService.js';
import { LOG } from '../../infrastructure/database/helper.js';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    /**
     * Handle login request
     */
    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                res.status(400).json({ error: 'Email and password are required' });
                return;
            }

            const result = await this.authService.login({ email, password });
            res.status(200).json(result);
        } catch (error: any) {
            LOG('Login error', true, error);
            res.status(401).json({ error: error.message || 'Login failed' });
        }
    }

    /**
     * Handle logout request
     */
    async logout(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).userId;

            if (!userId) {
                res.status(401).json({ error: 'User not authenticated' });
                return;
            }

            const result = await this.authService.logout(userId);
            res.status(200).json(result);
        } catch (error: any) {
            LOG('Logout error', true, error);
            res.status(500).json({ error: 'Logout failed' });
        }
    }

    /**
     * Handle Google OAuth login
     */
    async authenticateWithGoogle(req: Request, res: Response): Promise<void> {
        try {
            const { idToken } = req.body;

            if (!idToken) {
                res.status(400).json({ error: 'Missing idToken' });
                return;
            }

            const result = await this.authService.authenticateWithGoogle({ idToken });
            res.status(200).json(result);
        } catch (error: any) {
            LOG('Google login error', true, error);
            res.status(401).json({ error: error.message || 'Google authentication failed' });
        }
    }
}
