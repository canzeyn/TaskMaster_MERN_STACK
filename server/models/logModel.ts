import mongoose, { Schema, Document } from "mongoose";
import User from "./userModel";

interface ILog extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  level: string;
  time: Date;
  pid: number;
  hostname: string;
  description: string;
  action: string;
}

const LogSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId,ref: "User" , required: true,  },
  level: { type: String, required: true },
  time: { type: Date, required: true },
  pid: { type: Number, required: true },
  hostname: { type: String, required: true },
  description: { type: String, required: true },
  action: { type: String, required: true },
});

const Log = mongoose.models.Log || mongoose.model<ILog>('Log', LogSchema);
export default Log;
