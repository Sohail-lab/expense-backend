import { Request, Response } from 'express';
import { UserService } from '../../application/services/UserService.js';
import { LOG } from '../../infrastructure/database/helper.js';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    /**
     * Get user ID by email
     */
    async getUserIdByEmail(req: Request, res: Response): Promise<void> {
        try {
            const email = req.query.email as string;

            if (!email) {
                res.status(400).json({ error: 'Email is required' });
                return;
            }

            const rows = await this.userService.getUserIdByEmail(email);
            res.status(200).json(rows);
        } catch (error: any) {
            LOG('Error fetching user by email', true, error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    /**
     * Get user details by ID
     */
    async getUserDetails(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({ error: 'Invalid user ID' });
                return;
            }

            const user = await this.userService.getUserDetails(id);
            res.status(200).json(user);
        } catch (error: any) {
            LOG(`Error fetching user details with id = ${req.params.id}`, true, error);
            res.status(404).json({ error: error.message || 'User not found' });
        }
    }

    /**
     * Create a new user
     */
    async createUser(req: Request, res: Response): Promise<void> {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                res.status(400).json({ error: 'Name, email, and password are required' });
                return;
            }

            const result = await this.userService.createUser({ name, email, password });
            res.status(201).json(result);
        } catch (error: any) {
            LOG('Error creating user', true, error);
            res.status(400).json({ error: error.message || 'Failed to create user' });
        }
    }

    /**
     * Update user details
     */
    async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            const newData = req.body;

            if (isNaN(id)) {
                res.status(400).json({ error: 'Invalid user ID' });
                return;
            }

            const result = await this.userService.updateUser(id, newData);
            res.status(200).json(result);
        } catch (error: any) {
            LOG(`Error updating user ${req.params.id}`, true, error);
            res.status(400).json({ error: error.message || 'Failed to update user' });
        }
    }

    /**
     * Delete a user
     */
    async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            const { superUserId } = req.body;

            if (isNaN(id)) {
                res.status(400).json({ error: 'Invalid user ID' });
                return;
            }

            if (!superUserId) {
                res.status(400).json({ error: 'Super user ID is required' });
                return;
            }

            const result = await this.userService.deleteUser(id, superUserId);
            res.status(200).json(result);
        } catch (error: any) {
            LOG(`Error deleting user ${req.params.id}`, true, error);
            res.status(403).json({ error: error.message || 'Failed to delete user' });
        }
    }
}
