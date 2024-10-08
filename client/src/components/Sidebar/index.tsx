import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../redux/authSlice';
import { fetchConversations, selectConversation, fetchMessages, clearMessages, setSelectedUser } from '../../redux/messageSlice';
import Search from '../Search';
import UserListModal from '../UsersGetModal/index';
import CardSidebar from '../Cards/CardSidebar';
import ProfileModal from '../Auth/ProfileModal';
import GroupChatModal from '../GroupChatModal';
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdClose } from "react-icons/io";
import unknown from '../../assets/images/images.jpeg';
import { getLocalStorage } from '../../helpers/localsorage';
import { useSocketContext } from '../../context/socketContext';

export default function Sidebar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isGroupChatModalOpen, setIsGroupChatModalOpen] = useState(false);
  const [isUserListModalOpen, setIsUserListModalOpen] = useState(false);
  const { conversations, loading, error, selectedConversation } = useSelector((state) => state.message);
  const { isAuth, user: currentUser } = useSelector((state) => state.auth);
  const { onlineUsers } = useSocketContext();
  const onlineUsersAsNumbers = onlineUsers.map(Number); // Преобразуем все элементы массива в числа
  const isOnline = onlineUsersAsNumbers.includes(currentUser?.id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const avatarSrc = unknown;

  const handleSelectUser = (user) => {
    dispatch(clearMessages());
    dispatch(selectConversation(null));
    dispatch(setSelectedUser(user));
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const user = getLocalStorage('user');
    if (user) {
      dispatch(fetchConversations());
    }
  }, [dispatch]);

  const handleConversationClick = (conversation) => {
    dispatch(selectConversation(conversation));
    dispatch(fetchMessages(conversation.id));
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileModal = () => {
    setIsProfileModalOpen(!isProfileModalOpen);
  };

  const toggleUserListModal = () => {
    setIsUserListModalOpen(!isUserListModalOpen);
    console.log(isUserListModalOpen); // Переключаем модальное окно пользователей
  };

  const toggleGroupChatModal = () => {
    setIsGroupChatModalOpen(!isGroupChatModalOpen);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className='sidebar ps-4 pt-4 pe-4'>
      <div className='d-flex justify-content-between align-items-center pb-3 border-bottom' style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}>
        <button className="sidebar__button" onClick={toggleMenu}>
          <RxHamburgerMenu />
        </button>
        <Search onSelectUser={handleSelectUser} />
      </div>

      <div className='sidebar__content mt-4 mb-4 pe-1'>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p></p>
        ) : (
          conversations.map((conversation) => {
            const isGroupChat = !!conversation.groupName; // Проверяем, является ли это групповым чатом
            const otherParticipant = conversation.otherParticipants[0] || {}; // Берем первого участника или пустой объект
            const avatar = isGroupChat
              ? avatarSrc // Используем изображение по умолчанию для группового чата
              : otherParticipant.avatar
                ? `http://localhost:8000${otherParticipant.avatar}`
                : avatarSrc; // Используем изображение по умолчанию, если аватар отсутствует

            const lastMessage = conversation.conversationMessages[0]?.message || 'No messages';
            const username = isGroupChat ? conversation.groupName : (conversation.otherParticipants[0]?.username || 'Unknown');

            const isSelected = selectedConversation && selectedConversation.id === conversation.id;

            return (
              <div
                key={conversation.id}
                className={`sidebar__card-container ${isSelected ? 'selected' : ''}`}
                onClick={() => handleConversationClick(conversation)}
              >
                <span className={`sidebar__status ${isOnline ? 'online' : 'offline'}`}></span>
                <CardSidebar
                  avatar={avatar}
                  username={username}
                  message={lastMessage}
                  isSelected={isSelected}
                />
              </div>
            );
          })
        )}
      </div>

      <div className={`sidebar__menu ${isMenuOpen ? 'sidebar__menu--open' : ''}`}>
        <div className='d-flex justify-content-between'>
          <img src={currentUser.avatar ? `http://localhost:8000${currentUser.avatar}` : unknown} alt="avatar" className="sidebar__image" />
          <button className="sidebar__close-button" onClick={toggleMenu}>
            <IoMdClose />
          </button>
        </div>
        <ul className="sidebar__menu-list">
          <li><button onClick={toggleProfileModal}>Открыть профиль</button></li>
          <li><button onClick={toggleGroupChatModal}>Создать групповой чат</button></li>
          {currentUser.role === 'admin' && ( // Проверка роли
            <li><button onClick={toggleUserListModal}>Выгрузить данные</button></li>
          )}
          <li><button onClick={handleLogout}>Выйти из аккаунта</button></li>
        </ul>
      </div>

      {isProfileModalOpen && <ProfileModal onClose={toggleProfileModal} />}
      {isGroupChatModalOpen && (
        <GroupChatModal
          onClose={toggleGroupChatModal}
          currentUser={currentUser}
        />
      )}
       {isUserListModalOpen && <UserListModal onClose={toggleUserListModal} />}
    </div>
  );
}
