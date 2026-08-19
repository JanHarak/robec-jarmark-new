import React, { useEffect, useState } from 'react';
import { Page } from '../types/database';
import { getPageBySlug } from '../services/content';
import { ArrowRight, Egg, Sun, Feather, Sparkles, ShieldCheck } from 'lucide-react';

interface ChickensViewProps {
  onNavigate: (path: string) => void;
}

export const ChickensView: React.FC<ChickensViewProps> = ({ onNavigate }) => {
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getPageBySlug('nase-slepice');
        setPage(data);
      } catch (err) {
        console.error('Failed to load chickens page:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const breeds = [
    {
      name: 'Česká zlatá kropenka',
      origin: 'České tradiční plemeno',
      eggColor: 'Smetanově hnědé',
      desc: 'Otužilé, čilé slepičky se skvělou shánčlivostí v travnatém výběhu.',
    },
    {
      name: 'Maranska',
      origin: 'Francouzské plemeno',
      eggColor: 'Tmavě čokoládové',
      desc: 'Klidné slepice snášející velká vejce s nezaměnitelnou tmavou skořápkou.',
    },
    {
      name: 'Vlaška koroptví',
      origin: 'Italský původ',
      eggColor: 'Sněhově bílé',
      desc: 'Živé a zvídavé slepice s vysokou vitalitou a krásným zbarvením peří.',
    },
    {
      name: 'Araukana',
      origin: 'Původem z Chile',
      eggColor: 'Tyrkysově modrozelené',
      desc: 'Bezocasé slepičky se zvláštními lícními licousy snášející pastelová vajíčka.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-10 py-10 sm:py-16 space-y-12">
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8A9A5B]">
          Volný chov slepic
        </span>
        <h1 className="font-serif italic text-4xl sm:text-5xl font-bold text-[#2D2D2A]">
          Naše slepice a pastvina
        </h1>
        <p className="text-sm sm:text-base text-[#6D6D66] leading-relaxed">
          Celodenní přístup k zelené louce, přirozené popelení a poctivé obilí. Poznejte, jak žijí naše slepičky.
        </p>
      </div>

      {/* Hero Image */}
      <div className="aspect-16/9 w-full rounded-3xl overflow-hidden bg-[#F7F5F0] border border-[#E8E6E1] relative shadow-xs">
        <img
          src={page?.hero_image || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=80&w=1200'}
          alt="Slepice na zelené pastvině"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-[#E8E6E1] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-[#8A8A80] block mb-1">
            Zelený výběh
          </span>
          <p className="text-base sm:text-lg font-serif italic text-[#2D2D2A]">
            Více než 2 000 m² čisté louky a starého sadu
          </p>
        </div>
      </div>

      {/* Breeds showcase */}
      <div className="space-y-6">
        <div className="border-b border-[#E8E6E1] pb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#8A9A5B] block mb-1">
            Různorodost hejna
          </span>
          <h2 className="font-serif italic text-2xl font-bold text-[#2D2D2A]">
            Plemena v našem hejnu
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {breeds.map((breed) => (
            <div
              key={breed.name}
              className="bg-white rounded-2xl border border-[#E8E6E1] p-5 space-y-3 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#8A8A80]">
                  {breed.origin}
                </div>
                <h3 className="font-serif italic text-lg font-bold text-[#2D2D2A] mt-1">
                  {breed.name}
                </h3>
                <p className="text-xs text-[#6D6D66] mt-2 leading-relaxed">
                  {breed.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E8E6E1] text-[11px] text-[#5A5A40] font-medium flex items-center gap-1.5">
                <Egg className="w-3.5 h-3.5 shrink-0" />
                <span>Barva vajec: <strong>{breed.eggColor}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Body */}
      <div className="bg-white rounded-3xl border border-[#E8E6E1] p-8 sm:p-12 shadow-xs space-y-6">
        <div className="text-[#2D2D2A] text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-6">
          {page?.content}
        </div>

        {/* Added requested egg sales info section */}
        <div className="mt-8 pt-8 border-t border-[#E8E6E1] space-y-6 text-[#2D2D2A]">
          <p className="text-sm sm:text-base leading-relaxed">
            Vejce z lokálního malochovu v Robči, pečlivě ručně sbíraná a připravená k osobnímu odběru přímo ze dvora. Naše slepice žijí spokojeným životem s celodenním přístupem k čerstvé zelené trávě, což dává žloutkům nezaměnitelnou sytou barvu a skvělou chuť.
          </p>

          <div className="bg-[#F7F5F0] rounded-2xl p-6 border border-[#E8E6E1] space-y-3">
            <h3 className="font-serif italic text-lg font-bold text-[#2D2D2A]">
              Důležité informace o prodeji vajec:
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[#6D6D66]">
              <li><strong>Původ:</strong> Robečský rodinný malochov, Česká republika.</li>
              <li><strong>Způsob chovu:</strong> Volný výběh na travnatém sadu s přírodním krmením bez GMO.</li>
              <li><strong>Skladování:</strong> Skladujte v chladu od +5 °C do +12 °C, nevystavujte slunci a vlhku.</li>
              <li><strong>Datum snášky:</strong> Vždy vyznačeno na obalu při převzetí (garantujeme maximální čerstvost).</li>
              <li><strong>Úřední upozornění:</strong> Registrovaný malochov pod evidenčním číslem chovu CZ-XXXXXXXX. Prodej ze dvora v souladu s platnými veterinárními předpisy ČR.</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#E8E6E1] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-serif italic text-lg font-bold text-[#2D2D2A]">
              Chcete čerstvá domácí vajíčka?
            </h4>
            <p className="text-xs text-[#8A8A80]">
              Sbíráme je denně a třídíme do balení po 10 ks.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/produkt/domaci-vejce-10ks')}
            className="px-6 py-3 bg-[#5A5A40] hover:bg-[#2D2D2A] text-white text-[11px] font-bold uppercase tracking-widest rounded-full transition-colors flex items-center gap-2"
          >
            <span>Rezervovat vajíčka</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
