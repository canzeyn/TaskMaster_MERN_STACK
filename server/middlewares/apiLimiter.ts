import express from "express";
const rateLimit = require('express-rate-limit');

// Oran sınırlayıcıyı yapılandır
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100, // Belirtilen süre içinde her IP için maksimum 100 istek
  message: "Çok fazla istek gönderdiniz. Lütfen daha sonra tekrar deneyiniz.", // Limit aşıldığında gönderilecek mesaj
});

export default apiLimiter;
