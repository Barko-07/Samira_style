"use client";

import { Header } from "@/components/ui/Header";
import { Heart, ShoppingBag, Trash2, ArrowLeft, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { useState, useEffect } from "react";
import { getProducts } from "@/app/actions/products";
import { motion, AnimatePresence } from "framer-motion";

export default function WishlistPage() {
  const { items: wishlistIds, toggleItem } = useWishlistStore();
  const { addItem, items: cartItems } = useCartStore();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await getProducts();
      if (res.success && res.data) setProducts(res.data);
      setIsLoading(false);
    }
    load();
  }, []);

  const wishlistProducts = products.filter((p) => wishlistIds.includes(String(p.id)));

  const totalValue = wishlistProducts.reduce((acc, p) => acc + p.price, 0);

  const isInCart = (id: string) => cartItems.some((i) => (i.productId || i.id) === id);

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col pb-28 sm:pb-10">
      <Header />

      <main className="max-w-2xl mx-auto w-full px-4 sm:px-6 py-6">

        {/* Page Header */}
        <div className="flex items-center gap-4 mb-6 animate-fade-in">
          <Link href="/" className="w-10 h-10 rounded-2xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center hover:bg-[var(--card-hover)] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-extrabold flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" /> Sevimlilar
            </h1>
            <p className="text-sm text-[var(--muted)]">{wishlistProducts.length} ta mahsulot saqlangan</p>
          </div>
        </div>

        {/* Summary Card */}
        {wishlistProducts.length > 0 && (
          <div className="card p-5 mb-5 flex items-center justify-between animate-slide-up">
            <div>
              <p className="text-xs text-[var(--muted)] font-semibold">Jami qiymat</p>
              <p className="text-xl font-black">{totalValue.toLocaleString("ru")} so'm</p>
            </div>
            <button
              onClick={() => {
                wishlistProducts.forEach((p) => {
                  if (!isInCart(String(p.id))) {
                    addItem({ id: String(p.id), productId: String(p.id), title: p.title, price: p.price, image: p.image });
                  }
                });
              }}
              className="flex items-center gap-2 h-11 px-5 rounded-2xl bg-[var(--accent)] text-white font-bold text-sm hover:bg-[var(--accent-dark)] transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              Barchasini savatga
            </button>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-4 flex gap-4">
                <div className="skeleton w-20 h-24 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-3/4 rounded" />
                  <div className="skeleton h-3 w-1/2 rounded" />
                  <div className="skeleton h-9 w-full rounded-xl mt-2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && wishlistProducts.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-red-500/8 flex items-center justify-center mx-auto mb-5">
              <Heart className="w-9 h-9 text-red-400" />
            </div>
            <h2 className="text-lg font-extrabold mb-2">Sevimlilar bo'sh</h2>
            <p className="text-sm text-[var(--muted)] mb-6">Mahsulotlarga yoqtirish belgisini bosing va ular bu yerda saqlanadi</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 h-12 px-7 rounded-full bg-[var(--accent)] text-white font-bold hover:bg-[var(--accent-dark)] transition-colors"
            >
              Mahsulotlarni ko'rish
            </Link>
          </div>
        )}

        {/* Products List */}
        {!isLoading && (
          <div className="space-y-3">
            <AnimatePresence>
              {wishlistProducts.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.22 }}
                  className="card p-4 flex gap-4"
                >
                  {/* Image */}
                  <Link href={`/product/${p.id}`} className="relative w-20 h-24 rounded-xl overflow-hidden bg-[var(--border)] flex-shrink-0">
                    <Image src={p.image} alt={p.title} fill className="object-cover" unoptimized />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider mb-0.5">{p.category}</p>
                    <Link href={`/product/${p.id}`}>
                      <h3 className="text-sm font-semibold line-clamp-2 leading-snug hover:text-[var(--accent)] transition-colors">{p.title}</h3>
                    </Link>
                    <p className="text-base font-black mt-1">{p.price.toLocaleString("ru")} so'm</p>
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => {
                          if (!isInCart(String(p.id))) {
                            addItem({ id: String(p.id), productId: String(p.id), title: p.title, price: p.price, image: p.image });
                          }
                        }}
                        className={`flex-1 h-10 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                          isInCart(String(p.id))
                            ? "bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30"
                            : "bg-[var(--foreground)] text-[var(--background)] hover:bg-[var(--accent)] hover:text-white"
                        }`}
                      >
                        {isInCart(String(p.id)) ? <><Check className="w-3 h-3" /> Savatda</> : <><ShoppingBag className="w-3 h-3" /> Savatga</>}
                      </button>
                      <button
                        onClick={() => toggleItem(String(p.id))}
                        className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500/20 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
