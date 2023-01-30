import { NextFunction } from 'connect';
import MongoStore from 'connect-mongo';
import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import createHttpError, { isHttpError } from 'http-errors';
import morgan from 'morgan';
import notesRoutes from './routes/notes';
import usersRoutes from './routes/users';
import env from './util/validateEnv';

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(express.json());

// Express session
app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000,
    },
    rolling: true,
    store: MongoStore.create({
      mongoUrl: env.MONGO_DB_URI,
    }),
  })
);

// Notes Routes
app.use('/api/notes', notesRoutes);

// Users Routes
app.use('/api/users', usersRoutes);
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
