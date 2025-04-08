import { useState } from 'react';
import Router from 'next/router';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        password,
        role: 'user'
      }),
    });

    const data = await res.json();

    if (res.ok) {
      const user = {
        _id: data.user._id,
        username: data.user.username,
        role: data.user.role,
      };
      localStorage.setItem('user', JSON.stringify(user));
      Router.push('/');
    } else {
      alert(data.error || 'Signup failed');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow" style={{ minWidth: '300px' }}>
        <h2 className="mb-3">Sign Up</h2>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input 
            className="form-control"
            value={username}
            onChange={e => setUsername(e.target.value)} 
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input 
            type="password" 
            className="form-control"
            value={password}
            onChange={e => setPassword(e.target.value)} 
            required
          />
        </div>
        <button className="btn btn-primary w-100" type="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
}