import React, { useState } from 'react';
import { Product, Category } from '../types';
import { Sparkles, Heart, Eye, ArrowLeft, Star, HeartCrack, Flame, CheckCircle2, ShieldCheck, Truck, RotateCcw, Filter, ArrowUpDown, HelpCircle, Info, Calculator, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CustomerShopProps {
  products: Product[];
  categories: Category[];
  cartItems: { product: Product; quantity: number }[];
  onAddToCart: (product: Product) => void;
  favorites: string[];
  onToggleFavorite: (productId: string) => void;
  searchQuery: string;
  showOnlyFavorites: boolean;
  setShowOnlyFavorites: (val: boolean) => void;
}

// Helper to convert numbers to Persian digits and format currency
export function formatPersianPrice(num: number): string {
  const formatted = new Intl.NumberFormat('fa-IR').format(num);
  return `${formatted} تومان`;
}

export function toPersianDigits(val: number | string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return val.toString().replace(/\d/g, (x) => persianDigits[parseInt(x)]);
}

export default function CustomerShop({
  products,
  categories,
  cartItems,
  onAddToCart,
  favorites,
  onToggleFavorite,
  searchQuery,
  showOnlyFavorites,
  setShowOnlyFavorites
}: CustomerShopProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewedProduct, setViewedProduct] = useState<Product | null>(null);

  // Sorting and discount filter states
  const [sortOrder, setSortOrder] = useState<'none' | 'price-asc' | 'price-desc' | 'rating' | 'popular'>('none');
  const [onlyDiscounted, setOnlyDiscounted] = useState<boolean>(false);
  
  // Custom Modals states
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // Filter products by category, search query, favorites, and discount
  const filteredProducts = products
    .filter((prod) => {
      const matchesCategory = selectedCategory === 'all' || prod.category === selectedCategory;
      const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            prod.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFavorites = !showOnlyFavorites || favorites.includes(prod.id);
      const matchesDiscount = !onlyDiscounted || prod.discount > 0;
      return matchesCategory && matchesSearch && matchesFavorites && matchesDiscount;
    })
    .sort((a, b) => {
      const getDiscountedPrice = (p: Product) => p.price * (1 - p.discount / 100);

      if (sortOrder === 'price-asc') {
        return getDiscountedPrice(a) - getDiscountedPrice(b);
      }
      if (sortOrder === 'price-desc') {
        return getDiscountedPrice(b) - getDiscountedPrice(a);
      }
      if (sortOrder === 'rating') {
        return b.rating - a.rating;
      }
      if (sortOrder === 'popular') {
        return b.salesCount - a.salesCount;
      }
      return 0; // none
    });

  return (
    <div className="space-y-12 pb-16">
      
      {/* Dynamic Alert Banner for interactive action notifications */}
      <div className="bg-brand-orange/10 border-2 border-brand-orange text-brand-dark p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 shadow-bold-sm">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔥</span>
          <span className="font-bold text-sm md:text-base text-brand-dark">
            جشنواره تابستانه نیک‌کالا آغاز شد! از تخفیف‌های ویژه تا مرز ۳۰٪ در دسته پوشاک و کارهای دیجیتال بهره‌مند شوید.
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-brand-orange bg-white px-3 py-1.5 rounded-lg border-2 border-brand-dark">
          <span>کد تخفیف: NIKKALA</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-brand-blue/5 border-2 border-brand-dark rounded-3xl p-6 md:p-12 shadow-bold-lg flex flex-col lg:flex-row items-center gap-8">
        <div className="absolute top-4 right-4 bg-brand-yellow px-3 py-1 bg-amber-400 text-brand-dark text-xs font-bold rounded-lg border-2 border-brand-dark shadow-bold-sm flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 fill-current" />
          <span>خرید مطمئن و بی‌واسطه</span>
        </div>

        <div className="flex-1 space-y-6 text-right z-10">
          <h2 className="text-3xl md:text-5xl font-black text-brand-dark leading-tight">
            سامانه‌ای لوکس برای <br />
            <span className="text-brand-orange underline decoration-wavy decoration-2">خریدی نیک و آسان</span>
          </h2>
          <p className="text-stone-600 font-medium text-sm md:text-base leading-relaxed max-w-xl">
            نیک‌کالا پلتفرم جامعی است که با زبان بصری Bold & Light طراحی شده تا زیباترین تجربه خرید کالا را برای مشتریان و ساده‌ترین پنل مدیریتی را برای صاحبان کالا فراهم نماید. ارسال فوق‌سریع، اصالت صد در صدی کالا و تضمین رضایت از پایه‌های کارآمدی ماست.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#products-section"
              className="px-6 py-3 bg-brand-orange text-white font-black text-sm md:text-base rounded-2xl border-2 border-brand-dark shadow-bold hover:bg-brand-orange/90 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>مشاهده و سفارش سریع کالا</span>
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border-2 border-brand-dark shadow-bold-sm text-xs md:text-sm font-bold">
              <span>⭐️ محبوب‌ترین محصول هفته: </span>
              <span className="text-brand-blue font-black">آیفون ۱۵ پرو</span>
            </div>
          </div>
        </div>

        {/* Feature visual column */}
        <div className="flex-1 w-full max-w-sm lg:max-w-md relative">
          <div className="relative border-4 border-brand-dark rounded-2xl overflow-hidden shadow-bold-lg h-[240px] md:h-[300px]">
            <img 
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=800" 
              alt="NikKala Banner" 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-115"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-between p-6">
              <div>
                <p className="text-amber-400 font-mono text-xs font-bold">پیشنهاد برگزیده</p>
                <h3 className="text-white font-black text-lg md:text-xl">تخفیف شگفت‌انگیز ۲۵٪</h3>
              </div>
              <span className="bg-brand-orange text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-white">
                عضویت ویژه
              </span>
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 bg-brand-green text-white px-4 py-2 rounded-xl border-2 border-brand-dark shadow-bold-sm text-xs font-black flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-200 fill-amber-200 animate-pulse" />
            <span>۹۸ سفارش در ۲۴ ساعت گذشته</span>
          </div>
        </div>
      </section>

      {/* Categories Banner */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-6 bg-brand-orange rounded-full border border-brand-dark"></div>
          <h3 className="text-xl font-black text-brand-dark">دسته‌بندی‌های کالا</h3>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2.5 px-4 md:px-6 py-3 rounded-2xl border-2 border-brand-dark text-xs md:text-sm font-black shadow-bold-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-brand-blue text-white shadow-none translate-x-[2px] translate-y-[2px]'
                    : 'bg-white hover:bg-stone-50 text-brand-dark'
                }`}
              >
                <span className="text-lg">{cat.emoji}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Products list grid */}
      <section id="products-section" className="scroll-mt-24 space-y-6">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white border-2 border-brand-dark p-4 rounded-xl shadow-bold-sm text-right">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-6 bg-brand-blue rounded-full border border-brand-dark"></div>
            <h3 className="text-base md:text-lg font-black text-brand-dark">ویترین محصولات پیشرفته نیک‌کالا</h3>
          </div>

          <div className="flex flex-wrap items-center justify-start xl:justify-end gap-3">
            {/* General Filter controls */}
            <button
              onClick={() => setOnlyDiscounted(prev => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-brand-dark text-xs font-bold transition-all cursor-pointer ${
                onlyDiscounted
                  ? 'bg-amber-400 text-brand-dark shadow-sm translate-y-[1px]'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100 hover:text-brand-dark'
              }`}
            >
              <span>%</span>
              <span>فقط کالاهای تخفیف‌دار</span>
            </button>

            {/* General Sort Order */}
            <div className="flex flex-wrap items-center gap-2 border-r-2 border-dashed border-zinc-200 pr-3 mr-1">
              <span className="text-xs text-zinc-500 font-bold flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-brand-blue" />
                مرتب‌سازی:
              </span>
              <div className="flex flex-wrap items-center gap-1">
                {[
                  { key: 'none', label: 'پیش‌فرض' },
                  { key: 'price-asc', label: 'ارزان‌ترین' },
                  { key: 'price-desc', label: 'گران‌ترین' },
                  { key: 'rating', label: 'محبوب‌ترین' },
                  { key: 'popular', label: 'پرفروش‌ترین' }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setSortOrder(item.key as any)}
                    className={`px-2.5 py-1.5 rounded-lg border text-[10px] md:text-xs font-black transition-all cursor-pointer ${
                      sortOrder === item.key
                        ? 'bg-brand-blue text-white border-brand-dark shadow-xs'
                        : 'bg-white hover:bg-stone-50 text-stone-600 border-zinc-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs text-zinc-500 font-mono pr-2 border-r-2 border-dashed border-zinc-200">
              {toPersianDigits(filteredProducts.length)} کالا یافت شد
            </div>
          </div>
        </div>

        {/* Favorites Active Filter Notice */}
        {showOnlyFavorites && (
          <div className="bg-rose-50 border-2 border-rose-300 text-rose-800 p-3 rounded-xl flex items-center justify-between shadow-bold-sm">
            <div className="flex items-center gap-2 text-xs font-bold">
              <Heart className="w-4.5 h-4.5 fill-rose-500 text-rose-500" />
              <span>درحال حاضر فقط محصولات نشان‌شده (علاقه‌مندی‌ها) را مشاهده می‌کنید.</span>
            </div>
            <button
              onClick={() => setShowOnlyFavorites(false)}
              className="px-2.5 py-1 bg-white hover:bg-rose-100 text-rose-600 font-black text-[11px] rounded-lg border border-rose-300 transition-colors"
            >
              نمایش همه کالاها ×
            </button>
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <div className="border-2 border-dashed border-brand-dark/40 rounded-3xl p-12 text-center space-y-4 bg-white shadow-bold-sm">
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto border-2 border-brand-dark text-zinc-500">
              <HeartCrack className="w-8 h-8" />
            </div>
            <p className="font-bold text-zinc-600">کالایی متناسب با جستجو یا فیلتر شما یافت نشد.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
              }}
              className="px-4 py-2 bg-brand-blue text-white font-bold text-xs rounded-xl border border-brand-dark"
            >
              پاک کردن فیلترها
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredProducts.map((prod) => {
              const isFavorite = favorites.includes(prod.id);
              const discountPrice = prod.price * (1 - prod.discount / 100);
              
              return (
                <div
                  key={prod.id}
                  className="bg-white border-2 border-brand-dark rounded-2xl overflow-hidden shadow-bold hover:shadow-bold-lg hover:-translate-y-1 hover:-translate-x-1 duration-200 flex flex-col justify-between"
                >
                  {/* Card Image Area */}
                  <div className="relative aspect-video bg-zinc-100 border-b-2 border-brand-dark overflow-hidden group">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />

                    {/* Top Action Tags */}
                    <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 align-right">
                      {prod.discount > 0 && (
                        <span className="bg-brand-orange text-white text-xs font-black px-2.5 py-1 rounded-lg border border-brand-dark shadow-bold-sm">
                          {toPersianDigits(prod.discount)}٪ تخفیف
                        </span>
                      )}
                      {prod.stock <= 5 && prod.stock > 0 && (
                        <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md border border-brand-dark shadow-bold-sm">
                          تنها {toPersianDigits(prod.stock)} عدد باقیست
                        </span>
                      )}
                      {prod.stock === 0 && (
                        <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md border border-brand-dark shadow-bold-sm">
                          ناموجود
                        </span>
                      )}
                    </div>

                    {/* Favorite Trigger */}
                    <button
                      onClick={() => onToggleFavorite(prod.id)}
                      className={`absolute top-2.5 left-2.5 p-1.5 rounded-lg border border-brand-dark shadow-bold-sm hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                        isFavorite ? 'bg-rose-500 text-white' : 'bg-white text-rose-500 hover:bg-rose-50'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>

                    {/* Rating badge */}
                    <div className="absolute bottom-2.5 right-2.5 bg-brand-dark text-white px-2 py-0.5 rounded-md border border-white text-[11px] font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>{toPersianDigits(prod.rating)}</span>
                    </div>
                  </div>

                  {/* Card Details Area */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-black px-2 py-0.5 rounded-md">
                          {categories.find(c => c.id === prod.category)?.name || 'کالا'}
                        </span>
                        <span className="text-[10px] text-zinc-500">کد: {toPersianDigits(prod.id.replace('prod-', ''))}</span>
                      </div>
                      <h4 className="font-extrabold text-brand-dark text-sm md:text-base leading-snug line-clamp-2 hover:text-brand-blue cursor-pointer" onClick={() => setViewedProduct(prod)}>
                        {prod.name}
                      </h4>
                      <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                        {prod.description}
                      </p>
                    </div>

                    {/* Price & Add to Cart Action */}
                    <div className="pt-2 border-t border-zinc-100 flex items-center justify-between gap-2">
                      <div className="flex flex-col text-right">
                        {prod.discount > 0 && (
                          <span className="text-xs text-zinc-400 line-through font-bold">
                            {formatPersianPrice(prod.price)}
                          </span>
                        )}
                        <span className="text-sm md:text-base font-black text-brand-dark font-mono">
                          {formatPersianPrice(discountPrice)}
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setViewedProduct(prod)}
                          title="نمایش سریع"
                          className="p-1.5 bg-zinc-100 hover:bg-zinc-200 text-brand-dark rounded-xl border-2 border-brand-dark shadow-bold-sm transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => prod.stock > 0 && onAddToCart(prod)}
                          disabled={prod.stock === 0}
                          className={`px-3 py-1.5 font-bold text-xs rounded-xl border-2 border-brand-dark shadow-bold-sm transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer ${
                            prod.stock === 0
                              ? 'bg-zinc-200 text-zinc-400 border-zinc-300 cursor-not-allowed shadow-none active:translate-y-0'
                              : 'bg-brand-orange hover:bg-brand-orange/95 text-white'
                          }`}
                        >
                          {prod.stock === 0 ? 'ناموجود' : 'خرید'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Static features advantages section */}
      <section className="bg-white border-2 border-brand-dark rounded-2xl p-6 md:p-8 shadow-bold">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 text-right">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-xl border-2 border-brand-dark flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-brand-dark">ارسال فوق‌سریع کالا</h4>
              <p className="text-xs text-zinc-500 mt-0.5">ارسال اکسپرس پستی در ۲۴ ساعت</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-right">
            <div className="w-12 h-12 bg-rose-100 text-rose-700 rounded-xl border-2 border-brand-dark flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-brand-dark">ضمانت اصالت و فیزیکی</h4>
              <p className="text-xs text-zinc-500 mt-0.5">صد درصد کالاها اورجینال و تست شده</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-right">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl border-2 border-brand-dark flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-brand-dark">۷ روز ضمانت بازگشت</h4>
              <p className="text-xs text-zinc-500 mt-0.5">درصورت بروز هرگونه مغایرت یا عیب</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-right">
            <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-xl border-2 border-brand-dark flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-brand-dark">پشتیبانی همیشگی ۲۴/۷</h4>
              <p className="text-xs text-zinc-500 mt-0.5">تلفنی و تیکت آنلاین در پنل کاربری</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-brand-dark pt-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-orange rounded-lg border-2 border-brand-dark flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4 fill-current" />
              </div>
              <h4 className="font-black text-lg text-brand-dark">سامانه فروشگاهی نیک‌کالا</h4>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              نیک‌کالا ترکیبی خیره‌کننده از پویایی خرید، سرعت عملکرد و انضباط بصری است. این وب‌سایت با رویکرد سبک توسعه Bold & Light طراحی گردیده تا هم کاربران بهترین تجربه کاربری را داشته باشند و هم مدیران در کمترین زمان بر انبار کالاها نظارت نمایند.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-brand-dark border-r-2 border-brand-orange pr-2.5">دسترسی سریع</h4>
            <ul className="text-xs text-zinc-600 space-y-2.5 font-bold select-none">
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSortOrder('none');
                    setOnlyDiscounted(false);
                    setShowOnlyFavorites(false);
                    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-brand-orange transition-colors cursor-pointer text-right flex items-center gap-1.5 w-full font-bold"
                >
                  <span>📦</span>
                  <span>ویترین کلیه کالاهای فروشگاه</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSortOrder('price-asc');
                    setOnlyDiscounted(true);
                    setShowOnlyFavorites(false);
                    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-brand-orange transition-colors cursor-pointer text-right flex items-center gap-1.5 w-full font-bold"
                >
                  <span>🔥</span>
                  <span>پیشنهادات ویژه و ارزان‌ترین کالاها</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsAboutModalOpen(true)}
                  className="hover:text-brand-orange transition-colors cursor-pointer text-right flex items-center gap-1.5 w-full font-bold"
                >
                  <span>💼</span>
                  <span>درباره سامانه‌ فروشگاهی و تیم نیک‌کالا</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsAuditModalOpen(true)}
                  className="hover:text-brand-orange transition-colors cursor-pointer text-right flex items-center gap-1.5 w-full font-bold"
                >
                  <span>⚙️</span>
                  <span>نحوه عملکرد الگوریتم حسابرسی داشبورد</span>
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-brand-dark border-r-2 border-brand-blue pr-2.5">نمادهای اعتماد و ارتباط</h4>
            <div className="flex gap-2">
              <div className="w-14 h-14 bg-white border-2 border-brand-dark rounded-xl flex items-center justify-center text-xs font-black shadow-bold-sm">
                نشان ملی
              </div>
              <div className="w-14 h-14 bg-white border-2 border-brand-dark rounded-xl flex items-center justify-center text-xs font-black shadow-bold-sm text-brand-blue">
                e-namad
              </div>
              <div className="w-14 h-14 bg-white border-2 border-brand-dark rounded-xl flex items-center justify-center text-xs font-black shadow-bold-sm text-emerald-600">
                ساماندهی
              </div>
            </div>
            <p className="text-[11px] text-zinc-500 font-mono">تلفن پشتیبانی: ۰۲۱-۸۸۸۸۴۴۲۲ • پاسداران، تهران</p>
          </div>
        </div>

        <div className="border-t border-zinc-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div>© ۱۴۰۵ تمامی حقوق مادی و معنوی برای پلتفرم نیک‌کالا محفوظ است.</div>
          <div>Development Frame: React 19 • Tailwind v4 • Farsi RTL Edition</div>
        </div>
      </footer>

      {/* Viewed Product Details Modal */}
      <AnimatePresence>
        {viewedProduct && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewedProduct(null)}
              className="absolute inset-0 bg-black"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white border-3 border-brand-dark rounded-3xl p-6 md:p-8 shadow-bold-lg text-right z-10 overflow-y-auto max-h-[90vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setViewedProduct(null)}
                className="absolute top-4 left-4 p-2 bg-stone-100 hover:bg-stone-200 text-brand-dark border-2 border-brand-dark rounded-xl shadow-bold-sm transition-all active:translate-y-[2px]"
              >
                <span className="font-extrabold text-sm">بستن ×</span>
              </button>

              <div className="flex flex-col md:flex-row gap-6 mt-4">
                {/* Modal Left / Product Image */}
                <div className="flex-1">
                  <div className="aspect-square border-2 border-brand-dark rounded-2xl overflow-hidden shadow-bold-sm max-h-[250px] md:max-h-none">
                    <img
                      src={viewedProduct.image}
                      alt={viewedProduct.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="mt-4 p-3 bg-stone-50 border-2 border-brand-dark rounded-xl flex items-center justify-between text-xs">
                    <span className="font-bold">وضعیت موجودی:</span>
                    <span className={`font-black ${viewedProduct.stock > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {viewedProduct.stock > 0 ? `${toPersianDigits(viewedProduct.stock)} عدد در انبار موجود` : 'ناموجود در انبار'}
                    </span>
                  </div>
                </div>

                {/* Modal Right / Product details */}
                <div className="flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <span className="bg-brand-blue/10 text-brand-blue text-xs font-black px-2.5 py-1 rounded-lg border border-brand-blue">
                      {categories.find(c => c.id === viewedProduct.category)?.name}
                    </span>
                    <h3 className="text-xl font-black text-brand-dark leading-tight">
                      {viewedProduct.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="text-sm font-bold">{toPersianDigits(viewedProduct.rating)} از ۵ ستور از مشتریان دایمی</span>
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed font-semibold">
                      {viewedProduct.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t-2 border-dashed border-zinc-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex flex-col text-right">
                        <span className="text-xs text-zinc-400">قیمت واحد کالا:</span>
                        {viewedProduct.discount > 0 && (
                          <span className="text-xs text-zinc-400 line-through font-bold">
                            {formatPersianPrice(viewedProduct.price)}
                          </span>
                        )}
                        <span className="text-lg font-black text-brand-dark font-mono">
                          {formatPersianPrice(viewedProduct.price * (1 - viewedProduct.discount / 100))}
                        </span>
                      </div>
                      
                      {viewedProduct.discount > 0 && (
                        <div className="bg-rose-100 text-rose-800 border-2 border-rose-400 px-3 py-1 rounded-xl text-xs font-black">
                          ذخیره مادی: {formatPersianPrice(viewedProduct.price * (viewedProduct.discount / 100))}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        if (viewedProduct.stock > 0) {
                          onAddToCart(viewedProduct);
                          setViewedProduct(null);
                        }
                      }}
                      disabled={viewedProduct.stock === 0}
                      className={`w-full py-3 font-black text-sm rounded-2xl border-2 border-brand-dark shadow-bold hover:bg-brand-orange/95 cursor-pointer text-center text-white active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all ${
                        viewedProduct.stock === 0 ? 'bg-zinc-200 text-zinc-400 border-zinc-300 shadow-none cursor-not-allowed' : 'bg-brand-orange'
                      }`}
                    >
                      {viewedProduct.stock === 0 ? 'این کالا ناموجود است' : 'افزودن مستقیم به سبد خرید'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* About NikKala modal */}
      <AnimatePresence>
        {isAboutModalOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAboutModalOpen(false)}
              className="absolute inset-0 bg-black"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-white border-3 border-brand-dark rounded-3xl p-6 md:p-8 shadow-bold-lg text-right z-10 overflow-y-auto max-h-[85vh]"
            >
              <button
                onClick={() => setIsAboutModalOpen(false)}
                className="absolute top-4 left-4 p-2 bg-stone-100 hover:bg-stone-200 text-brand-dark border-2 border-brand-dark rounded-xl shadow-bold-sm transition-all active:translate-y-[2px]"
              >
                <span className="font-extrabold text-sm">بستن ×</span>
              </button>

              <div className="space-y-6 mt-4">
                <div className="flex items-center gap-2 border-b-2 border-dashed border-zinc-200 pb-3">
                  <div className="p-2 bg-brand-orange text-white rounded-xl border border-brand-dark">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-brand-dark">درباره سامانه فروشگاهی نیک‌کالا</h3>
                    <p className="text-xs text-zinc-500">پشتیبانی یکپارچه همراه با دیزاین بومی Bold & Light</p>
                  </div>
                </div>

                <div className="space-y-3 font-semibold text-xs md:text-sm text-zinc-700 leading-relaxed">
                  <p>
                    <strong>سامانه نیک‌کالا</strong> با هدف بهینه‌سازی تجربه سفارش کالا و مدیریت آسان فروشگاهی در پاییز ۱۴۰۴ متولد گردید. ما از تلفیق معماری قدرتمند مدرن React 19 و پالت رنگی گرم و هماهنگِ Tailwind CSS استفاده کرده‌ایم تا به یک طراحی منحصربه‌فرد با خطوط کنترلی مشکی (Neo-Brutalist) دست یابیم.
                  </p>
                  <p>
                    این دمو تمامی عناصر چرخه حیات کالا را پیاده‌سازی می‌کند؛ از اضافه کردن محصولات نوین برای مدیریت در پنل ادمین، ثبت صورت‌حساب مشتریان، تا پایش و تغییر لحظه‌ای وضعیت لجستیک سفارش‌ها در انبار.
                  </p>
                </div>

                {/* Team Grid */}
                <div className="space-y-3">
                  <h4 className="font-black text-brand-dark text-sm border-r-4 border-brand-blue pr-2">تیم طراحان و مهندسان نیک‌کالا</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 border-2 border-brand-dark rounded-xl bg-indigo-50/50 text-center space-y-1 shadow-bold-sm">
                      <h5 className="font-extrabold text-brand-dark text-xs">سهراب رادمان</h5>
                      <p className="text-[10px] text-zinc-500">مدیر هنری و طراح محصول</p>
                    </div>
                    <div className="p-3 border-2 border-brand-dark rounded-xl bg-amber-50/50 text-center space-y-1 shadow-bold-sm">
                      <h5 className="font-extrabold text-brand-dark text-xs">آناهیتا یوسفی</h5>
                      <p className="text-[10px] text-zinc-500">توسعه‌دهنده فرانت‌اند React</p>
                    </div>
                    <div className="p-3 border-2 border-brand-dark rounded-xl bg-rose-50/50 text-center space-y-1 shadow-bold-sm">
                      <h5 className="font-extrabold text-brand-dark text-xs">آرش نیکزاد</h5>
                      <p className="text-[10px] text-zinc-500">مهندس ارشد محاسبات مالی</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-zinc-50 border-2 border-brand-dark rounded-2xl flex items-center justify-between">
                  <span className="text-[11px] text-zinc-500 font-bold">پشتیبانی اضطراری شبانه‌روزی</span>
                  <span className="text-xs font-black text-brand-blue font-mono">۰۲۱-۸۸۸۸۴۴۲۲</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Audit System modal */}
      <AnimatePresence>
        {isAuditModalOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAuditModalOpen(false)}
              className="absolute inset-0 bg-black"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-white border-3 border-brand-dark rounded-3xl p-6 md:p-8 shadow-bold-lg text-right z-10 overflow-y-auto max-h-[85vh]"
            >
              <button
                onClick={() => setIsAuditModalOpen(false)}
                className="absolute top-4 left-4 p-2 bg-stone-100 hover:bg-stone-200 text-brand-dark border-2 border-brand-dark rounded-xl shadow-bold-sm transition-all active:translate-y-[2px]"
              >
                <span className="font-extrabold text-sm">بستن ×</span>
              </button>

              <div className="space-y-6 mt-4">
                <div className="flex items-center gap-2 border-b-2 border-dashed border-zinc-200 pb-3">
                  <div className="p-2 bg-brand-blue text-white rounded-xl border border-brand-dark">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-brand-dark">مکانیزم حسابرسی و آمار داشبورد</h3>
                    <p className="text-xs text-zinc-500">مبتنی بر فرمول‌های مالی و استانداردهای انبارداری</p>
                  </div>
                </div>

                <div className="space-y-4 font-semibold text-xs md:text-sm text-zinc-700 leading-relaxed">
                  <p>
                    اطلاعات مالی و آماری ارائه شده در «پنل ادمین نیک‌کالا» کاملاً پویا بوده و با هر فرآیند خرید مشتری با فرمول‌های زیر همگام‌سازی می‌شود:
                  </p>

                  <ul className="space-y-3.5 pr-1">
                    <li className="p-3 bg-stone-50 border border-brand-dark rounded-xl space-y-1">
                      <span className="font-extrabold text-brand-dark text-xs block">۱. درآمد ناخالص کل (Gross Revenue)</span>
                      <p className="text-[11px] text-zinc-500 leading-normal">
                        مجموع حاصل‌ضرب (قیمت پس از کسر تخفیف ضرب‌در تعداد کالای سبد) صرفاً برای سفارشاتی که به صورت <strong className="text-brand-blue">«پرداخت شده» (paid)</strong> ثبت گشته‌اند.
                      </p>
                    </li>

                    <li className="p-3 bg-stone-50 border border-brand-dark rounded-xl space-y-1">
                      <span className="font-extrabold text-brand-dark text-xs block">۲. سفارشات جاری (Active Invoices)</span>
                      <p className="text-[11px] text-zinc-500 leading-normal">
                        شامل تمام سفارشاتی که پرداخت مادی پیشخوان آنها تایید گردیده اما کماکان در حالت پردازشی <strong className="text-brand-orange">«معلق / در حال بسته‌بندی» (pending)</strong> در انبار لجستیک قرار دارد.
                      </p>
                    </li>

                    <li className="p-3 bg-stone-50 border border-brand-dark rounded-xl space-y-1">
                      <span className="font-extrabold text-brand-dark text-xs block">۳. موجودی فیزیکی انبار (Physical Stocks)</span>
                      <p className="text-[11px] text-zinc-500 leading-normal">
                        جمع تجمعی تعداد فیزیکی کلیه اجناس موجود و آماده فروش که پس از هر خرید در سبد مشتری، به صورت زنده از پایگاه داده‌های محصول کسر می‌شود.
                      </p>
                    </li>
                  </ul>

                  <p className="text-[11px] bg-amber-50 border border-amber-300 rounded-lg p-2.5 text-amber-900">
                    💡 <strong>نکته توسعه‌دهنده:</strong> این الگوریتم به دلیل ذخیره‌سازی ابری، از پایداری نشت داده محافظت می‌کند و مقیاس‌پذیری بالایی دارد.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
