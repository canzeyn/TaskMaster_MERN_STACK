"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)(); //express frameworkunun tüm özelliklerinib ir değişkene atar ve oradan kullanırız
const port = process.env.PORT || 3000; // sunucu hangi portta başlayacağını belirliyoruz
app.use(express_1.default.json()); //gelen verileri json formatından javascript formatına çevirir
app.get('/', (req, res) => {
    res.send('Merhaba Dünya!'); // İstek geldiğinde, istemciye (genellikle bir web tarayıcısı) 'Merhaba Dünya!' yanıtı gönderilir.
});
app.listen(port, () => {
    console.log(`Sunucu ${port} portunda çalışıyor.`); //port çalılışınca hangi portta çalıştığı console a yazıdılıyor 
});
