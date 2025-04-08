import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';

export default function RemoveUser() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) window.location.href = '/';
    const parsed = JSON.parse(stored);
    if (parsed.role !== 'admin') window.location.href = '/';
    setUser(parsed);

    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(u => u.username !== parsed.username); // prevent self-delete
        setUsers(filtered);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: selectedUserId })
    });
    if (res.ok) {
      alert('User removed!');
      window.location.reload();
    } else {
      alert('Failed to remove user');
    }
  };

  if (!user) return null;

  return (
    <Layout user={user} onLogout={() => {}}>
      <h1 className="fs-3 mb-3">Remove User</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Select User to Remove</label>
          <select 
            value={selectedUserId} 
            onChange={(e) => setSelectedUserId(e.target.value)} 
            className="form-select"
            required
          >
            <option value="">-- Select User --</option>
            {users.map(u => (
              <option key={u._id} value={u._id}>{u.username} ({u.role})</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-danger">Remove User</button>
      </form>
    </Layout>
  );
}
