# Node.js in belirli sürümünü alpine üzerine kuruyor
FROM node:21-alpine

# /app dizinini çalışma dizini olarak ayarla
WORKDIR /app

# package json içindeki dependecies kısmı alnıyor kopyalanıyor
COPY package.json ./

# bu dosyanın bir ğst diznini kopyalar yani server içindeki tüm dosyaları kopyalar
COPY . .

RUN npm install
# Uygulamanın çalıştığı portu belirt (Node.js/Express genellikle 3000 portunu kullanır)
EXPOSE 3000

# cmd ile shell komutları çalıştırılır run komutundan farkı run komutu kalıcı cmd ise geçicidir konteyner başlatıldığında çalışır bittiğinde biter
CMD ["npm", "start"]
