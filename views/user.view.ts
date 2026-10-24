import { IUser } from "../models/user.model"

export function showMessage(message: string) {
    return {
        message: message,
    }
}

function userDetails(u: IUser) {
    return {
        user_id: u.user_id,
        ...u.name && { name: u.name },
        ...u.email && { email: u.email },
        ...u.password && { password: u.password },
        ...u.super_user && { super_user: u.super_user },
        ...u.created_at && { created_at: u.created_at },
        ...u.updated_at && { updated_at: u.updated_at },
        ...u.session_id && { session_id: u.session_id },
        ...u.session_expires_at && { session_expires_at: u.session_expires_at },
        ...u.google_id && { google_id: u.google_id }
    }
}

export function showUserDetails(userList: IUser[]) {
    return userList.map(userDetails);
}