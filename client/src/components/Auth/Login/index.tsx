import React, { useState } from 'react'

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)
  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      email,
      password
    };

    console.log(data);

    setEmail('');
    setPassword('');
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
            className="form-control auth__form-input" />
        </div>

        <div className="mb-3 w-100">
          <label className="form-label">Password</label>
          <input
            type="password"
            value={password}
            onChange={handleChangePassword}
            className="form-control auth__form-input" />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>

        <p className="mt-3">Don't have an account? <a href="/signup">Sign Up</a></p>
      </form>
    </div>
  )
}
