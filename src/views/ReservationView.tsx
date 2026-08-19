import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/orders';
import { CreateOrderResult } from '../types/database';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  Sparkles,
  MapPin,
  Phone,
  Printer,
  ChevronLeft,
} from 'lucide-react';

interface ReservationViewProps {
  onNavigate: (path: string) => void;
}

export const ReservationView: React.FC<ReservationViewProps> = ({ onNavigate }) => {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    totalPrice,
    totalItemsCount,
    hasPreorderItems,
    hasMadeToOrderItems,
    hasRegularReservations,
  } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderResult, setOrderResult] = useState<CreateOrderResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (items.length === 0) {
      setErrorMessage('Košík je prázdný. Vyberte si prosím produkty z nabídky.');
      return;
    }

    if (!customerName.trim()) {
      setErrorMessage('Prosím vyplňte vaše jméno a příjmení.');
      return;
    }

    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      setErrorMessage('Prosím vyplňte platnou e-mailovou adresu.');
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await createOrder({
        p_customer_name: customerName.trim(),
        p_customer_email: customerEmail.trim(),
        p_customer_phone: customerPhone.trim() || undefined,
        p_customer_note: customerNote.trim() || undefined,
        p_items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
      });

      setOrderResult(result);
      clearCart();
    } catch (err: any) {
      console.error('Reservation submission failed:', err);
      setErrorMessage(
        err.message || 'Omlouváme se, rezervaci se nepodařilo odeslat. Zkuste to prosím znovu.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Confirmation Screen when Order is Created
  if (orderResult) {
    return (
      <div className="max-w-3xl mx-auto px-6 lg:px-10 py-12 space-y-8">
        <div className="bg-white rounded-3xl border border-[#E8E6E1] p-8 sm:p-12 shadow-xs text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#E6F4EA] text-[#1E7E34] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8A9A5B]">
              Rezervace úspěšně odeslána
            </span>
            <h1 className="font-serif italic text-3xl sm:text-4xl font-bold text-[#2D2D2A]">
              Děkujeme za vaši rezervaci!
            </h1>
            <p className="text-sm text-[#6D6D66] max-w-lg mx-auto leading-relaxed">
              Rezervaci <strong>{orderResult.order_number}</strong> jsme v pořádku přijali. Jakmile ji potvrdíme, dostanete další informace k předání.
            </p>
          </div>

          {/* Details Card */}
          <div className="bg-[#F7F5F0] rounded-2xl p-6 border border-[#E8E6E1] text-left space-y-4 max-w-lg mx-auto">
            <div className="flex justify-between items-center border-b border-[#E8E6E1] pb-3 text-xs">
              <span className="text-[#8A8A80] uppercase tracking-wider text-[10px] font-bold">Číslo rezervace:</span>
              <span className="font-mono font-bold text-[#2D2D2A] text-sm">{orderResult.order_number}</span>
            </div>

            <div className="flex justify-between items-center border-b border-[#E8E6E1] pb-3 text-xs">
              <span className="text-[#8A8A80] uppercase tracking-wider text-[10px] font-bold">Stav:</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFF4E5] text-[#B25E09] border border-[#FFE7C2]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B25E09]" />
                <span>Čeká na potvrzení</span>
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-[#8A8A80] uppercase tracking-wider text-[10px] font-bold">Orientační celková cena:</span>
              <span className="font-bold text-base text-[#2D2D2A]">{orderResult.total_price} Kč</span>
            </div>
          </div>

          {/* Pickup info box */}
          <div className="bg-white rounded-2xl p-6 border border-[#E8E6E1] text-left text-xs space-y-3 max-w-lg mx-auto">
            <h4 className="font-bold uppercase tracking-wider text-[10px] text-[#5A5A40] flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>Instrukce k vyzvednutí ze dvora</span>
            </h4>
            <p className="text-[#6D6D66] leading-relaxed">
              Osobní odběr probíhá na adrese <strong>Luční 14, Heřmanův Městec</strong>. Platba se provádí v hotovosti nebo okamžitou platbou QR kódem při převzetí.
            </p>
            <p className="text-[#8A8A80] text-[11px]">
              V případě dotazů nás kontaktujte na tel.: <strong>+420 732 112 233</strong>.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('/nabidka')}
              className="w-full sm:w-auto px-6 py-3 bg-[#5A5A40] hover:bg-[#2D2D2A] text-white text-[11px] font-bold uppercase tracking-widest rounded-full transition-colors"
            >
              Zpět do katalogu
            </button>
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto px-6 py-3 border border-[#2D2D2A] text-[#2D2D2A] text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-[#2D2D2A] hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Vytisknout shrnutí</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 lg:px-10 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#F7F5F0] border border-[#E8E6E1] text-[#8A8A80] flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif italic text-3xl font-bold text-[#2D2D2A]">
            Váš rezervační košík je prázdný
          </h1>
          <p className="text-sm text-[#8A8A80] max-w-md mx-auto">
            Prohlédněte si naši aktuální nabídku čerstvých vajec, medu, zavařenin a koláčů.
          </p>
        </div>
        <button
          onClick={() => onNavigate('/nabidka')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#5A5A40] hover:bg-[#2D2D2A] text-white text-[11px] font-bold uppercase tracking-widest rounded-full transition-colors shadow-xs"
        >
          <ArrowRight className="w-4 h-4" />
          <span>Prohlédnout nabídku hospodářství</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-10 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="border-b border-[#E8E6E1] pb-4 flex items-center justify-between">
        <div>
          <button
            onClick={() => onNavigate('/nabidka')}
            className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-[#8A8A80] hover:text-[#2D2D2A] mb-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Zpět do nabídky</span>
          </button>
          <h1 className="font-serif italic text-3xl sm:text-4xl font-bold text-[#2D2D2A]">
            Rezervace & předobjednávka
          </h1>
        </div>
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#8A8A80]">
          {totalItemsCount} položek v košíku
        </span>
      </div>

      {/* Main 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Items list (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Order type notice banner */}
          {(hasPreorderItems || hasMadeToOrderItems) && (
            <div className="p-4 bg-[#F7F5F0] border border-[#E8E6E1] rounded-2xl text-xs text-[#2D2D2A] space-y-2">
              <div className="font-bold uppercase tracking-widest text-[10px] text-[#5A5A40] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Typ objednávky: {hasPreorderItems && hasRegularReservations ? 'Kombinovaná rezervace' : hasPreorderItems ? 'Sezónní předobjednávka' : 'Výroba na zakázku'}</span>
              </div>
              {hasPreorderItems && (
                <p className="text-[#6D6D66]">
                  • Některé položky jsou na <strong>předobjednávku</strong>. O termínu naskladnění a vyzvednutí vás budeme včas informovat.
                </p>
              )}
              {hasMadeToOrderItems && (
                <p className="text-[#6D6D66]">
                  • Položky na zakázku (koláče, řemeslo) připravujeme čerstvě dle domluveného termínu.
                </p>
              )}
            </div>
          )}

          {/* Cart items */}
          <div className="bg-white rounded-3xl border border-[#E8E6E1] p-6 divide-y divide-[#E8E6E1] shadow-xs">
            {items.map((item) => {
              const imgUrl =
                item.product.images?.find((i) => i.is_primary)?.url ||
                item.product.images?.[0]?.url ||
                'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=80&w=200';

              return (
                <div key={item.product.id} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
                  <img
                    src={imgUrl}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 object-cover rounded-xl bg-[#F7F5F0] border border-[#E8E6E1] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif italic text-base font-bold text-[#2D2D2A] truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-xs text-[#8A8A80]">
                      {item.product.price} Kč / {item.product.unit}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity buttons */}
                      <div className="flex items-center bg-[#F7F5F0] border border-[#E8E6E1] rounded-full">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1.5 text-[#2D2D2A] hover:bg-[#E8E6E1] rounded-l-full transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-[#2D2D2A]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1.5 text-[#2D2D2A] hover:bg-[#E8E6E1] rounded-r-full transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-base font-bold text-[#2D2D2A]">
                          {item.product.price * item.quantity} Kč
                        </span>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-[#8A8A80] hover:text-red-600 transition-colors p-1"
                          title="Odebrat položku"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Total summary */}
            <div className="pt-4 mt-4 flex items-center justify-between text-sm">
              <span className="text-[#8A8A80] font-bold uppercase tracking-wider text-xs">Celková orientační cena:</span>
              <span className="font-bold text-xl text-[#2D2D2A] font-serif italic">{totalPrice} Kč</span>
            </div>
          </div>
        </div>

        {/* Right: Reservation Form (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E8E6E1] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-[#E8E6E1] pb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8A9A5B] block mb-1">
              Jednoduché objednání
            </span>
            <h2 className="font-serif italic text-2xl font-bold text-[#2D2D2A]">
              Kontaktní údaje
            </h2>
            <p className="text-xs text-[#8A8A80] mt-1">
              Nevyžadujeme registraci. Stačí vyplnit kontakt pro potvrzení a předání.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold uppercase tracking-wider text-[10px] text-[#2D2D2A] mb-1">
                Jméno a příjmení <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="např. Jan Novák"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F7F5F0] border border-[#E8E6E1] rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#5A5A40]"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-[10px] text-[#2D2D2A] mb-1">
                E-mailová adresa <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="jan.novak@email.cz"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F7F5F0] border border-[#E8E6E1] rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#5A5A40]"
              />
              <p className="text-[10px] text-[#8A8A80] mt-1">
                Na tento e-mail vám zašleme potvrzení rezervace a čas předání.
              </p>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-[10px] text-[#2D2D2A] mb-1">
                Telefon (doporučeno pro rychlou domluvu)
              </label>
              <input
                type="tel"
                placeholder="+420 777 123 456"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F7F5F0] border border-[#E8E6E1] rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#5A5A40]"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-[10px] text-[#2D2D2A] mb-1">
                Poznámka k převzetí / dotaz
              </label>
              <textarea
                rows={3}
                placeholder="např. Mohu se stavit ve čtvrtek v 17:00, vezmu si vlastní obal na vejce..."
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F7F5F0] border border-[#E8E6E1] rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#5A5A40]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-[#5A5A40] hover:bg-[#2D2D2A] disabled:opacity-50 text-white text-[11px] font-bold uppercase tracking-widest rounded-full shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Odesílám rezervaci...</span>
                ) : (
                  <>
                    <span>Odeslat rezervaci hospodáři</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            <p className="text-[10px] text-[#8A8A80] text-center pt-2 leading-relaxed">
              Odesláním rezervace nevzniká povinnost platby předem. Vše probíhá osobně při převzetí na hospodářství.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
