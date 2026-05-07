'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import { productsAPI, reviewsAPI } from '../../../lib/api';
import { useCart } from '../../../lib/context/CartContext';
import { useAuth } from '../../../lib/context/AuthContext';
import { formatPrice } from '../../../lib/utils';
import { ShoppingCart, Star, Minus, Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { user, isLoggedIn } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (id) {
      Promise.all([
        productsAPI.getOne(Number(id)),
        reviewsAPI.getByProduct(Number(id)),
      ]).then(([productRes, reviewsRes]) => {
        setProduct(productRes.data);
        setReviews(reviewsRes.data);
      }).finally(() => setLoading(false));
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.discountPrice > 0 ? product.discountPrice : product.price,
      quantity,
      image: product.image,
      stock: product.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) { router.push('/login'); return; }
    setSubmittingReview(true);
    try {
      await reviewsAPI.create({
        userId: user?.id,
        productId: Number(id),
        orderId: 1,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      const res = await reviewsAPI.getByProduct(Number(id));
      setReviews(res.data);
      setReviewForm({ rating: 5, comment: '' });
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <main>
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 gap-8 animate-pulse">
            <div className="bg-gray-200 rounded-xl h-96" />
            <div className="space-y-4">
              <div className="bg-gray-200 h-8 rounded w-3/4" />
              <div className="bg-gray-200 h-6 rounded w-1/2" />
              <div className="bg-gray-200 h-10 rounded w-1/3" />
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!product) return null;

  const finalPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const discount = product.discountPrice > 0
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <main style={{ backgroundColor: '#FDF8FF' }}>
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-700">Home</Link>
          <span>›</span>
          <span className="hover:text-green-700 cursor-pointer">{product.category}</span>
          <span>›</span>
          <span className="text-gray-800 truncate max-w-xs">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

          {/* Image */}
          <div className="bg-white rounded-2xl p-8 shadow flex items-center justify-center min-h-80">
            {product.image && product.image !== 'product.jpg' ? (
              <img src={product.image} alt={product.name} className="max-h-80 object-contain" />
            ) : (
              <div className="text-9xl">🛍️</div>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="text-sm text-gray-500 mb-2">{product.brand || product.category}</p>
            <h1 className="text-2xl font-bold text-gray-800 mb-3">{product.name}</h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < Math.floor(product.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                ))}
              </div>
              <span className="text-sm text-gray-500">({product.reviewCount || reviews.length} reviews)</span>
              <span className="text-sm text-green-600 font-medium">
                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
              </span>
            </div>

            <div className="mb-4">
              {discount > 0 && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-3xl font-bold" style={{ color: '#1B5E37' }}>{formatPrice(finalPrice)}</span>
                  <span className="text-lg text-gray-400 line-through">{formatPrice(product.price)}</span>
                  <span className="bg-red-100 text-red-600 text-sm px-2 py-1 rounded-full font-bold">-{discount}%</span>
                </div>
              )}
              {discount === 0 && (
                <span className="text-3xl font-bold" style={{ color: '#1B5E37' }}>{formatPrice(product.price)}</span>
              )}
            </div>

            <p className="text-green-600 text-sm font-medium mb-6">🚚 FREE SHIPPING</p>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-100 transition"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-2 border-x border-gray-300 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2 hover:bg-gray-100 transition"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mb-6">
              <Link href="/checkout" className="flex-1">
                <button
                  className="w-full py-3 text-white font-bold rounded-xl transition hover:opacity-90"
                  style={{ backgroundColor: '#1B5E37' }}
                  disabled={product.stock === 0}
                >
                  Buy Now
                </button>
              </Link>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 py-3 font-bold rounded-xl border-2 flex items-center justify-center gap-2 transition"
                style={{
                  borderColor: '#1B5E37',
                  color: added ? 'white' : '#1B5E37',
                  backgroundColor: added ? '#1B5E37' : 'white',
                }}
              >
                <ShoppingCart size={18} />
                {added ? 'Added!' : 'Add to Cart'}
              </button>
            </div>

            {/* Product Info */}
            <div className="bg-gray-50 rounded-xl p-4 text-sm">
              {product.sku && <p className="text-gray-600 mb-1"><span className="font-medium">SKU:</span> {product.sku}</p>}
              <p className="text-gray-600 mb-1"><span className="font-medium">Category:</span> {product.category}</p>
              {product.brand && <p className="text-gray-600"><span className="font-medium">Brand:</span> {product.brand}</p>}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <div className="flex gap-4 border-b mb-6">
            {['description', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="py-2 px-4 font-medium text-sm capitalize transition"
                style={{
                  borderBottom: activeTab === tab ? '2px solid #1B5E37' : '2px solid transparent',
                  color: activeTab === tab ? '#1B5E37' : '#6b7280',
                }}
              >
                {tab === 'reviews' ? `Reviews (${reviews.length})` : tab}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          )}

          {activeTab === 'reviews' && (
            <div>
              {/* Review Form */}
              {isLoggedIn && (
                <form onSubmit={handleSubmitReview} className="mb-8 bg-gray-50 rounded-xl p-4">
                  <h4 className="font-bold text-gray-800 mb-4">Write a Review</h4>
                  <div className="flex gap-2 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      >
                        <Star
                          size={24}
                          className={star <= reviewForm.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    placeholder="Share your experience..."
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-green-600 text-sm h-24 resize-none mb-3"
                  />
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-6 py-2 text-white font-medium rounded-lg"
                    style={{ backgroundColor: '#1B5E37' }}
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}

              {/* Reviews List */}
              {reviews.length === 0 ? (
                <p className="text-gray-500 text-center py-8">এখনো কোনো review নেই।</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-700 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}