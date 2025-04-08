import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) window.location.href = '/';
    const parsed = JSON.parse(stored);
    if (parsed.role !== 'admin') window.location.href = '/';
    setUser(parsed);

    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data));

    fetch('/api/items')
      .then(res => res.json())
      .then(data => setItems(data));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (!user) return null;

  return (
    <Layout user={user} onLogout={handleLogout}>
      <h1 className="fs-3 fw-bold mb-4">Admin Dashboard</h1>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-bg-primary mb-3">
            <div className="card-body">
              <h5 className="card-title">Total Users</h5>
              <p className="card-text fs-4">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-bg-success mb-3">
            <div className="card-body">
              <h5 className="card-title">Total Items</h5>
              <p className="card-text fs-4">{items.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="mb-4">
        <h3 className="fs-5 fw-bold mb-3">Quick Actions</h3>
        <div className="d-flex gap-2 flex-wrap">
          <Link href="/admin/add-user" className="btn btn-outline-primary">Add User</Link>
          <Link href="/admin/remove-user" className="btn btn-outline-danger">Remove User</Link>
          <Link href="/admin/add-item" className="btn btn-outline-success">Add Item</Link>
          <Link href="/admin/remove-item" className="btn btn-outline-warning">Remove Item</Link>
          <Link href="/admin/edit-item" className="btn btn-outline-info">Edit Item</Link>
        </div>
      </div>

      <h3 className="fs-5 fw-bold mb-3">Users</h3>
      <table className="table table-striped mb-5">
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Avg Rating Given</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.username}</td>
              <td>
                <span className={`badge ${u.role === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>
                  {u.role}
                </span>
              </td>
              <td>{u.averageRatingGiven ? u.averageRatingGiven.toFixed(1) : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="fs-5 fw-bold mb-3">Items</h3>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Avg Rating</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>${item.price}</td>
              <td>{item.averageRating?.toFixed(1) || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}
