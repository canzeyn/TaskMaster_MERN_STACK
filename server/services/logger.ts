import pino from "pino";

// dotenv kullanarak ortam değişkenlerini yükle
require("dotenv").config();

const mongoConnectionString = process.env.MONGODB_URI;

const logger = pino({
  level: "info",
  transport: {
    targets: [
      {
        target: "pino-mongodb",
        level: "info",
        options: {
          uri: mongoConnectionString,
          collection: "logs",
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
        target: "pino/file", // Dosyaya loglama için
        options: { destination: "./logs/info.log", mkdir: true }, // Logların yazılacağı dosya ve klasör
      },
    ],
  },
});

export default logger;
