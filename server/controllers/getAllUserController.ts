import User from "../models/userModel";
import express, { Request, Response } from "express";
import errorLogger from "../services/errorLogger";
import redisClient from "../config/redisConfig";

const allUser = async (req: Request, res: Response) => {
  try {
    const users = await User.find(); // User modelini kullanarak MongoDB'deki tüm kullanıcıları çekiyoruz
    // res.json(users); // Çekilen kullanıcıları JSON olarak dönüyoruz
    const userWithTodoCounts = await Promise.all( // promis.all ile birden fazla promise tabanlı işlem yapılır bu sayede bir hata oluşrusa biride sistem hata fırlatır ve diğer işlemler devam etmez 
      users.map(async (user) => { // veri tabanından çekilen user verlierli sırasıya dönülür
        const todoCountKey = `userTodoCount:${user._id}:todoCount`; // her kullanıcı için id değeri ile redis içinde anahtar değeri olarak id değeri eklenir ve her kullanıcı için todo saysını veren bir redis anahtarı oluşturulru cache içinde
        const todoCount = (await redisClient.get(todoCountKey)) || "0"; // redis içinde aranır veri ve get ile getirlir bu bir promise tabanlı olaydır get işelmi redis içinde ayrıca veri bulunamazsa 0 değeri girilir
        return {
          ...user.toObject(), // toObject ile veritabaından gelen nesne javascript objesine çevriliyor ... spread operatörü ile user nesnesinin bir kopyası alınır bu sayede orjinal nesneye bir müdahele olmaz ve korunur
          todoCount, // todoCount ile birleştirilir user nesnesi ve tek bir çıktıda hem kullanıcı bilgileri hemde redis içindeki o kullanıcının todoCount bilgi birleştirlir
        };
      })
    );
    res.json(userWithTodoCounts); // response olarak gönderiliyor
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Kullanıcılar listelenirken bir hata oluştu",
        error: err,
      });
  }
};

export default allUser;
