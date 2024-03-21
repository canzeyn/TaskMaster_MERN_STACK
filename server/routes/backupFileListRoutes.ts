import { Request, Response, Router } from "express";
import fs from "fs";
import path from "path";

const fileListRouter = Router();

fileListRouter.get("/", (req: Request, res: Response) => {
  const backupsDir = path.join(__dirname, "..", "backups");

  fs.readdir(backupsDir, (err, files) => {
    if (err) {
      console.error("Dosyaları listeleme hatası:", err);
      return res.status(500).send("Dosyalar listelenirken bir hata oluştu.");
    }
    // Dosya isimlerini JSON olarak dön
    res.json(files);
  });
});

export default fileListRouter;
