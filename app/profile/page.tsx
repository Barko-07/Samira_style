"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/ui/Header";
import { User, ShoppingBag, Heart, Settings, ChevronRight, LogOut, Shield, Phone, Mail, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getMyOrders } from "@/app/actions/orders";
import { orderStatusLabel } from "@/lib/orderUtils";
import { useWishlistStore } from "@/store/useWishlistStore";
import { checkIsAdmin, claimAdminRole } from "@/app/actions/auth";

export default function ProfilePage() {
  const router = useRouter();
  const [tgUser, setTgUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const { items: wishlistItems } = useWishlistStore();

  useEffect(() => {
    async function load() {
      let user: any = null;
      if (typeof window !== "undefined") {
        if ((window as any).Telegram?.WebApp?.initDataUnsafe?.user) {
          user = (window as any).Telegram.WebApp.initDataUnsafe.user;
        } else {
          try { user = JSON.parse(localStorage.getItem("tg_user") || "null"); } catch {}
        }
      }
      setTgUser(user);

      const telegramId = user ? String(user.id) : "";
      
      const [ordersRes, adminRes] = await Promise.all([
        getMyOrders(telegramId),
        checkIsAdmin(telegramId)
      ]);

      if (ordersRes.success) setOrders(ordersRes.data);
      setIsAdmin(adminRes);
      
      setIsLoading(false);
    }
    load();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("tg_user");
    router.push("/auth/login");
  };

  const handleAvatarClick = async () => {
    if (isAdmin || !tgUser) return;
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (newCount === 5) {
      const secret = prompt("Adminlik maxfiy so'zini kiriting:");
      if (secret) {
        const res = await claimAdminRole(String(tgUser.id), secret);
        if (res.success) {
          alert("Tabriklaymiz, siz adminga aylandingiz!");
          setIsAdmin(true);
        } else {
          alert(res.error);
        }
      }
      setClickCount(0);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col pb-28 sm:pb-10">
      <Header />

      <main className="max-w-2xl mx-auto w-full px-4 sm:px-6 py-6 space-y-5">

        {/* Profile Card */}
        <div className="card p-6 animate-fade-in">
          <div className="flex items-center gap-4">
            <div 
              onClick={handleAvatarClick}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent)]/5 border border-[var(--accent)]/20 flex items-center justify-center flex-shrink-0 text-2xl font-black text-[var(--accent)] cursor-pointer select-none"
            >
              {tgUser?.first_name?.charAt(0) ?? <User className="w-7 h-7" />}
            </div>
            <div className="flex-1 min-w-0">
              {tgUser ? (
                <>
                  <h1 className="text-xl font-extrabold">{tgUser.first_name} {tgUser.last_name ?? ""}</h1>
                  {tgUser.username && <p className="text-sm text-[var(--muted)] mt-0.5">@{tgUser.username}</p>}
                  <div className="flex items-center gap-1.5 mt-2 text-green-600 text-xs font-bold">
                    <Shield className="w-3.5 h-3.5" />
                    Telegram orqali tasdiqlangan
                  </div>
                </>
              ) : (
                <>
                  <h1 className="text-xl font-extrabold">Mehmon</h1>
                  <p className="text-sm text-[var(--muted)] mt-0.5">Kirish uchun Telegram kerak</p>
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold text-[var(--accent)] hover:underline"
                  >
                    Kirish →
                  </Link>
                </>
              )}
            </div>
          </div>

          {tgUser && (
            <div className="mt-4 pt-4 border-t border-[var(--border)] text-xs text-[var(--muted)] font-medium">
              Telegram ID: <span className="text-[var(--foreground)] font-bold">{tgUser.id}</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 animate-slide-up">
          <div className="card p-4 text-center">
            <p className="text-2xl font-black text-[var(--accent)]">{orders.length}</p>
            <p className="text-xs text-[var(--muted)] font-semibold mt-0.5">Buyurtmalar</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-2xl font-black text-red-500">{wishlistItems.length}</p>
            <p className="text-xs text-[var(--muted)] font-semibold mt-0.5">Sevimlilar</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="card overflow-hidden animate-slide-up">
          {isAdmin && (
            <Link href="/admin" className="flex items-center gap-4 px-5 py-4 hover:bg-[var(--card-hover)] transition-colors border-b border-[var(--border)]">
              <div className="w-10 h-10 rounded-2xl bg-[var(--background)] flex items-center justify-center border border-[var(--border)]">
                <Shield className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm">Admin Panel</p>
                <p className="text-xs text-[var(--muted)]">Do'konni boshqarish</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--muted)]" />
            </Link>
          )}

          {[
            { href: "/wishlist", icon: <Heart className="w-5 h-5 text-red-500" />, label: "Sevimli mahsulotlar", sub: `${wishlistItems.length} ta saqlangan` },
            { href: "/checkout", icon: <ShoppingBag className="w-5 h-5 text-[var(--accent)]" />, label: "Savat & Buyurtma", sub: "Xaridni rasmiylashtirish" },
          ].map((item, i) => (
            <Link key={i} href={item.href} className="flex items-center gap-4 px-5 py-4 hover:bg-[var(--card-hover)] transition-colors border-b border-[var(--border)] last:border-0">
              <div className="w-10 h-10 rounded-2xl bg-[var(--background)] flex items-center justify-center border border-[var(--border)]">
                {item.icon}
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm">{item.label}</p>
                <p className="text-xs text-[var(--muted)]">{item.sub}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--muted)]" />
            </Link>
          ))}
        </div>

        {/* Orders */}
        <div className="space-y-3 animate-slide-up">
          <h2 className="text-base font-extrabold px-1 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--accent)]" /> Buyurtmalar tarixi
          </h2>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="card p-4">
                  <div className="skeleton h-4 w-32 rounded mb-2" />
                  <div className="skeleton h-3 w-48 rounded" />
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="card p-8 text-center">
              <ShoppingBag className="w-10 h-10 mx-auto mb-3 text-[var(--muted)] opacity-50" />
              <p className="font-semibold text-[var(--muted)]">Hali buyurtmalar yo'q</p>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 mt-3 text-sm font-bold text-[var(--accent)] hover:underline"
              >
                Xarid qilish →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => {
                const { label, color } = orderStatusLabel(order.status);
                const colorMap: Record<string, string> = { warning: "text-yellow-600 bg-yellow-500/10", success: "text-green-600 bg-green-500/10", info: "text-blue-600 bg-blue-500/10", error: "text-red-600 bg-red-500/10", muted: "text-gray-500 bg-gray-500/10" };
                return (
                  <div key={order.id} className="card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold text-sm">#{order.id.slice(-8).toUpperCase()}</p>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${colorMap[color] ?? colorMap.muted}`}>{label}</span>
                    </div>
                    <p className="text-xs text-[var(--muted)] mb-2">
                      {new Date(order.createdAt).toLocaleDateString("uz-UZ", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-[var(--muted)]">{order.items?.length ?? 0} ta mahsulot</p>
                      <p className="font-black text-sm">{order.total.toLocaleString("ru")} so'm</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Logout */}
        {tgUser && (
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 h-12 rounded-2xl border border-red-500/30 text-red-500 font-bold hover:bg-red-500/8 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Tizimdan chiqish
          </button>
        )}
      </main>
    </div>
  );
}
