import Todo from "../models/todoModel";
import { Request, Response } from 'express';
import logger from "../services/logger"
import mongoose from "mongoose";

 const todoController = async (req: Request , res: Response) => {
    try {
       const newTodo = new Todo({ // todo adlı modele veri gönderiliyor burada amaç client taraftanalınan veriyi req.body.todoDescription ile alınıyor 
        // todo adlı modeldeki description kısmına ekleniyor ve isComplete yani todonun yapılıp yapılmadığı otomatik olarak false değeri atılıyor
        userId: (req as any).userId, // kullanıcın id değeri de alnıyor
        description: (req as any).body.description, // client taraftan gelen todo verisi geliyor
        isCompleted:false,
       });

       console.log("req içindeki id değeri:" , (req as any).userId)

       const savedTodo = await newTodo.save(); // bu yeni tanımlanan nesen mongodb içie kaydediliyor
       res.status(201).json(savedTodo); // işlem doğru bir biçimde gerçekleşirse 201 durum kodu gönderiliyor client tarafa


       const logMessage = { // bir nesne oluşturuluyor bu nesne ile kullanıcı bir todo eklediği zaman log kaydı tutulacak log kaydı içeriği aşağıdaki gibi olacak
         userId: (req as any).userId,
         action: "Todo Eklendi",
         details: `Todo detayı: ${(req as any).body.description}`,
         timestamp: new Date(),
       };

       if (!logMessage.userId) {
         console.error(" todoController.ts: Log kaydedilemedi: `userId` değeri eksik veya null.");
         return;
       } else {
         console.log("userID değeri başarıyla eklendi mesage içine" , logMessage.userId)
       }


       logger.info(JSON.stringify(logMessage)); // loggerın leveli info  olan yere gönderiyor oluşturulan nesneyi bunu yaparkende json formatına çeviriliyor
       // json formatına çevrilmesinin sebebi log mesajlarının standart olarak json formatında saklanmasıdır
    } catch(error:any){ 
        res.status(400).json({message: error.message});
    }
 }

 export default todoController;