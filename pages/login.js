import { useState } from 'react';
import Router from 'next/router';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('user', JSON.stringify(data.user));
      Router.push('/');
    } else {
      alert(data.message || 'Login failed');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow" style={{ minWidth: '300px' }}>
        <h2 className="mb-3">Login</h2>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input 
            className="form-control"
            value={username}
            onChange={e => setUsername(e.target.value)} 
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input 
            type="password" 
            className="form-control"
            value={password}
            onChange={e => setPassword(e.target.value)} 
          />
        </div>
        <button className="btn btn-primary w-100" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}
