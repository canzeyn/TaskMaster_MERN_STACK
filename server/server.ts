import express, { Express, Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import todoRoutes from "./routes/todoRoutes"
import mongoose from 'mongoose';

const app: Express = express(); //express frameworkunun tüm özelliklerinib ir değişkene atar ve oradan kullanırız
app.use(cors());
app.use(express.json());


app.use('/todo', todoRoutes);




// Statik dosyaları sunmadan önce tüm API rotaları tanımlanmalıdır
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

//  bu sayede tüm yollara gelen istekler için React uygulamasının index.html dosyasını sunar
app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, '..', 'client', 'dist', 'index.html'));
});


const port: string | number = process.env.PORT  || 3000; // sunucu hangi portta başlayacağını belirliyoruz





app.listen(port , () => { // burada uygulamanın başlıyacağı port dinleniyor yani o portta uygylama çalıştırılıyor 
    console.log(`Sunucu ${port} portunda çalışıyor.`) //port çalılışınca hangi portta çalıştığı console a yazıdılıyor 
})

