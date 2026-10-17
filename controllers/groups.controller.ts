import { Request, Response } from "express";
import { executeQuery, LOG } from "../helpers/helper.js";
import getAllGroupsQuery from "../db/queries/group_queries/getAllGroups.sql";
import getCurrentUserGroupsQuery from "../db/queries/group_queries/getCurrentUserGroups.sql";

export const getAllGroups = async (req: Request, res: Response) => {
  try {
    const rows = await executeQuery(getAllGroupsQuery);
    res.status(200).json(rows);
  } catch (error: any) {
    LOG("Error fetching groups", true, error);
    res.status(500).json({ error: error.message });
  }
};

export const getCurrentUserGroups = async (req: Request, res: Response) => {
  try {
    const uid = Number(req.params.uid);
    const rows = await executeQuery(getCurrentUserGroupsQuery, [uid]);
    res.status(200).json(rows);
  } catch (error: any) {
    LOG("Error fetching groups for user", true, error);
    res.status(500).json({ error: error.message });
  }
};
