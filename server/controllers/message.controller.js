import { Conversation, Message } from '../models/models.js';
import sequelize from '../sequelize.js';  // Убедитесь, что sequelize импортирован правильно

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user.id;

    const numericSenderId = Number(senderId);
    const numericReceiverId = Number(receiverId);

    // Поиск существующей переписки с использованием JSON_CONTAINS
    let conversation = await Conversation.findOne({
      where: sequelize.literal(`JSON_CONTAINS(participants, '[${numericSenderId}]') AND JSON_CONTAINS(participants, '[${numericReceiverId}]')`)
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

    // Отправляем успешный ответ
    res.status(201).json({ message: 'Сообщение отправлено', newMessage });

  } catch (error) {
    // Логирование ошибки
    console.error('Ошибка в sendMessage controller:', error);
    res.status(500).json({ message: error.message, error: 'sendMessage controller' });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user.id;

    const numericSenderId = Number(senderId);
    const numericuserToChatId = Number(userToChatId);

    // Поиск переписки с использованием JSON_CONTAINS
    const conversation = await Conversation.findOne({
      where: sequelize.literal(`JSON_CONTAINS(participants, '[${numericSenderId}]') AND JSON_CONTAINS(participants, '[${numericuserToChatId}]')`),
      include: [{
        model: Message,  // Загрузка связанных сообщений
        as: 'conversationMessages'  // Используем новый алиас
      }]
    });

    if (!conversation) {
      return res.status(404).json({});
    }
    res.status(200).json(conversation.conversationMessages);


  } catch (error) {
    // Логирование ошибки
    console.error('Ошибка в getMessages controller:', error);
    res.status(500).json({ message: error.message, error: 'getMessages controller' });
  }
};
