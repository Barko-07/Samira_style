"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ShieldAlert, CheckCircle2, Lock, Users, ShoppingBag, DollarSign,
  Plus, Trash2, Power, Package, ClipboardList, BarChart3, Tag,
  X, ArrowLeft, Upload, Eye, AlertCircle, ChevronDown,
} from "lucide-react";
import { getAdminStats } from "@/app/actions/admin";
import { getCategories, addCategory, deleteCategory, toggleCategory } from "@/app/actions/categories";
import { adminLoginEndpoint, adminLogout } from "@/app/actions/auth";
import { getAdminProducts, createProduct, deleteProduct } from "@/app/actions/products";
import { getOrders, updateOrderStatus } from "@/app/actions/orders";
import { orderStatusLabel } from "@/lib/orderUtils";
import Image from "next/image";

type Tab = "stats" | "products" | "orders" | "categories";

// ─── Order Status Badge ───────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const { label, color } = orderStatusLabel(status);
  const colorMap: Record<string, string> = {
    warning: "bg-yellow-500/10 text-yellow-600",
    success: "bg-green-500/10 text-green-600",
    info: "bg-blue-500/10 text-blue-600",
    error: "bg-red-500/10 text-red-600",
    muted: "bg-gray-500/10 text-gray-500",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${colorMap[color] ?? colorMap.muted}`}>
      {label}
    </span>
  );
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tgUser, setTgUser] = useState<any>(null);
  const [tgInitData, setTgInitData] = useState("");
  const [tgLoaded, setTgLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("stats");
  const [loadingAction, setLoadingAction] = useState(false);

  // Dashboard state
  const [stats, setStats] = useState({ users: 0, orders: 0, revenue: 0 });
  const [categories, setCategories] = useState<any[]>([]);
  const [newCatName, setNewCatName] = useState("");

  // Products state
  const [products, setProducts] = useState<any[]>([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [productForm, setProductForm] = useState({
    title: "", description: "", price: "", category: "Erkaklar",
    images: "",
  });

  // Orders state
  const [orders, setOrders] = useState<any[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).Telegram?.WebApp) {
      const webApp = (window as any).Telegram.WebApp;
      webApp.ready();
      webApp.expand();
      if (webApp.initData) setTgInitData(webApp.initData);
      if (webApp.initDataUnsafe?.user) setTgUser(webApp.initDataUnsafe.user);
      setTgLoaded(true);
    } else {
      setTimeout(() => setTgLoaded(true), 500);
    }
  }, []);

  const fetchDashboardData = useCallback(async () => {
    const [statsRes, catRes, prodRes, ordRes] = await Promise.all([
      getAdminStats(),
      getCategories(),
      getAdminProducts(),
      getOrders(),
    ]);
    if (statsRes.success && statsRes.stats) setStats(statsRes.stats);
    if (catRes.success && catRes.data) setCategories(catRes.data);
    if (prodRes.success) setProducts(prodRes.data);
    if (ordRes.success) setOrders(ordRes.data);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoadingAction(true);
    const authRes = await adminLoginEndpoint(tgInitData || "bypass", password);
    setLoadingAction(false);
    if (authRes.success) {
      setIsAuthenticated(true);
      fetchDashboardData();
    } else {
      setError(authRes.error || "Ruxsat berilmadi!");
    }
  };

  const handleLogout = async () => {
    await adminLogout();
    setIsAuthenticated(false);
    setPassword("");
  };

  const handleCreateCategory = async () => {
    if (!newCatName.trim()) return;
    setLoadingAction(true);
    const res = await addCategory(newCatName);
    if (!res.success) alert(res.error);
    setNewCatName("");
    await fetchDashboardData();
    setLoadingAction(false);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Rostdan o'chirmoqchimisiz?")) return;
    setLoadingAction(true);
    await deleteCategory(id);
    await fetchDashboardData();
    setLoadingAction(false);
  };

  const handleToggleCategory = async (id: string, currentStatus: boolean) => {
    setLoadingAction(true);
    await toggleCategory(id, !currentStatus);
    await fetchDashboardData();
    setLoadingAction(false);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.title || !productForm.price) return;
    setLoadingAction(true);
    const res = await createProduct({
      title: productForm.title,
      description: productForm.description,
      price: parseInt(productForm.price),
      category: productForm.category,
      images: productForm.images.split(",").map((s) => s.trim()).filter(Boolean),
    });
    setLoadingAction(false);
    if (res.success) {
      setShowAddProduct(false);
      setProductForm({ title: "", description: "", price: "", category: "Erkaklar", images: "" });
      await fetchDashboardData();
    } else {
      alert(res.error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Mahsulotni o'chirishni tasdiqlaysizmi?")) return;
    setLoadingAction(true);
    await deleteProduct(id);
    await fetchDashboardData();
    setLoadingAction(false);
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    setLoadingAction(true);
    await updateOrderStatus(orderId, status);
    await fetchDashboardData();
    setLoadingAction(false);
  };

  // ─── Loading ───────────────────────────────────────────────────────────────
  if (!tgLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="w-8 h-8 rounded-full border-3 border-[var(--accent)]/30 border-t-[var(--accent)] animate-spin" />
      </div>
    );
  }

  // ─── Login Form ────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-[var(--accent)] opacity-[0.06] blur-[100px]" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-orange-400 opacity-[0.06] blur-[100px]" />
        </div>

        <div className="w-full max-w-md relative z-10 animate-slide-up">
          <div className="glass rounded-3xl p-8 shadow-[var(--shadow-lg)]">
            <div className="w-14 h-14 rounded-2xl bg-[var(--foreground)] text-[var(--background)] flex items-center justify-center mb-6">
              <Lock className="w-6 h-6" />
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight mb-1">Admin Panel</h1>
            <p className="text-sm text-[var(--muted)] mb-8">
              Maxsus parol orqali kiring
              {tgUser && <> · ID: <span className="text-[var(--foreground)] font-bold">{tgUser.id}</span></>}
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin parolini kiriting..."
                className="input h-14 px-5 text-base"
                autoFocus
              />

              {error && (
                <div className="p-3.5 rounded-xl bg-red-500/8 border border-red-500/15 text-red-500 text-sm font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loadingAction || !password}
                className="w-full h-14 rounded-2xl bg-[var(--foreground)] text-[var(--background)] font-bold text-base hover:bg-[var(--accent)] hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loadingAction
                  ? <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                  : "Tizimga kirish"
                }
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ─── Authenticated Dashboard ────────────────────────────────────────────────
  const TABS: { key: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { key: "stats",      label: "Statistika", icon: <BarChart3 className="w-4 h-4" /> },
    { key: "products",   label: "Mahsulotlar", icon: <Package className="w-4 h-4" />, count: products.length },
    { key: "orders",     label: "Buyurtmalar", icon: <ClipboardList className="w-4 h-4" />, count: orders.length },
    { key: "categories", label: "Kategoriyalar", icon: <Tag className="w-4 h-4" />, count: categories.length },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[var(--accent)] flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-base leading-none">Admin Panel</h1>
              <p className="text-xs text-[var(--muted)] mt-0.5">Samira Style</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {tgUser && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--card)] border border-[var(--border)]">
                <div className="w-5 h-5 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center text-[10px] font-black">
                  {tgUser.first_name?.charAt(0)}
                </div>
                <span className="text-xs font-bold">{tgUser.first_name}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-full border border-red-500/30 text-red-500 text-xs font-bold hover:bg-red-500/10 transition-colors"
            >
              Chiqish
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="sticky top-16 z-30 bg-[var(--background)] border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto scrollbar-hide py-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? "bg-[var(--accent)] text-white shadow-[var(--shadow-accent)]"
                  : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--card)]"
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key ? "bg-white/25" : "bg-[var(--border)]"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">

        {/* ── STATISTIKA ── */}
        {activeTab === "stats" && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Buyurtmalar", value: `${stats.orders} ta`, icon: <ShoppingBag className="w-6 h-6" />, color: "text-[var(--accent)]", bg: "bg-[var(--accent)]/8" },
                { label: "Tushum", value: `${stats.revenue.toLocaleString("ru").replace(/\s/g, " ")} so'm`, icon: <DollarSign className="w-6 h-6" />, color: "text-green-500", bg: "bg-green-500/8" },
                { label: "Foydalanuvchilar", value: `${stats.users} ta`, icon: <Users className="w-6 h-6" />, color: "text-blue-500", bg: "bg-blue-500/8" },
              ].map((s, i) => (
                <div key={i} className="card p-6 flex items-center justify-between">
                  <div>
                    <p className="text-[var(--muted)] text-xs font-bold uppercase tracking-wider mb-2">{s.label}</p>
                    <h3 className="text-2xl font-black">{s.value}</h3>
                  </div>
                  <div className={`w-12 h-12 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center`}>
                    {s.icon}
                  </div>
                </div>
              ))}
            </div>

            <div className="card p-6">
              <h2 className="text-base font-extrabold mb-4 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-[var(--accent)]" />
                So'ngi Buyurtmalar
              </h2>
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between py-3 border-b border-[var(--border)] last:border-0">
                  <div>
                    <p className="font-bold text-sm">#{order.id.slice(-8)}</p>
                    <p className="text-xs text-[var(--muted)]">{order.buyer?.name ?? "Noma'lum"}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">{order.total.toLocaleString("ru")} so'm</p>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <p className="text-center text-sm text-[var(--muted)] py-4">Hali buyurtmalar yo'q</p>
              )}
            </div>
          </div>
        )}

        {/* ── MAHSULOTLAR ── */}
        {activeTab === "products" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold">Mahsulotlar ({products.length})</h2>
              <button
                onClick={() => setShowAddProduct(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[var(--accent)] text-white rounded-xl font-bold text-sm hover:bg-[var(--accent-dark)] transition-colors"
              >
                <Plus className="w-4 h-4" /> Mahsulot qo'shish
              </button>
            </div>

            {/* Add Product Modal */}
            {showAddProduct && (
              <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                <div className="w-full max-w-lg bg-[var(--background)] rounded-3xl p-6 shadow-[var(--shadow-lg)] animate-slide-up max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-extrabold">Yangi Mahsulot</h3>
                    <button onClick={() => setShowAddProduct(false)} className="w-8 h-8 rounded-full bg-[var(--card)] flex items-center justify-center hover:bg-[var(--border)] transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleAddProduct} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5 block">Mahsulot nomi *</label>
                      <input className="input h-12 px-4" placeholder="Masalan: Premium Futbolka" value={productForm.title} onChange={(e) => setProductForm((p) => ({ ...p, title: e.target.value }))} required />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5 block">Tavsif</label>
                      <textarea className="input px-4 py-3 resize-none" rows={3} placeholder="Mahsulot haqida ma'lumot..." value={productForm.description} onChange={(e) => setProductForm((p) => ({ ...p, description: e.target.value }))} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5 block">Narx (so'm) *</label>
                        <input className="input h-12 px-4" type="number" placeholder="150000" value={productForm.price} onChange={(e) => setProductForm((p) => ({ ...p, price: e.target.value }))} required />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5 block">Kategoriya</label>
                        <select className="input h-12 px-4" value={productForm.category} onChange={(e) => setProductForm((p) => ({ ...p, category: e.target.value }))}>
                          <option>Erkaklar</option>
                          <option>Ayollar</option>
                          <option>Bolalar</option>
                          <option>Aksessuar</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5 block">Rasm URL (vergul bilan)</label>
                      <input className="input h-12 px-4" placeholder="https://... , https://..." value={productForm.images} onChange={(e) => setProductForm((p) => ({ ...p, images: e.target.value }))} />
                      <p className="text-xs text-[var(--muted)] mt-1">Bir nechta rasm uchun vergul bilan ajrating</p>
                    </div>

                    {productForm.images && (
                      <div className="flex gap-2 overflow-x-auto">
                        {productForm.images.split(",").filter(Boolean).map((url, i) => (
                          <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[var(--card)]">
                            <Image src={url.trim()} alt="" fill className="object-cover" unoptimized onError={() => {}} />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-3 pt-2">
                      <button type="button" onClick={() => setShowAddProduct(false)} className="flex-1 h-12 rounded-2xl border border-[var(--border)] font-bold text-sm hover:bg-[var(--card)] transition-colors">
                        Bekor qilish
                      </button>
                      <button type="submit" disabled={loadingAction} className="flex-1 h-12 rounded-2xl bg-[var(--accent)] text-white font-bold text-sm hover:bg-[var(--accent-dark)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                        {loadingAction
                          ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          : <><Plus className="w-4 h-4" /> Qo'shish</>
                        }
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <div key={p.id} className="card p-4 flex gap-3">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[var(--card)] flex-shrink-0">
                    {p.image && (
                      <Image src={p.image} alt={p.title} fill className="object-cover" unoptimized />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm line-clamp-1">{p.title}</p>
                    <p className="text-xs text-[var(--muted)] mt-0.5">{p.category}</p>
                    <p className="text-sm font-black text-[var(--accent)] mt-1">{p.price?.toLocaleString("ru")} so'm</p>
                  </div>
                  <button
                    onClick={() => handleDeleteProduct(p.id)}
                    disabled={loadingAction}
                    className="w-8 h-8 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500/20 transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {products.length === 0 && (
                <div className="col-span-full text-center py-12 text-[var(--muted)]">
                  <Package className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p className="font-semibold">Hali mahsulotlar qo'shilmagan</p>
                  <p className="text-sm mt-1">"Mahsulot qo'shish" tugmasini bosing</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── BUYURTMALAR ── */}
        {activeTab === "orders" && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-extrabold">Buyurtmalar ({orders.length})</h2>

            {orders.map((order) => (
              <div key={order.id} className="card overflow-hidden">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-[var(--card-hover)] transition-colors"
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="w-5 h-5 text-[var(--accent)]" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">#{order.id.slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-[var(--muted)]">{order.buyer?.name ?? "Noma'lum"}</p>
                      <p className="text-xs text-[var(--muted)]">
                        {new Date(order.createdAt).toLocaleDateString("uz-UZ", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1.5">
                    <p className="font-black text-sm">{order.total.toLocaleString("ru")} so'm</p>
                    <StatusBadge status={order.status} />
                    <ChevronDown className={`w-4 h-4 text-[var(--muted)] transition-transform ${expandedOrder === order.id ? "rotate-180" : ""}`} />
                  </div>
                </div>

                {expandedOrder === order.id && (
                  <div className="border-t border-[var(--border)] p-4 bg-[var(--card-hover)] space-y-3 animate-fade-in">
                    <div>
                      <p className="text-xs font-bold text-[var(--muted)] mb-1">Manzil</p>
                      <p className="text-sm font-medium">{order.address}</p>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-[var(--muted)] mb-2">Mahsulotlar</p>
                      {order.items?.map((item: any) => (
                        <div key={item.id} className="flex justify-between text-sm py-1">
                          <span className="text-[var(--foreground)]/80">
                            {item.productVariant?.product?.title ?? "Mahsulot"} ×{item.qty}
                          </span>
                          <span className="font-bold">{(item.price * item.qty).toLocaleString("ru")} so'm</span>
                        </div>
                      ))}
                    </div>

                    <div>
                      <p className="text-xs font-bold text-[var(--muted)] mb-2">Statusni o'zgartirish</p>
                      <div className="flex flex-wrap gap-2">
                        {["PENDING_PAYMENT", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELED"].map((s) => (
                          <button
                            key={s}
                            onClick={() => handleUpdateOrderStatus(order.id, s)}
                            disabled={loadingAction || order.status === s}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              order.status === s
                                ? "bg-[var(--accent)] text-white"
                                : "bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                            } disabled:opacity-50`}
                          >
                            {orderStatusLabel(s).label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {orders.length === 0 && (
              <div className="text-center py-16 text-[var(--muted)]">
                <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="font-semibold">Hali buyurtmalar yo'q</p>
              </div>
            )}
          </div>
        )}

        {/* ── KATEGORIYALAR ── */}
        {activeTab === "categories" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold">Kategoriyalar</h2>
            </div>

            <div className="card p-5">
              <div className="flex gap-3 mb-6">
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateCategory()}
                  placeholder="Yangi kategoriya nomi..."
                  className="input flex-1 h-11 px-4"
                  disabled={loadingAction}
                />
                <button
                  onClick={handleCreateCategory}
                  disabled={loadingAction || !newCatName.trim()}
                  className="px-5 h-11 bg-[var(--foreground)] text-[var(--background)] rounded-xl font-bold hover:bg-[var(--accent)] hover:text-white transition-colors flex items-center gap-2 disabled:opacity-50 whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" /> Qo'shish
                </button>
              </div>

              <div className="space-y-2">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-[var(--background)] hover:bg-[var(--card-hover)] transition-colors">
                    <span className="font-semibold">{cat.name}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleCategory(cat.id, cat.isActive)}
                        disabled={loadingAction}
                        className={`px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors ${
                          cat.isActive ? "bg-green-500/10 text-green-600 hover:bg-green-500/20" : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                        }`}
                      >
                        <Power className="w-3 h-3" />
                        {cat.isActive ? "Faol" : "O'chirilgan"}
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        disabled={loadingAction}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {categories.length === 0 && (
                  <p className="text-center text-sm text-[var(--muted)] py-4">Hozircha kategoriyalar yo'q</p>
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-dashed border-[var(--border)] text-center">
              <p className="text-xs text-[var(--muted)]">
                Admin ({tgUser?.id ?? "Browser"}). Muhim: mahsulotlarga biriktirish uchun kategoriyalar kerak.
              </p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
