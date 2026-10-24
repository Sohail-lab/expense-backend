export interface IUser {
  user_id: number;
  name: string;
  email: string;
  password: string;
  super_user: number;
  created_at: string;
  updated_at: string;
  session_id: string;
  session_expires_at: string;
  google_id: string;
}
