import Todo from "../../models/todoModel";
import amqp from "amqplib";
import { enqueueNewTodoNotification } from "./producer";
import { enqueueLog } from "./producer";
import redisClient from "../../config/redisConfig";

async function startTodoCreateConsumer() {
  const conn = await amqp.connect("amqp://localhost");
  const channel = await conn.createChannel();
  await channel.assertQueue("todoCreateQueue");

  channel.consume("todoCreateQueue", async (message) => {
    if (!message) return;
    const todoData = JSON.parse(message.content.toString());

    try {
      const newTodo = new Todo(todoData);
      await newTodo.save();
      console.log("Todo saved to database:", newTodo);
      const todoCountKey = `userTodoCount:${newTodo.userId}:todoCount`; // redis cache kişinin todo sayısını 1 artırma işlemi burada yapılıyor
      await redisClient.incr(todoCountKey);


      try {
        // Log kaydı ve e-posta gönderimi için diğer kuyruklara mesaj gönder
      await enqueueNewTodoNotification(newTodo); // eğer veri tabanı eklemede sorun oluşursa bu kuyruk işlemleri olmaz
      await enqueueLog(newTodo, "Todo Added");
      } catch(err) {
        console.log("todoConsumer hata:" , err);
        channel.nack(message);
      }
      

      channel.ack(message);
    } catch (error) {
      console.error("Failed to save todo:", error);
      channel.nack(message);
    }
  });
}
