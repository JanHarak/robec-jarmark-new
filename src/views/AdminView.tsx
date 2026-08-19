import React, { useEffect, useState } from 'react';
import { Order, OrderStatus, Product, Inventory, Post } from '../types/database';
import {
  loginAdmin,
  logoutAdmin,
  getAdminSession,
  getAdminOrders,
  confirmOrder,
  rejectOrder,
  cancelOrder,
  markOrderReady,
  completeOrder,
  getInventoryList,
  addStock,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductImage,
} from '../services/admin';
import { getProducts } from '../services/products';
import { getPublishedPosts, getAllPages, updatePageContent } from '../services/content';
import {
  ShieldCheck,
  LogOut,
  ShoppingBag,
  Package,
  Layers,
  FileText,
  Egg,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Plus,
  RefreshCw,
  AlertCircle,
  Search,
  Filter,
  Phone,
  Mail,
  User,
  ExternalLink,
  Edit3,
} from 'lucide-react';

interface AdminViewProps {
  onNavigate: (path: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ onNavigate }) => {
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('admin@robeskyjarmark.cz');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Navigation tab in Admin
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'inventory' | 'products' | 'posts' | 'pages'>('dashboard');

  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [inventoryList, setInventoryList] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagesDict, setPagesDict] = useState<Record<string, any>>({});
  const [loadingData, setLoadingData] = useState(false);

  // Order filter
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Stock update modal/custom amount
  const [stockActionMsg, setStockActionMsg] = useState<string | null>(null);

  // Page editing state
  const [selectedPageSlug, setSelectedPageSlug] = useState<string>('o-hospodarstvi');
  const [editPageTitle, setEditPageTitle] = useState('');
  const [editPageContent, setEditPageContent] = useState('');
  const [editPageHero, setEditPageHero] = useState('');
  const [pageSaveMsg, setPageSaveMsg] = useState<string | null>(null);

  // Product management state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodSlug, setProdSlug] = useState('');
  const [prodCategory, setProdCategory] = useState('');
  const [prodPrice, setProdPrice] = useState(100);
  const [prodUnit, setProdUnit] = useState('ks');
  const [prodShortDesc, setProdShortDesc] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodImageUrl, setProdImageUrl] = useState('');
  const [prodInitialStock, setProdInitialStock] = useState(20);
  const [prodIsActive, setProdIsActive] = useState(true);
  const [prodIsFeatured, setProdIsFeatured] = useState(false);
  const [productActionMsg, setProductActionMsg] = useState<string | null>(null);

  const openAddProductModal = () => {
    setEditingProduct(null);
    setProdName('');
    setProdSlug('');
    setProdCategory('kat-1');
    setProdPrice(100);
    setProdUnit('ks');
    setProdShortDesc('');
    setProdDesc('');
    setProdImageUrl('');
    setProdInitialStock(20);
    setProdIsActive(true);
    setProdIsFeatured(false);
    setShowProductModal(true);
  };

  const openEditProductModal = (p: Product) => {
    setEditingProduct(p);
    setProdName(p.name);
    setProdSlug(p.slug);
    setProdCategory(p.category_id || 'kat-1');
    setProdPrice(p.price);
    setProdUnit(p.unit);
    setProdShortDesc(p.short_description || '');
    setProdDesc(p.description || '');
    setProdImageUrl(p.images?.[0]?.storage_path || p.images?.[0]?.url || '');
    setProdInitialStock(p.inventory?.quantity_on_hand || 20);
    setProdIsActive(p.is_active);
    setProdIsFeatured(p.is_featured);
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, {
          name: prodName,
          slug: prodSlug || prodName.toLowerCase().replace(/\s+/g, '-'),
          category_id: prodCategory || null,
          short_description: prodShortDesc,
          description: prodDesc,
          price: prodPrice,
          unit: prodUnit,
          is_active: prodIsActive,
          is_featured: prodIsFeatured,
        });
        if (prodImageUrl) {
          await addProductImage(editingProduct.id, prodImageUrl, prodName, true);
        }
        setProductActionMsg('Produkt byl úspěšně upraven.');
      } else {
        const newP: any = await createProduct({
          name: prodName,
          slug: prodSlug || prodName.toLowerCase().replace(/\s+/g, '-'),
          category_id: prodCategory || null,
          short_description: prodShortDesc,
          description: prodDesc,
          price: prodPrice,
          unit: prodUnit,
          is_active: prodIsActive,
          is_featured: prodIsFeatured,
        });
        if (newP?.id && prodImageUrl) {
          await addProductImage(newP.id, prodImageUrl, prodName, true);
        }
        if (newP?.id) {
          await addStock(newP.id, prodInitialStock, 'Počáteční zásoba');
        }
        setProductActionMsg('Nový produkt byl úspěšně vytvořen.');
      }
      setTimeout(() => setProductActionMsg(null), 3500);
      setShowProductModal(false);
      await loadAdminData();
    } catch (err: any) {
      console.error('Failed to save product:', err);
      alert('Chyba při ukládání produktu: ' + err.message);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Opravdu chcete tento produkt smazat (skrýt z nabídky)?')) {
      await deleteProduct(productId);
      await loadAdminData();
    }
  };

  // Check auth session
  useEffect(() => {
    const check = async () => {
      try {
        setAuthLoading(true);
        const s = await getAdminSession();
        setSession(s);
      } catch (e) {
        console.error(e);
      } finally {
        setAuthLoading(false);
      }
    };
    check();
  }, []);

  // Fetch admin data
  const loadAdminData = async () => {
    try {
      setLoadingData(true);
      const [ordList, invList, prodList, postList, pagesData] = await Promise.all([
        getAdminOrders(),
        getInventoryList(),
        getProducts(),
        getPublishedPosts(),
        getAllPages(),
      ]);
      setOrders(ordList);
      setInventoryList(invList);
      setProducts(prodList);
      setPosts(postList);
      setPagesDict(pagesData);
      if (pagesData[selectedPageSlug]) {
        setEditPageTitle(pagesData[selectedPageSlug].title || '');
        setEditPageContent(pagesData[selectedPageSlug].content || '');
        setEditPageHero(pagesData[selectedPageSlug].hero_image || '');
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (session) {
      loadAdminData();
    }
  }, [session]);

  // When selected page changes in pages tab
  useEffect(() => {
    if (pagesDict[selectedPageSlug]) {
      setEditPageTitle(pagesDict[selectedPageSlug].title || '');
      setEditPageContent(pagesDict[selectedPageSlug].content || '');
      setEditPageHero(pagesDict[selectedPageSlug].hero_image || '');
    }
  }, [selectedPageSlug, pagesDict]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      setIsLoggingIn(true);
      const res = await loginAdmin(loginEmail, loginPassword);
      setSession(res.session || { user: res.user });
    } catch (err: any) {
      setLoginError(err.message || 'Neplatné přihlašovací údaje.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setSession(null);
  };

  // Order Status Actions
  const handleConfirmOrder = async (orderId: string) => {
    await confirmOrder(orderId, 'Potvrzeno hospodářem', new Date(Date.now() + 86400000).toISOString().split('T')[0]);
    await loadAdminData();
  };

  const handleMarkOrderReady = async (orderId: string) => {
    await markOrderReady(orderId, 'Připraveno ve výdejně ze dvora');
    await loadAdminData();
  };

  const handleCompleteOrder = async (orderId: string) => {
    await completeOrder(orderId);
    await loadAdminData();
  };

  const handleRejectOrder = async (orderId: string) => {
    await rejectOrder(orderId, 'Kapacita vyčerpána');
    await loadAdminData();
  };

  const handleCancelOrder = async (orderId: string) => {
    await cancelOrder(orderId, 'Zrušeno na žádost');
    await loadAdminData();
  };

  // Quick Stock actions
  const handleQuickAddStock = async (productId: string, qty: number) => {
    await addStock(productId, qty, `Rychlé naskladnění +${qty}`);
    setStockActionMsg(`Naskladněno +${qty}`);
    setTimeout(() => setStockActionMsg(null), 2000);
    await loadAdminData();
  };

  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePageContent(selectedPageSlug, editPageTitle, editPageContent, editPageHero);
      setPageSaveMsg('Oblast byla úspěšně uložena a aktualizována.');
      setTimeout(() => setPageSaveMsg(null), 3500);
      await loadAdminData();
    } catch (err: any) {
      setPageSaveMsg('Chyba při ukládání: ' + err.message);
    }
  };

  // Status badge helper for orders
  const getOrderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-[#FFF4E5] text-[#B25E09] border border-[#FFE7C2]">
            Čeká na potvrzení
          </span>
        );
      case 'confirmed':
        return (
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-[#E6F4EA] text-[#1E7E34] border border-[#CEEAD6]">
            Potvrzeno
          </span>
        );
      case 'waiting':
        return (
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-[#E8F0FE] text-[#1967D2] border border-[#D2E3FC]">
            Připravujeme
          </span>
        );
      case 'ready':
        return (
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-[#E6F4EA] text-[#1E7E34] border border-[#1E7E34] font-semibold">
            Připraveno k předání
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-[#F1F3F4] text-[#5F6368]">
            Předáno
          </span>
        );
      case 'rejected':
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-[#FCE8E6] text-[#C5221F]">
            {status === 'rejected' ? 'Nebylo možné potvrdit' : 'Zrušeno'}
          </span>
        );
    }
  };

  // Auth Loading
  if (authLoading) {
    return (
      <div className="max-w-md mx-auto my-24 p-8 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-[#5A5A40] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-[#8A8A80] uppercase tracking-widest">Ověřuji oprávnění...</p>
      </div>
    );
  }

  // Not logged in: Show Login Screen
  if (!session) {
    return (
      <div className="max-w-md mx-auto my-16 sm:my-24 px-6">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E8E6E1] shadow-xs space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-[#5A5A40] text-white rounded-full flex items-center justify-center mx-auto text-lg font-serif italic">
              R
            </div>
            <h1 className="font-serif italic text-2xl font-bold text-[#2D2D2A]">
              Správa Robečského jarmarku
            </h1>
            <p className="text-xs text-[#8A8A80]">
              Přihlášení pro hospodáře.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold uppercase tracking-wider text-[10px] text-[#2D2D2A] mb-1">
                E-mail hospodáře
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F7F5F0] border border-[#E8E6E1] rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#5A5A40]"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-[10px] text-[#2D2D2A] mb-1">
                Heslo
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F7F5F0] border border-[#E8E6E1] rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#5A5A40]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 bg-[#5A5A40] hover:bg-[#2D2D2A] text-white font-bold uppercase tracking-widest text-[11px] rounded-full shadow-xs transition-colors"
            >
              {isLoggingIn ? 'Přihlašuji...' : 'Přihlásit se do administrace'}
            </button>
          </form>

          <div className="pt-2 text-center">
            <button
              onClick={() => onNavigate('/')}
              className="text-[11px] text-[#8A8A80] hover:text-[#2D2D2A] uppercase tracking-wider font-bold"
            >
              ← Zpět na úvodní stránku
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
    return true;
  });

  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const readyCount = orders.filter((o) => o.status === 'ready').length;
  const confirmedCount = orders.filter((o) => o.status === 'confirmed').length;

  const eggProduct = products.find((p) => p.slug.includes('vejce'));
  const eggInventory = inventoryList.find((i) => i.product_id === eggProduct?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Admin Header Bar */}
      <div className="bg-white rounded-3xl border border-[#E8E6E1] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#5A5A40] text-white flex items-center justify-center font-serif italic text-xl">
            R
          </div>
          <div>
            <h1 className="font-serif italic text-2xl font-bold text-[#2D2D2A]">
              Administrace Robečského jarmarku
            </h1>
            <p className="text-[11px] text-[#8A8A80] uppercase tracking-wider">
              Přihlášen jako: {session.user?.email || 'Hospodář'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadAdminData}
            className="p-2 text-[#8A8A80] hover:text-[#2D2D2A] hover:bg-[#F7F5F0] rounded-lg transition-colors text-xs flex items-center gap-1.5"
            title="Aktualizovat data"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Obnovit</span>
          </button>
          <button
            onClick={() => onNavigate('/')}
            className="px-3.5 py-1.5 text-xs font-medium border border-[#E8E6E1] rounded-full hover:bg-[#F7F5F0] transition-colors"
          >
            Zobrazit web
          </button>
          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 text-xs font-medium bg-[#F7F5F0] text-red-700 hover:bg-red-50 rounded-full transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Odhlásit</span>
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8E6E1] overflow-x-auto pb-1 text-xs font-bold uppercase tracking-widest">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2.5 rounded-full transition-colors whitespace-nowrap ${
            activeTab === 'dashboard'
              ? 'bg-[#5A5A40] text-white'
              : 'text-[#8A8A80] hover:text-[#2D2D2A] hover:bg-[#F7F5F0]'
          }`}
        >
          Přehled (Dashboard)
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-full transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'orders'
              ? 'bg-[#5A5A40] text-white'
              : 'text-[#8A8A80] hover:text-[#2D2D2A] hover:bg-[#F7F5F0]'
          }`}
        >
          <span>Rezervace & objednávky</span>
          {pendingCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#B25E09] text-white text-[10px] flex items-center justify-center">
              {pendingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2.5 rounded-full transition-colors whitespace-nowrap ${
            activeTab === 'inventory'
              ? 'bg-[#5A5A40] text-white'
              : 'text-[#8A8A80] hover:text-[#2D2D2A] hover:bg-[#F7F5F0]'
          }`}
        >
          Správa skladu & vajec
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2.5 rounded-full transition-colors whitespace-nowrap ${
            activeTab === 'products'
              ? 'bg-[#5A5A40] text-white'
              : 'text-[#8A8A80] hover:text-[#2D2D2A] hover:bg-[#F7F5F0]'
          }`}
        >
          Katalog produktů ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('posts')}
          className={`px-4 py-2.5 rounded-full transition-colors whitespace-nowrap ${
            activeTab === 'posts'
              ? 'bg-[#5A5A40] text-white'
              : 'text-[#8A8A80] hover:text-[#2D2D2A] hover:bg-[#F7F5F0]'
          }`}
        >
          Aktuality ({posts.length})
        </button>
        <button
          onClick={() => setActiveTab('pages')}
          className={`px-4 py-2.5 rounded-full transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'pages'
              ? 'bg-[#5A5A40] text-white'
              : 'text-[#8A8A80] hover:text-[#2D2D2A] hover:bg-[#F7F5F0]'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Úprava oblastí & stránek</span>
        </button>
      </div>

      {/* TAB 1: DASHBOARD OVERVIEW */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          {/* Key Metric cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-[#E8E6E1] shadow-xs space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B25E09]">
                Čeká na potvrzení
              </span>
              <div className="text-3xl font-bold font-serif italic text-[#2D2D2A]">
                {pendingCount}
              </div>
              <p className="text-xs text-[#8A8A80]">Nové rezervace od zákazníků</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E8E6E1] shadow-xs space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E7E34]">
                K vyzvednutí
              </span>
              <div className="text-3xl font-bold font-serif italic text-[#2D2D2A]">
                {readyCount}
              </div>
              <p className="text-xs text-[#8A8A80]">Objednávky připravené ve výdejně</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E8E6E1] shadow-xs space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A5A40]">
                Potvrzeno
              </span>
              <div className="text-3xl font-bold font-serif italic text-[#2D2D2A]">
                {confirmedCount}
              </div>
              <p className="text-xs text-[#8A8A80]">Zpracovávané objednávky</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E8E6E1] shadow-xs space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8A80]">
                Stav vajec na skladě
              </span>
              <div className="text-3xl font-bold font-serif italic text-[#2D2D2A]">
                {eggInventory ? eggInventory.quantity_on_hand - eggInventory.quantity_reserved : 22} balení
              </div>
              <p className="text-xs text-[#8A8A80]">Volně k rezervaci ze Supabase</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-[#E8E6E1] p-6 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E6E1] pb-4">
            <div>
              <h3 className="font-serif italic text-xl font-bold text-[#2D2D2A]">
                Přijaté rezervace a předobjednávky
              </h3>
              <p className="text-xs text-[#8A8A80] mt-0.5">
                Spravujte stavy objednávek pomocí autoritativních Supabase RPC akcí.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="px-3.5 py-2 bg-[#F7F5F0] border border-[#E8E6E1] rounded-full text-xs font-bold uppercase tracking-wider text-[#2D2D2A]"
              >
                <option value="all">Všechny stavy</option>
                <option value="pending">Čeká na potvrzení</option>
                <option value="confirmed">Potvrzeno</option>
                <option value="ready">Připraveno</option>
                <option value="completed">Předáno</option>
                <option value="cancelled">Zrušeno</option>
              </select>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-xs text-[#8A8A80]">
              Žádné rezervace neodpovídají zvolenému filtru.
            </div>
          ) : (
            <div className="divide-y divide-[#E8E6E1]">
              {filteredOrders.map((order) => (
                <div key={order.id} className="py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-[#2D2D2A]">
                        {order.order_number}
                      </span>
                      {getOrderStatusBadge(order.status)}
                    </div>
                    <div className="text-[#2D2D2A] font-medium flex items-center gap-3">
                      <span>{order.customer_name}</span>
                      <span className="text-[#8A8A80]">•</span>
                      <span>{order.customer_email}</span>
                      {order.customer_phone && (
                        <>
                          <span className="text-[#8A8A80]">•</span>
                          <span>{order.customer_phone}</span>
                        </>
                      )}
                    </div>
                    {order.customer_note && (
                      <p className="text-[#6D6D66] italic bg-[#F7F5F0] p-2 rounded-xl border border-[#E8E6E1] mt-1">
                        Poznámka: „{order.customer_note}“
                      </p>
                    )}
                    <div className="text-[11px] text-[#8A8A80]">
                      Vytvořeno: {new Date(order.created_at).toLocaleString('cs-CZ')} • Položky: {order.items?.length || 0} ks • Celkem: <strong>{order.total_price} Kč</strong>
                    </div>
                  </div>

                  {/* Order action buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleConfirmOrder(order.id)}
                        className="px-4 py-2 bg-[#5A5A40] hover:bg-[#2D2D2A] text-white text-[10px] font-bold uppercase tracking-wider rounded-full transition-colors"
                      >
                        Potvrdit rezervaci
                      </button>
                    )}

                    {(order.status === 'pending' || order.status === 'confirmed') && (
                      <button
                        onClick={() => handleMarkOrderReady(order.id)}
                        className="px-4 py-2 bg-[#1E7E34] hover:bg-[#155d26] text-white text-[10px] font-bold uppercase tracking-wider rounded-full transition-colors"
                      >
                        Připraveno k odběru
                      </button>
                    )}

                    {order.status === 'ready' && (
                      <button
                        onClick={() => handleCompleteOrder(order.id)}
                        className="px-4 py-2 bg-[#2D2D2A] hover:bg-black text-white text-[10px] font-bold uppercase tracking-wider rounded-full transition-colors"
                      >
                        Označit jako předané
                      </button>
                    )}

                    {order.status !== 'completed' && order.status !== 'cancelled' && order.status !== 'rejected' && (
                      <button
                        onClick={() => handleRejectOrder(order.id)}
                        className="px-3 py-2 bg-[#FCE8E6] text-[#C5221F] hover:bg-red-100 text-[10px] font-bold uppercase tracking-wider rounded-full transition-colors"
                      >
                        Zamítnout
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: INVENTORY */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-3xl border border-[#E8E6E1] p-6 space-y-6 shadow-xs">
          <div className="border-b border-[#E8E6E1] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif italic text-xl font-bold text-[#2D2D2A]">
                Správa skladu a naskladnění vajec (Supabase)
              </h3>
              <p className="text-xs text-[#8A8A80] mt-0.5">
                Data jsou načítána ze Supabase tabulky `inventory`. Rychlé naskladnění volá autoritativní RPC funkci `add_stock`.
              </p>
            </div>
          </div>

          {stockActionMsg && (
            <div className="p-3 bg-[#E6F4EA] border border-[#CEEAD6] text-[#1E7E34] text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{stockActionMsg}</span>
            </div>
          )}

          <div className="divide-y divide-[#E8E6E1]">
            {inventoryList.map((item) => {
              const available = Math.max(0, item.quantity_on_hand - item.quantity_reserved);
              return (
                <div key={item.product_id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div>
                    <h4 className="font-serif italic text-base font-bold text-[#2D2D2A]">
                      {item.product_name}
                    </h4>
                    <div className="flex items-center gap-4 text-[#8A8A80] mt-1 text-[11px]">
                      <span>Fyzicky na skladě: <strong>{item.quantity_on_hand}</strong></span>
                      <span>Rezervováno: <strong>{item.quantity_reserved}</strong></span>
                      <span className="text-[#1E7E34] font-bold">Volně k dispozici: {available} {item.unit}</span>
                    </div>
                  </div>

                  {/* Stock buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuickAddStock(item.product_id, 5)}
                      className="px-3 py-1.5 bg-[#F7F5F0] hover:bg-[#E8E6E1] text-[#2D2D2A] text-[10px] font-bold uppercase tracking-wider rounded-full border border-[#E8E6E1]"
                    >
                      +5 {item.unit}
                    </button>
                    <button
                      onClick={() => handleQuickAddStock(item.product_id, 10)}
                      className="px-3 py-1.5 bg-[#5A5A40] hover:bg-[#2D2D2A] text-white text-[10px] font-bold uppercase tracking-wider rounded-full"
                    >
                      +10 {item.unit}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: PRODUCTS CATALOG ADMIN */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl border border-[#E8E6E1] p-6 space-y-6 shadow-xs">
          <div className="border-b border-[#E8E6E1] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif italic text-xl font-bold text-[#2D2D2A]">
                Správa produktů v katalogu
              </h3>
              <p className="text-xs text-[#8A8A80] mt-0.5">
                Přidávejte nové produkty, upravujte ceny, popisy, obrázky a stav v e-shopu.
              </p>
            </div>
            <button
              onClick={openAddProductModal}
              className="px-5 py-2.5 bg-[#5A5A40] hover:bg-[#2D2D2A] text-white font-bold uppercase tracking-wider text-[11px] rounded-full flex items-center gap-2 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Přidat nový produkt</span>
            </button>
          </div>

          {productActionMsg && (
            <div className="p-3.5 bg-[#E6F4EA] border border-[#CEEAD6] text-[#1E7E34] text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{productActionMsg}</span>
            </div>
          )}

          <div className="divide-y divide-[#E8E6E1]">
            {products.map((p) => (
              <div key={p.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-4">
                  <img
                    src={p.images?.[0]?.storage_path || p.images?.[0]?.url || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=80&w=120'}
                    alt={p.name}
                    className="w-14 h-14 object-cover rounded-2xl bg-[#F7F5F0] border border-[#E8E6E1]"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif italic text-base font-bold text-[#2D2D2A]">
                        {p.name}
                      </h4>
                      {!p.is_active && (
                        <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded-full bg-gray-100 text-gray-500">
                          Skryto
                        </span>
                      )}
                    </div>
                    <p className="text-[#8A8A80] text-[11px] mt-0.5">
                      {p.category?.name || 'Hospodářství'} • <strong>{p.price} Kč</strong> / {p.unit} {p.is_featured ? '• ⭐ Doporučeno' : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditProductModal(p)}
                    className="px-3.5 py-1.5 bg-[#F7F5F0] hover:bg-[#E8E6E1] text-[#2D2D2A] font-bold uppercase tracking-wider text-[10px] rounded-full border border-[#E8E6E1] flex items-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Upravit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(p.id)}
                    className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold uppercase tracking-wider text-[10px] rounded-full flex items-center gap-1.5 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Smazat</span>
                  </button>
                  <button
                    onClick={() => onNavigate(`/produkt/${p.slug}`)}
                    className="p-2 text-[#8A8A80] hover:text-[#2D2D2A] rounded-full hover:bg-[#F7F5F0]"
                    title="Zobrazit na webu"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRODUCT ADD/EDIT MODAL */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-[#E8E6E1]">
            <div className="flex items-center justify-between border-b border-[#E8E6E1] pb-4">
              <h3 className="font-serif italic text-xl font-bold text-[#2D2D2A]">
                {editingProduct ? 'Úprava produktu' : 'Přidat nový produkt'}
              </h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="w-8 h-8 rounded-full bg-[#F7F5F0] flex items-center justify-center text-[#8A8A80] hover:text-[#2D2D2A]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-[10px] text-[#2D2D2A] mb-1">
                  Název produktu *
                </label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="např. Domácí jahodový džem"
                  className="w-full px-3.5 py-2.5 bg-[#F7F5F0] border border-[#E8E6E1] rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#5A5A40]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[10px] text-[#2D2D2A] mb-1">
                    Cena (Kč) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#F7F5F0] border border-[#E8E6E1] rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#5A5A40]"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[10px] text-[#2D2D2A] mb-1">
                    Jednotka *
                  </label>
                  <select
                    value={prodUnit}
                    onChange={(e) => setProdUnit(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F7F5F0] border border-[#E8E6E1] rounded-xl text-xs font-bold uppercase tracking-wider text-[#2D2D2A]"
                  >
                    <option value="ks">ks (kus)</option>
                    <option value="kg">kg (kilogram)</option>
                    <option value="l">l (litr)</option>
                    <option value="balení">balení</option>
                    <option value="sklenice">sklenice</option>
                    <option value="svazek">svazek</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[10px] text-[#2D2D2A] mb-1">
                  URL obrázku produktu (nebo cesta k úložišti)
                </label>
                <input
                  type="text"
                  value={prodImageUrl}
                  onChange={(e) => setProdImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... nebo products/jam.jpg"
                  className="w-full px-3.5 py-2.5 bg-[#F7F5F0] border border-[#E8E6E1] rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#5A5A40]"
                />
              </div>

              {!editingProduct && (
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[10px] text-[#2D2D2A] mb-1">
                    Počáteční zásoba na skladě
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={prodInitialStock}
                    onChange={(e) => setProdInitialStock(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#F7F5F0] border border-[#E8E6E1] rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#5A5A40]"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold uppercase tracking-wider text-[10px] text-[#2D2D2A] mb-1">
                  Krátký popisek (do karty produktu)
                </label>
                <input
                  type="text"
                  value={prodShortDesc}
                  onChange={(e) => setProdShortDesc(e.target.value)}
                  placeholder="např. Svařené z čerstvých zahradních jahod bez chemie"
                  className="w-full px-3.5 py-2.5 bg-[#F7F5F0] border border-[#E8E6E1] rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#5A5A40]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[10px] text-[#2D2D2A] mb-1">
                  Detailní popis produktu
                </label>
                <textarea
                  rows={4}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  placeholder="Podrobný popis složení, původu a výroby..."
                  className="w-full px-3.5 py-2.5 bg-[#F7F5F0] border border-[#E8E6E1] rounded-xl text-sm font-sans focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#5A5A40]"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-[#2D2D2A]">
                  <input
                    type="checkbox"
                    checked={prodIsActive}
                    onChange={(e) => setProdIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-[#5A5A40] focus:ring-[#5A5A40]"
                  />
                  <span>Aktivní v nabídce e-shopu</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-[#2D2D2A]">
                  <input
                    type="checkbox"
                    checked={prodIsFeatured}
                    onChange={(e) => setProdIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-[#5A5A40] focus:ring-[#5A5A40]"
                  />
                  <span>Doporučený produkt (na úvodu)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E6E1]">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-5 py-2.5 bg-[#F7F5F0] hover:bg-[#E8E6E1] text-[#2D2D2A] font-bold uppercase tracking-wider text-[10px] rounded-full"
                >
                  Zrušit
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#5A5A40] hover:bg-[#2D2D2A] text-white font-bold uppercase tracking-widest text-[11px] rounded-full shadow-xs"
                >
                  {editingProduct ? 'Uložit změny produktu' : 'Vytvořit produkt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 5: POSTS ADMIN */}
      {activeTab === 'posts' && (
        <div className="bg-white rounded-3xl border border-[#E8E6E1] p-6 space-y-4 shadow-xs">
          <div className="border-b border-[#E8E6E1] pb-3">
            <h3 className="font-serif italic text-xl font-bold text-[#2D2D2A]">
              Publikované aktuality
            </h3>
            <p className="text-xs text-[#8A8A80] mt-0.5">
              Články zobrazené na homepage a v sekci aktuality.
            </p>
          </div>

          <div className="divide-y divide-[#E8E6E1]">
            {posts.map((post) => (
              <div key={post.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div>
                  <h4 className="font-serif italic text-base font-bold text-[#2D2D2A]">
                    {post.title}
                  </h4>
                  <p className="text-[11px] text-[#8A8A80]">
                    Publikováno: {post.published_at ? new Date(post.published_at).toLocaleDateString('cs-CZ') : 'Koncept'}
                  </p>
                </div>

                <button
                  onClick={() => onNavigate(`/aktuality/${post.slug}`)}
                  className="px-3.5 py-1.5 border border-[#E8E6E1] hover:bg-[#F7F5F0] text-[#2D2D2A] text-[10px] font-bold uppercase tracking-wider rounded-full transition-colors flex items-center gap-1.5"
                >
                  <span>Zobrazit článek</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: PAGES & SECTIONS CMS */}
      {activeTab === 'pages' && (
        <div className="bg-white rounded-3xl border border-[#E8E6E1] p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="border-b border-[#E8E6E1] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif italic text-xl font-bold text-[#2D2D2A]">
                Správa a editace oblastí a stránek
              </h3>
              <p className="text-xs text-[#8A8A80] mt-0.5">
                Upravujte texty, nadpisy a obrázky pro jednotlivé sekce webu (O hospodářství, Naše slepice atd.).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedPageSlug}
                onChange={(e) => setSelectedPageSlug(e.target.value)}
                className="px-4 py-2 bg-[#F7F5F0] border border-[#E8E6E1] rounded-full text-xs font-bold uppercase tracking-wider text-[#2D2D2A]"
              >
                <option value="o-hospodarstvi">O našem hospodářství</option>
                <option value="nase-slepice">Naše slepice a volný chov</option>
              </select>
            </div>
          </div>

          {pageSaveMsg && (
            <div className="p-3.5 bg-[#E6F4EA] border border-[#CEEAD6] text-[#1E7E34] text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{pageSaveMsg}</span>
            </div>
          )}

          <form onSubmit={handleSavePage} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold uppercase tracking-wider text-[10px] text-[#2D2D2A] mb-1">
                Název oblasti / stránky
              </label>
              <input
                type="text"
                required
                value={editPageTitle}
                onChange={(e) => setEditPageTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F7F5F0] border border-[#E8E6E1] rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#5A5A40]"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-[10px] text-[#2D2D2A] mb-1">
                URL obrázku v záhlaví (Hero image URL)
              </label>
              <input
                type="text"
                value={editPageHero}
                onChange={(e) => setEditPageHero(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F7F5F0] border border-[#E8E6E1] rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#5A5A40]"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-[10px] text-[#2D2D2A] mb-1">
                Obsah oblasti (Podporuje odstavce a formátování)
              </label>
              <textarea
                rows={12}
                required
                value={editPageContent}
                onChange={(e) => setEditPageContent(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F7F5F0] border border-[#E8E6E1] rounded-xl text-sm font-sans focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#5A5A40] leading-relaxed"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-3.5 bg-[#5A5A40] hover:bg-[#2D2D2A] text-white font-bold uppercase tracking-widest text-[11px] rounded-full shadow-xs transition-colors"
              >
                Uložit změny oblasti
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
