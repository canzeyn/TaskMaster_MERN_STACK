import amqp from "amqplib";

async function connectRabbitMQ() {
  return await amqp.connect("amqp://user:password@rabbitmq");
}

export const enqueueNewTodoNotification = async (todo: any) => {
  const conn = await connectRabbitMQ();
  const channel = await conn.createChannel();

  await channel.assertQueue("todoNotifications");
  channel.sendToQueue("todoNotifications", Buffer.from(JSON.stringify(todo)), {
    persistent: true,
  });
  console.log("Todo notification queued");
  await channel.close();
  await conn.close();
};

export const enqueueLog = async (todo: any, action: any) => {
  const conn = await connectRabbitMQ();
  const channel = await conn.createChannel();

  await channel.assertQueue("logQueue");
  const log = {
    todoId: todo._id,
    userId: todo.userId,
    action,
    description: todo.description,
    time: new Date(),
  };
  channel.sendToQueue("logQueue", Buffer.from(JSON.stringify(log)));
  console.log("Log enqueued");
  await channel.close();
  await conn.close();
};

export const enqueueTodoCreate = async (todoData: any) => {
  const conn = await connectRabbitMQ();
  const channel = await conn.createChannel();

  await channel.assertQueue("todoCreateQueue");
  channel.sendToQueue("todoCreateQueue", Buffer.from(JSON.stringify(todoData)));
  console.log("Todo creation request queued");
  await channel.close();
  await conn.close();
};

// export const setupQueues = async () => {
//   const conn = await connectRabbitMQ();
//   const channel = await conn.createChannel();
//   await channel.assertExchange("dlx.exchange", "direct", { durable: true });
//   await channel.assertQueue("dlx.queue", { durable: true });
//   await channel.bindQueue("dlx.queue", "dlx.exchange", "error");

//   // const mainQueueOptions = {
//   //   durable: true,
//   //   arguments: {
//   //     'x-dead-letter-exchange': 'dlx.exchange',
//   //     'x-dead-letter-routing-key': 'error' // Bu satırı ekleyin
//   //   }
//   // };
//   // await channel.assertQueue('mainQueue', mainQueueOptions);

//   await channel.close();
//   await conn.close();
// };

// import amqp from "amqplib";

// export const enqueueNewTodoNotification = async (todo: any) => {
//   // asenkron bir fonksiyon tanımlanıyor
//   const conn = await amqp.connect("amqp://user:password@rabbitmq");; // RabbitMQ servera bağlan
//   const channel = await conn.createChannel(); // rabbitmq serverında bir kanal oluşturuyor bu kanal veriler gönderilip alınıyor
//   const options = {
//     durable: true,
//     deadLetterExchange: "dlx.exchange",
//     deadLetterRoutingKey: "error"
//   };
//   await channel.assertQueue("todoNotifications" , options); // todoNotifications adında bir kuyruk olup olmadığına bakılır eğer yoksa oluşturur
//   channel.sendToQueue("todoNotifications", Buffer.from(JSON.stringify(todo)) , ); // todo bilgisini belritilen kuruğa ekler bu sayede rabbitmq ile kuruğa giren veriler gerekli yerlere iletilir bunu yaparken todo verisini json nesnesine çevirir sonrasında byte formatına çevirir buffer.from ile rabbitmq mesajları byte formatında kabul eder
//   console.log("Todo notification queued");
//   await channel.close(); // kanalı kapatır
//   await conn.close(); // bağlantıyı keser
// };

// export async function enqueueLog(todo: any, action: string) {
//   const conn = await amqp.connect("amqp://user:password@rabbitmq");
//   const channel = await conn.createChannel();
//   const options = {
//     durable: true,
//     deadLetterExchange: "dlx.exchange",
//     deadLetterRoutingKey: "error"
//   };
//   await channel.assertQueue("logQueue", {
//     durable: true,
//     deadLetterExchange: "dlx.exchange",
//     deadLetterRoutingKey: "error"
//   });
//   const log = {
//     todoId: todo._id,
//     userId: todo.userId,
//     action: action,
//     description: todo.description,
//     time: new Date(),
//   };
//   channel.sendToQueue("logQueue", Buffer.from(JSON.stringify(log)));
//   console.log("Log enqueued");
//   await channel.close();
//   await conn.close();
// }

// export const enqueueTodoCreate = async (todoData: any) => {
//   const conn = await amqp.connect("amqp://user:password@rabbitmq");
//   const channel = await conn.createChannel();

//   const options = {
//     durable: true,
//     arguments: {
//       'x-dead-letter-exchange': 'dlx.exchange',
//       'x-dead-letter-routing-key': 'error'
//     }
//   };

//   await channel.assertQueue("todoCreateQueue", options);
//   channel.sendToQueue("todoCreateQueue", Buffer.from(JSON.stringify(todoData)));
//   console.log("Todo creation request queued");
//   await channel.close();
//   await conn.close();
// };

// export async function setupQueues() {
//   const connection = await amqp.connect("amqp://user:password@rabbitmq"); // rabbitmq sunucusuna bağlantı kurulur
//   const channel = await connection.createChannel(); // sunucuda bir kanal oluşturulur

//   // Ölü mektup değişimini (DLX) ve kuyruğunu (DLQ) oluştur
//   await channel.assertExchange("dlx.exchange", "direct", { durable: true }); // belirtile isimde exchange olup olmadığına bakar eğer yoksa oluşturur exchange
//   //exchnage mesajların kuyruklara dağıtıldığı yerdir burada belirtilen kuyruklara gönderilir 'direct': Bu parametre, exchange türünü belirtir. direct türü, mesajların doğrudan belirli kuyruklara yönlendirilmesini sağlar. Mesajın yönlendirileceği kuyruk, mesajın üzerindeki routing key ile kuyruğun binding key'i eşleştiğinde belirlenir.
//   // durable ile sunucu kapatılsa bile mesajlar silinmez kalır
//   await channel.assertQueue("dlx.queue", { durable: true }); // girilen isimde kuruk olup olmadığına bakar eğer yoksa oluşturur durable: true ilede sunucu kapatılıp açılsa bile veriler korunur
//   await channel.bindQueue("dlx.queue", "dlx.exchange", "error"); // bindQueue ile belritilen kuyruğu belirtilen exchange e bağlar bu sayede exchangeden mesajların nasıl yönlendirileceği ayarlanır en son girilen parametre binding keydir burada boş girilmiştir b,nd,ng key ,le rout,ng key eşleşmesi gerekir exchange tipine göre yoksa buradaki exchange ile kuyruk eşleştirmesi olmaz

//   // Ana kuyruğu DLX ile ayarla
//   //const options = {
//   //durable: true, // burada kuyruğa durable:true ile kapatılıp tekrar açılsa bile veriler korunumasını sağlar
//   //deadLetterExchange: 'dlx.exchange' // exchange içindeki hatalı mesajlar buradan ayarlanıyor ve bu options adlı nesnenin kullanıldığı kuyruğa yönlendirilecek bu sayede hatalı mesajlar tek bir kuyrukta toplanacak dlx.queue de toplanack çünkü exchange oraya bağlı
//   //};
//   //await channel.assertQueue('mainQueue', options);  // bir kuruk oluşturuluyor ve ikinci parametre olarak bu kuyruğa belirli ayarlar yapılıyor kuyruk bu ayarlara uymak zorunda bundan dolayı mainQueue artık sadece hatalı mesajları barındırıcak options nesnesine göre

//   await channel.close();
//   await connection.close();
// }
