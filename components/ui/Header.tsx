"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingBag, X, ChevronRight, Plus, Minus, Trash2, Home, Heart, User } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useRouter, usePathname } from "next/navigation";

export function Header() {
  const {
    isCartOpen, setIsCartOpen, items, getTotalItems, getTotalSelectedPrice,
    updateQuantity, removeItem, toggleItemSelection, toggleAllSelection,
  } = useCartStore();
  const [tgUser, setTgUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  const allSelected = items.length > 0 && items.every((i) => i.selectedForCheckout);
  const selectedItemsCount = items.filter((i) => i.selectedForCheckout).length;

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).Telegram?.WebApp) {
      const webApp = (window as any).Telegram.WebApp;
      webApp.ready();
      webApp.expand();
      if (webApp.initDataUnsafe?.user) {
        setTgUser(webApp.initDataUnsafe.user);
      }
    }
  }, []);

  const navLinks = [
    { href: "/", label: "Bosh sahifa", icon: <Home className="w-[23px] h-[23px]" /> },
    { href: "/wishlist", label: "Sevimlilar", icon: <Heart className="w-[23px] h-[23px]" /> },
  ];

  return (
    <>
      {/* ── Top Header ────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-[var(--border)] glass">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="relative h-9 w-9 overflow-hidden rounded-xl bg-[var(--card)] border border-[var(--border)] flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform shadow-[var(--shadow-sm)]">
              <span className="text-base font-black gradient-text">S</span>
            </span>
            <span className="text-lg font-extrabold tracking-tight hidden sm:block">
              Samira <span className="text-[var(--accent)]">Style</span>
            </span>
          </Link>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsCartOpen(true)}
              id="cart-btn"
              className="relative p-2.5 rounded-full hover:bg-[var(--accent)]/10 transition-colors group"
            >
              <ShoppingBag className="w-5 h-5 text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[var(--accent)] text-white text-[9px] font-black flex items-center justify-center animate-bounce-in">
                  {getTotalItems() > 9 ? "9+" : getTotalItems()}
                </span>
              )}
            </button>

            {tgUser ? (
              <Link
                href="/profile"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent)] transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center font-black text-[10px]">
                  {tgUser.first_name?.charAt(0)}
                </div>
                <span className="text-xs font-semibold">{tgUser.first_name}</span>
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="hidden sm:inline-flex h-9 items-center justify-center rounded-full border border-[var(--border)] px-4 text-xs font-bold hover:bg-[var(--accent)] hover:text-white hover:border-transparent transition-all duration-300"
              >
                Kirish
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ── Cart Drawer ─────────────────────────────────────── */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="relative w-full max-w-sm bg-[var(--background)] h-full shadow-2xl flex flex-col animate-slide-in-right">
            {/* Cart Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
              <div>
                <h2 className="text-lg font-extrabold">Savat</h2>
                {items.length > 0 && (
                  <p className="text-xs text-[var(--muted)] font-medium mt-0.5">{getTotalItems()} ta mahsulot</p>
                )}
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full bg-[var(--card)] flex items-center justify-center hover:bg-[var(--border)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cart Body */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 h-full">
                  <div className="w-20 h-20 rounded-full bg-[var(--accent)]/10 flex items-center justify-center mb-4">
                    <ShoppingBag className="w-9 h-9 text-[var(--accent)]" />
                  </div>
                  <p className="text-base font-bold mb-1">Savatingiz bo'sh</p>
                  <p className="text-sm text-[var(--muted)] mb-6">Mahsulotlar qo'shing va qulay xarid qiling</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="h-11 px-7 rounded-full bg-[var(--accent)] text-white font-bold hover:bg-[var(--accent-dark)] transition-colors"
                  >
                    Xaridni boshlash
                  </button>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {/* Select All */}
                  <label className="flex items-center gap-2.5 px-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={(e) => toggleAllSelection(e.target.checked)}
                      className="w-4 h-4 rounded accent-[var(--accent)] cursor-pointer"
                    />
                    <span className="text-sm font-bold">Barchasini tanlash</span>
                    <span className="ml-auto text-xs text-[var(--muted)]">{selectedItemsCount} ta tanlangan</span>
                  </label>

                  {items.map((item) => (
                    <div key={item.id} className={`flex gap-3 p-3 rounded-2xl border-2 transition-colors ${item.selectedForCheckout ? "border-[var(--accent)]/40 bg-[var(--accent)]/3" : "border-[var(--border)] bg-[var(--card)]"}`}>
                      <input
                        type="checkbox"
                        checked={item.selectedForCheckout}
                        onChange={() => toggleItemSelection(item.id)}
                        className="w-4 h-4 rounded accent-[var(--accent)] cursor-pointer mt-1 flex-shrink-0"
                      />
                      <div className="relative w-16 h-18 rounded-xl overflow-hidden bg-[var(--border)] flex-shrink-0" style={{ height: "72px" }}>
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold line-clamp-2 leading-tight">{item.title}</h4>
                        {item.variant && (
                          <p className="text-[11px] text-[var(--muted)] mt-0.5">
                            {item.variant.size && `O'lcham: ${item.variant.size}`}
                            {item.variant.color && ` · ${item.variant.color}`}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-sm font-black">{(item.price * item.quantity).toLocaleString("ru")} so'm</p>
                          <div className="flex items-center bg-[var(--background)] border border-[var(--border)] rounded-lg">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center hover:text-[var(--accent)] transition-colors">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center hover:text-[var(--accent)] transition-colors">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-7 h-7 flex-shrink-0 text-[var(--muted)] hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {items.length > 0 && (
              <div className="p-4 border-t border-[var(--border)] bg-[var(--card)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[var(--muted)]">Jami to'lov:</span>
                  <span className="text-xl font-black">{getTotalSelectedPrice().toLocaleString("ru")} so'm</span>
                </div>
                {selectedItemsCount > 0 ? (
                  <Link
                    href="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="flex items-center justify-center gap-2 h-13 w-full rounded-2xl bg-[var(--accent)] text-white font-bold hover:bg-[var(--accent-dark)] transition-all shadow-[var(--shadow-accent)] hover:-translate-y-0.5"
                    style={{ height: "52px" }}
                  >
                    Rasmiylashtirish <ChevronRight className="w-5 h-5" />
                  </Link>
                ) : (
                  <button
                    disabled
                    className="h-13 w-full rounded-2xl bg-[var(--border)] text-[var(--muted)] font-bold cursor-not-allowed"
                    style={{ height: "52px" }}
                  >
                    Tovarlarni tanlang
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── iOS-Style Floating Tab Bar (Main App) ─────────────── */}
      <nav
        className="fixed left-0 right-0 z-30 px-4 sm:hidden"
        style={{ bottom: "calc(16px + env(safe-area-inset-bottom, 0px))" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: 400,
            margin: "0 auto",
            background: "#F2F2F7",
            borderRadius: 9999,
            padding: 8,
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          }}
        >
          {/* Nav Links */}
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: isActive ? "8px 20px" : "8px 16px",
                  background: isActive ? "#ffffff" : "transparent",
                  borderRadius: 9999,
                  textDecoration: "none",
                  WebkitTapHighlightColor: "transparent",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: isActive ? "0 2px 10px rgba(0,0,0,0.04)" : "none",
                }}
              >
                <span
                  style={{
                    color: isActive ? "#ea580c" : "#0f172a",
                    transition: "color 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {link.icon}
                </span>
                {isActive && (
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#ea580c",
                      letterSpacing: "-0.01em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {link.label}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Cart Tab */}
          <button
            onClick={() => setIsCartOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: isCartOpen ? "8px 20px" : "8px 16px",
              background: isCartOpen ? "#ffffff" : "transparent",
              borderRadius: 9999,
              border: "none",
              cursor: "pointer",
              WebkitTapHighlightColor: "transparent",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: isCartOpen ? "0 2px 10px rgba(0,0,0,0.04)" : "none",
            }}
          >
            <div className="relative flex items-center justify-center">
              <ShoppingBag className="w-[23px] h-[23px] transition-colors duration-300" style={{ color: isCartOpen ? "#ea580c" : "#0f172a" }} />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 rounded-full bg-[#ea580c] text-white text-[9px] font-black flex items-center justify-center px-1 shadow-sm">
                  {getTotalItems() > 9 ? "9+" : getTotalItems()}
                </span>
              )}
            </div>
            {isCartOpen && (
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#ea580c",
                  letterSpacing: "-0.01em",
                  whiteSpace: "nowrap",
                }}
              >
                Savat
              </span>
            )}
          </button>

          {/* Profile Tab */}
          <Link
            href="/profile"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: pathname === "/profile" ? "8px 20px" : "8px 16px",
              background: pathname === "/profile" ? "#ffffff" : "transparent",
              borderRadius: 9999,
              textDecoration: "none",
              WebkitTapHighlightColor: "transparent",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: pathname === "/profile" ? "0 2px 10px rgba(0,0,0,0.04)" : "none",
            }}
          >
            <span className="flex items-center justify-center">
              <User className="w-[23px] h-[23px] transition-colors duration-300" style={{ color: pathname === "/profile" ? "#ea580c" : "#0f172a" }} />
            </span>
            {pathname === "/profile" && (
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#ea580c",
                  letterSpacing: "-0.01em",
                  whiteSpace: "nowrap",
                }}
              >
                Profil
              </span>
            )}
          </Link>
        </div>
      </nav>
    </>
  );
}
