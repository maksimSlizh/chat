import React from 'react';
import unknown from '../../assets/images/images.jpeg'; // Импортируем изображение по умолчанию

export default function UserAvatar({ user }) {
  const avatarSrc = user.avatar ? `http://localhost:8000${user.avatar}` : unknown; // Проверка на наличие аватара

  return (
    <img src={avatarSrc} alt="User Avatar" className="user-avatar" />
  );
}
