import Link from 'next/link';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

export default function SuccessPage() {
  return (
    <main style={{ backgroundColor: '#FDF8FF', minHeight: '100vh' }}>
      <Header />
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="bg-white rounded-2xl shadow-lg p-12">
          <div className="w-24 h-24 rounded-full border-4 border-green-500 flex items-center justify-center mx-auto mb-6">
            <span className="text-green-500 text-5xl">✓</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Payment Confirmed!</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Thank you for shopping at Blibus! Your order has been confirmed and will be ready to ship in 2 business days. Please check your email for order updates.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/">
              <button
                className="px-8 py-3 text-white font-bold rounded-xl hover:opacity-90 transition"
                style={{ backgroundColor: '#1B5E37' }}
              >
                Continue Shopping
              </button>
            </Link>
            <Link href="/profile">
              <button className="px-8 py-3 font-bold rounded-xl border-2 hover:bg-gray-50 transition" style={{ borderColor: '#1B5E37', color: '#1B5E37' }}>
                View Orders
              </button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}