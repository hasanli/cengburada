import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

export default function ItemDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [item, setItem] = useState(null);
  const [user, setUser] = useState(null);
  const [rating, setRating] = useState('');
  const [review, setReview] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));

    const fetchItem = async () => {
      const res = await fetch('/api/items');
      const items = await res.json();
      const found = items.find(i => i._id === id);
      if (found) {
        setItem(found);
        const localUser = stored ? JSON.parse(stored) : null;
        if (localUser) {
          const existing = found.reviews.find(r => {
            if (typeof r.userId === 'object') return r.userId._id === localUser._id;
            return r.userId === localUser._id;
          });

          if (existing) {
            if (existing.rating) setRating(existing.rating.toString());
            if (existing.text) setReview(existing.text);
          }
        }
      }
    };

    if (id) fetchItem();
  }, [id]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const submitFeedback = async () => {
    if (!user) return alert("You must be logged in");

    const payload = {
      action: 'feedback',
      itemId: id,
      userId: user._id,
      rating: rating ? parseInt(rating) : null,
      reviewText: review || null
    };

    const res = await fetch('/api/items', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (res.ok) {
      setItem(data.item);
      alert('Feedback submitted!');
    } else {
      alert('Error submitting feedback');
    }
  };

  if (!item) return <div>Loading...</div>;

  return (
    <Layout user={user} onLogout={handleLogout}>
      <h1 className="fs-3 fw-bold mb-3">{item.name}</h1>
      <div className="row">
        <div className="col-md-6">
          <img 
            src={item.image} 
            alt={item.name} 
            className="img-fluid rounded mb-3"
            style={{ height: '300px', objectFit: 'cover' }}
          />
        </div>
        <div className="col-md-6">
          <p><strong>Description:</strong> {item.description}</p>
          <p><strong>Price:</strong> ${item.price}</p>
          <p><strong>Seller:</strong> {item.seller}</p>
          <p><strong>Category:</strong> {item.category}</p>
          {item.batteryLife ? <p><strong>Battery Life:</strong> {item.batteryLife}h</p> : null}
          {item.age ? <p><strong>Age:</strong> {item.age} years</p> : null}
          {item.size ? <p><strong>Size:</strong> {item.size}</p> : null}
          {item.material ? <p><strong>Material:</strong> {item.material}</p> : null}
          <p className="mt-2"><strong>Average Rating:</strong> {typeof item.averageRating === 'number' ? item.averageRating.toFixed(1) : '—'}</p>
        </div>
      </div>

      {user && (
        <div className="mt-4">
          <h2 className="fs-5 fw-semibold">Rate & Review this item</h2>
          <div className="mb-3" style={{ maxWidth: '200px' }}>
            <label className="form-label">Rating (1-10)</label>
            <input 
              type="number" 
              min="1" 
              max="10" 
              value={rating} 
              onChange={(e) => setRating(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Your Review</label>
            <textarea 
              value={review} 
              onChange={(e) => setReview(e.target.value)} 
              className="form-control" 
              rows={3}
              placeholder="Write your review here..."
            />
          </div>
          <button onClick={submitFeedback} className="btn btn-primary">
            Submit
          </button>
        </div>
      )}

      <div className="mt-4">
        <h2 className="fs-5 fw-semibold">Reviews</h2>
        {item.reviews.length === 0 && <p>No reviews yet.</p>}
        {item.reviews.map((rev, i) => (
          <div key={`${rev.userId?._id || rev.userId}-${i}`} className="border-bottom py-2">
            <p className="mb-1">{rev.text}</p>
            <small className="text-muted">
              — {rev.userId?.username || 'Anonymous'} {typeof rev.rating === 'number' ? `| ${rev.rating}/10` : ''}
            </small>
          </div>
        ))}
      </div>
    </Layout>
  );
}
