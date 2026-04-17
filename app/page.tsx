"use client";

import { Header } from "@/components/ui/Header";
import { Search, Flashlight, Sparkles, Check, Heart } from "lucide-react";
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
    // Debounce search requests
    const timeoutId = setTimeout(() => {
      async function loadProducts() {
        const res = await getProducts(searchQuery);
        if (res.success && res.data) setProducts(res.data);
      }
      loadProducts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const filteredProducts = activeCategory === "Barchasi" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)] transition-colors duration-300">
      <Header />

      <main className="mx-auto w-full max-w-6xl pb-20 pt-2 sm:pt-6">
        


        {/* Qidiruv Qismi (Mobile First Search) */}
        <div className="relative mb-8 px-4 sm:px-6">
          <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[var(--muted)]" />
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Kiyimlar, poyabzallar va aksessuarlar..." 
            className="w-full h-14 pl-12 pr-4 rounded-2xl border-none bg-[var(--card)] shadow-sm focus:ring-2 focus:ring-[var(--accent)] text-lg placeholder:text-[var(--muted)]/70 transition-all font-medium"
          />
        </div>

        {/* Kategoriyalar karuseli */}
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 mb-8 px-4 sm:px-6">
          {categories.map((cat, idx) => (
            <button 
              key={idx}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-xl font-bold text-sm transition-colors ${activeCategory === cat ? 'bg-[var(--accent)] text-white shadow-md shadow-[var(--accent)]/30' : 'bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--accent)]/50'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Asosiy Banner (Hero) */}
        <div className="relative overflow-hidden rounded-3xl bg-[var(--foreground)] text-[var(--background)] p-6 sm:p-10 mb-10 w-full flex items-center mx-4 sm:mx-6 w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)]">
          <div className="relative z-10 w-full sm:w-2/3">
            <div className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent)] px-2.5 py-1 text-xs font-bold uppercase text-white shadow-sm mb-4">
              <Flashlight className="w-3 h-3" /> Yangi Mavsum
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight text-white">
              Kuzgi Kolleksiya <br className="hidden sm:block"/> <span className="text-[var(--accent)]">50% gacha foyda</span>
            </h1>
            <p className="text-[var(--muted)] mb-6 max-w-sm font-medium text-sm sm:text-base">
              Samira Style bilan eng so'nggi trenddagi kiyimlarni ajoyib narxlarda xarid qiling.
            </p>
            <button 
              onClick={() => document.getElementById('all-products-grid')?.scrollIntoView({ behavior: 'smooth' })}
              className="h-12 px-8 rounded-full bg-white text-black font-extrabold hover:scale-105 transition-transform"
            >
              Xaridni boshlash
            </button>
          </div>
          {/* Banner dekori (Faqat rang gradienti) */}
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-[var(--accent)] opacity-20 blur-[80px]"></div>
          <div className="absolute right-10 bottom-0 w-32 h-32 rounded-full bg-orange-400 opacity-20 blur-[50px]"></div>
        </div>

        {/* Mahsulotlar (Asosiy Grid) */}
        <div id="all-products-grid" className="flex items-center justify-between mb-5 scroll-mt-24 px-4 sm:px-6" suppressHydrationWarning>
          <h2 className="text-xl font-extrabold flex items-center gap-2">
            {searchQuery ? "Qidiruv natijalari" : "Barcha tovarlar"}
          </h2>
          <button 
            suppressHydrationWarning
            onClick={() => { setActiveCategory("Barchasi"); setSearchQuery(""); }} 
            className="text-sm font-bold text-[var(--accent)] hover:underline"
          >
            Barchasi
          </button>
        </div>

        <motion.div layout className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6 min-h-[400px] items-start px-4 sm:px-6">
          <AnimatePresence mode="popLayout">
            {filteredProducts.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="col-span-full py-10 text-center text-[var(--muted)] font-medium"
              >
                Kechirasiz, bunday maxsulot topilmadi.
              </motion.div>
            )}
            
            {filteredProducts.map((p) => (
               <ProductCard key={p.id} p={p} items={items} addItem={addItem} toggleItem={toggleItem} isFavorite={isFavorite} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Telegram App pastki bo'shligi */}
        <div className="h-16 w-full"></div>
      </main>

    </div>
  );
}

// Local Product Card Component to reuse in Sliders and Grids
function ProductCard({ p, items, addItem, toggleItem, isFavorite }: any) {
  // DB id may be in item.productId for complex carts, or fallback to item.id 
  const inCart = items.some((item: any) => (item.productId || item.id) === String(p.id));
  const fav = isFavorite(String(p.id));
              
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.25 }}
      className="group flex flex-col bg-[var(--card)] rounded-2xl overflow-hidden border border-[var(--border)]/50 hover:shadow-xl transition-shadow duration-300 h-full w-full"
    >
      <Link href={`/product/${p.id}`} className="flex flex-col flex-grow relative block">
        {/* Rasm qismi */}
        <div className="relative aspect-[3/4] w-full bg-[#f1f5f9] overflow-hidden block">
          <Image
            src={p.image}
            alt={p.title}
            fill
            sizes="(max-width: 640px) 50vw, 33vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
        </div>
        
        {/* Ma'lumot qismi */}
        <div className="p-3 flex flex-col flex-grow">
          <div className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider mb-1">{p.category}</div>
          <h3 className="text-[13px] font-semibold leading-tight mb-2 line-clamp-2 text-[var(--foreground)]">{p.title}</h3>
          
          <div className="mt-auto pt-2">
            <div className="text-sm font-bold text-[var(--foreground)]">
              {p.price.toLocaleString('en-US').replace(/,/g, ' ')} so'm
            </div>
          </div>
        </div>
      </Link>

      {/* Interactable Buttons (Absolutely positioned or injected properly) */}
      <button 
        onClick={(e) => { e.preventDefault(); toggleItem(String(p.id)); }}
        className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-sm md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
      >
        <Heart className={`w-5 h-5 transition-colors ${fav ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`} />
      </button>

      <div className="px-3 pb-3">
        <button 
          onClick={(e) => { 
            e.preventDefault(); 
            if (!inCart) addItem({ id: String(p.id), productId: String(p.id), title: p.title, price: p.price, image: p.image }); 
          }}
          className={`w-full h-10 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 ${
            inCart 
              ? 'bg-[var(--accent)]/10 text-[var(--accent)]' 
              : 'bg-[var(--foreground)] text-[var(--background)] hover:bg-[var(--accent)] hover:text-white'
          }`}
        >
          {inCart ? (
            <><Check className="w-4 h-4" /> Savatda</>
          ) : (
            "Savatga"
          )}
        </button>
      </div>

    </motion.div>
  );
}
