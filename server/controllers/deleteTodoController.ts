import Todo from "../models/todoModel";
import { Request , Response } from 'express';
import DeleteTodo from "../models/deleteTodoModel";

  const deleteTodoController = async (req: Request , res: Response) => {
    try{
        const todo = await Todo.findById(req.params.id); // işlemi yapılacak olan todo bulunur kullanıcının tıkladığı todo
        if (!todo)  { // bulunamazsa o todo silinmesi için kodlar çalışır
            return res.status(404).send("deletTodoController: hata var todo buşunamadı")
        }

        const deletedTodo = new DeleteTodo({  // silinen todo deletedTodo adlı collection içine alınıyor bu sayede kullanıcı bitirilen işleri görebilir daha sonra 
          userId: todo.userId,         
          description: todo.description, 
          isCompleted: true, 
          createdAt: todo.createdAt,   
          deletedAt: new Date(),
        })

        await deletedTodo.save(); // veri tabanına kayıt edilir

        await Todo.findByIdAndDelete(req.params.id); // findByIdAndDelete ile benzersiz olan id değerini bulur ve siler yani ilk eşleşen değeri buur ve siler her todo için kendine ait bir _id değeri olduğu için onu bulur ve siler

        
        res.status(200).send("todo başarıyla silindi");
    } catch (err) {
        res.status(500).send(err)
    }
  }

  export default deleteTodoController;