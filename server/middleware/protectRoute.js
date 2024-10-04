import jwt from 'jsonwebtoken';
import { User } from '../models/models.js';

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    // Проверяем наличие токена
    if (!token) {
      return res.status(401).json({ message: "Пользователь не авторизован" });
    }

    // Расшифровываем токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Логируем расшифрованный токен
    console.log("Расшифрованный токен:", decoded);

    // Извлекаем userId вместо id
    const userId = decoded.userId;

    // Логируем ID пользователя
    console.log("Идентификатор пользователя из токена:", userId);

    // Ищем пользователя по userId
    const user = await User.findByPk(userId, {
      attributes: { include: ['password'] },
    });

    // Логируем результат поиска пользователя
    if (!user) {
      console.log("Пользователь не найден");
      return res.status(401).json({ message: "Пользователь не найден, ProtectRoute user" });
    }

    // Сохраняем информацию о пользователе в req.user
    req.user = user;

    next();
  } catch (error) {
    res.status(500).json({ message: error.message, error: 'protectRoute middleware' });
  }
}

export default protectRoute;
