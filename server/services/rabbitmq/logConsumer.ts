import amqp from "amqplib";
import LogModel from '../../models/logModel'; // LogModel, MongoDB modelinizi temsil eder

export async function startLogConsumer() { 
    const conn = await amqp.connect("amqp://user:password@rabbitmq");
    const channel = await conn.createChannel();
    await channel.assertQueue('logQueue');

    channel.consume('logQueue', async (message) => {
        if (!message) {
            console.log('No message received');
            return;
        }
        const logData = JSON.parse(message.content.toString());
        console.log('Processing log:', logData);

        try {
            const newLog = new LogModel(logData);
            await newLog.save(); // Log kaydını MongoDB'ye kaydet
            console.log('Log saved to database:', logData);
        } catch (error) {
            console.error('Error saving log to database:', error);
            channel.nack(message)
        }

        channel.ack(message);
    });
}
