import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Исправлено: useSelector с маленькой буквы
import Main from './pages/Main';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';

function App() {
  const { isAuth } = useSelector((state) => state.auth); // Исправлено: useSelector с маленькой буквы

  return (
    <Routes>
      {/* Главная страница */}
      <Route path="/" element={isAuth ? <Main /> : <Navigate to="/auth/login" />} />

      {/* Аутентификация */}
      <Route path="/auth">
        {/* Если заходим на /auth, перенаправляем на /auth/login */}
        <Route index element={<Navigate to="login" />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>

      {/* 404 страница или редирект на главную */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
