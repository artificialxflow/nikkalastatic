import React, { useState } from 'react';
import { Product, Order, Category, OrderStatus } from '../types';
import { 
  TrendingUp, Coins, Package, Box, ShieldCheck, 
  Trash2, Plus, RefreshCw, Layers, Sparkles, Check, 
  X, AlertCircle, FileText, UserCheck, Eye, LogOut
} from 'lucide-react';
import { formatPersianPrice, toPersianDigits } from './CustomerShop';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  categories: Category[];
  onAddProduct: (newProduct: Omit<Product, 'id' | 'rating' | 'salesCount'>) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  setView: (view: 'shop' | 'admin') => void;
}

export default function AdminPanel({
  products,
  orders,
  categories,
  onAddProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  setView
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'add-product'>('overview');

  // Add Product Form States
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('digital');
  const [newProdDiscount, setNewProdDiscount] = useState('0');
  const [newProdStock, setNewProdStock] = useState('10');
  const [newProdDescription, setNewProdDescription] = useState('');
  const [newProdImage, setNewProdImage] = useState('');
  
  // Custom states for feedback alerts
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto placeholder images lists to choose from
  const MOCK_IMAGES = [
    { name: 'کالای دیجیتال', url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=600' },
    { name: 'پوشاک لوکس', url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=600' },
    { name: 'خوراکی ارگانیک', url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600' },
    { name: 'وسایل تزئینی', url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600' },
  ];

  // Calculations for stats card indicators
  const totalRevenue = orders
    .filter(o => o.status === 'paid')
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const totalActiveOrders = orders.filter(o => o.status !== 'cancelled').length;
  
  const totalStockItems = products.reduce((sum, p) => sum + p.stock, 0);
  
  const totalDeliveredCount = orders.filter(o => o.status === 'paid').length;

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newProdName || !newProdPrice || !newProdDescription) {
      setErrorMessage('لطفاً تمامی فیلدهای الزامی فرم را با دقت پر نمایید.');
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }

    const priceNum = parseFloat(newProdPrice);
    const discountNum = parseFloat(newProdDiscount);
    const stockNum = parseInt(newProdStock);

    if (isNaN(priceNum) || priceNum <= 0) {
      setErrorMessage('مبلغ قیمت محصول باید عددی بزرگ‌تر از صفر باشد.');
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }

    // Default image if empty
    const finalImage = newProdImage.trim() !== '' 
      ? newProdImage.trim() 
      : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600';

    onAddProduct({
      name: newProdName,
      price: priceNum,
      category: newProdCategory,
      image: finalImage,
      discount: isNaN(discountNum) ? 0 : discountNum,
      stock: isNaN(stockNum) ? 1 : stockNum,
      description: newProdDescription,
    });

    setSuccessMessage('کالای جدید با موفقیت به انبار سامانه نیک‌کالا افزوده شد و به صورت زنده در ویتیرین مشتریان ثبت گردید!');
    setTimeout(() => setSuccessMessage(null), 4000);

    // Reset Form
    setNewProdName('');
    setNewProdPrice('');
    setNewProdDiscount('0');
    setNewProdStock('10');
    setNewProdDescription('');
    setNewProdImage('');
    
    // Switch to active products listing within overview or simply stay
    setActiveTab('overview');
  };

  const useMockImage = (url: string) => {
    setNewProdImage(url);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 md:gap-8 pb-12 text-right">
      
      {/* 2. Sidebar column - aligned to Right in RTL */}
      <aside className="lg:w-72 bg-white border-2 border-brand-dark rounded-2xl p-6 shadow-bold h-fit space-y-8 shrink-0">
        
        {/* Profile Card */}
        <div className="flex items-center gap-3 border-b-2 border-dashed border-zinc-200 pb-5">
          <div className="w-12 h-12 rounded-full border-2 border-brand-dark bg-brand-blue text-white flex items-center justify-center font-black text-lg shadow-bold-sm select-none">
            مد
          </div>
          <div>
            <h4 className="font-extrabold text-brand-dark text-sm">جناب آقای علوی مدیر</h4>
            <p className="text-[10px] text-zinc-400 font-mono mt-0.5">کارشناس برنامه‌ریزی ارشد</p>
          </div>
        </div>

        {/* Sidebar Menu options */}
        <nav className="space-y-2">
          <p className="text-[11px] font-black tracking-wider text-zinc-400 mb-2">منوی اصلی پیشخوان</p>
          
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-xs md:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-brand-blue text-white border-brand-dark shadow-bold-sm'
                : 'bg-stone-50 text-stone-600 border-transparent hover:bg-stone-100 hover:text-brand-dark'
            }`}
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>پیشخوان و آمار کالا</span>
            </div>
            <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-mono">جدید</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-xs md:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-brand-blue text-white border-brand-dark shadow-bold-sm'
                : 'bg-stone-50 text-stone-600 border-transparent hover:bg-stone-100 hover:text-brand-dark'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>مدیریت سفارشات</span>
            </div>
            <span className="bg-brand-orange text-white px-2 py-0.5 rounded text-[10px] font-mono">
              {toPersianDigits(orders.length)}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('add-product')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-xs md:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'add-product'
                ? 'bg-brand-blue text-white border-brand-dark shadow-bold-sm'
                : 'bg-stone-50 text-stone-600 border-transparent hover:bg-stone-100 hover:text-brand-dark'
            }`}
          >
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span>افزودن محصول جدید</span>
            </div>
            <span className="text-zinc-400">⚡️</span>
          </button>
        </nav>

        {/* Quick controls section */}
        <div className="pt-4 border-t-2 border-dashed border-zinc-200 space-y-3">
          <p className="text-[10px] font-bold text-zinc-400">تعامل مستقیم</p>
          <button
            onClick={() => setView('shop')}
            className="w-full py-2 bg-brand-orange text-white text-xs font-black rounded-xl border-2 border-brand-dark shadow-bold-sm hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>خروج و نمایش فروشگاه</span>
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>

      </aside>

      {/* 2. Main Content panel */}
      <main className="flex-1 bg-white border-2 border-brand-dark rounded-2xl p-6 md:p-8 shadow-bold space-y-8 min-w-0">
        
        {/* Banner for Status notifications inside panel */}
        {(successMessage || errorMessage) && (
          <div className={`p-4 rounded-xl border-2 flex items-center gap-3 animate-bounce ${
            successMessage 
              ? 'bg-emerald-50 border-brand-green text-green-800' 
              : 'bg-rose-50 border-rose-400 text-rose-800'
          }`}>
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-xs font-black md:text-sm">
              {successMessage || errorMessage}
            </p>
          </div>
        )}

        {/* Dynamic Inner views based on tab chosen */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white border-2 border-brand-dark rounded-xl p-5 shadow-bold-blue hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all text-right flex flex-col justify-between h-[130px]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-brand-blue">کل فروش ناخالص</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-brand-dark flex items-center justify-center">
                    <Coins className="w-4.5 h-4.5 text-brand-blue" />
                  </div>
                </div>
                <div>
                  <h5 className="text-xl md:text-2xl font-black text-brand-dark font-mono">
                    {formatPersianPrice(totalRevenue)}
                  </h5>
                  <p className="text-[10px] text-zinc-500 mt-1">سفارشات قطعی پرداخت شده</p>
                </div>
              </div>

              <div className="bg-white border-2 border-brand-dark rounded-xl p-5 shadow-bold-orange hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all text-right flex flex-col justify-between h-[130px]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-600 font-bold">سفارشات جاری</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 border border-brand-dark flex items-center justify-center">
                    <Package className="w-4.5 h-4.5 text-brand-orange" />
                  </div>
                </div>
                <div>
                  <h5 className="text-xl md:text-2xl font-black text-brand-dark font-mono">
                    {toPersianDigits(totalActiveOrders)} سفارش
                  </h5>
                  <p className="text-[10px] text-zinc-500 mt-1">به انضمام خریدهای معلق</p>
                </div>
              </div>

              <div className="bg-white border-2 border-brand-dark rounded-xl p-5 shadow-bold-green hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all text-right flex flex-col justify-between h-[130px]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-600 font-bold">موجودی فیزیکی کل</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-brand-dark flex items-center justify-center">
                    <Box className="w-4.5 h-4.5 text-emerald-600" />
                  </div>
                </div>
                <div>
                  <h5 className="text-xl md:text-2xl font-black text-brand-dark font-mono">
                    {toPersianDigits(totalStockItems)} عدد کالا
                  </h5>
                  <p className="text-[10px] text-zinc-500 mt-1">موجود در انبار نیک‌کالا</p>
                </div>
              </div>

              <div className="bg-white border-2 border-brand-dark rounded-xl p-5 shadow-bold hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all text-right flex flex-col justify-between h-[130px]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-zinc-700 font-bold">تحویل موفق</span>
                  <div className="w-8 h-8 rounded-lg bg-zinc-50 border border-brand-dark flex items-center justify-center">
                    <UserCheck className="w-4.5 h-4.5 text-zinc-700" />
                  </div>
                </div>
                <div>
                  <h5 className="text-xl md:text-2xl font-black text-brand-dark font-mono">
                    {toPersianDigits(totalDeliveredCount)} فاکتور صادر شده
                  </h5>
                  <p className="text-[10px] text-zinc-500 mt-1">تراکنش مالی تسویه شده</p>
                </div>
              </div>

            </div>

            {/* Catalog list in dashboard */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="p-1 px-2.5 bg-brand-orange text-white border border-brand-dark rounded-md text-xs font-bold">بایگانی کالا</span>
                  <h4 className="font-extrabold text-base text-brand-dark">لیست انبارهای فعال</h4>
                </div>
                <span className="text-xs text-zinc-400 font-mono">مجموعاً {toPersianDigits(products.length)} کالا ثبت شده</span>
              </div>

              <div className="overflow-x-auto border-2 border-brand-dark rounded-2xl bg-stone-50">
                <table className="w-full text-right text-xs md:text-sm">
                  <thead className="bg-zinc-100 border-b-2 border-brand-dark text-stone-700 font-black">
                    <tr>
                      <th className="p-4 text-center">شناسه</th>
                      <th className="p-4">عنوان کالا</th>
                      <th className="p-4">دسته‌بندی</th>
                      <th className="p-4">قیمت مبنا (تومان)</th>
                      <th className="p-4">موجودی انبار</th>
                      <th className="p-4 text-center">عملیات کنترلی</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y border-brand-dark divide-zinc-200">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-zinc-100 transition-colors bg-white">
                        <td className="p-4 text-center font-mono font-bold text-zinc-500">
                          {toPersianDigits(p.id.replace('prod-', ''))}
                        </td>
                        <td className="p-4 font-extrabold text-brand-dark max-w-[200px] truncate">
                          <div className="flex items-center gap-2">
                            <img src={p.image} alt="" className="w-6 h-6 rounded border border-brand-dark flex-shrink-0 object-cover" referrerPolicy="no-referrer" />
                            <span className="truncate">{p.name}</span>
                          </div>
                        </td>
                        <td className="p-4 font-bold">
                          <span className="bg-indigo-100 text-indigo-800 text-[10px] px-2 py-0.5 rounded border border-indigo-200">
                            {categories.find(c => c.id === p.category)?.name || p.category}
                          </span>
                        </td>
                        <td className="p-4 font-mono font-black">{formatPersianPrice(p.price)}</td>
                        <td className="p-4 font-bold font-mono">
                          <span className={p.stock <= 5 ? 'text-rose-600 font-black' : 'text-zinc-700'}>
                            {toPersianDigits(p.stock)} عدد
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => {
                              if (confirm('آیا مایل به حذف قطعی این کالا از سیستم انبار هوشمند نیک‌کالا هستید؟')) {
                                onDeleteProduct(p.id);
                                setSuccessMessage('کالا با موفقیت از سیستم مراجع حذف شد.');
                                setTimeout(() => setSuccessMessage(null), 3000);
                              }
                            }}
                            className="p-1 px-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg border-2 border-rose-300 hover:border-rose-400 font-bold transition-all text-[11px] flex items-center gap-1 mx-auto cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>حذف کالا</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1 px-2 text-white bg-brand-blue border border-brand-dark rounded text-xs font-bold">دفتر ثبت احوال مالی</span>
                <h4 className="font-extrabold text-base text-brand-dark">جدول و تراز مالی سفارشات مشتری</h4>
              </div>
              <p className="text-xs text-zinc-400">به‌روزرسانی خودکار برخط</p>
            </div>

            {orders.length === 0 ? (
              <div className="border-2 border-dashed border-brand-dark p-12 rounded-2xl text-center bg-stone-50 text-zinc-500 font-bold">
                هنوز هیج فاکتور خریدی توسط مشتریان صادر نگردیده است.
              </div>
            ) : (
              <div className="overflow-x-auto border-2 border-brand-dark rounded-2xl bg-stone-50">
                <table className="w-full text-right text-xs md:text-sm">
                  <thead className="bg-zinc-100 border-b-2 border-brand-dark text-stone-700 font-black">
                    <tr>
                      <th className="p-4 text-center">فاکتور شماره</th>
                      <th className="p-4">نام مشتری</th>
                      <th className="p-4">نام کالاها و جزییات</th>
                      <th className="p-4">تلفن و نشانی</th>
                      <th className="p-4">مبلغ نهایی (تومان)</th>
                      <th className="p-4">وضعیت فاکتور</th>
                      <th className="p-4 text-center">بروزرسانی وضعیت</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y border-brand-dark divide-zinc-200">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-zinc-100 transition-colors bg-white">
                        <td className="p-4 text-center font-mono font-extrabold text-brand-dark">
                          #{toPersianDigits(o.id.replace('order-', ''))}
                        </td>
                        <td className="p-4 font-black text-brand-dark">{o.customerName}</td>
                        <td className="p-4 font-medium text-xs text-zinc-600 max-w-[200px]">
                          <ul className="list-disc pr-4 space-y-0.5">
                            {o.items.map((it, idx) => (
                              <li key={idx} className="truncate">
                                {it.name} <span className="font-black font-mono">({toPersianDigits(it.quantity)} عدد)</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="p-4 text-xs">
                          <p className="font-mono font-bold text-zinc-700">{toPersianDigits(o.customerPhone)}</p>
                          <p className="text-zinc-500 mt-0.5 line-clamp-1 truncate max-w-[150px]" title={o.customerAddress}>
                            {o.customerAddress}
                          </p>
                        </td>
                        <td className="p-4 font-mono font-black">{formatPersianPrice(o.totalPrice)}</td>
                        <td className="p-4 font-black">
                          {o.status === 'paid' && (
                            <span className="bg-emerald-100 text-emerald-800 border-2 border-emerald-400 px-2.5 py-1 rounded-xl text-xs dynamic-badge flex items-center gap-1 w-fit">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                              <span>پرداخت شده</span>
                            </span>
                          )}
                          {o.status === 'pending' && (
                            <span className="bg-amber-100 text-amber-800 border-2 border-amber-400 px-2.5 py-1 rounded-xl text-xs dynamic-badge flex items-center gap-1 w-fit">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                              <span>در انتظار تایید</span>
                            </span>
                          )}
                          {o.status === 'cancelled' && (
                            <span className="bg-rose-100 text-rose-800 border-2 border-rose-400 px-2.5 py-1 rounded-xl text-xs dynamic-badge flex items-center gap-1 w-fit">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                              <span>لغو شده</span>
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                onUpdateOrderStatus(o.id, 'paid');
                                setSuccessMessage(`وضعیت سفارش ${o.id} به پرداخت شده تغییر یافت.`);
                                setTimeout(() => setSuccessMessage(null), 3000);
                              }}
                              title="پرداخت شد"
                              className="p-1 text-emerald-600 bg-emerald-50 border-2 border-emerald-300 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                onUpdateOrderStatus(o.id, 'cancelled');
                                setSuccessMessage(`وضعیت سفارش ${o.id} به لغو شده تغییر یافت.`);
                                setTimeout(() => setSuccessMessage(null), 3000);
                              }}
                              title="لغو سفارش"
                              className="p-1 text-rose-600 bg-rose-50 border-2 border-rose-300 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
          </div>
        )}

        {activeTab === 'add-product' && (
          <div className="space-y-6">
            <div className="border-b border-zinc-200 pb-4">
              <h4 className="font-extrabold text-base text-brand-dark">فرم جامع افزودن و تدارکات کالا به انبار</h4>
              <p className="text-xs text-zinc-500 mt-1">تکمیل فیلدهای ستاره‌دار (*) جهت انبار مراجع و شعبه مرکزی الزامی است.</p>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-6 text-right">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Product Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-brand-dark block">
                    نام و عنوان کالا <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: هدفون بی سیم حرفه ای سونی"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-50 border-2 border-brand-dark rounded-xl text-xs md:text-sm focus:outline-none focus:border-brand-blue"
                  />
                </div>

                {/* Category Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-brand-dark block">
                    دسته‌بندی انبار کالا <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full px-4 py-2 bg-stone-50 border-2 border-brand-dark rounded-xl text-xs md:text-sm focus:outline-none focus:border-brand-blue"
                  >
                    {categories.filter(c => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.emoji} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Base price */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-brand-dark block">
                    قیمت مبنا (ریالی یا تومانی) <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      placeholder="مثال: 4500000"
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                      className="w-full pl-12 pr-4 py-2.5 bg-stone-50 border-2 border-brand-dark rounded-xl text-xs md:text-sm font-mono focus:outline-none focus:border-brand-blue"
                    />
                    <span className="absolute left-3 top-2.5 text-xs text-zinc-500 font-bold">تومان</span>
                  </div>
                </div>

                {/* Discount and Stock */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-brand-dark block">تخفیف (٪)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={newProdDiscount}
                      onChange={(e) => setNewProdDiscount(e.target.value)}
                      className="w-full px-3 py-2.5 bg-stone-50 border-2 border-brand-dark rounded-xl text-xs md:text-sm font-mono focus:outline-none focus:border-brand-blue"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-brand-dark block">شمار اولیه انبار *</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={newProdStock}
                      onChange={(e) => setNewProdStock(e.target.value)}
                      className="w-full px-3 py-2.5 bg-stone-50 border-2 border-brand-dark rounded-xl text-xs md:text-sm font-mono focus:outline-none focus:border-brand-blue"
                    />
                  </div>
                </div>

              </div>

              {/* URL with quick generate placeholder */}
              <div className="space-y-2">
                <label className="text-xs font-black text-brand-dark block">لوکیشن تصویر آنلاین کالا (آدرس وب)</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={newProdImage}
                    onChange={(e) => setNewProdImage(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-stone-50 border-2 border-brand-dark rounded-xl text-xs md:text-sm font-mono focus:outline-none focus:border-brand-blue"
                  />
                  <div className="w-full sm:w-auto flex flex-wrap gap-1.5 shrink-0">
                    {MOCK_IMAGES.map((img, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => useMockImage(img.url)}
                        className="px-2.5 py-1 text-[11px] font-bold bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg shrink-0 cursor-pointer"
                      >
                        {img.name}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-[10px] text-zinc-400">یک آدرس اینترنتی یا با کلیک روی هر دکمه، عکسی باکیفیت به صورت خودکار تخصیص دهید.</p>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-brand-dark block">شرح و توضیحات اختصاصی فنی *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="مشخصات فیزیکی، مبالغ جانبی، نحوه کارکرد کالا را یادداشت نمایید..."
                  value={newProdDescription}
                  onChange={(e) => setNewProdDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border-2 border-brand-dark rounded-xl text-xs md:text-sm focus:outline-none focus:border-brand-blue"
                />
              </div>

              {/* Submit triggers */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('overview');
                  }}
                  className="px-6 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-brand-dark font-extrabold text-xs md:text-sm rounded-xl border-2 border-zinc-400 shadow-bold-sm cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand-blue text-white font-black text-xs md:text-sm rounded-xl border-2 border-brand-dark shadow-bold hover:bg-brand-blue/90 cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>ثبت کالا و به‌روزرسانی زنده ویترین</span>
                </button>
              </div>

            </form>
          </div>
        )}

      </main>

    </div>
  );
}
