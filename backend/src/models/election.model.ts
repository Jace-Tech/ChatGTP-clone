import { IElection } from './../@types/common.d';
import { Schema, model, SchemaTypes } from "mongoose";

const ElectionSchema = new Schema<IElection>({
  title: {
    type: String,
    required: true,
    min: [3, "Please provide a meaningful title"]
  },
  user: {
    type: SchemaTypes.ObjectId,
    required: true,
    ref: "user"
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  image: String,
  winners: {
    type: [{ type: SchemaTypes.ObjectId, ref: "user"}],
    default: null
  }
}, { timestamps: true })

export default model("election", ElectionSchema)