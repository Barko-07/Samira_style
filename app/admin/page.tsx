"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, CheckCircle2, Lock, Users, ShoppingBag, DollarSign, Plus, Trash2, Power } from "lucide-react";
import { getAdminStats } from "@/app/actions/admin";
import { getCategories, addCategory, deleteCategory, toggleCategory } from "@/app/actions/categories";
import { adminLoginEndpoint } from "@/app/actions/auth";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tgUser, setTgUser] = useState<any>(null);
  const [tgInitData, setTgInitData] = useState("");
  const [tgLoaded, setTgLoaded] = useState(false);

  // Dashboard state
  const [stats, setStats] = useState({ users: 0, orders: 0, revenue: 0 });
  const [categories, setCategories] = useState<any[]>([]);
  const [newCatName, setNewCatName] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).Telegram?.WebApp) {
      const webApp = (window as any).Telegram.WebApp;
      webApp.ready();
      if (webApp.initData) setTgInitData(webApp.initData);
      if (webApp.initDataUnsafe?.user) {
        setTgUser(webApp.initDataUnsafe.user);
      }
      setTgLoaded(true);
    } else {
      setTimeout(() => setTgLoaded(true), 1000); // Fallback timeout if not in TG
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!tgUser && process.env.NODE_ENV !== "development") {
      setError("Xavfsizlik tizimi: Faqat Telegram Mini App orqali kirish mumkin!");
      return;
    }

    setLoadingAction(true);
    const authRes = await adminLoginEndpoint(
      tgInitData || (process.env.NODE_ENV === "development" ? "bypass" : ""), 
      password
    );
    setLoadingAction(false);

    if (authRes.success) {
      setIsAuthenticated(true);
      fetchDashboardData();
    } else {
      setError(authRes.error || "Ruxsat berilmadi!");
    }
  };

  const fetchDashboardData = async () => {
    const statsRes = await getAdminStats();
    if (statsRes.success && statsRes.stats) setStats(statsRes.stats);
    
    const catRes = await getCategories();
    if (catRes.success && catRes.data) setCategories(catRes.data);
  };

  const handleCreateCategory = async () => {
    if (!newCatName.trim()) return;
    setLoadingAction(true);
    const res = await addCategory(newCatName);
    if (res.success) {
      setNewCatName("");
      fetchDashboardData();
    } else {
      alert(res.error);
    }
    setLoadingAction(false);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Rostdan o'chirmoqchimisiz?")) return;
    setLoadingAction(true);
    await deleteCategory(id);
    fetchDashboardData();
    setLoadingAction(false);
  };

  const handleToggleCategory = async (id: string, currentStatus: boolean) => {
    setLoadingAction(true);
    await toggleCategory(id, !currentStatus);
    fetchDashboardData();
    setLoadingAction(false);
  };

  if (!tgLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="w-8 h-8 rounded-full border-4 border-[var(--accent)] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen p-6 bg-[var(--background)] text-[var(--foreground)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
            <h1 className="text-3xl font-extrabold">Boshqaruv Paneli</h1>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[var(--muted)] text-sm font-bold uppercase tracking-wider mb-2">Buyurtmalar</p>
                <h3 className="text-3xl font-black">{stats.orders} ta</h3>
              </div>
              <ShoppingBag className="w-10 h-10 text-[var(--accent)]/50" />
            </div>
            <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[var(--muted)] text-sm font-bold uppercase tracking-wider mb-2">Tushum</p>
                <h3 className="text-3xl font-black">{stats.revenue.toLocaleString('en-US').replace(/,/g, ' ')} <span className="text-lg">so'm</span></h3>
              </div>
              <DollarSign className="w-10 h-10 text-green-500/50" />
            </div>
            <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[var(--muted)] text-sm font-bold uppercase tracking-wider mb-2">Foydalanuvchilar</p>
                <h3 className="text-3xl font-black">{stats.users} ta</h3>
              </div>
              <Users className="w-10 h-10 text-blue-500/50" />
            </div>
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Kategoriyalarni Boshqarish</h2>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  placeholder="Yangi kategoriya nomi..."
                  className="px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:border-[var(--accent)]"
                  disabled={loadingAction}
                />
                <button 
                  onClick={handleCreateCategory}
                  disabled={loadingAction || !newCatName}
                  className="px-4 py-2 bg-[var(--foreground)] text-[var(--background)] rounded-xl font-bold hover:bg-[var(--accent)] hover:text-white transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" /> Qo'shish
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="py-3 px-4 text-sm tracking-wider text-[var(--muted)]">Nomi</th>
                    <th className="py-3 px-4 text-sm tracking-wider text-[var(--muted)] min-w-[200px]">Holati (saytda)</th>
                    <th className="py-3 px-4 text-sm tracking-wider text-[var(--muted)] text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(cat => (
                    <tr key={cat.id} className="border-b border-[var(--border)]/50 hover:bg-[var(--background)]/50 transition-colors">
                      <td className="py-3 px-4 font-semibold">{cat.name}</td>
                      <td className="py-3 px-4">
                        <button 
                          onClick={() => handleToggleCategory(cat.id, cat.isActive)}
                          disabled={loadingAction}
                          className={`px-3 py-1 text-xs font-bold rounded-lg flex items-center gap-1.5 w-max ${cat.isActive ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}
                        >
                          <Power className="w-3 h-3" /> {cat.isActive ? "Faol" : "O'chirilgan"}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button 
                          onClick={() => handleDeleteCategory(cat.id)}
                          disabled={loadingAction}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors inline-block"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {categories.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-[var(--muted)] font-medium">
                        Hozircha kategoriyalar yo'q. Yangi qo'shing.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-8 p-6 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background)]/50 flex flex-col items-center justify-center text-center">
            <h4 className="font-bold text-sm text-[var(--muted)]">Tizim holati</h4>
            <p className="text-xs text-[var(--muted)]/70 mt-1">
              Admin panel ({tgUser?.id || "Noma'lum"}). Telegram integratsiyasi va qo'shimcha ma'lumotlar IP tekshiruvidan keyin ishga tushadi.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
      <div className="w-full max-w-md p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-2xl relative overflow-hidden">
        {/* Decor */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/10 rounded-bl-full blur-2xl" />
        
        <div className="relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-[var(--foreground)] text-[var(--background)] flex items-center justify-center mb-6 shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          
          <h2 className="text-2xl font-extrabold tracking-tight mb-2">Admin Kirish</h2>
          <p className="text-sm text-[var(--muted)] mb-8">
            Maxsus parol orqali kiring. Sizning Telegram ID'ingiz tekshiriladi.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Admin Paroli</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full h-14 px-4 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none transition-all font-medium"
              />
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-semibold flex items-start gap-2">
                <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button 
              type="submit"
              className="w-full h-14 rounded-xl bg-[var(--foreground)] text-[var(--background)] font-bold tracking-wide hover:bg-[var(--accent)] hover:text-white transition-colors mt-4"
            >
              Tizimga kirish
            </button>
          </form>

          {tgUser && (
            <p className="text-xs text-center text-[var(--muted)] mt-6 font-medium">
              Sizning ID: <span className="text-[var(--foreground)]">{tgUser.id}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
