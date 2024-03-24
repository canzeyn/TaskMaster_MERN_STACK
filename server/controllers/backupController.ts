import express, { Request, Response } from "express";
import { exec as execCallback } from "child_process"; // child process modülü ile shell komutlarını nodejs ortaomunda çalıştımamakzı sağlar dış işlemlerden veri alımı sağlar burada exec ile belilrli komutları yürütmesini başlatılmasını sağlıyoruz
import moment from "moment"; // tarihleri daha okunabilir şekilde çevirir
import logger from "../services/logger";
import { promisify } from "util";

// hata veren bir nodejs paketi var bu paketten dolayı loglama işelmi hata veriyor  ve sunucuya veri hatalı gidiyor


require("dotenv").config();
const exec = promisify(execCallback);

const isPasswordCorrect = (req:Request , res:Response) => {
  const  {password}   = req.body // Client'tan gelen şifre
  return password === process.env.DB_BACKUP_PASSWORD; // .env dosyasındaki şifre ile karşılaştırma
};

const createBackup = async (req: Request, res: Response) => {
  try {
    if (!isPasswordCorrect(req , res)) {
      return res.status(401).send("Yanlış şifre.");
    }
    const userBackupName = req.params.backupName || "backup";
    const backupName = `${userBackupName}-${moment().format(
      "YYYY-MM-DD-HH-mm-ss"
    )}`; // alınan  yedeğin ismi burada oluşturulur tarih sayesinde her yedek farklı isimde olur
    const backupCommand = `mongodump --uri="${process.env.MONGODB_URI}" --out=./backups/${backupName}`; // Veri tabanının yedeğini alıp, ./backups/ klasörü altına tarih-saat bilgisi içeren benzersiz bir isimle kaydeder.

    const { stdout, stderr } = await exec(backupCommand);

    if (stderr) {
      console.error("Yedekleme sırasında hata oluştu:", stderr);
      return res
        .status(500)
        .send("Yedekleme işlemi sırasında bir hata oluştu.");
    }

    logger.info({
      userId: (req as any).userId,
      description: "Veri tabanı yedeklendi",
      deletedAt: new Date(),
      action: "backup",
    });
  } catch (err) {
    console.log("yedek alnırken hata:", err);
    res.status(500).send("Yedekleme işlemi başarısız.");
  }
};

export default createBackup;
