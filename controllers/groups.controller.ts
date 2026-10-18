import { Request, Response } from "express";
import {
  executeQuery,
  executeTransaction,
  LOG,
  generateUniqueGroupCode,
} from "../helpers/helper.js";
import getAllGroupsQuery from "../db/queries/group_queries/getAllGroups.sql";
import getCurrentUserGroupsQuery from "../db/queries/group_queries/getCurrentUserGroups.sql";
import createGroupQuery from "../db/queries/group_queries/createGroup.sql";
import joinGroupQuery from "../db/queries/group_queries/joinGroup.sql";
import getGroupCodesQuery from "../db/queries/group_queries/getGroupCodes.sql";
import { IGroup } from "../models/group.model.js";
import {
  listGroupResponse,
  listUserGroupResponse,
} from "../views/group.view.js";
import { AuthenticatedRequest } from "../models/authRequest.model.js";

export const getAllGroups = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const rows: IGroup[] = await executeQuery(getAllGroupsQuery);
    res.status(200).json(listGroupResponse(rows));
  } catch (error: any) {
    LOG("Error fetching groups", true, error);
    res.status(500).json({ error: error.message });
  }
};

export const getCurrentUserGroups = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const uid = Number(req.params.uid);
    const rows: IGroup[] = await executeQuery(getCurrentUserGroupsQuery, [uid]);
    res.status(200).json(listUserGroupResponse(rows));
  } catch (error: any) {
    LOG("Error fetching groups for user", true, error);
    res.status(500).json({ error: error.message });
  }
};

export const createGroup = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, userId } = req.body;
    const groupCode = await generateUniqueGroupCode();
    await executeTransaction(createGroupQuery, [
      name,
      userId,
      groupCode,
      userId,
    ]);
    res.status(201).json({ message: "Create group success", joinCode: groupCode });
  } catch (error: any) {
    LOG("Error fetching groups for user", true, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const joinGroup = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId, groupCode } = req.body;
    await executeTransaction(joinGroupQuery, [userId, groupCode]);
    res.status(200).json({ message: "User added to group successfully" });
  } catch (error: any) {
    LOG("Error fetching groups for user", true, error);
    res.status(404).json({ error: error.message });
  }
};

export const updateGroup = async (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({ message: "Update group partially" });
};

export const deleteGroup = async (req: AuthenticatedRequest, res: Response) => {
  res.status(204).json({ message: "Delete group" });
};

export const getGroupCodes = () => executeQuery(getGroupCodesQuery);