import React from 'react';
import { Egg, Sparkles } from 'lucide-react';

export const ConnectionBanner: React.FC = () => {
  return (
    <div className="bg-[#5A5A40] text-[#FDFCFB] text-[11px] py-2 px-6 lg:px-10 font-medium">
      <div className="max-w-7xl mx-auto flex items-center justify-center sm:justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-2.5 mx-auto sm:mx-0">
          <Egg className="w-4 h-4 text-[#8A9A5B] shrink-0 animate-bounce" />
          <span>
            <strong>Dnešní snáška (14. července):</strong> Čerstvá Honzíkova vejce jsou právě skladem! Sběr proběhl dnes v 6:30 ráno.
          </span>
        </div>
        <div className="hidden md:flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#E8E6E1]/95 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-[#8A9A5B]" />
          <span>Robečský jarmark přímý prodej</span>
        </div>
      </div>
    </div>
  );
};
