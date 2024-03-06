import pino from "pino";

// dotenv kullanarak ortam değişkenlerini yükle
require("dotenv").config();

const mongoConnectionString = process.env.MONGODB_URI;

const logger = pino({
  level: "info",
  transport: {
    targets: [
      // targets ile logların çeşitli hedeflere yani console kısmına dosyalara veya veri tabanlarına gönderim işlemleri ayarlanır
      {
        target: "pino-mongodb", // veri tabanına yazılacağını ayarlıyoruz
        level: "info", // log leveli info olarak ayarlanıyor
        options: {
          uri: mongoConnectionString, // veri tabanına bağlanmak için gerekli bağlantı ayarlanıyor
          collection: "logs", // logs collection içine gönderileceği ayarlanıyor
        },
      },
      {
        target: "pino-pretty", // logların tasarımı için kulalnılır
        options: {
          colorize: true, // logları renklerndirir
          translateTime: "SYS:standard", // zamanı okunur hale getirir
          ignore: "pid,hostname", // işlemci adı ve sunucu adını log içine eklemez
        },
      },
      {
        target: "pino/file", // logu hangi dosyaya kaydedilceğini gösteriyor
        options: { destination: "./logs/info.log", mkdir: true }, // logların yazılacağı klasör ayarlanıyor burada destination ile mkdir ilede dosya yoksa böyel bir oluşturması izni veriliyor bu sayede manuel olarak oluşturmak zorunda kalmıyor
      },
    ],
  },
});

export default logger;
