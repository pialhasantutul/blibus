'use client';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useCart } from '../../lib/context/CartContext';
import { formatPrice } from '../../lib/utils';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();

  return (
    <main style={{ backgroundColor: '#FDF8FF', minHeight: '100vh' }}>
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">
          🛒 Shopping Cart ({totalItems} items)
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag size={80} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">Cart খালি আছে</h3>
            <p className="text-gray-500 mb-8">কিছু product add করো!</p>
            <Link href="/">
              <button
                className="px-8 py-3 text-white font-bold rounded-xl"
                style={{ backgroundColor: '#1B5E37' }}
              >
                Shopping শুরু করো
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Cart Items */}
            <div className="md:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow p-4 flex gap-4 items-center">
                  <div className="bg-gray-100 w-20 h-20 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                    {item.image && item.image !== 'product.jpg' ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                    ) : '🛍️'}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 text-sm mb-1">{item.name}</h3>
                    <p className="font-bold text-sm" style={{ color: '#1B5E37' }}>
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2 py-1 hover:bg-gray-100 transition"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-3 py-1 border-x border-gray-300 text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 hover:bg-gray-100 transition"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <p className="font-bold w-24 text-right" style={{ color: '#1B5E37' }}>
                    {formatPrice(item.price * item.quantity)}
                  </p>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-400 hover:text-red-600 transition ml-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}

              <button
                onClick={clearCart}
                className="text-sm text-red-500 hover:underline"
              >
                Clear all items
              </button>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow p-6 h-fit">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Order Summary</h3>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                  <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-red-500 font-medium">-৳0</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-800">Total</span>
                  <span className="font-bold text-xl" style={{ color: '#1B5E37' }}>
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>

              <Link href="/checkout">
                <button
                  className="w-full py-3 text-white font-bold rounded-xl mb-3 hover:opacity-90 transition"
                  style={{ backgroundColor: '#1B5E37' }}
                >
                  Checkout করো →
                </button>
              </Link>

              <Link href="/">
                <button className="w-full py-3 font-medium text-green-700 hover:underline text-sm">
                  ← Shopping চালিয়ে যাও
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}