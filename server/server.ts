import express, { Express, Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import todoRoutes from "./routes/todoRoutes";
import mongoose from 'mongoose';
import signupRoutes from "./routes/signupRoutes";
import signinRoutes from './routes/signinRoutes';
import corsOptions  from "./config/corsConfig";
import cookieParser from 'cookie-parser';
import logOutRoutes from "./routes/logOutRoutes";
import getUserRoutes from "./routes/getUserRoutes";
import isAuthenticatedRoutes from "./routes/isAuthenticatedRoutes";
import verifyToken from './middlewares/verifyToken';
import getTodosRoutes from "./routes/getTodosRoutes";
import deleteTodoRoutes from "./routes/deleteTodoRoutes";
import updateTodoRoutes from "./routes/updateTodoRoutes";
import uploadPhotoRoutes from "./routes/uploadPhotoRoutes";
import updatePasswordRoutes from "./routes/updatePasswordRoutes";
import getDeleteTodosRoutes from "./routes/getDeleteTodosRoutes";
import getAllUserRoutes from "./routes/getAllUserRoutes";
import deleteUserRoutes from "./routes/deleteUserRoutes"
import updateUserNameRoutes from "./routes/updateUserNameRoutes";
import makeAdminRoutes from "./routes/makeAdminRoutes";

const app: Express = express(); //express frameworkunun tüm özelliklerinib ir değişkene atar ve oradan kullanırız


app.use(cors(corsOptions)); // cors ile başka kaynaklardan sunucuya gelen istekleri yönetiriz bir politika ayarlanır ve bu politikaya uymayan istekler sunucuya gelmez 
app.use(express.json()); //json olarak gelen verileri javascript objesine çeviri
app.use(cookieParser());

require('dotenv').config(); //.env dosyasından gereken bilgileri getirir ve kullanıma izin verir

const mongoDBUrl: string | undefined = process.env.MONGODB_URI; //mongodb ile yani veri tabanı ile bağlantı url i bir değişkene atanır url .env dosyasından getiriliyor

if (mongoDBUrl) { // eğer url varsa veri tabanına bağlanmak için kodlar çalışır
    mongoose.connect(mongoDBUrl).then(() => { //mongoose kütüphanesi ile mongodb bağlantısı ve diğer işlemler yapılır burada connect ile bağlantı yapılıyor ve bir promise yapısı kullanılıyor hata alma durumu için
        console.log('mongodb ile bağlantı kuruldu');
    }).catch((err: any) => {
        console.log('mongoDB ile bağlantı kurulamadı:', err);
    });
} else {
    console.error('MongoDB bağlantı URL’si bulunamadı.');
}

app.use('/signup' , signupRoutes);

app.use('/signin' , signinRoutes);

app.use('/logout' , logOutRoutes);

app.use('/get-user' , getUserRoutes);

app.use('/auth/check' , isAuthenticatedRoutes);

app.use('/addTodo' , verifyToken ,  todoRoutes );

app.use('/getTodos' , getTodosRoutes);

app.use('/deleteTodo' , deleteTodoRoutes);

app.use('/updateTodo' , updateTodoRoutes);

app.use('/upload-photo' , uploadPhotoRoutes);

app.use('/updatePassword' , updatePasswordRoutes);

app.use('/getDeleteTodos' , getDeleteTodosRoutes);

app.use('/getAllUser' , getAllUserRoutes);

app.use('/deleteUser' , deleteUserRoutes);

app.use('/updateUser' , updateUserNameRoutes);

app.use('/makeAdmin' , makeAdminRoutes)


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

