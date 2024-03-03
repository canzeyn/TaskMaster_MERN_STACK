import mongoose, { Schema, Document } from "mongoose";

interface IDeletedTodo extends Document {
  userId: string;
  description: string;
  isCompleted: boolean;
  createdAt?: Date;
  deletedAt: Date; // Silme tarihi eklendi
  role: string;
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
  role: {
    type: String,
    required: true,
    default: 'user' // Kullanıcıdan bu alan için bir veri girilmediğinde otomatik olarak 'user' değerini atar.
  }
});

const DeletedTodo = mongoose.model<IDeletedTodo>("DeletedTodo", deletedTodoSchema);

export default DeletedTodo;
