import bcrypt from 'bcryptjs';
import { User } from "../models/models.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import path from 'path';
import fs from 'fs';

// Контроллер регистрации
export const signup = async (req, res) => {
  try {
    const { email, password, fullName, username } = req.body;

    // Проверяем уникальность username
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ message: "Пользователь с таким username уже существует" });
    }

    // Проверяем уникальность email
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: "Этот email уже зарегистрирован" });
    }

    // Генерируем хэш пароля
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    // Проверяем, была ли загружена аватарка
    let avatarPath = null;
    if (req.files && req.files.avatar) {
      let avatarFile = req.files.avatar;

      // Создаем уникальное имя для файла аватарки
      const avatarFileName = Date.now() + path.extname(avatarFile.name);

      // Определяем путь для сохранения файла
      avatarPath = `/uploads/avatars/${avatarFileName}`;

      // Сохраняем файл аватарки на сервере
      avatarFile.mv(`./uploads/avatars/${avatarFileName}`, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Ошибка при загрузке файла' });
        }
      });
    }

    // Создаем нового пользователя
    const newUser = await User.create({
      email,
      password: hashPassword,
      fullName,
      username,
      avatar: avatarPath,  // Сохраняем путь к аватарке или null
    });

    // Генерируем токен и устанавливаем куки
    generateTokenAndSetCookie(newUser.id, res);

    res.status(201).json({
      message: "Пользователь успешно зарегистрирован",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Проверяем существует ли пользователь
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Пользователь не найден" });
    }

    // Проверяем пароль
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Неверный пароль" });
    }

  } catch (error) {

  }
}
