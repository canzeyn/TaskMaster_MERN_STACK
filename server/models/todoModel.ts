import mongoose, { Schema, Document } from "mongoose";

interface Itodo extends Document {
  // tip belirlemesi yapılıyor Document ile mongoose ile gelen fonksiyonların bu Itodo tipindeki modellerin kullanmasına izin veriyor
  userId: string;
  description: string;
  isCompleted: boolean;
  createdAt?: Date; // soru işareti ile bu Itodo tipindeki nesnelerde olmak zorunda olmadığını belirtiyoruz
}

const todoSchema = new mongoose.Schema({
  userId: { type:String, ref: "User", required: true },

  description: String,

  isCompleted: {
    type: Boolean,
    default: false, // otomatik olarak false değer ile başlar
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Todo = mongoose.model<Itodo>("Todo", todoSchema);

export default Todo;
