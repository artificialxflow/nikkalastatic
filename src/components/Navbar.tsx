import React from 'react';
import { ShoppingBag, LayoutDashboard, Store, Search, Heart } from 'lucide-react';

interface NavbarProps {
  currentView: 'shop' | 'admin';
  setView: (view: 'shop' | 'admin') => void;
  cartCount: number;
  openCart: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  favoritesCount: number;
  showOnlyFavorites: boolean;
  onToggleShowFavorites: () => void;
}

export default function Navbar({
  currentView,
  setView,
  cartCount,
  openCart,
  searchQuery,
  setSearchQuery,
  favoritesCount,
  showOnlyFavorites,
  onToggleShowFavorites
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b-2 border-brand-dark px-4 py-3 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Logo and App Mode Toggle */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-orange text-white rounded-xl border-2 border-brand-dark flex items-center justify-center shadow-bold-sm">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-brand-dark tracking-tight">نیک‌کالا</h1>
              <p className="text-[10px] text-zinc-500 font-mono">NikKala • Light & Bold</p>
            </div>
          </div>

          {/* Mobile view switchers */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setView(currentView === 'shop' ? 'admin' : 'shop')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-blue text-white rounded-xl border-2 border-brand-dark text-xs font-bold shadow-bold-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            >
              {currentView === 'shop' ? (
                <>
                  <LayoutDashboard className="w-4 h-4" />
                  <span>مدیریت</span>
                </>
              ) : (
                <>
                  <Store className="w-4 h-4" />
                  <span>فروشگاه</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Dynamic Search & Actions */}
        <div className="flex-1 flex flex-col sm:flex-row items-center justify-end gap-3 md:gap-6">
          
          {/* Search bar - only shown or useful when on shopping view */}
          {currentView === 'shop' && (
            <div className="relative w-full sm:max-w-xs">
              <input
                type="text"
                placeholder="جست‌وجوی هوشمند کالا..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-stone-50 border-2 border-brand-dark rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-zinc-400" />
            </div>
          )}

          {/* Action buttons */}
          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3">
            
            {/* Favorites Icon */}
            {currentView === 'shop' && (
              <button
                onClick={onToggleShowFavorites}
                className={`relative p-2 border-2 border-brand-dark rounded-xl font-bold shadow-bold-sm transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer ${
                  showOnlyFavorites ? 'bg-rose-500 text-white' : 'bg-pink-100 text-pink-600 hover:bg-pink-200'
                }`}
                title={showOnlyFavorites ? "نمایش همه محصولات" : "نمایش علاقه‌مندی‌ها"}
              >
                <Heart className={`w-5 h-5 ${showOnlyFavorites ? 'fill-white text-white' : 'fill-pink-500 text-pink-600'}`} />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-brand-dark text-white border-2 border-brand-dark rounded-full text-[10px] w-5 h-5 flex items-center justify-center font-bold">
                    {favoritesCount}
                  </span>
                )}
              </button>
            )}

            {/* Cart Button */}
            {currentView === 'shop' && (
              <button
                onClick={openCart}
                className="relative flex items-center gap-2 px-4 py-2 bg-brand-orange hover:bg-brand-orange/90 text-white font-bold rounded-xl border-2 border-brand-dark shadow-bold-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2.5 -right-2 bg-brand-dark text-white border border-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-sm hidden sm:inline">سبد خرید</span>
              </button>
            )}

            {/* Desktop Switch Mode Button */}
            <button
              onClick={() => setView(currentView === 'shop' ? 'admin' : 'shop')}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-brand-blue text-white font-bold rounded-xl border-2 border-brand-dark shadow-bold-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hover:bg-brand-blue/90 transition-all cursor-pointer"
            >
              {currentView === 'shop' ? (
                <>
                  <LayoutDashboard className="w-5 h-5" />
                  <span>ورود به پیشخوان مدیریت</span>
                </>
              ) : (
                <>
                  <Store className="w-5 h-5" />
                  <span>بازگشت به فروشگاه مشتری</span>
                </>
              )}
            </button>
            
          </div>
        </div>
        
      </div>
    </header>
  );
}
