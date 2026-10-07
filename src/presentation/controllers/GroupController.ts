import { Request, Response } from 'express';
import { GroupService } from '../../application/services/GroupService.js';
import { LOG } from '../../infrastructure/database/helper.js';

export class GroupController {
    private groupService: GroupService;

    constructor() {
        this.groupService = new GroupService();
    }

    /**
     * Get all groups
     */
    async getAllGroups(req: Request, res: Response): Promise<void> {
        try {
            const rows = await this.groupService.getAllGroups();
            res.status(200).json(rows);
        } catch (error: any) {
            LOG('Error fetching all groups', true, error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    /**
     * Get groups for a specific user
     */
    async getUserGroups(req: Request, res: Response): Promise<void> {
        try {
            const uid = Number(req.params.uid);

            if (isNaN(uid)) {
                res.status(400).json({ error: 'Invalid user ID' });
                return;
            }

            const rows = await this.groupService.getUserGroups(uid);
            res.status(200).json(rows);
        } catch (error: any) {
            LOG('Error fetching groups for user', true, error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    /**
     * Create a new group
     */
    async createGroup(req: Request, res: Response): Promise<void> {
        try {
            const { name, userId } = req.body;

            if (!name || !userId) {
                res.status(400).json({ error: 'Name and userId are required' });
                return;
            }

            const result = await this.groupService.createGroup({ name, userId });
            res.status(201).json(result);
        } catch (error: any) {
            LOG('Error creating group', true, error);
            res.status(400).json({ error: error.message || 'Failed to create group' });
        }
    }

    /**
     * Join a group by code
     */
    async joinGroup(req: Request, res: Response): Promise<void> {
        try {
            const { userId, groupCode } = req.body;

            if (!userId || !groupCode) {
                res.status(400).json({ error: 'userId and groupCode are required' });
                return;
            }

            const result = await this.groupService.joinGroup(groupCode, userId);
            res.status(200).json(result);
        } catch (error: any) {
            LOG('Error joining group', true, error);
            res.status(404).json({ error: error.message || 'Failed to join group' });
        }
    }
}
