import { createContext, useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
}

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      const socket = io('http://localhost:8000', {
        query: {
          userId: user.id // Проверьте, что используете правильный ID
        }
      });

      setSocket(socket);

      socket.on('getOnlineUsers', (users) => {
        setOnlineUsers(users); // Убедитесь, что здесь правильно обрабатываются онлайн пользователи
      });

      return () => {
        socket.disconnect(); // Правильное закрытие сокета
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
}
