import React, { useState, useEffect } from 'react';
import { IoMdClose } from "react-icons/io";
import { getLocalStorage, setLocalStorage } from '../../../helpers/localsorage'
import { updatedAvatar, changePassword } from '../../../http/authApi'
import { useDispatch } from 'react-redux';
import { setUser } from '../../../redux/authSlice'

export default function ProfileModal({ onClose }) {
  const dispatch = useDispatch()
  const [avatar, setAvatar] = useState(null);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  const user = getLocalStorage('user')

  useEffect(() => {
    if (user) {
      setAvatar(`http://localhost:8000${user.avatar}` || 'https://via.placeholder.com/150');
      setEmail(user.email || '');
      setUsername(user.username || '');
      setFullName(user.fullName || '');
    }
  }, [user]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file)

      try {
        const data = await updatedAvatar(formData)
        const newAvatarUrl = data.avatar
        setAvatar(newAvatarUrl)

        const updatedUser = { ...user, avatar: newAvatarUrl };
        setLocalStorage('user', updatedUser)

        dispatch(setUser(updatedUser));

        alert('Аватарка успешно обновлена');
      } catch (error) {
        alert('Не удалось обновить аватар');
      }
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword) {
      alert('Пожалуйста, заполните оба поля для смены пароля');
      return;
    }

    try {
      await changePassword({
        currentPassword,
        newPassword,
      });
      alert('Пароль успешно обновлен');
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      alert('Не удалось сменить пароль');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>
          <IoMdClose />
        </button>
        <h2>Редактировать профиль</h2>

        {/* Avatar */}
        <div className="modal-avatar">
          <img src={avatar} alt="avatar" />
          <input type="file" className="form-control" onChange={handleAvatarChange} />
        </div>

        {/* Fields for profile change */}
        <div className="modal-field">
          <label>Email: {email}</label>
        </div>

        <div className="modal-field">
          <label>Никнейм: {username}</label>
        </div>

        <div className="modal-field">
          <label>Полное имя: {fullName}</label>
        </div>

        {/* Button to change password */}
        <button className='btn btn-primary' onClick={() => setShowPasswordForm(prev => !prev)}>
          {showPasswordForm ? 'Скрыть форму смены пароля' : 'Сменить пароль'}
        </button>

        {/* Password change form */}
        {showPasswordForm && (
          <div className="modal-password">
            <h3>Сменить пароль</h3>
            <input
              type="password"
              placeholder="Текущий пароль"
              className='form-control mt-2'
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Новый пароль"
              className='form-control mt-2'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button className="btn btn-success mt-3" onClick={handlePasswordChange}>
              Сменить пароль
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
