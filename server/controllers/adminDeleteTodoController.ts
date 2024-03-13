import { Request, Response } from "express";
import Todo from "../models/todoModel";
import errorLogger from "../services/errorLogger"

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
    errorLogger.error("adminDeleteTodoController.ts:" , err)
    res.status(500).send({ message: "todo silinirken hata:", err });
  }
};

export default adminDeleteTodoController;
