import { Router } from 'express';
import {
  authenticateUserController,
  createUserController,
  //getUserController,
} from './auth.controller';

export const router = Router();
router.post('/login', authenticateUserController);
router.post('/register', createUserController);
