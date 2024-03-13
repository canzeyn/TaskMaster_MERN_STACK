import User from '../models/userModel';
import express, { Request, Response } from 'express';
import errorLogger from "../services/errorLogger"
 
 const allUser = async (req: Request, res: Response) => {
    try {
      const users  = await User.find(); // User modelini kullanarak MongoDB'deki tüm kullanıcıları çekiyoruz
      res.json(users); // Çekilen kullanıcıları JSON olarak dönüyoruz
    } catch (err) {
      res.status(500).json({ message: "Kullanıcılar listelenirken bir hata oluştu", error: err });
    }
  };

  export default allUser