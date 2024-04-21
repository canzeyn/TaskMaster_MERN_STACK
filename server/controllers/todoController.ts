import Todo from "../models/todoModel";
import { Request, Response } from "express";
import logger from "../services/logger";
import User from "../models/userModel";
import sendEmail from "../services/nodemailer";
import redisClient from "../config/redisConfig";
import { enqueueNewTodoNotification } from "../services/rabbitmq/producer";
import { enqueueLog } from "../services/rabbitmq/producer";
import { enqueueTodoCreate } from "../services/rabbitmq/producer";

const todoController = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  try {
    const newTodo = new Todo({
      // todo adlı modele veri gönderiliyor burada amaç client taraftanalınan veriyi req.body.todoDescription ile alınıyor
      // todo adlı modeldeki description kısmına ekleniyor ve isComplete yani todonun yapılıp yapılmadığı otomatik olarak false değeri atılıyor
      userId: (req as any).userId, // kullanıcın id değeri de alnıyor
      description: (req as any).body.description, // client taraftan gelen todo verisi geliyor
      deadline: (req as any).body.deadline,
      isCompleted: false,
    });

    console.log("req içindeki id değeri:", (req as any).userId);

     try {
       await enqueueTodoCreate(newTodo);
     } catch(err) {
      console.log("todo eklenirken hata:" , err);
     }
   

    // const savedTodo = await newTodo.save(); // bu yeni tanımlanan nesen mongodb içie kaydediliyor
    // try {
    //   await enqueueNewTodoNotification(savedTodo);
    // } catch (notificationError) {
    //   console.log("Failed to enqueue new todo notification: " + notificationError);
    // }

    // try {
    //   await enqueueLog(savedTodo, "Todo Added");
    // } catch (logError) {
    //   console.log("Failed to log new todo: " + logError);
    // }

    // try {
    //   const todoCountKey = `userTodoCount:${userId}:todoCount`;
    //   await redisClient.incr(todoCountKey);
    // } catch (redisError) {
    //   console.log("Failed to increment Redis todo count: " + redisError);
    // }

    //const todoCountKey = `userTodoCount:${userId}:todoCount`; // anahtar olarak redis içine user:userId gmnderiliyor değer olarak todoCount yani todo sayısı gönderiliyor bu sayede her kullanıcının kaç todosu var redis cache içinde tutulur ve bu sayede hızlıca erişilir
    // await redisClient.incr(todoCountKey); // incr ile var olan değer 1 artırılır eğer değer yoksa 0 dan başlar otomatik olarak

    //res.status(201).json(savedTodo); // işlem doğru bir biçimde gerçekleşirse 201 durum kodu gönderiliyor client tarafa

    res.status(202).json({ message: 'Todo creation in progress' });

    // logger.info({
    //   // logger ile info seviyesinde bir log alıyoruz ekleme işleminden sonra
    //   userId: (req as any).userId,
    //   description: (req as any).body.description,
    //   action: "Todo Added",
    //   deadline: (req as any).body.deadline,
    //   time: new Date(),
    // });

  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export default todoController;
