import express, { Request, Response, NextFunction } from "express";
import logger from '../services/logger';

// Sayfa ziyaretlerini loglayan middleware
const pathLog = (req:   Request, res: Response, next: NextFunction) => {

  const logPath = (req as any).body.path;
  const userId = (req as any).userId;
  console.log("loglayan kullanıcı:" , userId)

  logger.info({
    path: logPath,
    time: new Date(),
    userId: (req as any).userId , // Eğer kimlik doğrulama yapılıyorsa
    action:  "logged in",
    description: logPath
    
  });
  next(); // İstek işlem zincirinin devam etmesini sağlar
};

 export default pathLog;
