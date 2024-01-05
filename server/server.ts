import express, { Express, Request, Response } from 'express';
import path from 'path';
import cors from 'cors';

const app: Express = express(); //express frameworkunun tüm özelliklerinib ir değişkene atar ve oradan kullanırız
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

app.get('/todo', (req: Request, res: Response) => { // Kök URL'ye ('/') gelen GET isteklerini ele alır. Bu istekler genellikle bir web sayfasının yüklenmesi sırasında gerçekleşir.
    // res.send('Merhaba Dünya!'); // İstek geldiğinde, istemciye (genellikle bir web tarayıcısı) 'Merhaba Dünya!' yanıtı gönderilir.
    console.log('/todo rotasına bir istek yapıldı');
    res.json({ message: 'Burada todo verileri olacak' });
});

// Bu kısımı ekleyin, bu sayede tüm yollara gelen istekler için React uygulamasının index.html dosyasını sunar:
app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, '..', 'client', 'dist', 'index.html'));
});


const port: string | number = process.env.PORT  || 5173; // sunucu hangi portta başlayacağını belirliyoruz

app.use(express.json()); //gelen verileri json formatından javascript formatına çevirir



app.listen(port , () => { // burada uygulamanın başlıyacağı port dinleniyor yani o portta uygylama çalıştırılıyor 
    console.log(`Sunucu ${port} portunda çalışıyor.`) //port çalılışınca hangi portta çalıştığı console a yazıdılıyor 
})