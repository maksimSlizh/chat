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
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user',  // По умолчанию "user", но может быть "admin"
  }
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
      model: User,
      key: 'id',
    },
  },
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: true,  // ReceiverId не обязательно для групповых сообщений
    references: {
      model: User,
      key: 'id',
    },
  },
  conversationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Conversations',
      key: 'id',
    },
  }
});

// Модель переписки (Conversation)
const Conversation = sequelize.define('Conversation', {
  participants: {
    type: DataTypes.JSON,
    allowNull: false,  // Участники переписки (массив ID пользователей)
  },
  messages: {
    type: DataTypes.JSON,  // Массив сообщений (ID сообщений)
    allowNull: false,
    defaultValue: [],
  }
});

// Связи между моделями

User.belongsToMany(Conversation, {
  through: 'UserConversations',
  foreignKey: 'userId',
  otherKey: 'conversationId'
});

Conversation.belongsToMany(User, {
  through: 'UserConversations',
  foreignKey: 'conversationId',
  otherKey: 'userId'
});

// Одна переписка может содержать несколько сообщений
Conversation.hasMany(Message, { foreignKey: 'conversationId', as: 'conversationMessages' });
Message.belongsTo(Conversation, { foreignKey: 'conversationId' });

// Экспортируем модели
export { User, Message, Conversation };
