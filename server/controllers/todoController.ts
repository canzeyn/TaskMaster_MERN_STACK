import Todo from "../models/todoModel";
import { Request, Response } from "express";
import logger from "../services/logger";
import User from "../models/userModel";
import sendEmail from "../services/nodemailer";

const todoController = async (req: Request, res: Response) => {
  try {
    const newTodo = new Todo({
      // todo adlı modele veri gönderiliyor burada amaç client taraftanalınan veriyi req.body.todoDescription ile alınıyor
      // todo adlı modeldeki description kısmına ekleniyor ve isComplete yani todonun yapılıp yapılmadığı otomatik olarak false değeri atılıyor
      userId: (req as any).userId, // kullanıcın id değeri de alnıyor
      description: (req as any).body.description, // client taraftan gelen todo verisi geliyor
      isCompleted: false,
    });

    console.log("req içindeki id değeri:", (req as any).userId);

    const savedTodo = await newTodo.save(); // bu yeni tanımlanan nesen mongodb içie kaydediliyor
    res.status(201).json(savedTodo); // işlem doğru bir biçimde gerçekleşirse 201 durum kodu gönderiliyor client tarafa

    logger.info({
      // logger ile info seviyesinde bir log alıyoruz ekleme işleminden sonra
      userId: (req as any).userId,
      description: (req as any).body.description,
      action: "Todo Added",
      time: new Date(),
    });

    const users = await User.find().select("email -_id");

    users.forEach((user) => {
      sendEmail(
        user.email,
        "Yeni Todo Eklendi",
        "Merhaba, yeni bir todo eklendi. Göz atmayı unutmayın!"
      );
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export default todoController;
