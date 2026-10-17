import dotenv from "dotenv";

dotenv.config();

const db_host = process.env.LOCAL_DB_HOST!;
const db_port = process.env.LOCAL_DB_PORT! as unknown as number;
const db_user = process.env.REMOTE_DB_USER!;
const db_password = process.env.REMOTE_DB_PASSWORD!;
const db_name = process.env.REMOTE_DB_NAME!;

for (const [key, value] of Object.entries({
  db_host,
  db_port,
  db_user,
  db_password,
  db_name,
})) {
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
}

export { db_host, db_port, db_user, db_password, db_name };
