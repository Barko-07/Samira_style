"use client";

import { CreditCard, ShieldCheck, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/ui/Header";
import { useCartStore } from "@/store/useCartStore";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items, getTotalSelectedPrice, removeItem } = useCartStore();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const selectedItems = items.filter(i => i.selectedForCheckout);
  const totalItemsCount = selectedItems.length;
  const totalPrice = getTotalSelectedPrice();

  const handleCheckout = () => {
    if (totalItemsCount === 0) return;
    setIsProcessing(true);
    
    // API ni simulyatsiya qilish (2 soniya)
    setTimeout(() => {
      // Sotib olinganlarni savatdan tozalash
      selectedItems.forEach(item => removeItem(item.id));
      setIsProcessing(false);
      setSuccess(true);
      
      // 3 soniyadan keyin asosiy ekranga o'tish
      setTimeout(() => {
        router.push("/");
      }, 3000);
    }, 2000);
  };

  if (success) {
    return (
      <div className="flex min-h-screen flex-col bg-[var(--background)] items-center justify-center p-6 text-center">
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-extrabold mb-4">Tolov Muvaffaqiyatli!</h1>
        <p className="text-[var(--muted)] mb-8">Sizning buyurtmangiz qabul qilindi. Tez orada operatorlarimiz bog'lanishadi.</p>
        <button onClick={() => router.push("/")} className="h-12 px-8 rounded-full bg-[var(--foreground)] text-[var(--background)] font-bold">
          Asosiy sahifaga qaytish
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)] transition-colors duration-300">
      <Header />
      
      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">Buyurtmani rasmiylashtirish</h1>
          <p className="text-[var(--muted)] mt-2">Iltimos, to'lov turini tanlang va davom eting.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Chap ustun - To'lov Tizimlari */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[var(--accent)]" /> To'lov usuli
            </h2>
            
            <div className="space-y-3">
              {/* Payme Mock */}
              <label className="flex items-center justify-between p-5 rounded-2xl border-2 border-[var(--border)] hover:border-[var(--accent)] bg-[var(--card)] cursor-pointer group transition-all">
                <div className="flex items-center gap-4">
                  <input type="radio" name="payment_method" className="w-5 h-5 accent-[var(--accent)]" defaultChecked />
                  <span className="font-bold text-lg group-hover:text-[var(--accent)] transition-colors">Payme orqali</span>
                </div>
                <div className="px-3 py-1 bg-cyan-500/10 text-cyan-600 rounded-lg font-black tracking-widest">
                  PAYME
                </div>
              </label>

              {/* Click Mock */}
              <label className="flex items-center justify-between p-5 rounded-2xl border-2 border-[var(--border)] hover:border-[var(--accent)] bg-[var(--card)] cursor-pointer group transition-all">
                <div className="flex items-center gap-4">
                  <input type="radio" name="payment_method" className="w-5 h-5 accent-[var(--accent)]" />
                  <span className="font-bold text-lg group-hover:text-[var(--accent)] transition-colors">Click orqali</span>
                </div>
                <div className="px-3 py-1 bg-blue-500/10 text-blue-600 rounded-lg font-black tracking-widest">
                  CLICK
                </div>
              </label>
            </div>

            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-start gap-3 mt-4">
              <ShieldCheck className="w-6 h-6 text-orange-600 mt-0.5" />
              <p className="text-sm font-semibold text-orange-800 dark:text-orange-300">
                Barcha to'lovlar 100% himoyalangan. Kartangiz ma'lumotlari saqlanmaydi.
              </p>
            </div>
          </div>

          {/* O'ng ustun - Chek */}
          <div>
            <div className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-lg sticky top-24">
              <h2 className="text-xl font-bold mb-4">Sizning buyurtmangiz</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted)]">Mahsulotlar ({totalItemsCount})</span>
                  <span className="font-bold">{totalPrice.toLocaleString('en-US').replace(/,/g, ' ')} so'm</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted)]">Yetkazib berish</span>
                  <span className="font-bold text-green-500">Bepul</span>
                </div>
              </div>

              <div className="border-t border-[var(--border)] pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Jami to'lov</span>
                  <span className="text-2xl font-black text-[var(--foreground)]">{totalPrice.toLocaleString('en-US').replace(/,/g, ' ')} so'm</span>
                </div>
              </div>

              <button 
                disabled={totalItemsCount === 0 || isProcessing}
                onClick={handleCheckout}
                className={`w-full h-14 rounded-2xl text-white font-extrabold text-lg flex items-center justify-center gap-2 transition-transform shadow-xl ${
                  totalItemsCount === 0 
                  ? 'bg-gray-400 cursor-not-allowed shadow-none' 
                  : 'bg-[var(--accent)] hover:scale-[1.02] shadow-[var(--accent)]/20'
                }`}
              >
                {isProcessing ? "To'lov qilinmoqda..." : "To'lovni amalga oshirish"}
              </button>

              <Link href="/" className="block mt-4 text-center text-sm font-bold text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
                Orqaga qaytish
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
