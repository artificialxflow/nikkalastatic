import React, { useState } from 'react';
import { Product, OrderItem, Order } from '../types';
import { Trash2, Plus, Minus, ShoppingCart, User, Phone, MapPin, CheckCircle, X, ShoppingBag } from 'lucide-react';
import { formatPersianPrice, toPersianDigits } from './CustomerShop';
import { motion, AnimatePresence } from 'motion/react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: { product: Product; quantity: number }[];
  onUpdateQuantity: (productId: string, action: 'increment' | 'decrement') => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: (customerDetails: { name: string; phone: string; address: string }) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}: CartDrawerProps) {
  // Checkout Details States
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  // Process success overlay
  const [orderFinalized, setOrderFinalized] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState('');
  
  // Basic validation message
  const [validationError, setValidationError] = useState<string | null>(null);

  // Subtotal calculations
  const subtotal = cartItems.reduce((sum, item) => {
    const discountedPrice = item.product.price * (1 - item.product.discount / 100);
    return sum + (discountedPrice * item.quantity);
  }, 0);

  const shippingCost = subtotal > 15000000 ? 0 : 45000; // Free shipping above 15 Million
  const finalTotal = subtotal > 0 ? subtotal + shippingCost : 0;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      setValidationError('تکمیل تمامی فیلدهای ستاره‌دار (*) جهت ارسال سفارش الزامی است.');
      return;
    }

    if (customerPhone.trim().length < 10) {
      setValidationError('شماره تماس وارد شده نامعتبر است. حداقل ۱۱ رقم وارد نمایید.');
      return;
    }

    // Pass up to parent state manager
    onCheckout({
      name: customerName,
      phone: customerPhone,
      address: customerAddress
    });

    const mockId = Math.floor(1000 + Math.random() * 9000);
    setGeneratedOrderId(mockId.toString());
    setOrderFinalized(true);

    // Reset details
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
    setValidationError(null);
  };

  const handleFinishCelebration = () => {
    setOrderFinalized(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex justify-end">
      
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Body Container */}
      <div className="relative w-full max-w-md bg-white border-l-3 border-brand-dark h-full flex flex-col justify-between shadow-bold-lg text-right z-10">
        
        {/* Header content */}
        <div className="p-4 border-b-2 border-brand-dark bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 px-2.5 bg-brand-orange text-white border border-brand-dark rounded text-xs font-black">سبد خرید</div>
            <h3 className="font-extrabold text-brand-dark text-base">اقلام انتخابی شما</h3>
          </div>
          
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-stone-200 text-brand-dark border-2 border-brand-dark rounded-lg shadow-bold-sm transition-all active:translate-y-[1px] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic checkout state wrapper */}
        {orderFinalized ? (
          /* Checkout Celebration Screen */
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full border-3 border-brand-dark flex items-center justify-center shadow-bold-lg animate-bounce">
              <CheckCircle className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <h4 className="text-xl font-black text-brand-dark">سفارش شما ثبت نهایی گردید!</h4>
              <p className="text-brand-green font-mono font-black text-sm">شماره رهگیری فاکتور: #{toPersianDigits(generatedOrderId)}</p>
            </div>

            <p className="text-xs text-zinc-500 leading-relaxed max-w-xs font-semibold">
              سفارش شما به درستی در پایگاه داده‌های «سامانه انبارداری نیک‌کالا» درج گردید. شما می‌توانید با مراجعه به پیشخوان مدیریت به‌صورت زنده وضعیت پردازشی این سفارش را مشاهده کنید!
            </p>

            <button
              onClick={handleFinishCelebration}
              className="px-6 py-2.5 bg-brand-blue text-white font-black text-xs md:text-sm rounded-xl border-2 border-brand-dark shadow-bold-sm hover:scale-102 transition-transform cursor-pointer"
            >
              بستن و بازگشت به فروشگاه
            </button>
          </div>
        ) : (
          /* Normal Cart List & Form */
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            
            {/* Scrollable list of goods */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center">
                  <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center border-2 border-brand-dark">
                    <ShoppingCart className="w-8 h-8 text-zinc-400" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-brand-dark">سبد خرید شما در حال حاضر خالی است</h4>
                    <p className="text-xs text-zinc-400 mt-1">کالاهای جذاب فروشگاه را مشاهده و خریداری کنید!</p>
                  </div>
                </div>
              ) : (
                cartItems.map((item) => {
                  const finalUnitPrice = item.product.price * (1 - item.product.discount / 100);
                  const itemTotalPrice = finalUnitPrice * item.quantity;
                  
                  return (
                    <div
                      key={item.product.id}
                      className="bg-white border-2 border-brand-dark p-3 rounded-xl shadow-bold-sm flex gap-3 relative"
                    >
                      {/* Goods Image */}
                      <div className="w-16 h-16 rounded-lg border border-brand-dark overflow-hidden shrink-0 bg-stone-100">
                        <img 
                          src={item.product.image} 
                          alt="" 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Info & controls */}
                      <div className="flex-1 flex flex-col justify-between text-right">
                        <div>
                          <h5 className="font-bold text-brand-dark text-xs leading-tight line-clamp-1">
                            {item.product.name}
                          </h5>
                          <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                            قیمت واحد: {formatPersianPrice(finalUnitPrice)}
                          </p>
                        </div>

                        {/* Quantity trigger */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-brand-dark bg-stone-100 rounded-lg overflow-hidden text-xs">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, 'increment')}
                              className="px-2 py-1 hover:bg-zinc-200 transition-colors cursor-pointer"
                            >
                              <Plus className="w-3 h-3 text-brand-dark" />
                            </button>
                            <span className="px-3 py-1 bg-white font-black font-mono">
                              {toPersianDigits(item.quantity)}
                            </span>
                            <button
                              onClick={() => {
                                if (item.quantity === 1) {
                                  onRemoveItem(item.product.id);
                                } else {
                                  onUpdateQuantity(item.product.id, 'decrement');
                                }
                              }}
                              className="px-2 py-1 hover:bg-zinc-200 transition-colors cursor-pointer"
                            >
                              <Minus className="w-3 h-3 text-brand-dark" />
                            </button>
                          </div>

                          <span className="font-black text-xs text-brand-dark font-mono">
                            {formatPersianPrice(itemTotalPrice)}
                          </span>
                        </div>
                      </div>

                      {/* Trash action button */}
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="absolute top-2.5 left-2.5 p-1 text-rose-500 bg-rose-50 hover:bg-rose-100 hover:text-rose-600 rounded transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}

            </div>

            {/* Calculations and payment info Form */}
            {cartItems.length > 0 && (
              <div className="bg-stone-50 border-t-2 border-brand-dark p-4 space-y-4">
                
                {/* Cost recap */}
                <div className="space-y-1.5 text-xs font-bold font-mono">
                  <div className="flex items-center justify-between text-zinc-600">
                    <span>جمع ناخالص کالاها:</span>
                    <span>{formatPersianPrice(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-600">
                    <span>مبلغ لجستیک و ارسال:</span>
                    <span>{shippingCost === 0 ? 'رایگان (امروز ویژه)' : formatPersianPrice(shippingCost)}</span>
                  </div>
                  <div className="flex items-center justify-between text-brand-dark text-sm font-black pt-1.5 border-t border-dashed border-zinc-200">
                    <span>فاکتور پرداختی نهایی:</span>
                    <span>{formatPersianPrice(finalTotal)}</span>
                  </div>
                </div>

                {/* Shipping Details form */}
                <form onSubmit={handleSubmitOrder} className="pt-2 border-t border-zinc-200 space-y-3">
                  <p className="text-[11px] font-black text-brand-dark block">📝 فرآیند سریع ثبت سفارش اکسپرس</p>
                  
                  {validationError && (
                    <div className="bg-rose-100 border border-rose-300 text-rose-800 text-[10px] font-black p-2 rounded">
                      {validationError}
                    </div>
                  )}

                  <div className="space-y-2">
                    {/* User */}
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="نام و نام خانوادگی تحویل گیرنده *"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 bg-white border border-brand-dark rounded-lg text-xs placeholder:text-zinc-400 focus:outline-none focus:border-brand-blue"
                      />
                      <User className="absolute left-2.5 top-2 w-4 h-4 text-zinc-400" />
                    </div>

                    {/* Phone */}
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        placeholder="شماره تماس همراه (تلفن همراه) *"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 bg-white border border-brand-dark rounded-lg text-xs font-mono placeholder:text-zinc-400 focus:outline-none focus:border-brand-blue"
                      />
                      <Phone className="absolute left-2.5 top-2 w-4 h-4 text-zinc-400" />
                    </div>

                    {/* Address */}
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="نشانی مکتوب دقیق پستی جهت تحویل کارتن *"
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 bg-white border border-brand-dark rounded-lg text-xs placeholder:text-zinc-400 focus:outline-none focus:border-brand-blue"
                      />
                      <MapPin className="absolute left-2.5 top-2 w-4 h-4 text-zinc-400" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-brand-orange text-white font-black text-xs rounded-xl border-2 border-brand-dark shadow-bold-sm hover:bg-brand-orange/95 cursor-pointer text-center select-none active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>تکمیل خرید و ثبت نهایی در پیشخوان مدیریت</span>
                  </button>
                </form>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
