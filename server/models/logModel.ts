import mongoose, { Schema, Document } from "mongoose";

interface ILog extends Document {
  userId: mongoose.Schema.Types.ObjectId; // Kullanıcı ID'si
  action: string; // Yapılan işlem (örneğin, 'Todo Eklendi', 'Todo Silindi')
  timestamp: Date; // İşlemin zaman damgası
  details: string; // İşlem detayları
}

// Log Schema'sı, veritabanında log kayıtlarının nasıl saklanacağını tanımlar
const LogSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  action: { type: String, required: true },
  timestamp: { type: Date, required: true, default: Date.now },
  details: { type: String, required: true },
  bişeyler: { type: String, required: true, default: "bu alan default" },
});

// Mongoose modelini oluştur ve dışa aktar
const Log = mongoose.model<ILog>("Log", LogSchema);
export default Log;
