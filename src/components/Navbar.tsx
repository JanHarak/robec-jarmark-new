import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Menu, X, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const { totalItemsCount, setIsDrawerOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Nabídka', path: '/nabidka' },
    { label: 'O hospodářství', path: '/o-hospodarstvi' },
    { label: 'Naše slepice', path: '/nase-slepice' },
    { label: 'Aktuality', path: '/aktuality' },
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FDFCFB]/95 backdrop-blur-md border-b border-[#E8E6E1]">
      <div className="flex justify-between items-center px-6 lg:px-10 py-4 sm:py-5 max-w-7xl mx-auto">
        {/* Brand Logo */}
        <button
          id="brand-logo-btn"
          onClick={() => handleNavClick('/')}
          className="flex items-center gap-3 text-left focus:outline-hidden group"
        >
          <div className="w-10 h-10 bg-[#5A5A40] rounded-full flex items-center justify-center text-[#FDFCFB] font-serif text-xl italic group-hover:bg-[#2D2D2A] transition-colors">
            H
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-widest uppercase text-[#2D2D2A]">
              Naše Hospodářství
            </h1>
            <p className="text-[10px] text-[#8A8A80] uppercase tracking-wider">
              Digitální katalog produktů
            </p>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex gap-8 text-[12px] font-medium uppercase tracking-widest">
          {navLinks.map((link) => {
            const isActive =
              currentPath === link.path ||
              (link.path === '/nabidka' && currentPath.startsWith('/produkt'));
            return (
              <button
                key={link.path}
                id={`nav-link-${link.path.replace('/', '') || 'home'}`}
                onClick={() => handleNavClick(link.path)}
                className={`transition-colors ${
                  isActive
                    ? 'border-b border-[#2D2D2A] pb-1 text-[#2D2D2A] font-bold'
                    : 'text-[#8A8A80] hover:text-[#2D2D2A]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls & Cart Button */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="hidden lg:block text-right">
            <p className="text-[10px] text-[#8A8A80] uppercase tracking-wider">Dnešní odběr</p>
            <p className="text-xs font-bold text-[#2D2D2A]">14:00 — 17:00</p>
          </div>

          <button
            id="admin-nav-button"
            onClick={() => handleNavClick('/admin')}
            title="Administrace"
            className={`p-2 text-xs font-bold uppercase tracking-wider rounded-full transition-colors flex items-center gap-1.5 ${
              currentPath.startsWith('/admin')
                ? 'bg-[#2D2D2A] text-white'
                : 'text-[#8A8A80] hover:text-[#2D2D2A] hover:bg-[#F7F5F0]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="hidden xl:inline text-[10px]">Admin</span>
          </button>

          <button
            id="cart-trigger-button"
            onClick={() => setIsDrawerOpen(true)}
            className="bg-[#5A5A40] text-white px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-[#2D2D2A] transition-colors shadow-xs flex items-center gap-2"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Košík ({totalItemsCount})</span>
          </button>

          {/* Mobile menu trigger */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#2D2D2A] hover:bg-[#F7F5F0] rounded-lg"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E8E6E1] bg-[#FDFCFB] px-6 py-4 space-y-2">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`w-full text-left py-2 text-xs uppercase tracking-widest font-bold ${
                  isActive ? 'text-[#2D2D2A] underline underline-offset-4' : 'text-[#8A8A80]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
          <div className="pt-2 border-t border-[#E8E6E1] flex justify-between items-center text-xs">
            <span className="text-[10px] text-[#8A8A80] uppercase">Odběr ze dvora:</span>
            <span className="font-bold text-[#2D2D2A]">14:00 — 17:00</span>
          </div>
        </div>
      )}
    </header>
  );
};
