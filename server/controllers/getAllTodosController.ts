import express, { Request, Response } from "express";
import Todo from "../models/todoModel";
import errorLogger from "../services/errorLogger"

const allTodos = async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query; // sorfu url içinden sayfa sayısını ve gösterilecek olan veri sayısını alıyor
  try {
    // const todos = await Todo.find().populate("userId", "email _id"); // burada iki collection içindeki bilgiler tek sorgu içinde getiriliyor populate ile
    // Todo.Find() ile Todo adlı collection içindeki tüm veriler çekiliyor
    // populate ile userId değeri ilişkili değer olarak kullanılıyor populate iki tabloyu birleştirir ve istenen verilerin getirilmesini sağlar burada userId her iki tabloda var ve bu userId değerinin ref değeri user adşı collectiondan geliyor
    // bu gelen değer ile yani id değeri ile o todoyu hangi kullanıcının yaptığını anlayabiliyoruz bu sayede tek sorguda hem todoalrı hemde o todoyu yapan kullanıcının email değeri getirliyor   
    const todos = await Todo.paginate({}, { page: Number(page), limit: Number(limit), populate: 'userId' }); // paginate fonksiyonu ile bir seferde sadece belirli sayda veri çekiliyor bu sayede daha performaslı oluyor ayrıca client tarafta bu sayede sayfalama ile veriler gösterilebiliyor
    // page ile bir sayfa ayarlanıyor ve hangi sayfada olduğunuz page ile belirleniyor limit ilede bir sayfada kaç veri gösterileceği belirleniyor
    // alınan bu veriler number tipine dönüştürülerek kesin olarak sayı tipi gönderiliyor
    res.status(200).json(todos);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export default allTodos;
