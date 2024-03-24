import express, { Request, Response } from "express";
import { exec as execCallback } from "child_process";
import { promisify } from "util";

require("dotenv").config();
const exec = promisify(execCallback);

const isPasswordCorrect = (req: Request, res: Response): boolean => {
  const { password } = req.body; // Client'tan gelen şifre
  return password === process.env.DB_BACKUP_PASSWORD; // .env dosyasındaki şifre ile karşılaştırma
};

const restoreBackup = async (req: Request, res: Response) => {
  try {
    const passwordCorrect = isPasswordCorrect(req, res);
    if (!passwordCorrect) {
      return res.status(401).send("Yanlış şifre.");
    }

    const backupName = req.params.restoreBackupName; // yedek dosyanın adı alınıyor client taraftan
    const restoreCommand = `mongorestore --drop --uri="${process.env.MONGODB_URI}" ./backups/${backupName}`; // geri yükleneek olan dosya ve veri tabanı yolu burada aylarınyor

    const { stdout, stderr } = await exec(restoreCommand);

    if (stderr) {
      console.error("Geri yükleme sırasında hata oluştu:", stderr);
      return res
        .status(500)
        .send("Geri yükleme işlemi sırasında bir hata oluştu.");
    }

    res.send(`${backupName} adındaki yedekten geri yükleme başarıyla yapıldı.`);
  } catch (err) {
    console.log("yedek yüklenirken hata oluştu", err);
    res.status(500).json({ message: "yedekleme yapılamadı hata var" });
  }
};

export default restoreBackup;
