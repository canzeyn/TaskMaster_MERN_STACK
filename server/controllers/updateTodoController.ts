import Todo from "../models/todoModel";
import { Request , Response } from 'express';
import errorLogger from "../services/errorLogger"

  const updateTodoController = async (req: Request , res: Response) => {
    try {
        const {id} = req.params;
        const {description} = req.body;

        const updateTodo = await Todo.findByIdAndUpdate(id , {description} , {new:true}); 

        if(updateTodo) {
             res.status(200).json({message:"updateTodoController.ts: todo başarıyla güncellendi" , updateTodo});
        } else {
            res.status(404).json({message:"updateTodoController.ts: güncellenecek todo bulunamadı"});
        }
    } catch(err) {
        res.status(500).json({message:"updateTodoController.ts: güncellenirken bir hata oluştu hata:" , err});
    }
  }

  export default updateTodoController;