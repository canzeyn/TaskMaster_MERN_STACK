import amqp from "amqplib";


export const enqueueNewTodoNotification = async (todo:any) => { // asenkron bir fonksiyon tanımlanıyor
    const conn = await amqp.connect('amqp://localhost'); // RabbitMQ servera bağlan
    const channel = await conn.createChannel(); // rabbitmq serverında bir kanal oluşturuyor bu kanal veriler gönderilip alınıyor
    await channel.assertQueue('todoNotifications'); // todoNotifications adında bir kuyruk olup olmadığına bakılır eğer yoksa oluşturur
    channel.sendToQueue('todoNotifications', Buffer.from(JSON.stringify(todo))); // todo bilgisini belritilen kuruğa ekler bu sayede rabbitmq ile kuruğa giren veriler gerekli yerlere iletilir bunu yaparken todo verisini json nesnesine çevirir sonrasında byte formatına çevirir buffer.from ile rabbitmq mesajları byte formatında kabul eder
    console.log('Todo notification queued');
    await channel.close(); // kanalı kapatır
    await conn.close(); // bağlantıyı keser
}

 export async function enqueueLog(todo:any, action:string) {
    const conn = await amqp.connect('amqp://localhost');
    const channel = await conn.createChannel();
    await channel.assertQueue('logQueue');
    const log = {
        todoId: todo._id,
        userId: todo.userId,
        action: action,
        description: todo.description,
        time: new Date()
    };
    channel.sendToQueue('logQueue', Buffer.from(JSON.stringify(log)));
    console.log('Log enqueued');
    await channel.close();
    await conn.close();
}
