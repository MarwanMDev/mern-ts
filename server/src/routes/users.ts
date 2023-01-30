import express from 'express';
import {
  getAuthenticatedUser,
  logIn,
  signUp,
  logout,
} from '../controllers/usersController';

const router = express.Router();

router.get('/', getAuthenticatedUser);
router.post('/signup', signUp);
router.post('/login', logIn);
router.post('/logout', logout);

export default router;
