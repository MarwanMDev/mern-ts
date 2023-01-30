import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import UserModel from '../models/user';
import bcrypt from 'bcrypt';

interface SignUpBody {
  username?: string;
  email?: string;
  password?: string;
}

export const signUp: RequestHandler<
  unknown,
  unknown,
  SignUpBody,
  unknown
> = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password)
      throw createHttpError(400, 'Invalid parameters.');

    const existingUsername = await UserModel.findOne({
      username: username,
    }).exec();

    if (existingUsername)
      throw createHttpError(
        409,
        'Username already in use, please choose a another one.'
      );

    const existingEmail = await UserModel.findOne({ email: email });

    if (existingEmail)
      throw createHttpError(
        409,
        'Email already in use, please choose a another one.'
      );

    const hashedPassword = await bcrypt.hash(password, 10);

    const nUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(200).json(nUser);
  } catch (error) {
    next(error);
  }
};
