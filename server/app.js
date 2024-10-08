import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from './sequelize.js';
import router from './routes/index.js';
import { app, server } from './socket/socket.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const PORT = process.env.PORT || 5000;

dotenv.config();

// Настройки CORS
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());


app.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 }, // Лимит на загрузку 10MB
}));

// Путь к статическим файлам
app.use('/uploads/avatars', express.static(path.join(__dirname, 'uploads', 'avatars')));

app.use('/api', router);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.log('Unable to connect to the database', error);
  }
}

start();
