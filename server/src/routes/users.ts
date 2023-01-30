import express from 'express';
import { signUp } from '../controllers/usersController';

const router = express.Router();

router.post('/signup', signUp);

export default router;
