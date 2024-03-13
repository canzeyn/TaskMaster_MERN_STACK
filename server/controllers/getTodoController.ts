import Todo from "../models/todoModel";
import { Request, Response } from "express";
import errorLogger from "../services/errorLogger"

export const getTodosController = async (req: Request, res: Response) => {
  try {
    // Kullanıcı ID'sini middleware'den al
    const userId = (req as any).userId;

    
    const todos = await Todo.find({ userId: userId }); // mongodb içinde todos adlı collection içinde bu id il eşleşen tüm değerleri getirir

    // Todos'ları yanıt olarak dön
    res.status(200).json({todos});
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
