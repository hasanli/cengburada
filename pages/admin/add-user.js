import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';

export default function AddUser() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    username: '',
    password: '',
    role: 'user'
  });

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) window.location.href = '/';
    const parsed = JSON.parse(stored);
    if (parsed.role !== 'admin') window.location.href = '/';
    setUser(parsed);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-auth': process.env.NEXT_PUBLIC_ADMIN_API_KEY
      },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      alert('User created!');
      setForm({ username: '', password: '', role: 'user' });
    } else {
      alert('Failed to create user');
    }
  };

  if (!user) return null;

  return (
    <Layout user={user} onLogout={() => {}}>
      <h1 className="fs-3 mb-3">Add User</h1>
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Username</label>
          <input 
            name="username"
            value={form.username}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Password</label>
          <input 
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Role</label>
          <select 
            name="role"
            value={form.role}
            onChange={handleChange}
            className="form-select"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary">Create User</button>
        </div>
      </form>
    </Layout>
  );
}