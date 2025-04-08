import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

export default function EditItemPage() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState('');
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

  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) router.push('/');
    const parsed = JSON.parse(stored);
    if (parsed.role !== 'admin') router.push('/');
    setUser(parsed);

    fetch('/api/items')
      .then(res => res.json())
      .then(data => setItems(data));
  }, []);

  const handleItemSelect = (e) => {
    const itemId = e.target.value;
    setSelectedItemId(itemId);

    const item = items.find(i => i._id === itemId);
    if (item) {
      setForm({
        name: item.name || '',
        description: item.description || '',
        price: item.price || '',
        seller: item.seller || '',
        image: item.image || '',
        category: item.category || 'Vinyls',
        batteryLife: item.batteryLife || '',
        age: item.age || '',
        size: item.size || '',
        material: item.material || ''
      });
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/items', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update',
        itemId: selectedItemId,
        ...form,
        price: parseFloat(form.price),
        batteryLife: parseInt(form.batteryLife),
        age: parseInt(form.age),
      })
    });

    if (res.ok) {
      alert('Item updated!');
      router.push('/admin');
    } else {
      alert('Failed to update item.');
    }
  };

  if (!user) return null;

  return (
    <Layout user={user} onLogout={() => {}}>
      <h1 className="fs-3 mb-4">Edit Item</h1>

      <div className="mb-3">
        <label className="form-label">Select Item</label>
        <select
          className="form-select"
          value={selectedItemId}
          onChange={handleItemSelect}
        >
          <option value="">-- Select an Item --</option>
          {items.map(item => (
            <option key={item._id} value={item._id}>{item.name}</option>
          ))}
        </select>
      </div>

      {selectedItemId && (
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="form-control" />
          </div>
          <div className="col-md-6">
            <label className="form-label">Description</label>
            <input name="description" value={form.description} onChange={handleChange} className="form-control" />
          </div>
          <div className="col-md-4">
            <label className="form-label">Price</label>
            <input name="price" value={form.price} onChange={handleChange} className="form-control" />
          </div>
          <div className="col-md-4">
            <label className="form-label">Seller</label>
            <input name="seller" value={form.seller} onChange={handleChange} className="form-control" />
          </div>
          <div className="col-md-4">
            <label className="form-label">Image URL</label>
            <input name="image" value={form.image} onChange={handleChange} className="form-control" />
          </div>
          <div className="col-md-4">
            <label className="form-label">Category</label>
            <select name="category" value={form.category} onChange={handleChange} className="form-select">
              <option value="Vinyls">Vinyls</option>
              <option value="AntiqueFurniture">Antique Furniture</option>
              <option value="GPSSportWatches">GPS Sport Watches</option>
              <option value="RunningShoes">Running Shoes</option>
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Battery Life</label>
            <input name="batteryLife" value={form.batteryLife} onChange={handleChange} className="form-control" />
          </div>
          <div className="col-md-4">
            <label className="form-label">Age</label>
            <input name="age" value={form.age} onChange={handleChange} className="form-control" />
          </div>
          <div className="col-md-4">
            <label className="form-label">Size</label>
            <input name="size" value={form.size} onChange={handleChange} className="form-control" />
          </div>
          <div className="col-md-4">
            <label className="form-label">Material</label>
            <input name="material" value={form.material} onChange={handleChange} className="form-control" />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </div>
        </form>
      )}
    </Layout>
  );
}
