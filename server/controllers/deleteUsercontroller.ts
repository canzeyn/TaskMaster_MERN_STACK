import User from '../models/userModel';
import { Request, Response } from 'express';
import errorLogger from "../services/errorLogger"

 const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id; // URL'den kullanıcı ID'sini al
    const deletedUser = await User.findByIdAndDelete(userId); // Kullanıcıyı sil

    if (!deletedUser) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    res.status(200).json({ message: "Kullanıcı başarıyla silindi." });
  } catch (err) {
    res.status(500).json({ message: "Kullanıcı silinirken bir hata oluştu.", error: err });
  }
};
export default deleteUser;