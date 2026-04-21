"use client";

import { CreditCard, ShieldCheck, CheckCircle2, MapPin, Phone, User, ChevronLeft, Truck, Clock } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/ui/Header";
import { useCartStore } from "@/store/useCartStore";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { placeOrder } from "@/app/actions/orders";

type PayMethod = "payme" | "click" | "cash";

export default function CheckoutPage() {
  const { items, getTotalSelectedPrice, removeItem } = useCartStore();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [payMethod, setPayMethod] = useState<PayMethod>("payme");
  const [tgUser, setTgUser] = useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const wApp = (window as any).Telegram?.WebApp;
      if (wApp?.initDataUnsafe?.user) {
        const u = wApp.initDataUnsafe.user;
        setTgUser(u);
        setForm((f) => ({
          ...f,
          name: (u.first_name + " " + (u.last_name ?? "")).trim(),
          phone: "",
        }));
      } else {
        try {
          const saved = JSON.parse(localStorage.getItem("tg_user") || "null");
          if (saved) {
            setTgUser(saved);
            setForm((f) => ({ ...f, name: (saved.first_name + " " + (saved.last_name ?? "")).trim() }));
          }
        } catch {}
      }
    }
  }, []);

  const selectedItems = items.filter((i) => i.selectedForCheckout);
  const totalPrice = getTotalSelectedPrice();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Ism kiritilishi shart";
    if (!form.phone.trim()) e.phone = "Telefon raqam kiritilishi shart";
    if (!form.address.trim()) e.address = "Manzil kiritilishi shart";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCheckout = async () => {
    if (!validate()) return;
    if (selectedItems.length === 0) return;
    setIsProcessing(true);

    const address = `${form.name}, ${form.phone}, ${form.address}${form.note ? ` (${form.note})` : ""}`;

    const res = await placeOrder({
      telegramId: tgUser ? String(tgUser.id) : undefined,
      items: selectedItems.map((i) => ({
        productId: i.productId || i.id,
        variantId: i.variant?.id,
        qty: i.quantity,
        price: i.price,
      })),
      address,
      total: totalPrice,
    });

    setIsProcessing(false);
    if (res.success) {
      selectedItems.forEach((item) => removeItem(item.id));
      setOrderId(res.orderId ?? "");
      setSuccess(true);
      setTimeout(() => router.push("/"), 4000);
    }
  };

  // ── Success Screen ─────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-6 text-center">
        <div className="animate-bounce-in">
          <div className="w-24 h-24 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-3xl font-extrabold mb-3">Buyurtma qabul qilindi! 🎉</h1>
          <p className="text-[var(--muted)] mb-2">Buyurtma raqami: <span className="font-bold text-[var(--foreground)]">#{orderId.slice(-8).toUpperCase()}</span></p>
          <p className="text-[var(--muted)] text-sm mb-8">Tez orada operatorlarimiz siz bilan bog'lanishadi.</p>
          <div className="space-y-3">
            <button
              onClick={() => router.push("/")}
              className="w-full h-13 rounded-2xl bg-[var(--accent)] text-white font-bold hover:bg-[var(--accent-dark)] transition-colors"
              style={{ height: "52px" }}
            >
              Asosiy sahifaga qaytish
            </button>
            <Link href="/profile" className="block text-sm font-bold text-[var(--accent)] hover:underline mt-2">
              Buyurtmalarimni ko'rish →
            </Link>
          </div>
        </div>
        <p className="text-xs text-[var(--muted)] mt-8">4 soniyada avtomatik o'tadi...</p>
      </div>
    );
  }

  // ── Empty Cart ─────────────────────────────────────────────────────────────
  if (selectedItems.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <div className="w-20 h-20 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center mb-5">
            <Truck className="w-9 h-9 text-[var(--muted)]" />
          </div>
          <h1 className="text-xl font-extrabold mb-2">Savat bo'sh</h1>
          <p className="text-sm text-[var(--muted)] mb-6">Avvalo mahsulotlarni savatga qo'shing</p>
          <Link
            href="/"
            className="h-12 px-8 rounded-full bg-[var(--accent)] text-white font-bold hover:bg-[var(--accent-dark)] transition-colors inline-flex items-center"
          >
            Xaridni boshlash
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col pb-8">
      <Header />

      {/* Back nav */}
      <div className="sticky top-[64px] z-30 bg-[var(--background)]/90 backdrop-blur border-b border-[var(--border)] px-4 h-12 flex items-center gap-3 sm:hidden">
        <button onClick={() => router.back()} className="p-1 -ml-1">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-bold text-sm">Buyurtmani rasmiylashtirish</span>
      </div>

      <main className="max-w-4xl mx-auto w-full px-4 py-6 sm:px-6 sm:py-8">
        <h1 className="text-2xl font-extrabold mb-6 hidden sm:block">Buyurtmani rasmiylashtirish</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Left: Delivery Info ──────────────────────────────── */}
          <div className="space-y-5 order-2 lg:order-1">

            {/* Delivery Form */}
            <div className="card p-5 space-y-4">
              <h2 className="font-extrabold text-base flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--accent)]" /> Yetkazib berish ma'lumotlari
              </h2>

              <div className="space-y-3">
                {/* Name */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5 block">Ism Familiya *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                    <input
                      className={`input h-12 pl-10 ${errors.name ? "border-red-500" : ""}`}
                      placeholder="Ismi Familiyangiz"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    />
                  </div>
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5 block">Telefon raqam *</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                    <input
                      className={`input h-12 pl-10 ${errors.phone ? "border-red-500" : ""}`}
                      type="tel"
                      placeholder="+998 90 123 45 67"
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>

                {/* Address */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5 block">Manzil *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-[var(--muted)]" />
                    <textarea
                      className={`input pl-10 py-3 resize-none ${errors.address ? "border-red-500" : ""}`}
                      rows={2}
                      placeholder="Shahar, ko'cha, uy raqami..."
                      value={form.address}
                      onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                    />
                  </div>
                  {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                </div>

                {/* Note */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5 block">Izoh (ixtiyoriy)</label>
                  <textarea
                    className="input py-3 px-4 resize-none"
                    rows={2}
                    placeholder="Maxsus ko'rsatmalar yoki izoh..."
                    value={form.note}
                    onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="font-bold text-sm">Bepul yetkazib berish</p>
                <p className="text-xs text-[var(--muted)]">1-2 ish kuni ichida</p>
              </div>
              <div className="ml-auto badge badge-success">Bepul</div>
            </div>

            {/* Payment Methods */}
            <div className="card p-5 space-y-3">
              <h2 className="font-extrabold text-base flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[var(--accent)]" /> To'lov usuli
              </h2>

              {[
                { id: "payme", label: "Payme", desc: "Payme karta orqali", color: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20" },
                { id: "click", label: "Click", desc: "Click ilovasi orqali", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
                { id: "cash", label: "Naqd", desc: "Yetkazib berishda naqd", color: "bg-green-500/10 text-green-600 border-green-500/20" },
              ].map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    payMethod === method.id ? "border-[var(--accent)] bg-[var(--accent)]/4" : "border-[var(--border)] hover:border-[var(--accent)]/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={payMethod === method.id}
                      onChange={() => setPayMethod(method.id as PayMethod)}
                      className="w-4 h-4 accent-[var(--accent)]"
                    />
                    <div>
                      <p className="font-bold text-sm">{method.desc}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-black px-2.5 py-1 rounded-lg border ${method.color}`}>
                    {method.label}
                  </span>
                </label>
              ))}

              <div className="pt-2 flex items-start gap-2.5 text-sm text-[var(--muted)]">
                <ShieldCheck className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-xs font-medium">Barcha to'lovlar 100% himoyalangan va xavfsiz</span>
              </div>
            </div>
          </div>

          {/* ── Right: Order Summary ─────────────────────────────── */}
          <div className="order-1 lg:order-2">
            <div className="card p-5 lg:sticky lg:top-28">
              <h2 className="font-extrabold text-base mb-4">Sizning buyurtmangiz</h2>

              {/* Items */}
              <div className="space-y-3 mb-5">
                {selectedItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-14 h-16 rounded-xl overflow-hidden bg-[var(--border)] flex-shrink-0">
                      <Image src={item.image} alt={item.title} fill className="object-cover" unoptimized />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold line-clamp-1">{item.title}</p>
                      {item.variant && (
                        <p className="text-xs text-[var(--muted)] mt-0.5">
                          {item.variant.size} {item.variant.color && `· ${item.variant.color}`}
                        </p>
                      )}
                      <p className="text-sm font-black mt-1">{(item.price * item.quantity).toLocaleString("ru")} so'm</p>
                    </div>
                    <span className="text-xs text-[var(--muted)] font-bold flex-shrink-0">×{item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 pb-4 border-b border-[var(--border)]">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted)]">Mahsulotlar ({selectedItems.length})</span>
                  <span className="font-semibold">{totalPrice.toLocaleString("ru")} so'm</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted)]">Yetkazib berish</span>
                  <span className="font-bold text-green-500">Bepul</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-4">
                <span className="font-extrabold text-base">Jami:</span>
                <span className="text-2xl font-black text-[var(--foreground)]">{totalPrice.toLocaleString("ru")} so'm</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className={`w-full rounded-2xl text-white font-extrabold text-base flex items-center justify-center gap-2 transition-all ${
                  isProcessing
                    ? "bg-[var(--muted)] cursor-not-allowed opacity-60"
                    : "bg-[var(--accent)] hover:bg-[var(--accent-dark)] shadow-[var(--shadow-accent)] hover:-translate-y-0.5"
                }`}
                style={{ height: "52px" }}
              >
                {isProcessing ? (
                  <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Buyurtma berilmoqda...</>
                ) : (
                  <>Buyurtmani tasdiqlash</>
                )}
              </button>

              <Link href="/" className="block mt-3 text-center text-xs font-bold text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
                ← Xaridni davom ettirish
              </Link>

              <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-[var(--muted)]">
                <Clock className="w-3.5 h-3.5" />
                <span>1-2 ish kuni ichida yetkaziladi</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
