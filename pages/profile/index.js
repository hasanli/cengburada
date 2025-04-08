import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      window.location.href = '/';
      return;
    }

    const parsed = JSON.parse(stored);

    if (parsed.role !== 'user' && parsed.role !== 'admin') {
      window.location.href = '/';
      return;
    }

    // ✅ Fetch fresh user data from database
    fetch(`/api/users?id=${parsed._id}`)
      .then(res => res.json())
      .then(freshUser => {
        setUser(freshUser);

        // ✅ Then fetch items and filter their reviews
        fetch('/api/items')
          .then(res => res.json())
          .then(items => {
            const userReviews = [];
            items.forEach(item => {
              item.reviews.forEach(r => {
                if (
                  r.userId === freshUser._id || // non-populated case
                  (r.userId?._id && r.userId._id === freshUser._id) // populated case
                ) {
                  userReviews.push({
                    itemName: item.name,
                    text: r.text
                  });
                }
              });
            });
            setReviews(userReviews);
          });
      });
  }, []);


  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (!user) return null;

  return (
    <Layout user={user} onLogout={handleLogout}>
      <h1 className="fs-3 fw-bold mb-4">Your Profile</h1>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">User Info</h5>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Average Rating Given:</strong> {(user.averageRatingGiven ?? 0).toFixed(1)}</p>
          <p><strong>Total Reviews:</strong> {reviews.length}</p>
        </div>
      </div>

      <h4 className="mb-3">My Reviews</h4>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <div className="list-group">
          {reviews.map((r, i) => (
            <div key={i} className="list-group-item">
              <h6 className="mb-1">{r.itemName}</h6>
              <p className="mb-0">{r.text}</p>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
