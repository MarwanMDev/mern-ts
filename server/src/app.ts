import { NextFunction } from 'connect';
import 'dotenv/config';
import express from 'express';
import createHttpError, { isHttpError } from 'http-errors';
import morgan from 'morgan';
import notesRoutes from './routes/notes';

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(express.json());

// Notes Routes
app.use('/api/notes', notesRoutes);

// Not found routes handler
app.use((_req, _res, next) => {
  next(createHttpError(404, 'Endpoint not found.'));
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
    let statusCode = 500;
    if (isHttpError(error)) {
      statusCode = error.status;
      errMsg = error.message;
    }
    res.status(statusCode).json({ error: errMsg });
  }
);

export default app;
