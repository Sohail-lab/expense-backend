import { Request, Response } from 'express';
import { UserModel } from '../models/UserModel.js';
import { UserPresenter } from '../presenters/UserPresenter.js';

const userPresenter = new UserPresenter(new UserModel());

export const userView = {
    getUserIdByEmail: async (req: Request, res: Response) => {
        try {
            const email = req.query.email as string;
            if (!email) {
                res.status(400).json({ error: 'Email is required' });
                return;
            }

            const rows = await userPresenter.getUserIdByEmail(email);
            res.status(200).json(rows);
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Internal Server Error' });
        }
    },

    getUserDetails: async (req: Request, res: Response) => {
        try {
            const userId = Number(req.params.id);
            if (isNaN(userId)) {
                res.status(400).json({ error: 'Invalid user ID' });
                return;
            }

            const user = await userPresenter.getUserDetails(userId);
            res.status(200).json(user);
        } catch (error: any) {
            res.status(404).json({ error: error.message || 'User not found' });
        }
    },

    createUser: async (req: Request, res: Response) => {
        try {
            const { name, email, password } = req.body;
            const result = await userPresenter.createUser(name, email, password);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message || 'Failed to create user' });
        }
    },

    updateUser: async (req: Request, res: Response) => {
        try {
            const userId = Number(req.params.id);
            if (isNaN(userId)) {
                res.status(400).json({ error: 'Invalid user ID' });
                return;
            }

            const result = await userPresenter.updateUser(userId, req.body);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message || 'Failed to update user' });
        }
    },

    deleteUser: async (req: Request, res: Response) => {
        try {
            const userId = Number(req.params.id);
            const { superUserId } = req.body;
            if (isNaN(userId)) {
                res.status(400).json({ error: 'Invalid user ID' });
                return;
            }

            const result = await userPresenter.deleteUser(userId, superUserId);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(403).json({ error: error.message || 'Failed to delete user' });
        }
    }
};
