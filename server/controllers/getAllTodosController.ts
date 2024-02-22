import express, { Request, Response } from "express";
import Todo from "../models/todoModel";

const allTodos = async (req: Request, res: Response) => {
  try {
    const todos = await Todo.find().populate("userId", "email _id"); // burada iki collection içindeki bilgiler tek sorgu içinde getiriliyor populate ile
    // Todo.Find() ile Todo adlı collection içindeki tüm veriler çekiliyor
    // populate ile userId değeri ilişkili değer olarak kullanılıyor populate iki tabloyu birleştirir ve istenen verilerin getirilmesini sağlar burada userId her iki tabloda var ve bu userId değerinin ref değeri user adşı collectiondan geliyor
    // bu gelen değer ile yani id değeri ile o todoyu hangi kullanıcının yaptığını anlayabiliyoruz bu sayede tek sorguda hem todoalrı hemde o todoyu yapan kullanıcının email değeri getirliyor   

    res.status(200).json(todos);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export default allTodos;
