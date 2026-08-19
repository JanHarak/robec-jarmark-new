import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#FDFCFB] border-t border-[#E8E6E1] text-[11px] text-[#8A8A80]">
      {/* Upper footer details */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#5A5A40] rounded-full flex items-center justify-center text-[#FDFCFB] font-serif text-xs italic">
              R
            </div>
            <span className="font-bold uppercase tracking-widest text-[#2D2D2A]">
              Robečský jarmark
            </span>
          </div>
          <p className="text-xs text-[#6D6D66] leading-relaxed">
            Malé rodinné hospodářství a tržiště. Poctivá vajíčka od slepic z volného výběhu, sezónní ovoce, včelí med a čerstvé domácí pečení.
          </p>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#2D2D2A] block">
            Odběr ze dvora
          </span>
          <p className="text-xs text-[#6D6D66] leading-relaxed">
            Adresa: Robečská 14, Lhota<br />
            Čtvrtek & Pátek: 14:00 — 17:00<br />
            Sobota: 09:00 — 12:00
          </p>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#2D2D2A] block">
            Přímý kontakt
          </span>
          <p className="text-xs text-[#6D6D66] leading-relaxed">
            Telefon: <a href="tel:+420777123456" className="text-[#2D2D2A] font-medium">+420 777 123 456</a><br />
            E-mail: <a href="mailto:hospodar@robeskyjarmark.cz" className="text-[#2D2D2A] font-medium">hospodar@robeskyjarmark.cz</a>
          </p>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#2D2D2A] block">
            Rychlé odkazy
          </span>
          <div className="flex flex-col space-y-1.5 text-xs">
            <button
              onClick={() => onNavigate('/nabidka')}
              className="text-left text-[#6D6D66] hover:text-[#2D2D2A]"
            >
              Nabídka & dostupnost
            </button>
            <button
              onClick={() => onNavigate('/o-hospodarstvi')}
              className="text-left text-[#6D6D66] hover:text-[#2D2D2A]"
            >
              O hospodářství
            </button>
            <button
              onClick={() => onNavigate('/nase-slepice')}
              className="text-left text-[#6D6D66] hover:text-[#2D2D2A]"
            >
              Naše slepice
            </button>
            <button
              onClick={() => onNavigate('/admin')}
              className="text-left text-[#5A5A40] hover:text-[#2D2D2A] font-bold flex items-center gap-1 pt-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Administrace</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lower Copyright bar */}
      <div className="border-t border-[#E8E6E1] px-6 lg:px-10 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] uppercase tracking-widest">
          <div>© {new Date().getFullYear()} Robečský jarmark • Ručně a s úctou k přírodě</div>
          <div>Poháněno Supabase backendem & RLS</div>
        </div>
      </div>
    </footer>
  );
};
