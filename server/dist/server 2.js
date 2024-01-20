"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)(); //express frameworkunun tüm özelliklerinib ir değişkene atar ve oradan kullanırız
app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'client', 'dist')));
// Bu kısımı ekleyin, bu sayede tüm yollara gelen istekler için React uygulamasının index.html dosyasını sunar:
app.get('*', (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, '..', 'client', 'dist', 'index.html'));
});
const port = process.env.PORT || 3000; // sunucu hangi portta başlayacağını belirliyoruz
app.use(express_1.default.json()); //gelen verileri json formatından javascript formatına çevirir
app.get('/todo', (req, res) => {
    // res.send('Merhaba Dünya!'); // İstek geldiğinde, istemciye (genellikle bir web tarayıcısı) 'Merhaba Dünya!' yanıtı gönderilir.
    console.log('/todo rotasına bir istek yapıldı');
    res.json({ message: 'Burada todo verileri olacak' });
});
app.listen(port, () => {
    console.log(`Sunucu ${port} portunda çalışıyor.`); //port çalılışınca hangi portta çalıştığı console a yazıdılıyor 
});
