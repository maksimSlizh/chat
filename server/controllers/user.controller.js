import { User } from "../models/models.js";
import { Op } from 'sequelize';

export const findUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;  // Получаем никнейм из параметров URL

    // Поиск пользователя по никнейму
    const user = await User.findOne({
      where: { username },  // Ищем пользователя с этим никнеймом
      attributes: ['id', 'username', 'fullName', 'avatar']  // Возвращаем только нужные поля
    });

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Возвращаем ID и информацию о пользователе
    res.status(200).json({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      avatar: user.avatar
    });

  } catch (error) {
    res.status(500).json({ message: error.message, error: 'findUserByUsername controller' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    // Получаем всех пользователей, включая их id, имя и роль
    const users = await User.findAll({
      attributes: ['id', 'fullName', 'role']  // Указываем, какие поля вернуть
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message, 'error': 'getAllUsers controller' });
  }
};
