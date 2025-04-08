import Link from 'next/link';

export default function Layout({ children, user, onLogout }) {
  return (
    <div className="d-flex flex-column vh-100">
      <header className="bg-dark text-white p-3 d-flex justify-content-between align-items-center">
        <div>
          <Link href="/" className="text-white text-decoration-none fw-bold">
            Cengburada
          </Link>
        </div>
        <nav>
          {!user ? (
            <>
              <Link href="/login" className="text-white me-3">Login</Link>
              <Link href="/signup" className="text-white">Signup</Link>
            </>
          ) : (
            <>
              {user.role === 'admin' && (
                <Link href="/admin" className="text-white me-3">Admin Panel</Link>
              )}
              <Link href="/profile" className="text-white me-3">Profile</Link>
              <button onClick={onLogout} className="btn btn-sm btn-outline-light">
                Logout
              </button>
            </>
          )}
        </nav>
      </header>

      <main className="container my-4 flex-grow-1">
        {children}
      </main>

      <footer className="bg-light text-center py-2">
        <p className="mb-0">Cengburada &copy; 2025</p>
      </footer>
    </div>
  );
}
