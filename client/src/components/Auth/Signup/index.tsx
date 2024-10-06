import React, { useState } from 'react'

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)
  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)
  const handleChangeFullName = (e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)
  const handleChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)
  const handleConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
    }

    const data = {
      email,
      password,
      fullName,
      username
    };

    console.log(data);

    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setUsername('');
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

        <p>Already have an account? <a href="/login">Login</a></p>
      </form>
    </div>
  )
}
