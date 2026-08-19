import React, { useState } from 'react';
import { isSupabaseConfigured, setSupabaseConfigOverride, clearSupabaseConfigOverride } from '../lib/supabase/client';
import { Database, CheckCircle2, Settings2, X, RefreshCw } from 'lucide-react';

export const ConnectionBanner: React.FC = () => {
  const configured = isSupabaseConfigured();
  const [modalOpen, setModalOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput && keyInput) {
      setSupabaseConfigOverride(urlInput, keyInput);
      setSavedMsg(true);
      setTimeout(() => {
        setSavedMsg(false);
        setModalOpen(false);
        window.location.reload();
      }, 800);
    }
  };

  const handleReset = () => {
    clearSupabaseConfigOverride();
    setUrlInput('');
    setKeyInput('');
    window.location.reload();
  };

  return (
    <>
      <div className="bg-[#F7F5F0] border-b border-[#E8E6E1] text-[#6D6D66] text-[11px] py-1.5 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            {configured ? (
              <span className="inline-flex items-center gap-1.5 text-[#1E7E34] font-bold uppercase tracking-wider text-[10px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Supabase backend připojen</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[#5A5A40] font-bold uppercase tracking-wider text-[10px]">
                <Database className="w-3.5 h-3.5" />
                <span>Aktivní RPC & schémata (připraveno pro Supabase)</span>
              </span>
            )}
            <span className="hidden md:inline text-[#E8E6E1]">|</span>
            <span className="hidden md:inline text-[#8A8A80] text-[10px]">
              Všechna data odpovídají autoritativnímu SQL schématu & RPC funkcím
            </span>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="text-[10px] text-[#2D2D2A] hover:text-[#5A5A40] uppercase tracking-widest font-bold flex items-center gap-1 shrink-0"
          >
            <Settings2 className="w-3 h-3" />
            <span>{configured ? 'Nastavení' : 'Připojit Supabase'}</span>
          </button>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D2D2A]/60 backdrop-blur-xs">
          <div className="bg-[#FDFCFB] rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-[#E8E6E1] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E6E1]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#5A5A40] text-white flex items-center justify-center text-xs font-serif italic">
                  H
                </div>
                <div>
                  <h3 className="font-serif italic text-lg font-bold text-[#2D2D2A]">
                    Připojení Supabase backendu
                  </h3>
                  <p className="text-[10px] uppercase tracking-wider text-[#8A8A80]">
                    Schéma tabulek & RPC funkcí
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-[#8A8A80] hover:text-[#2D2D2A] p-1.5 rounded-full hover:bg-[#F7F5F0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="p-4 bg-[#F7F5F0] rounded-2xl border border-[#E8E6E1] text-[#6D6D66] leading-relaxed text-xs">
                Můžete zadat URL a Anon Key vašeho Supabase projektu, nebo nastavit proměnné prostředí <code>VITE_SUPABASE_URL</code> a <code>VITE_SUPABASE_ANON_KEY</code>.
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[10px] text-[#2D2D2A] mb-1">
                  SUPABASE_URL
                </label>
                <input
                  type="url"
                  placeholder="https://xyzcompany.supabase.co"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E8E6E1] rounded-xl font-mono text-xs focus:ring-2 focus:ring-[#5A5A40] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[10px] text-[#2D2D2A] mb-1">
                  SUPABASE_ANON_KEY
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E8E6E1] rounded-xl font-mono text-xs focus:ring-2 focus:ring-[#5A5A40] focus:outline-hidden"
                />
              </div>

              {savedMsg && (
                <div className="p-3 bg-[#E6F4EA] border border-[#CEEAD6] text-[#1E7E34] text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Údaje uloženy, načítám...</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-[#E8E6E1]">
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-[#8A8A80] hover:text-[#2D2D2A] text-xs flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Obnovit výchozí</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#8A8A80] hover:text-[#2D2D2A]"
                  >
                    Zavřít
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#5A5A40] hover:bg-[#2D2D2A] text-white text-[10px] font-bold uppercase tracking-widest rounded-full transition-colors"
                  >
                    Uložit a připojit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
