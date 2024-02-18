import express from 'express';
import  makeAdmin  from '../controllers/makeAdminController';
import  authorize  from '../middlewares/authorizeMiddleware';
import verifyToken from '../middlewares/verifyToken';

const makeAdminRouter = express.Router();

// Yönetici yapma rotası
makeAdminRouter.patch('/:id', makeAdmin);  

export default makeAdminRouter;
