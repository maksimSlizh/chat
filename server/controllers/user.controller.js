import { User } from "../models/models.js";
import { Op } from 'sequelize';

export const findUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    // Поиск пользователей по частичному совпадению с именем
    const users = await User.findAll({
      where: {
        username: {
          [Op.like]: `${username}%`  // Частичное совпадение
        }
      },
      attributes: ['id', 'username', 'fullName', 'avatar'], // Возвращаем нужные поля
      limit: 3 // Ограничиваем количество пользователей до 3
    });

    if (users.length === 0) {
      return res.status(404).json({ message: 'Пользователи не найдены' });
    }

    // Возвращаем список пользователей
    res.status(200).json(users);

  } catch (error) {
    console.error('Ошибка поиска пользователей:', error);
    res.status(500).json({ message: error.message });
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
