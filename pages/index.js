import { useEffect, useState } from 'react';
import Layout from '../components/Layout';

export default function Home() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));

    fetch('/api/items')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setItems(data);
        } else {
          console.warn("Expected array, got:", data);
          setItems([]);
        }
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setItems([]); // fallback to empty array
      });
  }, []);

  const filtered = category
    ? items.filter(item => item.category === category)
    : items;

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Layout user={user} onLogout={handleLogout}>
      <h1 className="fs-2 fw-bold mb-4">Welcome to Cengburada</h1>

      <div className="mb-3">
        <label className="me-2 fw-semibold">Filter by Category:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="form-select d-inline-block w-auto"
        >
          <option value="">All</option>
          <option value="Vinyls">Vinyls</option>
          <option value="AntiqueFurniture">Antique Furniture</option>
          <option value="GPSSportWatches">GPS Sport Watches</option>
          <option value="RunningShoes">Running Shoes</option>
        </select>
      </div>

      <div className="row">
        {filtered.map(item => (
          <div key={item._id} className="col-md-4 mb-4">
            <div className="card">
              <img 
                src={item.image} 
                alt={item.name} 
                className="card-img-top" 
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{item.name}</h5>
                <p className="card-text">{item.description}</p>
                <p className="fw-bold">Price: ${item.price}</p>
                <p>
                  Avg Rating:{' '}
                  {typeof item.averageRating === 'number'
                    ? item.averageRating.toFixed(1)
                    : 'N/A'}
                </p>
                <a href={`/item/${item._id}`} className="btn btn-primary">
                  View Details
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
