import React, { useEffect, useState } from 'react';
import { Product, Post } from '../types/database';
import { getProducts } from '../services/products';
import { getPublishedPosts } from '../services/content';
import { ProductCard } from '../components/ProductCard';
import {
  ArrowRight,
  Calendar,
  Clock,
  Egg,
  Sparkles,
  ChevronRight,
  Sun,
  ShieldCheck,
  HeartHandshake,
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (path: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [prodList, postList] = await Promise.all([
          getProducts(),
          getPublishedPosts(),
        ]);
        setProducts(prodList);
        setPosts(postList.slice(0, 3));
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter products by section
  const availableProducts = products.filter(
    (p) => p.availability?.status === 'available'
  );

  const preorderAndComingSoon = products.filter(
    (p) =>
      p.availability?.status === 'preorder' ||
      p.availability?.status === 'coming_soon'
  );

  const madeToOrderProducts = products.filter(
    (p) => p.is_made_to_order || p.availability?.status === 'made_to_order'
  );

  const seasonalProducts = products.filter((p) => p.is_seasonal);

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* Clean Minimalism Hero Section */}
      <section className="px-6 lg:px-10 py-10 sm:py-14 flex flex-col lg:flex-row gap-8 lg:gap-12 items-center bg-[#F7F5F0] border-b border-[#E8E6E1]">
        <div className="flex-1 space-y-6">
          <span className="text-[11px] font-bold text-[#8A9A5B] uppercase tracking-[0.2em] block">
            Vítejte u nás na dvoře
          </span>
          <h1 className="font-serif italic text-4xl sm:text-5xl lg:text-6xl text-[#2D2D2A] leading-tight">
            Poctivá vajíčka a domácí <br className="hidden sm:inline" />
            výrobky z podhůří.
          </h1>
          <p className="text-[#6D6D66] text-sm sm:text-base max-w-lg leading-relaxed">
            Nejsme anonymní e-shop. Jsme malé rodinné hospodářství. Na tomto webu najdete to, co jsme právě sklidili, vyrobili nebo co pro vás teprve s láskou chystáme.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              id="hero-cta-catalog"
              onClick={() => onNavigate('/nabidka')}
              className="border border-[#2D2D2A] bg-[#2D2D2A] text-white px-8 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-[#5A5A40] hover:border-[#5A5A40] rounded-full transition-colors shadow-xs"
            >
              Zobrazit nabídku
            </button>
            <button
              id="hero-cta-story"
              onClick={() => onNavigate('/o-hospodarstvi')}
              className="text-[11px] font-bold uppercase tracking-widest text-[#2D2D2A] flex items-center gap-2 underline underline-offset-8 hover:text-[#5A5A40] transition-colors"
            >
              Příběh hospodářství
            </button>
          </div>
        </div>

        {/* Hero Visual Card with floating pill */}
        <div className="w-full lg:w-[440px] h-[320px] bg-[#E8E6E1] rounded-[36px] relative overflow-hidden shadow-xs shrink-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center opacity-95"></div>
          <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#E8E6E1] shadow-xs">
            <p className="text-[10px] uppercase font-bold text-[#8A8A80] mb-0.5">Dnes sneseno & připraveno</p>
            <p className="text-xl font-serif italic text-[#2D2D2A]">42 čerstvých vajec</p>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 space-y-16 sm:space-y-20">
        {/* Section 1: Právě máme (Available) */}
        <section id="sekce-prave-mame" className="scroll-mt-24 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E6E1] pb-4">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-[#1E7E34] uppercase tracking-widest mb-1">
                <span className="w-2 h-2 rounded-full bg-[#1E7E34] animate-pulse" />
                <span>Ihned k rezervaci ze dvora</span>
              </div>
              <h2 className="font-serif italic text-2xl sm:text-3xl font-bold text-[#2D2D2A]">
                Co máme právě na skladě
              </h2>
              <p className="text-xs sm:text-sm text-[#6D6D66] mt-1">
                Čerstvě snesená vajíčka, vytočený med a zásoby připravené k osobnímu odběru.
              </p>
            </div>

            <button
              onClick={() => onNavigate('/nabidka')}
              className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-[#5A5A40] hover:text-[#2D2D2A] transition-colors"
            >
              <span>Všechny produkty</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-80 bg-[#F7F5F0] rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : availableProducts.length === 0 ? (
            <div className="text-center py-12 bg-[#F7F5F0] rounded-2xl border border-[#E8E6E1] p-6 text-xs text-[#8A8A80]">
              Momentálně jsou skladové zásoby vyčerpány. Prohlédněte si produkty na předobjednávku.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {availableProducts.slice(0, 4).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onNavigate={(slug) => onNavigate(`/produkt/${slug}`)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Section 2: Připravujeme & Předobjednávky */}
        {preorderAndComingSoon.length > 0 && (
          <section className="space-y-6">
            <div className="border-b border-[#E8E6E1] pb-4">
              <div className="flex items-center gap-2 text-[10px] font-bold text-[#B25E09] uppercase tracking-widest mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Plánovaná sklizeň & příprava</span>
              </div>
              <h2 className="font-serif italic text-2xl sm:text-3xl font-bold text-[#2D2D2A]">
                Připravujeme a předobjednávky
              </h2>
              <p className="text-xs sm:text-sm text-[#6D6D66] mt-1">
                Zarezervujte si své místo v předstihu pro nadcházející sklizeň jarních plodů a sirupů.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {preorderAndComingSoon.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onNavigate={(slug) => onNavigate(`/produkt/${slug}`)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Section 3: Na zakázku (Made to Order: Pečení, Řemeslo) */}
        {madeToOrderProducts.length > 0 && (
          <section className="space-y-6 bg-[#F7F5F0] -mx-6 sm:-mx-10 p-6 sm:p-10 rounded-3xl border border-[#E8E6E1]">
            <div className="border-b border-[#E8E6E1] pb-4">
              <div className="flex items-center gap-2 text-[10px] font-bold text-[#5A5A40] uppercase tracking-widest mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Ruční práce & čerstvé pečení</span>
              </div>
              <h2 className="font-serif italic text-2xl sm:text-3xl font-bold text-[#2D2D2A]">
                Vyrábíme a pečeme na objednávku
              </h2>
              <p className="text-xs sm:text-sm text-[#6D6D66] mt-1">
                Koláče pečeme ráno v den předání. Dřevěné výrobky z masivu zhotovujeme ručně v naší dílně.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
              {madeToOrderProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onNavigate={(slug) => onNavigate(`/produkt/${slug}`)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Section 4: O hospodářství & Naše slepice Story Callouts */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: O hospodářství */}
          <div className="bg-white rounded-3xl border border-[#E8E6E1] p-8 sm:p-10 flex flex-col justify-between shadow-xs space-y-6">
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8A9A5B]">
                Příběh dvora
              </span>
              <h3 className="font-serif italic text-2xl sm:text-3xl font-bold text-[#2D2D2A] leading-snug">
                Jak hospodaříme v souladu s přírodou
              </h3>
              <p className="text-xs sm:text-sm text-[#6D6D66] leading-relaxed">
                Přečtěte si, jak pečujeme o staré sady, proč nepoužíváme syntetickou chemii a jak vzniká poctivé jídlo z našeho rodinného dvora.
              </p>
            </div>

            <div className="pt-4 border-t border-[#E8E6E1]">
              <button
                onClick={() => onNavigate('/o-hospodarstvi')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#5A5A40] text-white text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-[#2D2D2A] transition-colors"
              >
                <span>Více o našem hospodářství</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Naše slepice */}
          <div className="bg-[#2D3027] text-[#FDFCFB] rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-xs space-y-6">
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8A9A5B]">
                Volný chov slepic
              </span>
              <h3 className="font-serif italic text-2xl sm:text-3xl font-bold text-white leading-snug">
                Poznejte naše slepičky a jejich louku
              </h3>
              <p className="text-xs sm:text-sm text-[#E8E6E1]/80 leading-relaxed">
                Pestrá směs tradičních plemen, zelený jetelový výběh, poctivé zrno a vejce se sytě žlutým žloutkem.
              </p>
            </div>

            <div className="pt-4 border-t border-white/10">
              <button
                onClick={() => onNavigate('/nase-slepice')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#2D2D2A] text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-[#8A9A5B] hover:text-white transition-colors"
              >
                <span>Číst o našich slepicích</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* Section 5: Aktuality ze dvora */}
        {posts.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#E8E6E1] pb-4">
              <div>
                <h2 className="font-serif italic text-2xl sm:text-3xl font-bold text-[#2D2D2A]">
                  Aktuality ze dvora
                </h2>
                <p className="text-xs sm:text-sm text-[#6D6D66] mt-1">
                  Co se právě děje na záhonech, ve včelíně a v kurníku.
                </p>
              </div>

              <button
                onClick={() => onNavigate('/aktuality')}
                className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-[#5A5A40] hover:text-[#2D2D2A]"
              >
                <span>Všechny články</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post) => (
                <article
                  key={post.id}
                  onClick={() => onNavigate(`/aktuality/${post.slug}`)}
                  className="bg-white rounded-2xl border border-[#E8E6E1] overflow-hidden shadow-xs hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
                >
                  {post.cover_image && (
                    <div className="aspect-16/10 overflow-hidden bg-[#F7F5F0]">
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover hover:scale-103 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {post.published_at && (
                        <div className="text-[10px] uppercase font-bold text-[#8A8A80] mb-2">
                          {new Date(post.published_at).toLocaleDateString('cs-CZ')}
                        </div>
                      )}
                      <h3 className="font-serif italic text-lg font-bold text-[#2D2D2A] mb-2 leading-snug">
                        {post.title}
                      </h3>
                      {post.perex && (
                        <p className="text-xs text-[#6D6D66] line-clamp-3 leading-relaxed">
                          {post.perex}
                        </p>
                      )}
                    </div>
                    <div className="pt-4 mt-4 border-t border-[#E8E6E1] flex items-center text-[11px] font-bold uppercase tracking-widest text-[#5A5A40] gap-1">
                      <span>Číst celý příspěvek</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
