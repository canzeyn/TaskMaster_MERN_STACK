import Todo from "../models/todoModel";
import { Request, Response } from "express";
import mongoose from "mongoose";
import {LogModel} from "./getAllLogsController";

// const LogSchema = new mongoose.Schema({}, { collection: "logs", strict: false });
// const LogModel = mongoose.model("Log", LogSchema);


// Aylık Todo Raporu için yeni bir controller fonksiyonu
const getMonthlyTodoReport = async (req: Request, res: Response) => {
    const userId = (req as any).userId
    console.log('UserId for report:', userId);
  try {
    const report = await LogModel.aggregate([ // raporlama için mongodb frameworkü olan aggregate kullanımı başlıoyr todo modeli için
      {
        $match: { // aşamalar ile raporlama yapılır burada ilk olarak filtreleme yapılıyor bu sayede kişilere özel raporlama yapılabilir
             userId: userId,
             action: "Todo Added"
          // Burada, isteğe bağlı olarak belirli bir kullanıcıya göre filtreleme yapabilirsiniz.
          // Örneğin: userId: mongoose.Types.ObjectId(req.params.userId)
        }
      },
      {
        $project: { // veri tabnaından yani raporlanacak olan collectiondan hangi bilgiinin alınması gerektiğini burada ayarlıyoruz
          month: { $month: "$time" }, // dolar işaraeti ile belirtilen yerler operatörlerdir buradaki operatör ayı temsil eder ayrıca dolar ile collection içinden hangi verinin getireleceği ayarlanır $month ile creadetAt alanındaki ay bilgisi çıkarılır sadece 
          year: { $year: "$time" },
          userId: 1 // userId nin raporlamaya dahil edilceği ayarlanıyor burada 1 ile
        }
      },
      {
        $group: { // verileri gruplandırma yapılıyor bu gruplandırmaya göre grafik hanline gelicek aylara öre veya yıllara göer gibi
          _id: {
            month: "$month",
            year: "$year",
            userId: userId 
          },
          count: { $sum: 1 }  // burada grup içindeki grupların herbirinde ne kadar veri olduğunu hesaplıyor
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 } // burada raporlanacak olan verilerin sırası ayarlanıyor 
        // sıralama işlemi artan şekilde yapılıyor bunuda 1 ile ayarlanıyor yani küçük yıldan büyük yıla doğru oluyor 
        // yılı aynı olan veriler için aya göre sıralama yapılır orada da ay bilgisi artan olarak sıralanır
      }
      
    ]);

    console.log('Aggregation report:', report);
    res.json(report);
  } catch (error:any) {
    console.error('Error during aggregation:', error);
    res.status(500).json({ message: error.message });
  }
};

export default getMonthlyTodoReport;
