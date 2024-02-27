import winston from "winston";
import Log from "../models/logModel";
import { Writable } from "stream"; // Node.js stream modülünü import edin
import mongoose from "mongoose";


// Winston logger yapılandırması
const logger = winston.createLogger({
  // bir logger oluşturuyor uygulamada kullanıcıların neler yapğtığını kaydediceğiz bu uygulamada todo ekledi sildi gibi işlemlerim kayıt altına alıcağız hangi kullanıcı yaptıysa görebileceğiz
  level: "info", // logların hangi seviyede olduğunu buradan belirliyoruz info ile bilgi seviyesinde bir log olucak başika log seviyeleride var
  format: winston.format.json(), // logların hangi formatta kaydedileceğini belirliyoruz burada json formatında olacak bu sayede hem kullanıcı hemde bilgisayar rahatça anlayabilecek verileri
  defaultMeta: { service: "user-service" },
  transports: [
    // burada belirlenen alanlara gönderiliyor birden fazla alana log mesajları log kaydı alındığı anda dosyaya ve console içine aynı anda gönderiliyor
    new winston.transports.Console(), // yapılan log kaydı ilk olarak console da gösteriliyor bu olay anında gerçekleşiyor ve görüntülenebiliyor
    new winston.transports.File({ filename: "combined.log" }), // yapılan log kaydı combined.log adında bir dosya içine gönderiliyor daha sonra bu klasör içinde tüm log kayıtlarını görüntüleyebiliriz
  ],
});

// Özel stream transport sınıfı
const customStream = new Writable({
  // bunun kullanılası sebbebi sürekli bir log tutulacağı ve bunun arka planda asenkron olarak yapılacağı için sürekli bir log isteği atılabilir sunucuya ve performanslıdır
  //winston ile entegre edilmiş özel bir writable streamidir asenkron bir şekilde kaydedir logları veri tabanına asenkron bir şekilde yapar bu sayede uygulama performansı korunur
  // burası logları veri tabanına kaydetmek için kullanılır writable stream kütüphanesinden gelen bir dosyaya veri yazılacağı zaman kullanılır
  write: async (message: string, encoding, callback) => {
    // write fonksiyonu writable sınıfın bir parçasıdır ve yazma işlemlerinde kullanılır
    // message yazılacak olan veriyi ifade eder  genellikle string formattadır
    // encoding genellikle kullanılmaz verinin kodlanmasıyla ilgilidir ama kullanılmaz genelde
    // callback fonksyionu yazma işlemi bitince çağrılacak olan fonksiyondur başarılı olarak yazılması durumunda veya hata olması durumda bu fonksyiyon çağrılır başarılı durumda bir şey vermezken hata durumuda error nesnesi bu fonksiyona parametre olarak geçilir
    console.log("Gelen mesaj tipi:", typeof message);
    console.log("Gelen mesaj:", message);

    try {
      const messageString = message.toString();
      const logEntry = JSON.parse(messageString);
      console.log("LogEntry:", logEntry);
      // const logEntry = JSON.parse(message.toString()); // gelen log mesajını javascript nesnesine çevriliyor
      if (!logEntry.userId) {
        callback(
          new Error(
            "Log kaydedilirken hata oluştu: `userId` değeri eksik veya null."
          )
        );
        return;
      }

      const newLog = new Log({
        // mongoose modeli kullanılarak yeni bir log nesnesi oluşturuluyor  ve aşağıdaki değerler veri tabanına kaydediliyor
        userId: logEntry.userId, // Kullanıcı ID'si
        action: logEntry.action, // Log seviyesi
        details: logEntry.message, // Log mesajı
        timestamp: new Date(), // Zaman damgası
      });
      newLog
        .save()
        .then((savedLog) => {
          console.log("Log başarıyla kaydedildi:", savedLog);
          callback(null);
          // Kaydetme işlemi başarılı olduğunda callback fonksiyonunu çağır
        })
        .catch((err) => {
          console.error("Log kaydedilirken hata oluştu:", err);
          callback(err);
          
        }); // Log kaydını veritabanına kaydet
      // Herhangi bir hata olmadan callback fonksiyonunu çağır
    } catch (err: any) {
      console.error("Log kaydedilirken hata oluştu:", err);
      callback(err); // Hata oluştuğunda callback fonksiyonunu hata ile çağır
    }
  },
});

// logger.add ile mevcut logger nesnesine bir transport daha ekleniyor bu sayede winstonun genel loglama mekanizmaları dışında başka yerlerde eklenebiliyor
logger.add(new winston.transports.Stream({ stream: customStream }));
// new winston.transports.Stream  burada winston kütüphaneisnden gelen transport ile stream ile yeni bir yol ile gönderiliyor
// { stream: customStream } burada artık customStream türünde loglama yapılabileceğini sağlıyoruz

// Logger'ı export et
export default logger;
