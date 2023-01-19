import { Types } from "mongoose";

export interface IUser {
  email: string;
  name: string;
  password: string;
  isEmailVerified: boolean;
  isCandidate: boolean;
  isElecting: boolean;
}

export interface ICandidate {
  election: Types.ObjectId,
  user: Types.ObjectId
}

export interface IElection {
  title: string;
  image: string;
  winners: Types.ObjectId[];
  user: Types.ObjectId;
  startDate: Types.Date;
  endDate: Types.Date;
}

