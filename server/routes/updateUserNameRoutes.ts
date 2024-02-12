import express from 'express';
import { updateUser } from '../controllers/updateUserNameController';
import { Router } from 'express';

const router = Router();

router.patch('/:id', updateUser);

export default router;