import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';

const app = express();

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello World');
});
mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.MONGO_DB_URI || '')
  .then(() => {
    console.log('Connected to Database');
    app.listen(port, () => {
      console.log(`listening on port: ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
