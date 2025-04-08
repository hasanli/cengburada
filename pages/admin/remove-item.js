import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';

export default function RemoveItem() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) window.location.href = '/';
    const parsed = JSON.parse(stored);
    if (parsed.role !== 'admin') window.location.href = '/';
    setUser(parsed);

    fetch('/api/items')
      .then(res => res.json())
      .then(data => setItems(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/items', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId: selectedItemId })
    });
    if (res.ok) {
      alert('Item removed!');
      window.location.reload();
    } else {
      alert('Failed to remove item');
    }
  };

  if (!user) return null;

  return (
    <Layout user={user} onLogout={() => {}}>
      <h1 className="fs-3 mb-3">Remove Item</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Select Item to Remove</label>
          <select 
            value={selectedItemId} 
            onChange={(e) => setSelectedItemId(e.target.value)} 
            className="form-select"
            required
          >
            <option value="">-- Select Item --</option>
            {items.map(item => (
              <option key={item._id} value={item._id}>
                {item.name} ({item.category})
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-danger">Remove Item</button>
      </form>
    </Layout>
  );
}
