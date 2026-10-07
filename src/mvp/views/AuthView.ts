import { Request, Response } from 'express';
import { AuthPresenter } from '../presenters/AuthPresenter.js';
import { AuthModel } from '../models/AuthModel.js';

const authPresenter = new AuthPresenter(new AuthModel());

export const authView = {
    login: async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({ error: 'Email and password are required' });
                return;
            }

            const result = await authPresenter.login(email, password);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(401).json({ error: error.message || 'Login failed' });
        }
    },

    logout: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId;
            if (!userId) {
                res.status(401).json({ error: 'User not authenticated' });
                return;
            }

            const result = await authPresenter.logout(userId);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ error: 'Logout failed' });
        }
    },

    googleLogin: async (req: Request, res: Response) => {
        try {
            const { idToken } = req.body;
            const result = await authPresenter.loginWithGoogle(idToken);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(401).json({ error: error.message || 'Google authentication failed' });
        }
    }
};
