import Todo from "../models/todoModel";
import { Request , Response } from 'express';

  const deleteTodoController = async (req: Request , res: Response) => {
    try{
        const deleteTodo = await Todo.findByIdAndDelete(req.params.id); // findByIdAndDelete ile benzersiz olan id değerini bulur ve siler yani ilk eşleşen değeri buur ve siler her todo için kendine ait bir _id değeri olduğu için onu bulur ve siler
        if (!deleteTodo)  { // bulunamazsa o todo silinmesi için kodlar çalışır
            return res.status(404).send("deletTodoController: hata var todo buşunamadı")
        }
        res.status(200).send("todo başarıyla silindi");
    } catch (err) {
        res.status(500).send(err)
    }
  }

  export default deleteTodoController;