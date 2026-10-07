import { UserModel } from '../models/UserModel.js';

export class UserPresenter {
    constructor(private model: UserModel) {}

    async getUserIdByEmail(email: string) {
        return await this.model.getUserIdByEmail(email);
    }

    async getUserDetails(userId: number) {
        const users = await this.model.getUserDetails(userId);

        if (!users || users.length === 0) {
            throw new Error('User not found');
        }

        return users[0];
    }

    async createUser(name: string, email: string, password: string) {
        if (!name || !email || !password) {
            throw new Error('Name, email, and password are required');
        }

        if (!email.includes('@')) {
            throw new Error('Invalid email format');
        }

        const existingUsers = await this.model.getUserIdByEmail(email);
        if (existingUsers && existingUsers.length > 0) {
            throw new Error('Email already registered');
        }

        await this.model.createUser(name, email, password);
        return { message: 'Create user succeeded' };
    }

    async updateUser(userId: number, newData: any) {
        const oldData = await this.model.getUserDetails(userId);
        if (!oldData || oldData.length === 0) {
            throw new Error('User not found');
        }

        const user = oldData[0];
        const name = newData.name ?? user.name;
        const password = newData.password ?? user.password;

        await this.model.updateUser(userId, name, password);
        return { message: 'Update user succeeded' };
    }

    async deleteUser(userId: number, superUserId: number) {
        const isSuperUser = await this.model.isSuperUser(superUserId);
        if (!isSuperUser) {
            throw new Error('User not authorized');
        }

        await this.model.deleteUser(userId);
        return { message: `Deleted user ${userId}` };
    }
}
