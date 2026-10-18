import { IGroup } from "../models/group.model";

function userGroupResponse(g: IGroup) {
    return {
        Name: g.name,
        Code: g.group_code,
        JoinDate: g.join_date,
        CreatedBy: g.created_by,
        CreatedAt: g.created_at,
        UpdatedAt: g.updated_at
    }
}

function groupResponse(g: IGroup) {
    return {
        Name: g.name,
        Code: g.group_code,
        Id: g.group_id,
        CreatedBy: g.created_by,
        CreatedAt: g.created_at,
        UpdatedAt: g.updated_at
    }
}

export function listGroupResponse(groupList: IGroup[]) {
    return groupList.map(groupResponse);
}

export function listUserGroupResponse(groupList: IGroup[]) {
    return groupList.map(userGroupResponse);
}