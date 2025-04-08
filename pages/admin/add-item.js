import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';

export default function AddItem() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    seller: '',
    image: '',
    category: 'Vinyls',
    batteryLife: '',
    age: '',
    size: '',
    material: ''
  });

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      window.location.href = '/';
    } else {
      const parsed = JSON.parse(stored);
      if (parsed.role !== 'admin') {
        window.location.href = '/';
      }
      setUser(parsed);
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price) || 0,
        batteryLife: parseInt(form.batteryLife) || 0,
        age: parseInt(form.age) || 0
      })
    });
    if (res.ok) {
      alert('Item added!');
      window.location.href = '/admin';
    } else {
      alert('Failed to add item');
    }
  };

  if (!user) return null;

  return (
    <Layout user={user} onLogout={() => {}}>
      <h1 className="fs-3 fw-bold mb-3">Add Item</h1>
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Name</label>
          <input 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            className="form-control"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Description</label>
          <input 
            name="description" 
            value={form.description} 
            onChange={handleChange} 
            className="form-control"
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Price</label>
          <input 
            name="price" 
            value={form.price} 
            onChange={handleChange} 
            className="form-control"
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Seller</label>
          <input 
            name="seller" 
            value={form.seller} 
            onChange={handleChange} 
            className="form-control"
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Image URL</label>
          <input 
            name="image" 
            value={form.image} 
            onChange={handleChange} 
            className="form-control"
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Category</label>
          <select 
            name="category" 
            value={form.category} 
            onChange={handleChange} 
            className="form-select"
          >
            <option value="Vinyls">Vinyls</option>
            <option value="AntiqueFurniture">Antique Furniture</option>
            <option value="GPSSportWatches">GPS Sport Watches</option>
            <option value="RunningShoes">Running Shoes</option>
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label">Battery Life (GPS Watches)</label>
          <input 
            name="batteryLife" 
            value={form.batteryLife} 
            onChange={handleChange} 
            className="form-control"
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Age (Antique/Vinyl)</label>
          <input 
            name="age" 
            value={form.age} 
            onChange={handleChange} 
            className="form-control"
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Size (Running Shoes)</label>
          <input 
            name="size" 
            value={form.size} 
            onChange={handleChange} 
            className="form-control"
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Material (Furniture/Shoes)</label>
          <input 
            name="material" 
            value={form.material} 
            onChange={handleChange} 
            className="form-control"
          />
        </div>
        <div className="col-12">
          <button className="btn btn-primary">Submit</button>
        </div>
      </form>
    </Layout>
  );
}
