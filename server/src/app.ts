import { NextFunction } from 'connect';
import 'dotenv/config';
import express from 'express';
import NoteModel from './models/note';

const app = express();

app.get('/', async (_req, res, next) => {
  try {
    const notes = await NoteModel.find().exec();
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
});

app.use((_req, _res, next) => {
  next(Error('Endpoint not found.'));
});

app.use(
  (
    error: unknown,
    _req: express.Request,
    res: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
  ) => {
    console.error(error);
    let errMsg = 'error occurred while fetching notes';
    if (error instanceof Error) errMsg = error.message;
    res.status(500).json({ error: errMsg });
  }
);

export default app;
