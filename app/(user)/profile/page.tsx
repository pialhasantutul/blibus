'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../lib/context/AuthContext';
import { ordersAPI } from '../../lib/api';
import { formatPrice, formatDate, getOrderStatusColor } from '../../lib/utils';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, isLoggedIn } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    if (user?.id) {
      ordersAPI.getByUser(user.id)
        .then((res) => setOrders(res.data))
        .catch(() => setOrders([]))
        .finally(() => setLoading(false));
    }
  }, [isLoggedIn, user]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!isLoggedIn) return null;

  return (
    <main style={{ backgroundColor: '#FDF8FF', minHeight: '100vh' }}>
      <Header />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">My Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          {/* Sidebar */}
          <div className="bg-white rounded-2xl shadow p-6 h-fit">
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-4xl mx-auto mb-3">
                👤
              </div>
              <h2 className="font-bold text-gray-800">{user?.name}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>

            <nav className="space-y-1">
              {[
                { id: 'orders', label: '📦 My Orders' },
                { id: 'wishlist', label: '❤️ Wishlist' },
                { id: 'addresses', label: '📍 Addresses' },
                { id: 'settings', label: '⚙️ Settings' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="w-full text-left px-4 py-2 rounded-lg text-sm transition"
                  style={{
                    backgroundColor: activeTab === tab.id ? '#e8f5e9' : 'transparent',
                    color: activeTab === tab.id ? '#1B5E37' : '#6b7280',
                    fontWeight: activeTab === tab.id ? '600' : '400',
                  }}
                >
                  {tab.label}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition"
              >
                🚪 Logout
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="md:col-span-3">

            {/* Orders */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl shadow p-6">
                <h3 className="font-bold text-gray-800 mb-6">My Orders</h3>
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-4xl mb-3">📦</p>
                    <p className="text-gray-500">কোনো order নেই।</p>
                    <Link href="/">
                      <button className="mt-4 px-6 py-2 text-white rounded-lg text-sm" style={{ backgroundColor: '#1B5E37' }}>
                        Shop Now
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-bold text-gray-800">#{order.orderNumber}</p>
                            <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                          </div>
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${getOrderStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-600">
                            {Array.isArray(order.items) ? order.items.length : 0} items
                          </p>
                          <p className="font-bold" style={{ color: '#1B5E37' }}>
                            {formatPrice(order.total)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist */}
            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-2xl shadow p-6">
                <h3 className="font-bold text-gray-800 mb-6">Wishlist</h3>
                <div className="text-center py-12">
                  <p className="text-4xl mb-3">❤️</p>
                  <p className="text-gray-500">Wishlist খালি আছে।</p>
                </div>
              </div>
            )}

            {/* Addresses */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-2xl shadow p-6">
                <h3 className="font-bold text-gray-800 mb-6">Saved Addresses</h3>
                <div className="text-center py-12">
                  <p className="text-4xl mb-3">📍</p>
                  <p className="text-gray-500">কোনো address save নেই।</p>
                </div>
              </div>
            )}

            {/* Settings */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-2xl shadow p-6">
                <h3 className="font-bold text-gray-800 mb-6">Account Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
                    <input
                      type="text"
                      defaultValue={user?.name}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-green-600 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                    <input
                      type="email"
                      defaultValue={user?.email}
                      disabled
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-gray-50 text-gray-500"
                    />
                  </div>
                  <button
                    className="px-6 py-2 text-white font-medium rounded-lg"
                    style={{ backgroundColor: '#1B5E37' }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}