import React, { useEffect, useState } from 'react';
import { Product } from '../types/database';
import { getProductBySlug } from '../services/products';
import { StatusBadge } from '../components/StatusBadge';
import { useCart } from '../context/CartContext';
import {
  ChevronLeft,
  ShoppingBag,
  CheckCircle2,
  Calendar,
  Clock,
  Plus,
  Minus,
  Sparkles,
} from 'lucide-react';

interface ProductDetailViewProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ slug, onNavigate }) => {
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getProductBySlug(slug);
        setProduct(data);
        setSelectedImageIndex(0);
        setQuantity(1);
      } catch (err) {
        console.error('Failed to load product detail:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-4 w-32 bg-[#E8E6E1] rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="h-96 bg-[#F7F5F0] rounded-2xl" />
            <div className="space-y-4">
              <div className="h-8 bg-[#E8E6E1] rounded w-3/4" />
              <div className="h-6 bg-[#E8E6E1] rounded w-1/4" />
              <div className="h-24 bg-[#F7F5F0] rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center space-y-4">
        <h2 className="font-serif italic text-2xl font-bold text-[#2D2D2A]">
          Produkt nebyl nalezen
        </h2>
        <p className="text-[#8A8A80] text-sm">
          Produkt s tímto odkazem neexistuje nebo již není v naší nabídce.
        </p>
        <button
          onClick={() => onNavigate('/nabidka')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#5A5A40] text-white text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-[#2D2D2A] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Zpět do nabídky</span>
        </button>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [
    {
      id: 'default-img',
      product_id: product.id,
      storage_path: 'default.jpg',
      url: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=80&w=800',
      alt_text: product.name,
      is_primary: true,
      sort_order: 1,
    }
  ];

  const currentImage = images[selectedImageIndex] || images[0];
  const availability = product.availability;
  const status = availability?.status || (product.is_made_to_order ? 'made_to_order' : 'available');
  const isOrderable = status === 'available' || status === 'preorder' || status === 'made_to_order';

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  const getMonthName = (m: number) => {
    const months = [
      'leden', 'únor', 'březen', 'duben', 'květen', 'červen',
      'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec'
    ];
    return months[m - 1] || '';
  };

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-10 py-8 space-y-8">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between border-b border-[#E8E6E1] pb-4">
        <button
          onClick={() => onNavigate('/nabidka')}
          className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#8A8A80] hover:text-[#2D2D2A] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Zpět na přehled nabídky</span>
        </button>

        <span className="text-[11px] uppercase tracking-widest text-[#8A8A80]">
          Kategorie: <strong className="text-[#2D2D2A] font-bold">{product.category?.name || 'Hospodářství'}</strong>
        </span>
      </div>

      {/* Main product view grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white p-6 sm:p-10 rounded-3xl border border-[#E8E6E1] shadow-xs">
        {/* Left: Gallery (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Large Image */}
          <div className="aspect-4/3 w-full bg-[#F7F5F0] rounded-2xl overflow-hidden border border-[#E8E6E1] relative">
            <img
              src={currentImage.url}
              alt={currentImage.alt_text || product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <StatusBadge
                status={status}
                availableQuantity={availability?.available_quantity}
                unit={product.unit}
              />
            </div>
          </div>

          {/* Thumbnail list */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-[#5A5A40]'
                      : 'border-[#E8E6E1] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.alt_text || ''}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Reservation Box (6 cols) */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8A9A5B] bg-[#F7F5F0] px-3 py-1 rounded-full border border-[#E8E6E1]">
                {product.category?.name || 'Hospodářství'}
              </span>

              {product.is_featured && (
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A5A40] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Doporučujeme</span>
                </span>
              )}
            </div>

            <h1 className="font-serif italic text-3xl sm:text-4xl text-[#2D2D2A] leading-tight">
              {product.name}
            </h1>

            {/* Price & Unit */}
            <div className="flex items-baseline gap-2 py-3 border-y border-[#E8E6E1]">
              <span className="text-3xl font-bold text-[#2D2D2A]">
                {product.price} <span className="text-base font-normal text-[#8A8A80]">Kč</span>
              </span>
              <span className="text-xs text-[#8A8A80] font-medium uppercase tracking-wider">
                / {product.unit}
              </span>
            </div>

            {/* Short description */}
            <p className="text-sm text-[#6D6D66] leading-relaxed">
              {product.short_description}
            </p>

            {/* Availability & Season notes box */}
            <div className="space-y-2 pt-2">
              {product.is_seasonal && (
                <div className="p-4 bg-[#F7F5F0] border border-[#E8E6E1] rounded-2xl text-xs text-[#2D2D2A] space-y-1">
                  <div className="font-bold uppercase tracking-wider text-[10px] text-[#5A5A40] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Sezónní plodina</span>
                  </div>
                  {product.season_start_month && product.season_end_month && (
                    <p className="text-xs text-[#6D6D66]">
                      Obvyklá doba sklizně: <strong>{getMonthName(product.season_start_month)} – {getMonthName(product.season_end_month)}</strong>
                    </p>
                  )}
                  {product.season_notes && (
                    <p className="text-xs text-[#6D6D66]">{product.season_notes}</p>
                  )}
                </div>
              )}

              {product.is_made_to_order && (
                <div className="p-4 bg-[#F7F5F0] border border-[#E8E6E1] rounded-2xl text-xs text-[#2D2D2A] space-y-1">
                  <div className="font-bold uppercase tracking-wider text-[10px] text-[#5A5A40] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Vyrábíme na objednávku</span>
                  </div>
                  <p className="text-xs text-[#6D6D66]">
                    Tento produkt připravujeme čerstvě pro vás. Obvyklá doba přípravy je <strong>{product.lead_time_days_min || 1} až {product.lead_time_days_max || 4} dny</strong>.
                  </p>
                </div>
              )}

              {status === 'preorder' && product.expected_available_at && (
                <div className="p-4 bg-[#FFF4E5] border border-[#FFE7C2] rounded-2xl text-xs text-[#B25E09] space-y-1">
                  <div className="font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Předobjednávka na očekávaný termín</span>
                  </div>
                  <p className="text-xs">
                    Předpokládaný termín naskladnění: <strong>{new Date(product.expected_available_at).toLocaleDateString('cs-CZ')}</strong>.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action / Reservation box */}
          <div className="bg-[#F7F5F0] p-6 rounded-2xl border border-[#E8E6E1] space-y-4">
            {isOrderable ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#8A8A80]">
                    Množství:
                  </span>

                  <div className="flex items-center bg-white border border-[#E8E6E1] rounded-full">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 text-[#2D2D2A] hover:bg-[#F7F5F0] rounded-l-full transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 text-xs font-bold text-[#2D2D2A] min-w-10 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 text-[#2D2D2A] hover:bg-[#F7F5F0] rounded-r-full transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-[#E8E6E1]">
                  <span className="text-[#8A8A80] uppercase tracking-wider text-[10px]">Cena za vybrané množství:</span>
                  <span className="font-bold text-[#2D2D2A] text-base">
                    {product.price * quantity} Kč
                  </span>
                </div>

                <button
                  id="product-add-to-reservation-btn"
                  onClick={handleAddToCart}
                  className="w-full py-3.5 px-5 bg-[#5A5A40] hover:bg-[#2D2D2A] text-white text-[11px] font-bold uppercase tracking-widest rounded-full shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {status === 'available'
                      ? 'Přidat do rezervace'
                      : status === 'preorder'
                      ? 'Přidat k předobjednávce'
                      : 'Přidat do objednávky na zakázku'}
                  </span>
                </button>

                {addedSuccess && (
                  <div className="p-3 bg-[#E6F4EA] border border-[#CEEAD6] text-[#1E7E34] text-xs rounded-xl flex items-center gap-2 justify-center">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Položka byla úspěšně přidána do vaší rezervace!</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-3 text-xs text-[#8A8A80]">
                Tento produkt v tuto chvíli nelze zarezervovat.
              </div>
            )}

            <div className="pt-2 text-[10px] text-[#8A8A80] uppercase tracking-widest flex items-center justify-between">
              <span>• Osobní odběr ze dvora</span>
              <span>• Platba při převzetí</span>
            </div>
          </div>
        </div>
      </div>

      {/* Long Rich Description */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E8E6E1] space-y-6">
        <h2 className="font-serif italic text-2xl font-bold text-[#2D2D2A] border-b border-[#E8E6E1] pb-3">
          Podrobné informace & původ
        </h2>
        <div className="text-[#6D6D66] leading-relaxed text-sm whitespace-pre-line space-y-4">
          {product.description}
        </div>
      </div>
    </div>
  );
};
