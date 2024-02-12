import express from 'express';
import  deleteUser  from '../controllers/deleteUsercontroller';
import { Router } from 'express';

const DeleteUserRouter = Router();

DeleteUserRouter.delete('/:id', deleteUser); // Kullanıcı silme route'u

export default DeleteUserRouter;