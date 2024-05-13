import express, { Router, Request, Response } from "express";
import authorize from "../middlewares/authorizeMiddleware";
import { MongoClient, ServerApiVersion } from "mongodb";
import redis from "redis";
import amqp from "amqplib";

require("dotenv").config();

const healthCheckRouter = express.Router();

const mongoDBUrl = process.env.MONGODB_URI;
const redisUrl = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;
const rabbitMQUrl = `amqp://${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`;

async function checkMongoDBConnection() {
  const client = await MongoClient.connect(mongoDBUrl as string, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  await client.db("sixpack").command({ ping: 1 });
  await client.close();
}

async function checkRedisConnection() {
  const redisClient = redis.createClient({ url: redisUrl });
  await redisClient.connect();
  await redisClient.ping();
  await redisClient.disconnect();
}

async function checkRabbitMQConnection() {
  const connection = await amqp.connect(rabbitMQUrl);
  const channel = await connection.createChannel();

  // 1. Geçici kuyruk işlemleri
  const queueName = "health-check-queue";
  await channel.assertQueue(queueName, { durable: false });
  const message = "Health check message";
  await channel.sendToQueue(queueName, Buffer.from(message));
  await channel.consume(
    queueName,
    (msg) => {
      if (msg) {
        channel.ack(msg);
      }
    },
    { noAck: false }
  );
  await channel.deleteQueue(queueName);

  // 2. Mevcut kuyrukların durumu (örnek)
  const existingQueue = "your-app-queue";
  const queueInfo = await channel.assertQueue(existingQueue);
  console.log("Kuyruk Bilgisi:", queueInfo);

  // 3. Bağlantı sınırları ve disk alanı kontrolü için RabbitMQ API'lerini kullanabilirsiniz.

  await channel.close();
  await connection.close();
}

healthCheckRouter.get("/", async (req: Request, res: Response) => {
  try {
    await checkMongoDBConnection();
    await checkRedisConnection();
    await checkRabbitMQConnection();
    res.sendStatus(200);
  } catch (error) {
    console.error("Health Check Failed:", error);
    res.status(503).send("Service Unavailable");
  }
});

export default healthCheckRouter;

// healthCheckRouter.get("/", async (req: Request, res: Response) => {
//   try {
//     try {
//       // Veritabanı bağlantısını kontrol
//       const client = await MongoClient.connect(mongoDBUrl as string, {
//         // mongodb veri tabanına bağlanır env dosyasından gelen bilgiler ile  mongodbClient ie veri tabanı bağlantısı için kullaılan fonksiyondur
//         serverApi: {
//           // burada amaç mongodb ile etkileişime girecek olan uygulmaların kullanıcakları api sürümünü ayarlamak için yaılıyor
//           version: ServerApiVersion.v1, // mongodb servier apinin sürümünü belirler
//           strict: true, // yalnızca api sürümündeki özelliklerin kullanılmasına izin verilir
//           deprecationErrors: true, // eğer kullanılan bir özellik mongodb tarafından önerilmiyorsa hata fırlatır
//         },
//       });
//       await client.db("sixpack").command({ ping: 1 }); // sixpack adlı veri tabanının erişilebilir olup olmadığını kontrol eder ping ile ping çok hızlı şekilde çalışır
//       await client.close();
//     } catch (error) {
//       console.error("MongoDB Health Check Failed:", error);
//       return res.status(503).send("MongoDB Health Check Failed");
//     }

//     try {
//       const redisClient = redis.createClient({ url: redisUrl });
//       await redisClient.connect();
//       await redisClient.ping();
//       await redisClient.disconnect();
//     } catch (error) {
//       console.error("Redis Health Check Failed:", error);
//       return res.status(503).send("Redis Health Check Failed");
//     }

//     try {
//       const rabbitMQConnection = await amqp.connect(rabbitMQUrl);
//       const channel = await rabbitMQConnection.createChannel();
//       await channel.close();
//       await rabbitMQConnection.close();
//     } catch (error) {
//       console.error("RabbitMQ Health Check Failed:", error);
//       return res.status(503).send("RabbitMQ Health Check Failed");
//     }

//     // Her şey yolundaysa, HTTP 200 OK
//     res.sendStatus(200);
//   } catch (error) {
//     console.error("Sağlık kontrolü başarısız:", error);
//     // Hata durumunda HTTP 503 Service Unavailable
//     res.sendStatus(503);
//   }
// });
