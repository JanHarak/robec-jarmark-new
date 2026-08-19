import React, { useEffect, useState } from 'react';
import { Page } from '../types/database';
import { getPageBySlug } from '../services/content';
import { ArrowRight, Feather, HeartHandshake, Sun, ShieldCheck, MapPin, Clock } from 'lucide-react';

interface AboutViewProps {
  onNavigate: (path: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getPageBySlug('o-hospodarstvi');
        setPage(data);
      } catch (err) {
        console.error('Failed to load about page:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-10 py-10 sm:py-16 space-y-12">
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8A9A5B]">
          Příběh hospodářství
        </span>
        <h1 className="font-serif italic text-4xl sm:text-5xl font-bold text-[#2D2D2A]">
          O našem hospodářství
        </h1>
        <p className="text-sm sm:text-base text-[#6D6D66] leading-relaxed">
          Malé rodinné hospodářství založené na úctě k půdě, zvířatům a tradičním řemeslným postupům.
        </p>
      </div>

      {/* Hero Image with Clean Minimalist framing */}
      <div className="aspect-16/9 w-full rounded-3xl overflow-hidden bg-[#F7F5F0] border border-[#E8E6E1] relative shadow-xs">
        <img
          src={page?.hero_image || 'https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&q=80&w=1200'}
          alt="Luční Dvůr hospodářství"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Philosophy Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-y border-[#E8E6E1]">
        <div className="p-6 bg-white rounded-2xl border border-[#E8E6E1] space-y-2">
          <div className="w-8 h-8 rounded-full bg-[#F7F5F0] text-[#5A5A40] flex items-center justify-center font-serif italic text-lg">
            1
          </div>
          <h3 className="font-serif italic text-lg font-bold text-[#2D2D2A]">
            Bez průmyslové chemie
          </h3>
          <p className="text-xs text-[#6D6D66] leading-relaxed">
            Půdu hnojíme vlastním vyzrálým kompostem. Nepoužíváme syntetické pesticidy ani umělá hnojiva.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-[#E8E6E1] space-y-2">
          <div className="w-8 h-8 rounded-full bg-[#F7F5F0] text-[#5A5A40] flex items-center justify-center font-serif italic text-lg">
            2
          </div>
          <h3 className="font-serif italic text-lg font-bold text-[#2D2D2A]">
            Pohoda zvířat
          </h3>
          <p className="text-xs text-[#6D6D66] leading-relaxed">
            Naše slepice i včely mají neomezený prostor v přirozeném prostředí s pestrou a zdravou stravou.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-[#E8E6E1] space-y-2">
          <div className="w-8 h-8 rounded-full bg-[#F7F5F0] text-[#5A5A40] flex items-center justify-center font-serif italic text-lg">
            3
          </div>
          <h3 className="font-serif italic text-lg font-bold text-[#2D2D2A]">
            Osobní kontakt
          </h3>
          <p className="text-xs text-[#6D6D66] leading-relaxed">
            Všechny produkty předáváme osobně ze dvora. Víte přesně, kdo vaše jídlo vypěstoval a připravil.
          </p>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="bg-white rounded-3xl border border-[#E8E6E1] p-8 sm:p-12 shadow-xs space-y-6">
        <div className="text-[#2D2D2A] text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-6">
          {page?.content}
        </div>

        <div className="pt-8 border-t border-[#E8E6E1] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-serif italic text-lg font-bold text-[#2D2D2A]">
              Chcete ochutnat naše produkty?
            </h4>
            <p className="text-xs text-[#8A8A80]">
              Prohlédněte si, co máme právě čerstvě sklizeno a připraveno k odběru.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/nabidka')}
            className="px-6 py-3 bg-[#5A5A40] hover:bg-[#2D2D2A] text-white text-[11px] font-bold uppercase tracking-widest rounded-full transition-colors flex items-center gap-2"
          >
            <span>Přejít do nabídky</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
