import React, { useEffect, useState } from 'react';
import { Category, Product } from '../types/database';
import { getCategories, getProducts } from '../services/products';
import { ProductCard } from '../components/ProductCard';
import { Filter, Search, SlidersHorizontal } from 'lucide-react';

interface CatalogViewProps {
  onNavigate: (path: string) => void;
  initialCategory?: string;
}

export const CatalogView: React.FC<CatalogViewProps> = ({ onNavigate, initialCategory }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(initialCategory || 'all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [cats, prods] = await Promise.all([
          getCategories(),
          getProducts(),
        ]);
        setCategories(cats);
        setProducts(prods);
      } catch (err) {
        console.error('Failed to load catalog:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Filter products locally for instant response
  const filteredProducts = products.filter((product) => {
    // Category match
    if (selectedCategoryId !== 'all' && product.category_id !== selectedCategoryId) {
      return false;
    }

    // Status filter match
    if (selectedStatus !== 'all') {
      const pStatus = product.availability?.status;
      if (selectedStatus === 'available' && pStatus !== 'available') return false;
      if (selectedStatus === 'preorder' && pStatus !== 'preorder') return false;
      if (selectedStatus === 'made_to_order' && (!product.is_made_to_order && pStatus !== 'made_to_order')) return false;
      if (selectedStatus === 'seasonal' && !product.is_seasonal) return false;
    }

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchDesc = product.short_description.toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }

    return true;
  });

  const availableCount = products.filter((p) => p.availability?.status === 'available').length;

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 sm:py-14 space-y-8">
      {/* Header */}
      <div className="border-b border-[#E8E6E1] pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-[#8A9A5B] uppercase tracking-[0.2em] block mb-1">
              Digitální katalog dvora
            </span>
            <h1 className="font-serif italic text-3xl sm:text-4xl font-bold text-[#2D2D2A]">
              Naše nabídka & dostupnost
            </h1>
            <p className="text-xs sm:text-sm text-[#6D6D66] mt-1 max-w-2xl">
              Všechna vejce, med, zavařeniny i koláče pochází přímo z našeho hospodářství. Vyberte si podle kategorie nebo stavu dostupnosti.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 bg-[#E6F4EA] border border-[#CEEAD6] text-[#1E7E34] rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1E7E34] animate-pulse" />
              <span>{availableCount} položek ihned skladem</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="space-y-4 bg-white p-5 sm:p-6 rounded-3xl border border-[#E8E6E1] shadow-xs">
        {/* Search & Status Quick Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#8A8A80] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Hledat v nabídce (vejce, med, koláč, sirup)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F7F5F0] border border-[#E8E6E1] rounded-full text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#5A5A40]"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-3 py-1.5 rounded-full transition-colors ${
                selectedStatus === 'all'
                  ? 'bg-[#2D2D2A] text-white'
                  : 'bg-[#F7F5F0] text-[#8A8A80] hover:text-[#2D2D2A]'
              }`}
            >
              Všechny stavy
            </button>
            <button
              onClick={() => setSelectedStatus('available')}
              className={`px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 ${
                selectedStatus === 'available'
                  ? 'bg-[#1E7E34] text-white'
                  : 'bg-[#E6F4EA] text-[#1E7E34] hover:bg-[#CEEAD6]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#1E7E34]" />
              <span>Pouze skladem</span>
            </button>
            <button
              onClick={() => setSelectedStatus('preorder')}
              className={`px-3 py-1.5 rounded-full transition-colors ${
                selectedStatus === 'preorder'
                  ? 'bg-[#B25E09] text-white'
                  : 'bg-[#FFF4E5] text-[#B25E09] hover:bg-[#FFE7C2]'
              }`}
            >
              Předobjednávky
            </button>
            <button
              onClick={() => setSelectedStatus('made_to_order')}
              className={`px-3 py-1.5 rounded-full transition-colors ${
                selectedStatus === 'made_to_order'
                  ? 'bg-[#5A5A40] text-white'
                  : 'bg-[#F7F5F0] text-[#6D6D66] hover:bg-[#E8E6E1]'
              }`}
            >
              Na zakázku
            </button>
            <button
              onClick={() => setSelectedStatus('seasonal')}
              className={`px-3 py-1.5 rounded-full transition-colors ${
                selectedStatus === 'seasonal'
                  ? 'bg-[#C2410C] text-white'
                  : 'bg-[#FFF0E8] text-[#C2410C]'
              }`}
            >
              Sezónní
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="pt-3 border-t border-[#E8E6E1] flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#8A8A80] shrink-0 mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3" />
            <span>Kategorie:</span>
          </span>
          <button
            onClick={() => setSelectedCategoryId('all')}
            className={`px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full shrink-0 transition-colors ${
              selectedCategoryId === 'all'
                ? 'bg-[#5A5A40] text-white shadow-xs'
                : 'bg-[#F7F5F0] text-[#6D6D66] hover:bg-[#E8E6E1]'
            }`}
          >
            Všechny ({products.length})
          </button>
          {categories.map((cat) => {
            const count = products.filter((p) => p.category_id === cat.id).length;
            const isSelected = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-[#5A5A40] text-white shadow-xs'
                    : 'bg-[#F7F5F0] text-[#6D6D66] hover:bg-[#E8E6E1]'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-88 bg-[#F7F5F0] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#E8E6E1] p-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#F7F5F0] flex items-center justify-center mx-auto text-[#8A8A80]">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="font-serif italic text-lg font-bold text-[#2D2D2A]">
            Žádné produkty neodpovídají zadaným filtrům
          </h3>
          <p className="text-xs text-[#8A8A80] max-w-md mx-auto">
            Zkuste vymazat vyhledávací dotaz nebo vybrat jinou kategorii či stav dostupnosti.
          </p>
          <button
            onClick={() => {
              setSelectedCategoryId('all');
              setSelectedStatus('all');
              setSearchQuery('');
            }}
            className="px-5 py-2.5 bg-[#5A5A40] text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-[#2D2D2A] transition-colors mt-2"
          >
            Zobrazit všechny produkty
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onNavigate={(slug) => onNavigate(`/produkt/${slug}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
