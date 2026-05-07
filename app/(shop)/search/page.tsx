'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import ProductCard from '../../components/shared/ProductCard';
import { productsAPI } from '../../lib/api';
import { useCart } from '../../lib/context/CartContext';
import Link from 'next/link';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    productsAPI.getAll(query)
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [query]);

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.discountPrice > 0 ? product.discountPrice : product.price,
      quantity: 1,
      image: product.image,
      stock: product.stock,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          Search results for: <span style={{ color: '#1B5E37' }}>"{query}"</span>
        </h2>
        <p className="text-gray-500 text-sm">{products.length} products found</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl h-64 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">কোনো product পাওয়া যায়নি</h3>
          <p className="text-gray-500 mb-6">অন্য keyword দিয়ে search করো</p>
          <Link href="/">
            <button
              className="px-6 py-3 text-white font-bold rounded-lg"
              style={{ backgroundColor: '#1B5E37' }}
            >
              Homepage এ ফিরে যাও
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              onAddToCart={() => handleAddToCart(product)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <main style={{ backgroundColor: '#FDF8FF', minHeight: '100vh' }}>
      <Header />
      <Suspense fallback={<div className="text-center py-10">Searching...</div>}>
        <SearchResults />
      </Suspense>
      <Footer />
    </main>
  );
}