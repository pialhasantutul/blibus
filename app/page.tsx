'use client';
import { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProductCard from './components/shared/ProductCard';
import { productsAPI, categoriesAPI } from './lib/api';
import { useCart } from './lib/context/CartContext';
import Link from 'next/link';

const DEFAULT_CATEGORIES = [
  { name: 'Men Fashion', icon: '👔' },
  { name: 'Women Fashion', icon: '👗' },
  { name: 'Kids Fashion', icon: '🧒' },
  { name: 'Electronics', icon: '⚡' },
  { name: 'Mobile Phone', icon: '📱' },
  { name: 'Laptop & Computer', icon: '💻' },
  { name: 'Electronic Gadgets', icon: '🎮' },
  { name: 'Home Items', icon: '🏠' },
];

const SLIDES = [
  {
    bg: 'linear-gradient(135deg, #1B5E37 0%, #2d7a4f 100%)',
    title: 'Shop Smarter with AI',
    subtitle: 'Up to 50% off on selected items',
    tag: 'New Collection',
  },
  {
    bg: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
    title: 'Latest Electronics',
    subtitle: 'Best deals on gadgets & devices',
    tag: 'Hot Deals',
  },
  {
    bg: 'linear-gradient(135deg, #b71c1c 0%, #c62828 100%)',
    title: 'Fashion Collection',
    subtitle: 'Trending styles for everyone',
    tag: 'New Arrivals',
  },
];

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productsAPI.getAll(),
        categoriesAPI.getAll(),
      ]);
      setProducts(productsRes.data);
      setCategories(
        categoriesRes.data.length > 0 ? categoriesRes.data : DEFAULT_CATEGORIES
      );
    } catch {
      setCategories(DEFAULT_CATEGORIES);
    } finally {
      setLoading(false);
    }
  };

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

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  return (
    <main style={{ backgroundColor: '#FDF8FF', minHeight: '100vh' }}>
      <Header />

      {/* Hero Banner Slideshow */}
      <div
        className="w-full py-20 flex items-center justify-center text-white relative overflow-hidden transition-all duration-700"
        style={{ background: SLIDES[currentSlide].bg }}
      >
        <div className="text-center z-10 px-4">
          <p className="text-green-300 text-sm font-medium mb-2 tracking-widest uppercase">
            {SLIDES[currentSlide].tag}
          </p>
          <h1 className="text-5xl font-bold mb-4">{SLIDES[currentSlide].title}</h1>
          <p className="text-green-200 text-lg mb-8">{SLIDES[currentSlide].subtitle}</p>
          <div className="flex gap-4 justify-center">
            <Link href="/search?q=">
              <button className="bg-white text-green-800 px-8 py-3 rounded-full font-bold hover:bg-green-50 transition">
                Shop Now
              </button>
            </Link>
          </div>
        </div>

        {/* Dots */}
        <div className="absolute bottom-4 flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className="w-3 h-3 rounded-full transition-all"
              style={{
                backgroundColor:
                  i === currentSlide ? 'white' : 'rgba(255,255,255,0.4)',
              }}
            />
          ))}
        </div>

        {/* Arrows */}
        <button
          onClick={() =>
            setCurrentSlide((currentSlide - 1 + SLIDES.length) % SLIDES.length)
          }
          className="absolute left-4 text-white text-3xl hover:bg-white hover:bg-opacity-20 w-10 h-10 rounded-full flex items-center justify-center transition"
        >
          ‹
        </button>
        <button
          onClick={() => setCurrentSlide((currentSlide + 1) % SLIDES.length)}
          className="absolute right-4 text-white text-3xl hover:bg-white hover:bg-opacity-20 w-10 h-10 rounded-full flex items-center justify-center transition"
        >
          ›
        </button>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Categories</h2>
          <p className="text-gray-500">Buy What You Need Here!</p>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {(categories.length > 0 ? categories : DEFAULT_CATEGORIES).map(
            (cat: any) => (
              <button
                key={cat.name}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === cat.name ? '' : cat.name
                  )
                }
                className={`bg-white rounded-xl p-4 text-center shadow hover:shadow-md transition cursor-pointer border-2 ${
                  selectedCategory === cat.name
                    ? 'border-green-600'
                    : 'border-transparent'
                }`}
              >
                <div className="text-3xl mb-2">{cat.icon || '🛍️'}</div>
                <p className="text-xs font-medium text-gray-700">{cat.name}</p>
              </button>
            )
          )}
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {selectedCategory ? selectedCategory : 'Just For You'}
          </h2>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory('')}
              className="text-sm text-green-700 hover:underline"
            >
              Clear filter ✕
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛍️</div>
            <p className="text-gray-500">কোনো product নেই।</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}