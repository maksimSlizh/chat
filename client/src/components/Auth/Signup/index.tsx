import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate, NavLink } from 'react-router-dom';
import { validateSignupData } from '../../../helpers/fillInputValue';
import { registration } from '../../../http/authApi';
import { setIsAuth, setUser } from '../../../redux/authSlice'

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)
  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)
  const handleChangeFullName = (e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)
  const handleChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)
  const handleConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValid = validateSignupData(email, password, fullName, username, confirmPassword);
    if (!isValid) {
      alert('Please make sure all fields are filled and passwords match.');
      return;
    }

    const data = {
      email,
      password,
      fullName,
      username
    };

    try {
      const response = await registration(data);

      dispatch(setUser(response.user));
      dispatch(setIsAuth(true));

      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setFullName('');
      setUsername('');

      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className='auth'>
      <form className='auth__form' onSubmit={handleSubmit}>

        <div className="mb-3 w-100 d-flex justify-content-center">
          <h2>Sign Up</h2>
        </div>

        <div className="mb-3 w-100">
          <label className="form-label">Email address</label>
          <input
          type="email"
          value={email}
          onChange={handleChangeEmail}
          className="form-control auth__form-input" />
        </div>
        <div className="mb-2 w-100">
          <label className="form-label">Full name</label>
          <input
          type="text"
          value={fullName}
          onChange={handleChangeFullName}
          className="form-control auth__form-input" />
        </div>
        <div className="mb-2 w-100">
          <label className="form-label ">User name</label>
          <input
          type="text"
          value={username}
          onChange={handleChangeUsername}
          className="form-control auth__form-input" />
        </div>
        <div className="mb-2 w-100">
          <label className="form-label">Password</label>
          <input
          type="password"
          value={password}
          onChange={handleChangePassword}
          className="form-control auth__form-input" />
        </div>
        <div className="mb-2 w-100">
          <label className="form-label">Confirm Password</label>
          <input
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPassword}
          className="form-control auth__form-input" />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>

        <p>Already have an account? <NavLink to="/auth/login">Login</NavLink></p>
      </form>
    </div>
  )
}
