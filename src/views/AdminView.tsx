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
} from '../services/admin';
import { getProducts } from '../services/products';
import { getPublishedPosts } from '../services/content';
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
} from 'lucide-react';

interface AdminViewProps {
  onNavigate: (path: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ onNavigate }) => {
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('admin@lucnidvur.cz');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Navigation tab in Admin
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'inventory' | 'products' | 'posts'>('dashboard');

  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [inventoryList, setInventoryList] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Order filter
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Stock update modal/custom amount
  const [customStockId, setCustomStockId] = useState<string | null>(null);
  const [customStockAmount, setCustomStockAmount] = useState<number>(10);
  const [stockActionMsg, setStockActionMsg] = useState<string | null>(null);

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
      const [ordList, invList, prodList, postList] = await Promise.all([
        getAdminOrders(),
        getInventoryList(),
        getProducts(),
        getPublishedPosts(),
      ]);
      setOrders(ordList);
      setInventoryList(invList);
      setProducts(prodList);
      setPosts(postList);
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
              H
            </div>
            <h1 className="font-serif italic text-2xl font-bold text-[#2D2D2A]">
              Správa hospodářství
            </h1>
            <p className="text-xs text-[#8A8A80]">
              Přihlášení přes Supabase Auth pro hospodáře.
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
              className="w-full py-3 px-4 bg-[#5A5A40] hover:bg-[#2D2D2A] text-white text-[11px] font-bold uppercase tracking-widest rounded-full transition-colors mt-2"
            >
              {isLoggingIn ? 'Přihlašuji...' : 'Vstoupit do administrace'}
            </button>
          </form>

          <div className="p-3 bg-[#F7F5F0] rounded-xl text-[10px] text-[#8A8A80] leading-relaxed text-center">
            Předvyplněné demo přihlášení: <strong>admin@lucnidvur.cz</strong> / <strong>admin123</strong>
          </div>
        </div>
      </div>
    );
  }

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter === 'all') return true;
    return o.status === orderStatusFilter;
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
            H
          </div>
          <div>
            <h1 className="font-serif italic text-2xl font-bold text-[#2D2D2A]">
              Administrace hospodářství
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
              <p className="text-xs text-[#8A8A80]">Volně k rezervaci</p>
            </div>
          </div>

          {/* Quick Stock Action Widget for Hens / Eggs */}
          <div className="bg-[#F7F5F0] p-6 sm:p-8 rounded-3xl border border-[#E8E6E1] flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#5A5A40]">
                <Egg className="w-4 h-4" />
                <span>Rychlé naskladnění čerstvých vajec</span>
              </div>
              <h3 className="font-serif italic text-xl font-bold text-[#2D2D2A]">
                Právě jste posbírali a vytřídili vejce?
              </h3>
              <p className="text-xs text-[#6D6D66]">
                Jedním kliknutím navýšíte stav skladu a zákazníci si mohou vejce ihned rezervovat.
              </p>
            </div>

            {eggProduct && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuickAddStock(eggProduct.id, 6)}
                  className="px-4 py-2.5 bg-white border border-[#E8E6E1] hover:border-[#2D2D2A] text-xs font-bold uppercase tracking-wider rounded-full shadow-xs transition-colors"
                >
                  +6 balení
                </button>
                <button
                  onClick={() => handleQuickAddStock(eggProduct.id, 12)}
                  className="px-4 py-2.5 bg-[#5A5A40] hover:bg-[#2D2D2A] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-xs transition-colors"
                >
                  +12 balení
                </button>
              </div>
            )}
          </div>

          {/* Recent Orders Overview */}
          <div className="bg-white rounded-3xl border border-[#E8E6E1] p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#E8E6E1] pb-3">
              <h3 className="font-serif italic text-lg font-bold text-[#2D2D2A]">
                Poslední přijaté rezervace
              </h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-bold uppercase tracking-wider text-[#5A5A40] hover:underline"
              >
                Všechny rezervace ({orders.length}) →
              </button>
            </div>

            {orders.length === 0 ? (
              <p className="text-xs text-[#8A8A80] py-4">Zatím nebyly vytvořeny žádné rezervace.</p>
            ) : (
              <div className="divide-y divide-[#E8E6E1]">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#2D2D2A]">{order.order_number}</span>
                        {getOrderStatusBadge(order.status)}
                      </div>
                      <p className="text-[#6D6D66] mt-0.5">
                        Zákazník: <strong>{order.customer_name}</strong> • {order.customer_phone || order.customer_email}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-[#2D2D2A]">{order.total_price} Kč</span>
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleConfirmOrder(order.id)}
                          className="px-3 py-1 bg-[#5A5A40] hover:bg-[#2D2D2A] text-white text-[10px] font-bold uppercase tracking-wider rounded-full"
                        >
                          Potvrdit
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Status filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest">
            {['all', 'pending', 'confirmed', 'ready', 'completed', 'cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setOrderStatusFilter(st)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  orderStatusFilter === st
                    ? 'bg-[#5A5A40] text-white'
                    : 'bg-white border border-[#E8E6E1] text-[#8A8A80] hover:text-[#2D2D2A]'
                }`}
              >
                {st === 'all'
                  ? 'Všechny stavy'
                  : st === 'pending'
                  ? `Čeká na potvrzení (${orders.filter((o) => o.status === 'pending').length})`
                  : st === 'confirmed'
                  ? 'Potvrzeno'
                  : st === 'ready'
                  ? 'K vyzvednutí'
                  : st === 'completed'
                  ? 'Dokončeno'
                  : 'Zrušeno'}
              </button>
            ))}
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-3xl border border-[#E8E6E1] overflow-hidden shadow-xs">
            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#8A8A80]">
                Žádné rezervace v této kategorii.
              </div>
            ) : (
              <div className="divide-y divide-[#E8E6E1]">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="p-6 space-y-4 hover:bg-[#FDFCFB]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-sm text-[#2D2D2A]">
                          {order.order_number}
                        </span>
                        {getOrderStatusBadge(order.status)}
                        <span className="text-[10px] text-[#8A8A80]">
                          {new Date(order.created_at).toLocaleString('cs-CZ')}
                        </span>
                      </div>

                      <div className="text-sm font-bold text-[#2D2D2A]">
                        Celkem: {order.total_price} Kč
                      </div>
                    </div>

                    {/* Customer info */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-[#F7F5F0] p-4 rounded-2xl border border-[#E8E6E1]">
                      <div>
                        <span className="text-[10px] text-[#8A8A80] uppercase tracking-wider block">Zákazník</span>
                        <span className="font-semibold text-[#2D2D2A]">{order.customer_name}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#8A8A80] uppercase tracking-wider block">E-mail</span>
                        <a href={`mailto:${order.customer_email}`} className="text-[#5A5A40] underline">
                          {order.customer_email}
                        </a>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#8A8A80] uppercase tracking-wider block">Telefon</span>
                        <a href={`tel:${order.customer_phone}`} className="text-[#2D2D2A] font-medium">
                          {order.customer_phone || 'Neuveden'}
                        </a>
                      </div>
                      {order.customer_note && (
                        <div className="sm:col-span-3 pt-2 border-t border-[#E8E6E1] text-[#6D6D66]">
                          <strong>Poznámka zákazníka:</strong> {order.customer_note}
                        </div>
                      )}
                    </div>

                    {/* Items */}
                    {order.items && order.items.length > 0 && (
                      <div className="text-xs space-y-1 pt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8A80]">
                          Položky rezervace:
                        </span>
                        <ul className="list-disc list-inside text-[#2D2D2A] space-y-0.5">
                          {order.items.map((it, idx) => (
                            <li key={idx}>
                              <strong>{it.quantity}× {it.product_name}</strong> ({it.unit}) — {it.total_price} Kč
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Action buttons with RPC handlers */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E8E6E1]">
                      {order.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleConfirmOrder(order.id)}
                            className="px-4 py-1.5 bg-[#5A5A40] hover:bg-[#2D2D2A] text-white text-[10px] font-bold uppercase tracking-wider rounded-full transition-colors"
                          >
                            Potvrdit rezervaci
                          </button>
                          <button
                            onClick={() => handleRejectOrder(order.id)}
                            className="px-4 py-1.5 border border-red-200 text-red-700 hover:bg-red-50 text-[10px] font-bold uppercase tracking-wider rounded-full transition-colors"
                          >
                            Zamítnout
                          </button>
                        </>
                      )}

                      {order.status === 'confirmed' && (
                        <button
                          onClick={() => handleMarkOrderReady(order.id)}
                          className="px-4 py-1.5 bg-[#1E7E34] hover:bg-[#155724] text-white text-[10px] font-bold uppercase tracking-wider rounded-full transition-colors"
                        >
                          Označit jako připraveno k předání
                        </button>
                      )}

                      {order.status === 'ready' && (
                        <button
                          onClick={() => handleCompleteOrder(order.id)}
                          className="px-4 py-1.5 bg-[#2D2D2A] hover:bg-black text-white text-[10px] font-bold uppercase tracking-wider rounded-full transition-colors"
                        >
                          Označit jako předáno (dokončeno)
                        </button>
                      )}

                      {order.status !== 'cancelled' && order.status !== 'completed' && order.status !== 'rejected' && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="px-3 py-1 text-xs text-[#8A8A80] hover:text-red-600 transition-colors ml-auto"
                        >
                          Zrušit rezervaci
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: INVENTORY & STOCK */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-[#E8E6E1] p-6 space-y-4 shadow-xs">
            <div className="border-b border-[#E8E6E1] pb-3">
              <h3 className="font-serif italic text-xl font-bold text-[#2D2D2A]">
                Přehled skladových zásob (Inventory)
              </h3>
              <p className="text-xs text-[#8A8A80] mt-0.5">
                Sklad se automaticky rezervuje při schválení objednávek. Zde můžete navyšovat fyzický stav zásob.
              </p>
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
        </div>
      )}

      {/* TAB 4: PRODUCTS CATALOG ADMIN */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl border border-[#E8E6E1] p-6 space-y-4 shadow-xs">
          <div className="border-b border-[#E8E6E1] pb-3">
            <h3 className="font-serif italic text-xl font-bold text-[#2D2D2A]">
              Správa produktů v katalogu
            </h3>
            <p className="text-xs text-[#8A8A80] mt-0.5">
              Přehled všech aktivních a sezónních produktů na webu.
            </p>
          </div>

          <div className="divide-y divide-[#E8E6E1]">
            {products.map((p) => (
              <div key={p.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=80&w=100'}
                    alt={p.name}
                    className="w-12 h-12 object-cover rounded-xl bg-[#F7F5F0] border border-[#E8E6E1]"
                  />
                  <div>
                    <h4 className="font-serif italic text-sm font-bold text-[#2D2D2A]">
                      {p.name}
                    </h4>
                    <p className="text-[#8A8A80] text-[11px]">
                      {p.category?.name || 'Hospodářství'} • {p.price} Kč / {p.unit}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-[#E6F4EA] text-[#1E7E34]">
                    Aktivní na webu
                  </span>
                  <button
                    onClick={() => onNavigate(`/produkt/${p.slug}`)}
                    className="p-1 text-[#8A8A80] hover:text-[#2D2D2A]"
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
    </div>
  );
};
