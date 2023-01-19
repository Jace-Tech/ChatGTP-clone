import mongoose, { SchemaTypes } from "mongoose";
import { ICandidate } from "../@types/common";

const CandidateSchema = new mongoose.Schema<ICandidate>({
  election: {
    type: SchemaTypes.ObjectId,
    required: true,
    ref: "election"
  },
  user: { 
    type: SchemaTypes.ObjectId,
    required: true,
    ref: "user"
  }
}, { timestamps: true })

export default mongoose.model("candidate", CandidateSchema)