import type { Pool, RowDataPacket } from "mysql2/promise";

export type Database = Pool;

export interface User extends RowDataPacket {
	id: number;
	name: string;
	email: string;
}
