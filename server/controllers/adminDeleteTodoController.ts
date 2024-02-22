import { Request, Response } from "express";
import Todo from "../models/todoModel";

const adminDeleteTodoController = async (req: Request, res: Response) => {
  try {
    const todoId = req.params.id;
    await Todo.findByIdAndDelete(todoId);
    res.status(200).send({ message: "Todo Başarıyla Silindi" });
  } catch (err) {
    console.log(
      "adminDeleteTodoController.ts: silinmek istenen tododa hata oldu",
      err
    );
    res.status(500).send({ message: "todo silinirken hata:", err });
  }
};

export default adminDeleteTodoController;
