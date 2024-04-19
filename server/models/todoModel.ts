import mongoose, { Schema, Document } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

interface ITodo extends Document {
  // tip belirlemesi yapılıyor Document ile mongoose ile gelen fonksiyonların bu Itodo tipindeki modellerin kullanmasına izin veriyor
  userId: mongoose.Schema.Types.ObjectId;
  description: string;
  isCompleted: boolean;
  deadline:Date;
  createdAt?: Date; // soru işareti ile bu Itodo tipindeki nesnelerde olmak zorunda olmadığını belirtiyoruz
}

const todoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // mongodb içindeki benzersiz id değerini temsil ediyor
    ref: "User", // user adlı collection içinden geleceğini belirtiyor bu id değerinin referans olarak bu sayede herhangi bir yerde bu id değeri ile users adlı collection ile tablo birleştirme yapılabilir
    required: true,
  },

  description: String,

  isCompleted: {
    type: Boolean,
    default: false, // otomatik olarak false değer ile başlar
  },

  deadline: {
    type: Date,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

todoSchema.plugin(mongoosePaginate);

interface ITodoModel<T extends Document> extends mongoose.PaginateModel<T> {}

const Todo: ITodoModel<ITodo> = mongoose.model<ITodo>(
  "Todo",
  todoSchema
) as ITodoModel<ITodo>;

export default Todo;
