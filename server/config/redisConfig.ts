
import { createClient } from 'redis';

require('dotenv').config();

// Redis client'ını yapılandır: Redis sunucusuna bağlantı kurmak için bir istemci oluşturur.
// 'url' ile Redis sunucusunun adresini ve portunu belirtiriz.
const client = createClient({ 
    url: `redis://redis:6379` 
});

// Redis ile iletişim sırasında herhangi bir hata oluşursa bu hatayı yakalar ve konsola yazdırır.
client.on('error', (err: Error) => console.log('Redis Client Error', err));

client.connect(); // Redis sunucusuna bağlanmayı başlatır. Bu komut, client'ın sunucuya bağlantısını etkinleştirir.

export default client;