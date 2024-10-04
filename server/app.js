import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import sequelize from './sequelize.js';
import { User, Message, Conversation } from './models/models.js';
import router from './routes/index.js';


const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());

app.use('/api', router);
app.use('/uploads/avatars', express.static('uploads/avatars'));
// Запуск сервера
const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.log('Unable to connect to the database', error);
  }
}

start();
