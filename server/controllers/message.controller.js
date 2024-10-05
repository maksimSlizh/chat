import { Conversation, Message, User } from '../models/models.js';
import sequelize from '../sequelize.js';  // Убедитесь, что sequelize импортирован правильно

// Личное сообщение
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;  // Получатель из URL
    const senderId = req.user.id;           // Отправитель из авторизации

    const numericSenderId = Number(senderId);
    const numericReceiverId = Number(receiverId);

    // Поиск существующей личной переписки (два участника)
    let conversation = await Conversation.findOne({
      where: sequelize.literal(
        `JSON_CONTAINS(participants, '[${numericSenderId}]') AND JSON_CONTAINS(participants, '[${numericReceiverId}]') AND JSON_LENGTH(participants) = 2`
      )
    });

    // Если переписка не найдена, создаем новую
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [numericSenderId, numericReceiverId],
        messages: []
      });
    }

    // Создание нового сообщения
    const newMessage = await Message.create({
      userId: numericSenderId,        // Отправитель
      receiverId: numericReceiverId,  // Получатель
      message,                        // Текст сообщения
      conversationId: conversation.id // ID переписки
    });

    // Обновляем массив сообщений в переписке
    const updatedMessages = [...conversation.messages, newMessage.id];
    await conversation.update({ messages: updatedMessages });

    res.status(201).json({ message: 'Сообщение отправлено', newMessage });

  } catch (error) {
    console.error('Ошибка в sendMessage controller:', error);
    res.status(500).json({ message: error.message, error: 'sendMessage controller' });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: conversationId } = req.params;  // ID переписки из URL

    // Поиск переписки по её ID
    const conversation = await Conversation.findOne({
      where: { id: conversationId },
      include: [
        {
          model: Message,
          as: 'conversationMessages',  // Загрузка всех сообщений
          order: [['createdAt', 'ASC']]  // Сообщения отсортированы по времени
        },
        {
          model: User,  // Загрузка информации о пользователях (участниках)
          attributes: ['id', 'username', 'fullName'],
          through: { attributes: [] }  // Не загружаем промежуточные данные
        }
      ]
    });

    // Проверяем, существует ли переписка
    if (!conversation) {
      return res.status(404).json({ message: 'Переписка не найдена' });
    }

    // Возвращаем все сообщения переписки и информацию об участниках
    res.status(200).json({
      participants: conversation.Users,  // Информация об участниках
      messages: conversation.conversationMessages  // Все сообщения
    });

  } catch (error) {
    console.error('Ошибка в getMessages controller:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getUserConversations = async (req, res) => {
  try {
    const userId = Number(req.user.id);  // Убедимся, что ID пользователя - число

    // Поиск всех переписок, где участвует пользователь
    const conversations = await Conversation.findAll({
      where: sequelize.literal(`JSON_CONTAINS(participants, '[${userId}]')`),  // Проверяем наличие userId в поле participants
      include: [
        {
          model: Message,
          as: 'conversationMessages',
          limit: 1,  // Получаем только последнее сообщение для каждой переписки
          order: [['createdAt', 'DESC']]  // Сортировка сообщений по дате
        },
        {
          model: User,  // Загрузка информации о пользователях
          attributes: ['id', 'username', 'fullName', 'avatar'],
          through: { attributes: [] }  // Не нужно загружать промежуточные данные
        }
      ]
    });

    // Если переписок нет, возвращаем 404
    if (!conversations || conversations.length === 0) {
      return res.status(404).json({ message: 'У вас нет переписок' });
    }

    // Возвращаем список переписок с последними сообщениями и информацией о пользователях
    res.status(200).json(conversations);

  } catch (error) {
    console.error('Ошибка в getUserConversations controller:', error);
    res.status(500).json({ message: error.message });
  }
};

export const createGroupConversation = async (req, res) => {
  try {
    const { groupName, participants } = req.body;  // Название группы и ID участников

    if (!groupName || !participants || participants.length < 2) {
      return res.status(400).json({ message: 'Группа должна содержать название и хотя бы двух участников' });
    }

    // Найдем всех пользователей по их ID
    const users = await User.findAll({
      where: {
        id: participants
      }
    });

    if (users.length !== participants.length) {
      return res.status(400).json({ message: 'Некоторые пользователи не найдены' });
    }

    // Добавляем текущего пользователя как создателя группы
    const creatorId = req.user.id;
    if (!participants.includes(creatorId)) {
      participants.push(creatorId);
    }

    // Создаем новую группу (переписку)
    const newConversation = await Conversation.create({
      participants,  // Массив ID участников
      messages: [],  // Массив для сообщений, который можно будет обновлять
      groupName      // Название группы
    });

    res.status(201).json({ message: 'Группа успешно создана', conversation: newConversation });
  } catch (error) {
    console.error('Ошибка при создании группы:', error);
    res.status(500).json({ message: error.message });
  }
};

export const sendGroupMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const conversationId = Number(req.params.id);  // Преобразуем ID переписки (группы) в число
    const senderId = req.user.id;  // ID отправителя

    // Найдем групповую переписку по ID
    const conversation = await Conversation.findOne({
      where: { id: conversationId },
      include: [
        {
          model: User,  // Подгружаем участников группы
          attributes: ['id', 'username', 'fullName']
        }
      ]
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Группа не найдена' });
    }

    // Проверяем, является ли отправитель участником группы
    if (!conversation.participants.includes(senderId)) {
      return res.status(403).json({ message: 'Вы не являетесь участником этой группы' });
    }

    // Создаем сообщение
    const newMessage = await Message.create({
      userId: senderId,
      message,               // Текст сообщения
      conversationId         // ID переписки (группы)
    });

    // Обновляем массив сообщений в переписке
    const updatedMessages = [...conversation.messages, newMessage.id];
    await conversation.update({ messages: updatedMessages });

    res.status(201).json({ message: 'Сообщение отправлено', newMessage });
  } catch (error) {
    console.error('Ошибка в sendGroupMessage controller:', error);
    res.status(500).json({ message: error.message });
  }
};

