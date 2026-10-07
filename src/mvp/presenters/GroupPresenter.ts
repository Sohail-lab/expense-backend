import { GroupModel } from '../models/GroupModel.js';
import { generateUniqueGroupCode } from '../../infrastructure/database/helper.js';

export class GroupPresenter {
    constructor(private model: GroupModel) {}

    async getAllGroups() {
        return await this.model.getAllGroups();
    }

    async getUserGroups(userId: number) {
        return await this.model.getUserGroups(userId);
    }

    async createGroup(name: string, userId: number) {
        if (!name || name.trim().length === 0) {
            throw new Error('Group name is required');
        }

        const groupCode = await generateUniqueGroupCode();
        await this.model.createGroup(name, userId, groupCode);

        return { message: 'Create group success', joinCode: groupCode };
    }

    async joinGroup(userId: number, groupCode: string) {
        if (!groupCode) {
            throw new Error('Group code is required');
        }

        const groupRows = await this.model.getGroupByCode(groupCode);
        if (!groupRows || groupRows.length === 0) {
            throw new Error(`No group exists with code = ${groupCode}`);
        }

        const group = groupRows[0];
        await this.model.addUserToGroup(group.group_id, group.name, userId, group.group_code, group.created_at, group.created_by);

        return { message: 'User added to group successfully' };
    }
}
