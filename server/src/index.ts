import app from './app';
import env from './util/validateEnv';
import mongoose from 'mongoose';

const port = env.PORT || 5000;

mongoose.set('strictQuery', false);
mongoose
  .connect(env.MONGO_DB_URI)
  .then(() => {
    console.log('Connected to Database');
    app.listen(port, () => {
      console.log(`listening on port: ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
