import { Connection, Types } from "mongoose";
import { user_profile } from ".";

declare module "express-serve-static-core" {
  export interface Request {
    user?: user_profile | { user_id: string; email: string; }
  }
}
