import { Request } from "express";

export interface RequestUser {
  id: string;
  isVerified: boolean
}

export interface RequestWithUserContext extends Request {
  context: {
    user: RequestUser;
  }
}

export interface RequestWithContext extends Request {
  context: {
    user: RequestUser;
    vaultId: string;
  }
}