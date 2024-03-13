import DeleteTodo from "../models/deleteTodoModel";
import errorLogger from "../services/errorLogger"

import { Request , Response } from 'express';

 const getDeletedTodosController = async (req: Request, res: Response) => {
  try {
    // Kullanıcı ID'sini middleware'den al
    const userId = (req as any).userId; 

    // Silinen todo'ları getir
    const deletedTodos = await DeleteTodo.find({ userId: userId });

    // Silinen todo'ları yanıt olarak dön
    res.status(200).json({ deletedTodos });
  } catch (error) {
    res.status(500).send({ message: "Sunucu hatası", error });
  }
};

export default getDeletedTodosController;
