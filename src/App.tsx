/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Product, Order, Category, OrderStatus } from './types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_ORDERS } from './mockData';
import Navbar from './components/Navbar';
import CustomerShop from './components/CustomerShop';
import AdminPanel from './components/AdminPanel';
import CartDrawer from './components/CartDrawer';
import { Sparkles, LayoutDashboard, Store } from 'lucide-react';

export default function App() {
  // Application Views / Routing
  const [currentView, setView] = useState<'shop' | 'admin'>('shop');

  // Master States
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Shopping Cart States
  const [cartItems, setCartItems] = useState<{ product: Product; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // --- Handlers for Catalog Operations ---
  const handleAddProduct = (newProduct: Omit<Product, 'id' | 'rating' | 'salesCount'>) => {
    const freshId = `prod-${Date.now()}`;
    const formattedProduct: Product = {
      ...newProduct,
      id: freshId,
      rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5 and 5.0
      salesCount: 0
    };
    setProducts((prev) => [formattedProduct, ...prev]);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    // Also remove from cart if present
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // --- Handlers for Shopping Basket ---
  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      
      // Stock limit validation check
      const currentQty = existing ? existing.quantity : 0;
      if (currentQty >= product.stock) {
        alert('موجودی این کالا در انبار به پایان رسیده و امکان ثبت تعداد بیشتر وجود ندارد.');
        return prev;
      }

      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { product, quantity: 1 }];
      }
    });
    
    // Quick mini-notification / behavior
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, action: 'increment' | 'decrement') => {
    setCartItems((prev) => {
      return prev.map((item) => {
        if (item.product.id === productId) {
          const matchedProd = products.find((p) => p.id === productId);
          const maxStock = matchedProd ? matchedProd.stock : 100;
          
          if (action === 'increment') {
            if (item.quantity >= maxStock) {
              alert('تعداد انتخابی نمی‌تواند از تعداد کل موجودی انبار بیشتر باشد.');
              return item;
            }
            return { ...item, quantity: item.quantity + 1 };
          } else {
            return { ...item, quantity: Math.max(1, item.quantity - 1) };
          }
        }
        return item;
      });
    });
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleToggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // --- Handlers for Order Processing & Checkout System ---
  const handleCheckoutSubmit = (customerDetails: { name: string; phone: string; address: string }) => {
    // Collect order items
    const orderItemsList = cartItems.map((item) => {
      const discountedPrice = item.product.price * (1 - item.product.discount / 100);
      return {
        productId: item.product.id,
        name: item.product.name,
        price: discountedPrice,
        quantity: item.quantity
      };
    });

    const subtotal = cartItems.reduce((sum, item) => {
      const discountedPrice = item.product.price * (1 - item.product.discount / 100);
      return sum + (discountedPrice * item.quantity);
    }, 0);
    const shippingCost = subtotal > 15000000 ? 0 : 45000;
    const finalTotal = subtotal + shippingCost;

    // Build the Persian Date string for mock records
    const today = new Date();
    const formattedDate = '۱۴۰۵/۰۳/۱۰'; // Custom consistent model dates

    const freshOrder: Order = {
      id: `order-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: customerDetails.name,
      customerPhone: customerDetails.phone,
      customerAddress: customerDetails.address,
      date: formattedDate,
      items: orderItemsList,
      totalPrice: finalTotal,
      status: 'pending' as OrderStatus
    };

    // Deduct physical stocks corresponding to purchase catalog
    setProducts((prevProducts) => {
      return prevProducts.map((p) => {
        const cartMatch = cartItems.find((item) => item.product.id === p.id);
        if (cartMatch) {
          return {
            ...p,
            stock: Math.max(0, p.stock - cartMatch.quantity),
            salesCount: p.salesCount + cartMatch.quantity
          };
        }
        return p;
      });
    });

    // Save final Order to master array
    setOrders((prev) => [freshOrder, ...prev]);

    // Wipe cart items list clear
    setCartItems([]);
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  // Calculate cart count
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-stone-50 select-none antialiased">
      
      {/* 1. Sticky Navigation Header */}
      <Navbar
        currentView={currentView}
        setView={setView}
        cartCount={cartItemCount}
        openCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        favoritesCount={favorites.length}
        showOnlyFavorites={showOnlyFavorites}
        onToggleShowFavorites={() => setShowOnlyFavorites(prev => !prev)}
      />

      {/* Floating System Mode Sticky Trigger for premium feel */}
      <div className="fixed bottom-6 left-6 z-40 hidden sm:block">
        <button
          onClick={() => setView(currentView === 'shop' ? 'admin' : 'shop')}
          className="flex items-center gap-2 px-4 py-3 bg-brand-dark hover:bg-zinc-800 text-white font-black text-xs md:text-sm rounded-2xl border-2 border-slate-700 shadow-bold cursor-pointer"
        >
          {currentView === 'shop' ? (
            <>
              <LayoutDashboard className="w-4.5 h-4.5 text-brand-orange animate-pulse" />
              <span>پنل مدیریت و انبارداری دمو</span>
            </>
          ) : (
            <>
              <Store className="w-4.5 h-4.5 text-brand-blue" />
              <span>بازگشت به لندینگ فروشگاه</span>
            </>
          )}
        </button>
      </div>

      {/* 2. Main content pages */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 md:px-8">
        {currentView === 'shop' ? (
          /* Landing Page + Showcase */
          <CustomerShop
            products={products}
            categories={categories}
            cartItems={cartItems}
            onAddToCart={handleAddToCart}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            searchQuery={searchQuery}
            showOnlyFavorites={showOnlyFavorites}
            setShowOnlyFavorites={setShowOnlyFavorites}
          />
        ) : (
          /* Admin Dashboard Dashboard */
          <AdminPanel
            products={products}
            orders={orders}
            categories={categories}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            setView={setView}
          />
        )}
      </div>

      {/* 3. Sliding Customer Cart Drawer Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleCheckoutSubmit}
      />
      
    </div>
  );
}
