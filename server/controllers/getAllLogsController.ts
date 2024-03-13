import express, { Request, Response } from "express";
import mongoose from "mongoose";
import errorLogger from "../services/errorLogger"

const LogSchema = new mongoose.Schema({}, { collection: "logs", strict: false });
const LogModel = mongoose.model("Log", LogSchema);

const allLogs = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId; // URL'den alınan userId
    console.log("Gelen userId: ", userId);

    // Kullanıcı ID'sinin varlığını ve geçerliliğini kontrol et
    if (!userId) {
      console.log("userId parametresi eksik.");
      return res.status(400).json({ message: "userId is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log(`Geçersiz userId: ${userId}`);
      return res.status(400).json({ message: "Invalid userId" });
    }

    // MongoDB'ye doğrudan sorgu atma
    const logs = await LogModel.find({ userId: userId }).exec(); // Burada mongoose.Types.ObjectId kullanarak userId'yi ObjectId'ye çeviriyoruz.
     // `.then` ve `.catch` yerine, `await` ile sonucu bekleyip, hata olması durumunda try-catch bloğu içinde yakalayabiliriz.

    res.status(200).json(logs);
  } catch (err:any) {
    console.error("getAllLogsController.ts: hata var:", err.message);
    res.status(500).json({ message: err.message || "An unknown error occurred" });
  }
};

export default allLogs;
