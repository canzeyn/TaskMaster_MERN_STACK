import amqp from "amqplib";
import LogModel from '../../models/logModel'; // LogModel, MongoDB modelinizi temsil eder

async function startLogConsumer() { 
    const conn = await amqp.connect('amqp://localhost');
    const channel = await conn.createChannel();
    await channel.assertQueue('logQueue');

    channel.consume('logQueue', async (message) => {
        if (!message) {
            console.log('No message received');
            return;
        }
        const log = JSON.parse(message.content.toString());
        console.log('Processing log:', log);

        try {
            const newLog = new LogModel(log);
            await newLog.save(); // Log kaydını MongoDB'ye kaydet
            console.log('Log saved to database:', log);
        } catch (error) {
            console.error('Error saving log to database:', error);
        }

        channel.ack(message);
    });
}
