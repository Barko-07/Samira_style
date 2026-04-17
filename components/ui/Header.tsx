"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ShoppingBag, X, ChevronRight, User, Plus, Minus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export function Header() {
  const { 
    isCartOpen, setIsCartOpen, items, getTotalItems, getTotalSelectedPrice, 
    updateQuantity, removeItem, toggleItemSelection, toggleAllSelection 
  } = useCartStore();
  const [tgUser, setTgUser] = useState<any>(null);

  const allSelected = items.length > 0 && items.every((i) => i.selectedForCheckout);
  const selectedItemsCount = items.filter(i => i.selectedForCheckout).length;

  useEffect(() => {
    // Check if Telegram Web App is running
    if (typeof window !== "undefined" && (window as any).Telegram?.WebApp) {
      const webApp = (window as any).Telegram.WebApp;
      webApp.ready();
      if (webApp.initDataUnsafe?.user) {
        setTgUser(webApp.initDataUnsafe.user);
      }
    }
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="relative h-10 w-10 overflow-hidden rounded-xl bg-[var(--card)] shadow-sm border border-[var(--border)] transition-transform group-hover:scale-105 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Samira Style"
                fill
                sizes="40px"
                className="object-contain p-1"
                priority
              />
            </span>
            <span className="text-xl font-extrabold tracking-tight text-[var(--foreground)] mt-0.5">
              Samira <span className="text-[var(--accent)]">Style</span>
            </span>
          </Link>



          <div className="flex items-center gap-3">
            {tgUser ? (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--card)]">
                <div className="w-6 h-6 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center font-bold text-xs">
                  {tgUser.first_name?.charAt(0) || <User className="w-3 h-3"/>}
                </div>
                <span className="text-xs font-semibold">{tgUser.first_name}</span>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="hidden sm:inline-flex h-9 items-center justify-center rounded-full border border-[var(--border)] px-4 text-xs font-bold tracking-[0.1em] text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-white hover:border-transparent transition-all duration-300"
              >
                KIRISH
              </Link>
            )}

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full hover:bg-[var(--accent)]/10 transition-colors group"
            >
              <ShoppingBag className="w-6 h-6 text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors" />
              {getTotalItems() > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[var(--accent)] text-white text-[10px] font-bold flex items-center justify-center border border-[var(--background)]">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>
        </div>


      </header>

      {/* Cart Drawer (Uzum-style Slide-in) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />
          
          {/* Drawer */}
          <div className="relative w-full max-w-md bg-[var(--background)] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
              <h2 className="text-xl font-bold">Savat</h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-full hover:bg-[var(--border)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 flex flex-col">
              {items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 rounded-full bg-[var(--accent)]/10 flex items-center justify-center mb-4">
                    <ShoppingBag className="w-10 h-10 text-[var(--accent)]" />
                  </div>
                  <p className="text-lg font-bold mb-2">Savatingiz hozircha bo'sh</p>
                  <p className="text-sm text-[var(--muted)] mb-6">Mahsulotlarni topish uchun katalogni ko'ring</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="h-12 px-8 rounded-full bg-[var(--accent)] text-white font-bold hover:bg-orange-600 transition-colors w-full"
                  >
                    Xaridni boshlash
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {/* Tanlash boshqaruvi */}
                  <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-bold">
                      <input 
                        type="checkbox" 
                        checked={allSelected}
                        onChange={(e) => toggleAllSelection(e.target.checked)}
                        className="w-5 h-5 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)] accent-[var(--accent)] cursor-pointer"
                      />
                      Barchasini tanlash
                    </label>
                    <span className="text-xs text-[var(--muted)] font-medium">Tanlandi: {selectedItemsCount} ta</span>
                  </div>

                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] transition-colors hover:border-[var(--accent)]/50">
                      <div className="flex items-center justify-center">
                        <input 
                          type="checkbox"
                          checked={item.selectedForCheckout}
                          onChange={() => toggleItemSelection(item.id)}
                          className="w-5 h-5 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)] accent-[var(--accent)] cursor-pointer"
                        />
                      </div>
                      <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-[#f1f5f9] flex-shrink-0">
                        <Image src={item.image} alt={item.title} fill className="object-cover" unoptimized />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="text-sm font-semibold text-[var(--foreground)] line-clamp-2 pr-2">{item.title}</h3>
                          <button onClick={() => removeItem(item.id)} className="text-[var(--muted)] hover:text-red-500 transition-colors p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-sm font-bold mt-auto mb-2">{(item.price * item.quantity).toLocaleString('en-US').replace(/,/g, ' ')} so'm</div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center bg-[var(--background)] border border-[var(--border)] rounded-lg">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 px-2 hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] transition-colors rounded-l-lg">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 px-2 hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] transition-colors rounded-r-lg">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {items.length > 0 && (
              <div className="p-5 border-t border-[var(--border)] bg-[var(--card)]">
                <div className="flex items-center justify-between font-bold text-lg mb-4">
                  <span>Jami:</span>
                  <span>{getTotalSelectedPrice().toLocaleString('en-US').replace(/,/g, ' ')} so'm</span>
                </div>
                {selectedItemsCount > 0 ? (
                  <Link
                    href="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="h-14 w-full rounded-2xl bg-[var(--accent)] text-white font-bold hover:bg-orange-600 transition-colors flex items-center justify-center shadow-lg shadow-[var(--accent)]/30"
                  >
                    Rasmiylashtirish <ChevronRight className="w-5 h-5 ml-1" />
                  </Link>
                ) : (
                  <button 
                    disabled
                    className="h-14 w-full rounded-2xl bg-[var(--muted)]/20 text-[var(--muted)] font-bold flex items-center justify-center cursor-not-allowed"
                  >
                    Tovarlarni tanlang
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
