import { IGroup } from "../models/group.model";

function groupDetails(g: IGroup) {
    return {
        group_id: g.group_id,
        name: g.name,
        user_id: g.user_id,
        group_code: g.group_code,
        created_at: g.created_at,
        updated_at: g.updated_at,
        created_by: g.created_by,
        join_date: g.join_date
    }
}

export function showMessage(message: string, groupCode?: string) {
    return {
        message: message,
        ...(groupCode && { group_code: groupCode })
    }
}

export function listGroupDetails(groupList: IGroup[]) {
    return groupList.map(groupDetails);
}