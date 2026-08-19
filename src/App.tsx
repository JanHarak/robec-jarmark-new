import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ConnectionBanner } from './components/ConnectionBanner';
import { QuickCartDrawer } from './components/QuickCartDrawer';
import { HomeView } from './views/HomeView';
import { CatalogView } from './views/CatalogView';
import { ProductDetailView } from './views/ProductDetailView';
import { ReservationView } from './views/ReservationView';
import { AboutView } from './views/AboutView';
import { ChickensView } from './views/ChickensView';
import { PostsView } from './views/PostsView';
import { PostDetailView } from './views/PostDetailView';
import { AdminView } from './views/AdminView';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route matching logic
  const renderCurrentView = () => {
    if (currentPath === '/' || currentPath === '') {
      return <HomeView onNavigate={handleNavigate} />;
    }

    if (currentPath === '/nabidka') {
      return <CatalogView onNavigate={handleNavigate} />;
    }

    if (currentPath.startsWith('/produkt/')) {
      const slug = currentPath.replace('/produkt/', '');
      return <ProductDetailView slug={slug} onNavigate={handleNavigate} />;
    }

    if (currentPath === '/rezervace') {
      return <ReservationView onNavigate={handleNavigate} />;
    }

    if (currentPath === '/o-hospodarstvi') {
      return <AboutView onNavigate={handleNavigate} />;
    }

    if (currentPath === '/nase-slepice') {
      return <ChickensView onNavigate={handleNavigate} />;
    }

    if (currentPath === '/aktuality') {
      return <PostsView onNavigate={handleNavigate} />;
    }

    if (currentPath.startsWith('/aktuality/')) {
      const slug = currentPath.replace('/aktuality/', '');
      return <PostDetailView slug={slug} onNavigate={handleNavigate} />;
    }

    if (currentPath.startsWith('/admin')) {
      return <AdminView onNavigate={handleNavigate} />;
    }

    // Default fallback to HomeView
    return <HomeView onNavigate={handleNavigate} />;
  };

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-[#FDFCFB] text-[#2D2D2A]">
        <ConnectionBanner />
        <Navbar currentPath={currentPath} onNavigate={handleNavigate} />

        <main className="flex-1">
          {renderCurrentView()}
        </main>

        <QuickCartDrawer onNavigate={handleNavigate} />
        <Footer onNavigate={handleNavigate} />
      </div>
    </CartProvider>
  );
}
