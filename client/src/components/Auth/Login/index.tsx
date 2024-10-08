import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { login } from '../../../http/authApi';
import { useDispatch } from 'react-redux';
import { setUser, setIsAuth } from '../../../redux/authSlice'

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      email,
      password
    };

    try {
      const response = await login(data)

      dispatch(setUser(response.user))
      dispatch(setIsAuth(true))
      localStorage.setItem('user', JSON.stringify(response.user))

      setEmail('');
      setPassword('');

      navigate('/');
    } catch (error) {
      console.error('Login error:', error)
      alert('Неверный логин или пароль')
    }
  };

  return (
    <div className='auth'>
      <form className='auth__form' onSubmit={handleSubmit}>

        <div className="mb-3 w-100 d-flex justify-content-center">
          <h2>Login</h2>
        </div>

        <div className="mb-3 w-100">
          <label className="form-label">Email address</label>
          <input
            type="email"
            value={email}
            onChange={handleChangeEmail}
            className="form-control auth__form-input"
            required
          />
        </div>

        <div className="mb-3 w-100">
          <label className="form-label">Password</label>
          <input
            type="password"
            value={password}
            onChange={handleChangePassword}
            className="form-control auth__form-input"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>

        <p className="mt-3">Don't have an account? <NavLink to="/auth/signup">Signup</NavLink></p>
      </form>
    </div>
  );
}
