import express from 'express';
import  makeAdmin  from '../controllers/makeAdminController';
import { authorize } from '../middlewares/authorizeMiddleware';

const router = express.Router();

// Yönetici yapma rotası
router.patch('/:id', authorize(['admin']), makeAdmin);  

export default router;
