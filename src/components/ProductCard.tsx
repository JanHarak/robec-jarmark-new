import React from 'react';
import { Product } from '../types/database';
import { StatusBadge } from './StatusBadge';
import { useCart } from '../context/CartContext';
import { Plus, ArrowRight, Calendar, Clock } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onNavigate: (slug: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate }) => {
  const { addItem } = useCart();
  const primaryImage =
    product.images?.find((img) => img.is_primary)?.url ||
    product.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=80&w=600';

  const availability = product.availability;
  const status = availability?.status || (product.is_made_to_order ? 'made_to_order' : 'available');
  const isOrderable = status === 'available' || status === 'preorder' || status === 'made_to_order';

  const handleCardClick = () => {
    onNavigate(product.slug);
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOrderable) {
      addItem(product, 1);
    } else {
      onNavigate(product.slug);
    }
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={handleCardClick}
      className="bg-white border border-[#E8E6E1] p-5 flex flex-col justify-between hover:shadow-md transition-shadow rounded-2xl cursor-pointer group"
    >
      <div className="flex flex-col gap-3">
        {/* Image */}
        <div className="w-full aspect-4/3 bg-[#F7F5F0] rounded-xl overflow-hidden relative">
          <img
            src={primaryImage}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          />
          <div className="absolute top-2.5 left-2.5">
            <StatusBadge
              status={status}
              availableQuantity={availability?.available_quantity}
              unit={product.unit}
            />
          </div>
          {product.is_seasonal && (
            <div className="absolute top-2.5 right-2.5 bg-[#2D2D2A]/80 backdrop-blur-xs text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1">
              <span>Sezónní</span>
            </div>
          )}
        </div>

        {/* Title & Description */}
        <div>
          <h3 className="font-serif italic text-lg text-[#2D2D2A] leading-snug group-hover:text-[#5A5A40] transition-colors">
            {product.name}
          </h3>
          <p className="text-[11px] text-[#8A8A80] mt-1 line-clamp-2 leading-relaxed">
            {product.short_description}
          </p>
        </div>

        {/* Meta badges for made to order or preorder */}
        {product.is_made_to_order && (
          <div className="text-[10px] text-[#5A5A40] bg-[#F7F5F0] px-2 py-1 rounded-md flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Příprava cca {product.lead_time_days_min || 1}–{product.lead_time_days_max || 4} dny</span>
          </div>
        )}
      </div>

      {/* Price & Action */}
      <div className="flex justify-between items-end mt-4 pt-3 border-t border-[#E8E6E1]">
        <div>
          <p className="font-bold text-lg text-[#2D2D2A]">
            {product.price} Kč <span className="text-[11px] font-normal text-[#8A8A80]">/ {product.unit}</span>
          </p>
        </div>

        {isOrderable ? (
          <button
            id={`btn-cta-${product.id}`}
            onClick={handleActionClick}
            className="w-8 h-8 rounded-full border border-[#2D2D2A] flex items-center justify-center hover:bg-[#2D2D2A] hover:text-white transition-colors text-sm font-bold"
            title="Přidat do rezervace"
          >
            +
          </button>
        ) : (
          <button
            id={`btn-cta-${product.id}`}
            onClick={handleActionClick}
            className="text-[10px] font-bold uppercase tracking-widest text-[#2D2D2A] underline hover:text-[#5A5A40]"
          >
            Detail
          </button>
        )}
      </div>
    </div>
  );
};
