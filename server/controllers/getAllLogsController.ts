import express, { Request, Response } from "express";
import Log from "../models/logModel";
import mongoose from "mongoose";

const allLogs = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string; // userId'yi string olarak kabul et
    console.log("Gelen userId: ", userId);

    if (!userId) {
      console.log("userId parametresi eksik.");
      return res.status(400).json({ message: "userId is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log(`Geçersiz userId: ${userId}`);
      return res.status(400).json({ message: "Invalid userId" });
    }

    console.log("getAllLogsController.ts: geçerli id tipi");
    const logs = await Log.find({ userId }).populate("userId").exec();

    if (!logs.length) {
      console.log("Sorgu sonucu null veya boş array olarak döndü");
      return res.status(404).json({ message: "Logs not found for the given userId" });
    }

    res.status(200).json(logs);
  } catch (err:any) {
    console.error("getAllLogsController.ts: hata var:", err);
    res.status(500).json({ message: err.message });
  }
};

export default allLogs;
