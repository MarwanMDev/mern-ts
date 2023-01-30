import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import UserModel from '../models/user';
import bcrypt from 'bcrypt';

export const getAuthenticatedUser: RequestHandler = async (
  req,
  res,
  next
) => {
  const authenticatedUserId = req.session.userId;

  try {
    if (!authenticatedUserId)
      throw createHttpError(401, 'User not authenticated.');

    const authenticatedUser = await UserModel.findById(
      authenticatedUserId
    )
      .select('+email')
      .exec();
    res.status(200).json(authenticatedUser);
  } catch (error) {
    next(error);
  }
};

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

    req.session.userId = nUser._id;

    res.status(200).json(nUser);
  } catch (error) {
    next(error);
  }
};

interface LoginBody {
  username?: string;
  password?: string;
}

export const logIn: RequestHandler<
  unknown,
  unknown,
  LoginBody,
  unknown
> = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    if (!username || !password)
      throw createHttpError(400, 'missing username or password.');

    const user = await UserModel.findOne({ username })
      .select('+password +email')
      .exec();

    if (!user) throw createHttpError(401, 'Invalid credentials.');

    const matchPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!matchPassword)
      throw createHttpError(401, 'Invalid credentials.');

    req.session.userId = user._id;

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) next(error);
    else res.sendStatus(200);
  });
};
