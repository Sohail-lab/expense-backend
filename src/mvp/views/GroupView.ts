import { Request, Response } from 'express';
import { GroupModel } from '../models/GroupModel.js';
import { GroupPresenter } from '../presenters/GroupPresenter.js';

const groupPresenter = new GroupPresenter(new GroupModel());

export const groupView = {
    getAllGroups: async (_req: Request, res: Response) => {
        try {
            const rows = await groupPresenter.getAllGroups();
            res.status(200).json(rows);
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Internal Server Error' });
        }
    },

    getUserGroups: async (req: Request, res: Response) => {
        try {
            const userId = Number(req.params.uid);
            const rows = await groupPresenter.getUserGroups(userId);
            res.status(200).json(rows);
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Internal Server Error' });
        }
    },

    createGroup: async (req: Request, res: Response) => {
        try {
            const { name, userId } = req.body;
            const result = await groupPresenter.createGroup(name, userId);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message || 'Failed to create group' });
        }
    },

    joinGroup: async (req: Request, res: Response) => {
        try {
            const { userId, groupCode } = req.body;
            const result = await groupPresenter.joinGroup(userId, groupCode);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(404).json({ error: error.message || 'Failed to join group' });
        }
    }
};
