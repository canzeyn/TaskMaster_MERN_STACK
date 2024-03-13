import pino from "pino";

// dotenv kullanarak ortam değişkenlerini yükle
require("dotenv").config();

const mongoConnectionString = process.env.MONGODB_URI;

const errorLogger = pino({
  level: "error", // Loglama seviyesini 'error' olarak güncelledik
  transport: {
    targets: [
      {
        target: "pino-mongodb", // Veri tabanına yazılacak
        level: "error", // Burada da log seviyesini 'error' olarak güncelledik
        options: {
          uri: mongoConnectionString,
          collection: "logs",
        },
      },
      {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      },
      {
        target: "pino/file",
        level: "error", // Burada da log seviyesini 'error' olarak güncelledik
        options: { destination: "./logs/error.log", mkdir: true }, // Hata loglarının yazılacağı dosya
      },
    ],
  },
});

export default errorLogger;
