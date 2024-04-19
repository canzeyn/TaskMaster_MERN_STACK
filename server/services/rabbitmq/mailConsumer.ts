import amqp from "amqplib";
import User from '../../models/userModel'; 
import sendEmail from '../nodemailer'; // Güncellenmiş import ifadesi

async function startConsumer() {
    const conn = await amqp.connect('amqp://localhost'); // rabbitmq sunucusuna bağlantı kuruluyor
    const channel = await conn.createChannel(); // sunucuda bir kanal oluşturuluyor mesaj alışverişi için 
    await channel.assertQueue('todoNotifications'); // eğer varsa bu kuyruğa bağlanılıyor yoksa bu isimde bir kuyruk oluşturuluyor

    channel.consume('todoNotifications', message => { // todoNotifications kuyuruğunu dinlerve bu kuruğa giren mesajları alır
        if (!message) { // mesaj yoksa kuyrukta kodlar çalışır
            console.log('No message received');
            return;
        }
        const todo = JSON.parse(message.content.toString()); //mesajlar alınır kuyruktan ve javascript nesnesine çevrilir
        console.log('Processing todo:', todo.description);
        
        sendEmailToAllUsers(todo); // eklenen todo argüman olarak geçiyor fonksiyona
    
        channel.ack(message); // Mesajı işlendi olarak işaretle doğrular mesajı eğer başarılı olarak gönderildiyse
    });
}

async function sendEmailToAllUsers(todo) {
    const users = await User.find().select("email -_id"); // users adlı collectiondaki tüm kullanıcılara  mesaj atılması alınıyor ve bir değişkene atılıyor
    users.forEach(user => { // tüm kullanıcılar teker teker dönülüyor
        sendEmail( // nodemailer ile e-mail gönderiliyor
            user.email,  // her kullanıcı mailine 
            "Yeni Todo Eklendi", // bu mesah gönderiliyor content olarak
            `Merhaba, yeni bir todo eklendi: ${todo.description}. Göz atmayı unutmayın!`
        );
    });
}


