import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

// Модель пользователя
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6], // Минимальная длина пароля 6 символов
    }
  },
  avatar: {
    type: DataTypes.STRING,
  },
});

// Модель сообщения
const Message = sequelize.define('Message', {
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,  // Ссылка на модель пользователя (отправителя)
      key: 'id',
    },
  },
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,  // Ссылка на модель пользователя (получателя)
      key: 'id',
    },
  },
  conversationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Conversations',  // Ссылка на модель переписки
      key: 'id',
    },
  }
});

// Модель переписки (Conversation)
const Conversation = sequelize.define('Conversation', {
  participants: {
    type: DataTypes.JSON,  // Хранение массива участников (ID пользователей) в формате JSON
    allowNull: false,      // Поле обязательное
  },
  messages: {
    type: DataTypes.JSON,  // Хранение массива сообщений (ID сообщений) в формате JSON
    allowNull: false,
    defaultValue: [],      // Значение по умолчанию - пустой массив
  }
});

// Связи между моделями

// Один пользователь может участвовать в нескольких переписках (многие ко многим)
User.belongsToMany(Conversation, {
  through: 'UserConversations',  // Промежуточная таблица для связи многие ко многим
  foreignKey: 'userId',
  otherKey: 'conversationId'
});

Conversation.belongsToMany(User, {
  through: 'UserConversations',
  foreignKey: 'conversationId',
  otherKey: 'userId'
});

// Одна переписка может содержать несколько сообщений
Conversation.hasMany(Message, { foreignKey: 'conversationId', as: 'conversationMessages' });  // Переименовали алиас
Message.belongsTo(Conversation, { foreignKey: 'conversationId' });

// Одно сообщение принадлежит одному пользователю (отправителю)
User.hasMany(Message, { foreignKey: 'userId' });
Message.belongsTo(User, { foreignKey: 'userId' });

// Связь сообщения с получателем (receiverId)
User.hasMany(Message, { foreignKey: 'receiverId', as: 'receivedMessages' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

// Экспортируем модели
export { User, Message, Conversation };
