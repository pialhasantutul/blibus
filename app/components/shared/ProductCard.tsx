import Link from 'next/link';
import { ShoppingCart, Star } from 'lucide-react';
import { formatPrice } from '../../lib/utils';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  discountPrice?: number;
  image?: string;
  rating?: number;
  reviewCount?: number;
  category?: string;
  stock?: number;
  onAddToCart?: () => void;
}

export default function ProductCard({
  id, name, price, discountPrice, image, rating = 0, reviewCount = 0, category, stock = 0, onAddToCart,
}: ProductCardProps) {
  const discount = discountPrice && discountPrice > 0
    ? Math.round(((price - discountPrice) / price) * 100)
    : 0;

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-200 overflow-hidden group">
      <Link href={`/products/${id}`}>
        <div className="relative bg-gray-100 h-48 flex items-center justify-center overflow-hidden">
          {image && image !== 'product.jpg' ? (
            <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
          ) : (
            <div className="text-6xl">🛍️</div>
          )}
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
              -{discount}%
            </span>
          )}
          {stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span className="text-white font-bold text-sm">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-3">
        <Link href={`/products/${id}`}>
          <p className="text-xs text-gray-500 mb-1">{category}</p>
          <h3 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2 hover:text-green-700 transition">
            {name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={12}
              className={i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
            />
          ))}
          <span className="text-xs text-gray-500">({reviewCount})</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {discountPrice && discountPrice > 0 ? (
              <>
                <p className="text-sm font-bold" style={{ color: '#1B5E37' }}>{formatPrice(discountPrice)}</p>
                <p className="text-xs text-gray-400 line-through">{formatPrice(price)}</p>
              </>
            ) : (
              <p className="text-sm font-bold" style={{ color: '#1B5E37' }}>{formatPrice(price)}</p>
            )}
          </div>
          {stock > 0 && onAddToCart && (
            <button
              onClick={onAddToCart}
              className="p-2 rounded-full text-white hover:opacity-90 transition"
              style={{ backgroundColor: '#1B5E37' }}
            >
              <ShoppingCart size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}