'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Search, User, Menu, X, Bell } from 'lucide-react';
import { useCart } from '../../lib/context/CartContext';
import { useAuth } from '../../lib/context/AuthContext';

export default function Header() {
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { totalItems } = useCart();
  const { user, logout, isLoggedIn } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search)}`);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="w-full sticky top-0 z-50 shadow-md" style={{ backgroundColor: '#1B5E37' }}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="text-white font-bold text-2xl border-2 border-white px-3 py-1 rounded-lg hover:bg-green-700 transition">
              Blibus
            </div>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex flex-1 max-w-2xl">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 rounded-l-full outline-none text-gray-800 text-sm"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-r-full border border-white text-white hover:bg-green-700 transition"
              style={{ backgroundColor: '#145c2e' }}
            >
              <Search size={18} />
            </button>
          </form>

          {/* Right Side */}
          <div className="flex items-center gap-4">

            {/* Cart */}
            <Link href="/cart" className="relative text-white hover:text-green-200 transition">
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-4 text-white text-sm">
              <Link href="/" className="hover:text-green-200 transition">Home</Link>
              <Link href="/seller/dashboard" className="hover:text-green-200 transition">Sell</Link>

              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <Link href="/profile" className="flex items-center gap-1 hover:text-green-200 transition">
                    <User size={16} />
                    <span>{user?.name?.split(' ')[0]}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="border border-white px-3 py-1 rounded-full hover:bg-white hover:text-green-800 transition text-xs"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="border border-white px-4 py-1 rounded-full hover:bg-white hover:text-green-800 transition"
                >
                  Login
                </Link>
              )}
            </nav>

            {/* Mobile Menu */}
            <button
              className="md:hidden text-white"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="md:hidden mt-3 pb-3 border-t border-green-600">
            <nav className="flex flex-col gap-2 mt-3 text-white text-sm">
              <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link href="/seller/dashboard" onClick={() => setMenuOpen(false)}>Become a Seller</Link>
              {isLoggedIn ? (
                <>
                  <Link href="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
                  <button onClick={handleLogout} className="text-left">Logout</button>
                </>
              ) : (
                <Link href="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}