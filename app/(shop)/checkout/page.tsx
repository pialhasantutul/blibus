'use client';
import { useState } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useCart } from '../../lib/context/CartContext';
import { useAuth } from '../../lib/context/AuthContext';
import { ordersAPI, couponsAPI } from '../../lib/api';
import { formatPrice } from '../../lib/utils';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { user, isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    note: '',
    paymentMethod: 'cod',
    saveInfo: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleCoupon = async () => {
    try {
      const res = await couponsAPI.validate(couponCode);
      const coupon = res.data;
      if (coupon.discountType === 'percentage') {
        setCouponDiscount(Math.round(totalPrice * coupon.discountValue / 100));
      } else {
        setCouponDiscount(coupon.discountValue);
      }
      setCouponError('');
    } catch {
      setCouponError('Invalid coupon code!');
      setCouponDiscount(0);
    }
  };

  const finalTotal = totalPrice - couponDiscount;

  const handlePlaceOrder = async () => {
    if (!isLoggedIn) { router.push('/login'); return; }
    if (items.length === 0) return;
    setLoading(true);

    try {
      await ordersAPI.create({
        userId: user?.id,
        items: items.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        subtotal: totalPrice,
        discount: couponDiscount,
        shippingCost: 0,
        total: finalTotal,
        paymentMethod: formData.paymentMethod,
        paymentStatus: 'pending',
        couponCode: couponCode || null,
        shippingAddress: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
        },
        notes: formData.note,
      });

      if (couponCode) await couponsAPI.use(couponCode);
      clearCart();
      router.push('/success');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ backgroundColor: '#FDF8FF', minHeight: '100vh' }}>
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-8">
          <Link href="/cart" className="text-green-700 font-medium">Cart</Link>
          <span className="text-gray-400">›</span>
          <span className="font-bold text-gray-800">Details</span>
          <span className="text-gray-400">›</span>
          <span className="text-gray-400">Payment</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Left — Form */}
          <div>
            {/* Contact */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-3">Contact</h3>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-green-600 text-sm"
              />
            </div>

            {/* Shipping */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-3">Shipping Address</h3>
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-green-600 text-sm"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-green-600 text-sm"
                  />
                </div>
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-green-600 text-sm"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-green-600 text-sm"
                  />
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="Postal Code"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-green-600 text-sm"
                  />
                </div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-green-600 text-sm"
                />
                <textarea
                  name="note"
                  placeholder="Order note (optional)"
                  value={formData.note}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-green-600 text-sm h-20 resize-none"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-3">Payment Method</h3>
              <div className="space-y-2">
                {[
                  { value: 'cod', label: '💵 Cash on Delivery' },
                  { value: 'bkash', label: '📱 bKash' },
                  { value: 'nagad', label: '📱 Nagad' },
                  { value: 'card', label: '💳 Credit/Debit Card' },
                ].map((method) => (
                  <label key={method.value} className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-green-600 transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={formData.paymentMethod === method.value}
                      onChange={handleChange}
                      className="accent-green-700"
                    />
                    <span className="text-sm font-medium">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Link href="/cart" className="text-green-700 text-sm font-medium hover:underline">
                ← Back to cart
              </Link>
              <button
                onClick={handlePlaceOrder}
                disabled={loading || items.length === 0}
                className="px-8 py-3 text-white font-bold rounded-xl hover:opacity-90 transition disabled:opacity-60"
                style={{ backgroundColor: '#1B5E37' }}
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>

          {/* Right — Summary */}
          <div>
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Order Summary</h3>

              {/* Items */}
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700">{item.name}</span>
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">x{item.quantity}</span>
                    </div>
                    <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 outline-none text-sm"
                />
                <button
                  onClick={handleCoupon}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-800 transition"
                >
                  Apply
                </button>
              </div>
              {couponError && <p className="text-red-500 text-xs mb-3">{couponError}</p>}
              {couponDiscount > 0 && (
                <p className="text-green-600 text-xs mb-3">✅ Coupon applied! -{formatPrice(couponDiscount)}</p>
              )}

              {/* Totals */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-red-500">-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span style={{ color: '#1B5E37' }}>{formatPrice(finalTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}