import express , {Request , Response} from "express";
import {exec} from "child_process";

require('dotenv').config();

 const restoreBackup = (req:Request, res:Response) => {
  const { backupName } = req.params; // yedek dosyanın adı alınıyor client taraftan
  const restoreCommand = `mongorestore --uri="${process.env.MONGODB_URI}" ./backups/${backupName}`; // geri yükleneek olan dosya ve veri tabanı yolu burada aylarınyor

  exec(restoreCommand, (error:any, stdout:any, stderr:any) => { // konut çalıştırılıyor exec ile ve geri yükleme yapılıyor
    if (error) {
      console.error(`Geri yükleme hatası: ${error}`);
      return res.status(500).send('Geri yükleme işlemi başarısız.');
    }
    res.send(`${backupName} adındaki yedekten geri yükleme başarıyla yapıldı.`);
  });
};

export default restoreBackup;
