import React from 'react';
import { useCart } from '../context/CartContext';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';

interface QuickCartDrawerProps {
  onNavigate: (path: string) => void;
}

export const QuickCartDrawer: React.FC<QuickCartDrawerProps> = ({ onNavigate }) => {
  const {
    items,
    updateQuantity,
    removeItem,
    isDrawerOpen,
    setIsDrawerOpen,
    totalPrice,
    totalItemsCount,
    hasPreorderItems,
    hasMadeToOrderItems,
  } = useCart();

  if (!isDrawerOpen) return null;

  const handleProceed = () => {
    setIsDrawerOpen(false);
    onNavigate('/rezervace');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsDrawerOpen(false)}
        className="absolute inset-0 bg-[#2D2D2A]/40 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FDFCFB] shadow-2xl flex flex-col border-l border-[#E8E6E1]">
          {/* Header */}
          <div className="p-6 border-b border-[#E8E6E1] flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#5A5A40] text-white flex items-center justify-center text-xs font-serif italic">
                H
              </div>
              <div>
                <h3 className="font-serif italic text-lg font-bold text-[#2D2D2A]">
                  Přehled košíku
                </h3>
                <p className="text-[10px] text-[#8A8A80] uppercase tracking-wider">
                  {totalItemsCount} {totalItemsCount === 1 ? 'položka' : totalItemsCount < 5 ? 'položky' : 'položek'}
                </p>
              </div>
            </div>
            <button
              id="close-cart-drawer-btn"
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 text-[#8A8A80] hover:text-[#2D2D2A] hover:bg-[#F7F5F0] rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Items list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#8A8A80] space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#F7F5F0] flex items-center justify-center text-[#8A8A80]">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#2D2D2A]">Košík je prázdný</p>
                <p className="text-xs text-[#6D6D66] max-w-xs">
                  Vyberte si čerstvá vejce, med nebo koláče z naší nabídky.
                </p>
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    onNavigate('/nabidka');
                  }}
                  className="mt-2 text-[11px] font-bold uppercase tracking-widest text-[#5A5A40] underline hover:text-[#2D2D2A]"
                >
                  Prohlédnout nabídku
                </button>
              </div>
            ) : (
              <>
                {(hasPreorderItems || hasMadeToOrderItems) && (
                  <div className="p-3 bg-[#F7F5F0] border border-[#E8E6E1] rounded-xl text-xs text-[#2D2D2A] space-y-1">
                    <div className="font-bold text-[10px] uppercase tracking-wider text-[#5A5A40] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Upozornění</span>
                    </div>
                    {hasPreorderItems && (
                      <p className="text-[11px] text-[#6D6D66]">• Obsahuje položky na <strong>předobjednávku</strong>.</p>
                    )}
                    {hasMadeToOrderItems && (
                      <p className="text-[11px] text-[#6D6D66]">• Obsahuje položky <strong>vyráběné na zakázku</strong>.</p>
                    )}
                  </div>
                )}

                <div className="divide-y divide-[#E8E6E1]">
                  {items.map((item) => {
                    const imgUrl =
                      item.product.images?.find((img) => img.is_primary)?.url ||
                      item.product.images?.[0]?.url ||
                      'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=80&w=200';

                    return (
                      <div key={item.product.id} className="py-4 flex items-start gap-3">
                        <img
                          src={imgUrl}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 object-cover rounded-xl bg-[#F7F5F0] border border-[#E8E6E1] shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-[#2D2D2A] truncate">
                            {item.product.name}
                          </h4>
                          <div className="text-[11px] text-[#8A8A80] mt-0.5">
                            {item.product.price} Kč / {item.product.unit}
                          </div>

                          <div className="flex items-center justify-between mt-2.5">
                            {/* Quantity controls */}
                            <div className="flex items-center border border-[#E8E6E1] rounded-full bg-white">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="p-1 text-[#2D2D2A] hover:bg-[#F7F5F0] rounded-l-full"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2.5 text-xs font-bold text-[#2D2D2A]">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="p-1 text-[#2D2D2A] hover:bg-[#F7F5F0] rounded-r-full"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-xs font-bold text-[#2D2D2A]">
                                {item.product.price * item.quantity} Kč
                              </span>
                              <button
                                onClick={() => removeItem(item.product.id)}
                                className="text-[#8A8A80] hover:text-red-600 transition-colors p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Footer & Checkout button */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#E8E6E1] bg-white space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8A80]">Orientační celková cena:</span>
                <span className="text-lg font-serif italic font-bold text-[#2D2D2A]">{totalPrice} Kč</span>
              </div>
              <p className="text-[10px] text-[#8A8A80] leading-normal">
                Platba probíhá až při osobním převzetí na hospodářství.
              </p>

              <button
                id="checkout-proceed-btn"
                onClick={handleProceed}
                className="w-full py-3.5 px-4 bg-[#5A5A40] hover:bg-[#2D2D2A] text-white text-[11px] font-bold uppercase tracking-widest rounded-full shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Pokračovat k rezervaci</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
