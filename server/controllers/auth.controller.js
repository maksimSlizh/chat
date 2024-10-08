import bcrypt from 'bcryptjs';
import { User } from "../models/models.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import path from 'path';
import { fileURLToPath } from 'url';

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

    generateTokenAndSetCookie(user.id, res);

    res.status(200).json({
      message: "Пользователь успешно авторизован",
      user,
    });

  } catch (error) {
    res.status(500).json({ message: error.message, 'error': 'login controller' });
  }
}

export const logout = (req, res) => {
  try {
    res.clearCookie('token', '', { maxAge: 0, });
    res.status(200).json({ message: "Вы вышли из аккаунта" });
  } catch (error) {
    res.status(500).json({ message: error.message, 'error': 'logout controller' });
  }
}

export const updateAvatar = async (req, res) => {
  try {

    const userId = req.user.id;  // Извлекаем ID пользователя
    if (!userId) {
      return res.status(401).json({ message: "Пользователь не авторизован" });
    }

    // Проверяем, была ли загружена аватарка
    if (req.files && req.files.avatar) {
      const avatarFile = req.files.avatar;

      // Определяем путь для сохранения файла аватара
      const avatarFileName = Date.now() + path.extname(avatarFile.name);
      const avatarFilePath = path.resolve('uploads', 'avatars', avatarFileName); // Корректный путь для загрузки

      console.log('Путь для сохранения аватарки:', avatarFilePath); // Логирование пути для отладки

      // Сохраняем файл аватарки на сервере
      avatarFile.mv(avatarFilePath, async (err) => {
        if (err) {
          console.error('Ошибка при сохранении файла:', err); // Логируем ошибки сохранения
          return res.status(500).json({ message: 'Ошибка при загрузке файла' });
        }

        try {
          // Обновляем запись о пользователе в базе данных с новым путем аватара
          const avatarUrl = `/uploads/avatars/${avatarFileName}`; // Путь для использования на клиенте
          await User.update({ avatar: avatarUrl }, { where: { id: userId } });

          // Отправляем успешный ответ с новым аватаром
          res.status(200).json({ message: 'Аватарка успешно обновлена', avatar: avatarUrl });
        } catch (dbError) {;
          res.status(500).json({ message: 'Ошибка при обновлении базы данных' });
        }
      });
    } else {
      res.status(400).json({ message: 'Не выбрана аватарка для обновления' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Найти пользователя
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Проверить текущий пароль
    const isPasswordCorrect = bcrypt.compareSync(currentPassword, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Неверный текущий пароль' });
    }

    // Хэшировать новый пароль
    const salt = bcrypt.genSaltSync(10);
    const hashNewPassword = bcrypt.hashSync(newPassword, salt);

    // Обновить пароль в базе данных
    await User.update({ password: hashNewPassword }, { where: { id: userId } });

    res.status(200).json({ message: 'Пароль успешно обновлен' });
  } catch (error) {
    res.status(500).json({ message: error.message, 'error': 'changePassword controller' });
  }
};
