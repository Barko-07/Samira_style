"use client";

import { Header } from "@/components/ui/Header";
import { Search, Zap, Sparkles, Check, Heart, ChevronRight, TrendingUp, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { getCategories } from "@/app/actions/categories";
import { getProducts } from "@/app/actions/products";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { addItem, items } = useCartStore();
  const { toggleItem, isFavorite } = useWishlistStore();

  const [activeCategory, setActiveCategory] = useState("Barchasi");
  const [categories, setCategories] = useState<string[]>(["Barchasi", "Yangi Kelganlar"]);
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [bannerIdx, setBannerIdx] = useState(0);

  const banners = [
    { tag: "Yangi Mavsum", title: "Kuzgi Kolleksiya", highlight: "50% gacha chegirma", sub: "Samira Style bilan trenddagi kiyimlarni ajoyib narxlarda xarid qiling.", btn: "Xaridni boshlash", color: "from-slate-900 to-slate-800" },
    { tag: "Top Sotuv", title: "Ayollar Kolleksiyasi", highlight: "Premium Sifat", sub: "Har bir kuni nafis ko'rinish uchun maxsus tanlangan kiyimlar.", btn: "Ko'rish", color: "from-rose-900 to-rose-800" },
    { tag: "Chegirma", title: "Poyabzal Haftaligi", highlight: "30% Arzonroq", sub: "Premium sport va klassik poyabzallar maxsus narxlarda.", btn: "Katalog", color: "from-indigo-900 to-blue-900" },
  ];

  useEffect(() => {
    const interval = setInterval(() => setBannerIdx((i) => (i + 1) % banners.length), 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function loadCats() {
      const res = await getCategories();
      if (res.success && res.data) {
        const activeCats = res.data.filter((c: any) => c.isActive).map((c: any) => c.name);
        setCategories(["Barchasi", "Yangi Kelganlar", ...activeCats]);
      }
    }
    loadCats();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      const res = await getProducts(searchQuery);
      if (res.success && res.data) setProducts(res.data);
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const filteredProducts =
    activeCategory === "Barchasi" || activeCategory === "Yangi Kelganlar"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const currentBanner = banners[bannerIdx];

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <Header />

      <main className="mx-auto w-full max-w-6xl pb-28 sm:pb-10">

        {/* ── Qidiruv ── */}
        <div className="relative px-4 sm:px-6 pt-4 pb-2">
          <Search className="absolute left-8 sm:left-10 top-1/2 w-4.5 h-4.5 text-[var(--muted)] pointer-events-none" style={{ top: "calc(50% + 8px)", width: "18px", height: "18px" }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Kiyim, poyabzal, aksessuar..."
            className="w-full h-12 rounded-2xl border border-[var(--border)] bg-[var(--card)] pl-11 pr-4 text-sm font-medium placeholder:text-[var(--muted)]/60 focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/12 transition-all shadow-[var(--shadow-sm)]"
          />
        </div>

        {/* ── Kategoriyalar ── */}
        <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-2 pt-3 px-4 sm:px-6">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                activeCategory === cat
                  ? "bg-[var(--accent)] text-white shadow-[var(--shadow-accent)]"
                  : "bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--accent)]/50 hover:text-[var(--accent)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Hero Banner ── */}
        {!searchQuery && (
          <div className="px-4 sm:px-6 mt-4 mb-6">
            <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${currentBanner.color} text-white p-7 sm:p-10 min-h-[200px] flex items-center transition-all`}>
              {/* Decor circles */}
              <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-white opacity-[0.04] blur-2xl" />
              <div className="absolute right-8 bottom-0 w-32 h-32 rounded-full bg-[var(--accent)] opacity-20 blur-3xl" />
              <div className="absolute -left-8 -bottom-8 w-40 h-40 rounded-full bg-white opacity-[0.03] blur-2xl" />

              <div className="relative z-10 max-w-sm">
                <div className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest mb-4">
                  <Zap className="w-3 h-3" /> {currentBanner.tag}
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2 leading-tight">
                  {currentBanner.title} <br />
                  <span className="text-[var(--accent)]">{currentBanner.highlight}</span>
                </h1>
                <p className="text-white/60 text-sm mb-5 leading-relaxed">{currentBanner.sub}</p>
                <button
                  onClick={() => document.getElementById("products-grid")?.scrollIntoView({ behavior: "smooth" })}
                  className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-white text-black font-extrabold text-sm hover:scale-105 transition-transform"
                >
                  {currentBanner.btn} <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Banner indicator */}
              <div className="absolute bottom-4 right-4 flex gap-1.5">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setBannerIdx(i)}
                    className={`h-1.5 rounded-full transition-all ${i === bannerIdx ? "w-6 bg-white" : "w-1.5 bg-white/40"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Stats Strip ── */}
        {!searchQuery && (
          <div className="flex gap-3 px-4 sm:px-6 mb-6 overflow-x-auto scrollbar-hide">
            {[
              { icon: <TrendingUp className="w-4 h-4" />, label: "10,000+ mahsulot", color: "text-[var(--accent)]" },
              { icon: <Star className="w-4 h-4" />, label: "4.9 reyting", color: "text-yellow-500" },
              { icon: <Sparkles className="w-4 h-4" />, label: "Bepul yetkazib berish", color: "text-green-500" },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[var(--card)] border border-[var(--border)] whitespace-nowrap flex-shrink-0">
                <span className={s.color}>{s.icon}</span>
                <span className="text-xs font-bold">{s.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── Mahsulotlar sarlavhasi ── */}
        <div id="products-grid" className="flex items-center justify-between mb-4 scroll-mt-24 px-4 sm:px-6">
          <h2 className="text-lg font-extrabold flex items-center gap-2">
            {searchQuery
              ? <><Search className="w-5 h-5 text-[var(--accent)]" /> "{searchQuery}" natijalari</>
              : "Barcha mahsulotlar"
            }
          </h2>
          <span className="text-sm font-semibold text-[var(--muted)]">{filteredProducts.length} ta</span>
        </div>

        {/* ── Skeleton Loading ── */}
        {isLoading && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4 px-4 sm:px-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-[var(--border)]">
                <div className="skeleton aspect-[3/4] w-full" />
                <div className="p-3 space-y-2">
                  <div className="skeleton h-3 w-14 rounded" />
                  <div className="skeleton h-4 w-full rounded" />
                  <div className="skeleton h-4 w-2/3 rounded" />
                  <div className="skeleton h-8 w-full rounded-xl mt-2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Products Grid ── */}
        {!isLoading && (
          <motion.div
            layout
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4 min-h-[300px] items-start px-4 sm:px-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="col-span-full py-16 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center mx-auto mb-4">
                    <Search className="w-7 h-7 text-[var(--muted)]" />
                  </div>
                  <p className="font-bold text-[var(--foreground)] mb-1">Hech narsa topilmadi</p>
                  <p className="text-sm text-[var(--muted)]">Boshqa so'z bilan qidiring</p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-4 h-10 px-6 rounded-full bg-[var(--accent)] text-white font-bold text-sm hover:bg-[var(--accent-dark)] transition-colors"
                  >
                    Barchasini ko'rish
                  </button>
                </motion.div>
              )}

              {filteredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  p={p}
                  items={items}
                  addItem={addItem}
                  toggleItem={toggleItem}
                  isFavorite={isFavorite}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
    </div>
  );
}

// ─── Product Card ──────────────────────────────────────────────────────────────
function ProductCard({ p, items, addItem, toggleItem, isFavorite }: any) {
  const inCart = items.some((item: any) => (item.productId || item.id) === String(p.id));
  const fav = isFavorite(String(p.id));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="group flex flex-col bg-[var(--card)] rounded-2xl overflow-hidden border border-[var(--border)]/60 hover:shadow-[var(--shadow-md)] hover:border-[var(--accent)]/20 transition-all duration-300 relative"
    >
      <Link href={`/product/${p.id}`} className="flex flex-col flex-grow">
        {/* Image */}
        <div className="relative aspect-[3/4] w-full bg-[var(--border)] overflow-hidden">
          <Image
            src={p.image}
            alt={p.title}
            fill
            sizes="(max-width: 640px) 50vw, 33vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
          {/* New badge */}
          {p.id === "mock-1" && (
            <div className="absolute top-2 left-2 badge badge-accent">Yangi</div>
          )}
        </div>

        {/* Info */}
        <div className="p-3 flex flex-col flex-grow">
          <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider mb-1">{p.category}</p>
          <h3 className="text-xs sm:text-sm font-semibold leading-snug line-clamp-2 mb-2 text-[var(--foreground)]">{p.title}</h3>
          <div className="mt-auto">
            <p className="text-sm font-black text-[var(--foreground)]">
              {p.price.toLocaleString("ru")} so'm
            </p>
          </div>
        </div>
      </Link>

      {/* Wishlist button */}
      <button
        onClick={(e) => { e.preventDefault(); toggleItem(String(p.id)); }}
        className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-sm transition-all hover:scale-110 z-10"
        style={{ opacity: 1 }}
      >
        <Heart className={`w-4 h-4 transition-colors ${fav ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
      </button>

      {/* Add to cart */}
      <div className="px-3 pb-3">
        <button
          onClick={(e) => {
            e.preventDefault();
            if (!inCart) addItem({ id: String(p.id), productId: String(p.id), title: p.title, price: p.price, image: p.image });
          }}
          className={`w-full h-9 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
            inCart
              ? "bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30"
              : "bg-[var(--foreground)] text-[var(--background)] hover:bg-[var(--accent)] hover:text-white"
          }`}
        >
          {inCart ? <><Check className="w-3.5 h-3.5" /> Savatda</> : "Savatga"}
        </button>
      </div>
    </motion.div>
  );
}
