import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatGHS } from '@/lib/utils';
import VerifiedSellerBadge from './VerifiedSellerBadge';

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const { addToCart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-md overflow-hidden shadow-sm hover:shadow-lg transition-all border border-transparent hover:border-orange-200 flex flex-col h-full group"
    >
      <Link to={`/product/${product.id}`} className="relative block aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {product.isVerifiedSeller && (
          <div className="absolute top-2 right-2 z-10">
            <VerifiedSellerBadge />
          </div>
        )}
        {product.stock < 10 && product.stock > 0 && (
          <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">Only {product.stock} left</Badge>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white px-3 py-1 rounded text-xs font-bold text-black uppercase">Out of Stock</span>
          </div>
        )}
      </Link>

      <div className="p-3 flex flex-col flex-grow">
        <div className="mb-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{product.category}</span>
        </div>
        <Link to={`/product/${product.id}`} className="block mb-1">
          <h3 className="text-sm font-medium line-clamp-2 leading-tight group-hover:text-orange-600 transition-colors">
            {product.title}
          </h3>
        </Link>

        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold text-black">{formatGHS(product.price)}</span>
            {product.price > 500 && (
               <span className="text-xs text-gray-400 line-through">{formatGHS(product.price * 1.2)}</span>
            )}
          </div>

          <div className="flex items-center gap-1 mb-3">
             <div className="flex text-orange-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating || 0) ? 'fill-current' : ''}`} />
                ))}
             </div>
             <span className="text-[10px] text-gray-400">(45)</span>
          </div>

          <Button 
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            disabled={product.stock === 0}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white shadow-none h-9 text-xs uppercase font-bold"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;