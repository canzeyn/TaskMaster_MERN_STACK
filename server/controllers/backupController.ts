import express, { Request, Response } from "express";
import { exec } from "child_process"; // child process modülü ile shell komutlarını nodejs ortaomunda çalıştımamakzı sağlar dış işlemlerden veri alımı sağlar burada exec ile belilrli komutları yürütmesini başlatılmasını sağlıyoruz
import moment from "moment"; // tarihleri daha okunabilir şekilde çevirir

require("dotenv").config();

const createBackup = (req: Request, res: Response) => {
  const userBackupName = req.params.backupName || "backup";
  const backupName = `${userBackupName}-${moment().format("YYYY-MM-DD-HH-mm-ss")}`; // alınan  yedeğin ismi burada oluşturulur tarih sayesinde her yedek farklı isimde olur
  const backupCommand = `mongodump --uri="${process.env.MONGODB_URI}" --out=./backups/${backupName}`; // Veri tabanının yedeğini alıp, ./backups/ klasörü altına tarih-saat bilgisi içeren benzersiz bir isimle kaydeder.

  exec(backupCommand, (error: any, stdout: any, stderr: any) => {
    // error hata durumunda gelir ve console a yazdırılır
    // stdout standart çıktıdır sistemin nasıl çalıştığını başarılı olup olmadığını taşır
    // stderr hata çıktısıdır
    if (error) {
      console.log(`Yedekleme hatası: ${error}`);
      return res.status(500).send("Yedekleme işlemi başarısız.");
    } else {
      console.log("yedekleme yapıldı")
    }
   

  

    res.send(`${userBackupName} adında yedekleme başarıyla oluşturuldu.`); // başarılı olduğunu cevap olarak gönderir
  });
};

export default createBackup;
