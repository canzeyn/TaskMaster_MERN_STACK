import mongoose, { Schema, Document } from "mongoose";

interface IDeletedTodo extends Document {
  userId: string;
  description: string;
  isCompleted: boolean;
  createdAt?: Date;
  deletedAt: Date; // Silme tarihi eklendi
}

const deletedTodoSchema = new mongoose.Schema({
  userId: { type: String, ref: "User", required: true },
  description: String,
  isCompleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deletedAt: { // Silme tarihi için yeni alan
    type: Date,
    default: Date.now, // Silme anının zaman damgası
  },
});

const DeletedTodo = mongoose.model<IDeletedTodo>("DeletedTodo", deletedTodoSchema);

export default DeletedTodo;
