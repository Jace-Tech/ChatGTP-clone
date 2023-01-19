import { Schema, model } from "mongoose";
import { IUser } from "../@types/common";

const UserSchema = new Schema<IUser>({
  email: {
    type: "string",
    unique: true,
    required: true
  },
  name: {
    type: "string",
    required: true,
  },
  password: {
    type: "string",
    required: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isCandidate: {
    type: Boolean,
    default: false
  },
  isElecting: {
    type: Boolean,
    default: false
  },
}, { timestamps: true })

export default model("user", UserSchema)