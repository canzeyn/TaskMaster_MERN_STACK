import User from '../models/userModel';
import { Request , Response } from 'express';

export const updateUser = async (req:Request, res:Response) => {
  try {
    const { name } = req.body; // burada istek nesnesindeki isim değerini alıyoruz
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { name:name }, { new: true });  // burada id değerine göre kulalnıcı bulunuyor ardından client taraftan gelen name değeri ile veri tabanındaki name değeri değiştiriliyor
    // new:true ilede güncelenen veri o an döndürülüyor eğer false olursa o an döndürülmez 
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Kullanıcı güncellenirken bir hata oluştu", error: err });
  }
};