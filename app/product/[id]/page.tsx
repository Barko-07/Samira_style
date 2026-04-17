"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProductById } from "@/app/actions/products";
import { Header } from "@/components/ui/Header";
import { ChevronLeft, Star, ShoppingCart, Heart, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const { addItem, items, setIsCartOpen } = useCartStore();
  const { isFavorite, toggleItem } = useWishlistStore();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await getProductById(String(id));
      if (res.success && res.data) {
        setProduct(res.data);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-[var(--accent)] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)]">
        <h1 className="text-xl font-bold mb-4">Maxsulot topilmadi</h1>
        <button onClick={() => router.push('/')} className="text-[var(--accent)] underline font-bold">Ortga qaytish</button>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : [product.image];
  const variants = product.variants || [];
  const reviews = product.reviews || [];

  // Extract unique available options
  const uniqueSizes = Array.from(new Set(variants.map((v: any) => v.size))).filter(Boolean) as string[];
  const uniqueColors = Array.from(new Set(variants.map((v: any) => v.color))).filter(Boolean) as string[];

  // Get currently matched variant based on selections
  const activeVariant = variants.find((v: any) => 
    (!selectedSize || v.size === selectedSize) && 
    (!selectedColor || v.color === selectedColor)
  );

  const isSelectionComplete = Boolean((uniqueSizes.length === 0 || selectedSize) && (uniqueColors.length === 0 || selectedColor));
  const matchedVariantExact = variants.find((v: any) => v.size === selectedSize && v.color === selectedColor);
  
  // Checking stock: If no variants exist, assume in stock (for fallback items). 
  // If variants exist, require exact match stock.
  const currentStock = variants.length === 0 ? 100 : (matchedVariantExact ? matchedVariantExact.stock : 0);
  const outOfStock = Boolean(variants.length > 0 && isSelectionComplete && currentStock === 0);

  const handleAddToCart = () => {
    if (!isSelectionComplete || outOfStock) return;
    
    addItem({
      id: product.id,
      productId: product.id,
      title: product.title,
      price: product.price,
      image: images[0],
      variant: matchedVariantExact ? {
        id: matchedVariantExact.id,
        size: matchedVariantExact.size,
        color: matchedVariantExact.color
      } : undefined
    });

    setIsCartOpen(true);
  };

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : "0.0";

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)] pb-24">
      <Header />
      
      {/* Top Nav (Mobile mostly) */}
      <div className="sticky top-0 z-40 bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--border)] px-4 h-14 flex items-center justify-between sm:hidden">
        <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-[var(--card)]">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="font-bold text-sm truncate px-4">{product.title}</span>
        <button onClick={() => toggleItem(product.id)} className="p-2 -mr-2 rounded-full hover:bg-[var(--card)]">
          <Heart className={`w-6 h-6 transition-colors ${isFavorite(product.id) ? 'fill-red-500 text-red-500' : 'text-[var(--foreground)]'}`} />
        </button>
      </div>

      <main className="flex-grow max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:p-6 p-0 mb-10">
        
        {/* Left Column: Image Slider */}
        <div className="relative w-full bg-[var(--card)] sm:rounded-3xl overflow-hidden aspect-[4/5] object-center">
          <Image
            src={images[activeImageIdx]}
            alt={product.title}
            fill
            className="object-contain sm:object-cover"
            priority
            unoptimized
          />
          
          <button 
            onClick={() => toggleItem(product.id)}
            className="absolute top-4 right-4 w-10 h-10 hidden sm:flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-sm z-10 hover:scale-105 transition-transform"
          >
            <Heart className={`w-5 h-5 transition-colors ${isFavorite(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`} />
          </button>

          {images.length > 1 && (
            <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2 px-4 z-10">
              {images.map((_: any, idx: number) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImageIdx(idx)}
                  className={`h-2 rounded-full transition-all ${idx === activeImageIdx ? 'w-8 bg-[var(--accent)]' : 'w-2 bg-gray-300'}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details */}
        <div className="px-4 py-4 sm:px-0 sm:py-0 flex flex-col">
          
          <div className="mb-2 text-xs font-bold text-[var(--muted)] uppercase tracking-widest">
            {product.category}
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-3 leading-tight">
            {product.title}
          </h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1 text-sm font-bold bg-yellow-100/50 text-yellow-700 px-2 py-1 rounded-lg">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" /> 
              {avgRating} <span className="text-[var(--muted)] font-normal ml-1">({reviews.length} baho)</span>
            </div>
            {currentStock > 0 && currentStock <= 5 && (
              <div className="text-xs font-bold text-red-600 bg-red-100/50 px-2 py-1 rounded-lg">
                Shoshiling, {currentStock} dona qoldi!
              </div>
            )}
          </div>

          <div className="text-3xl sm:text-4xl font-black text-[var(--foreground)] mb-8">
            {product.price.toLocaleString('en-US').replace(/,/g, ' ')} so'm
          </div>

          {/* Variants Selection */}
          <div className="space-y-6 mb-8">
            {uniqueColors.length > 0 && (
              <div>
                 <h3 className="text-sm font-bold mb-3 flex justify-between">
                   Rang: <span className="text-[var(--muted)]">{selectedColor || "Tanlanmagan"}</span>
                 </h3>
                 <div className="flex flex-wrap gap-3">
                   {uniqueColors.map(color => {
                     // Check if this color is available with currently selected size
                     const isAvailable = variants.some((v:any) => v.color === color && (!selectedSize || v.size === selectedSize) && v.stock > 0);
                     
                     return (
                       <button
                         key={color}
                         onClick={() => setSelectedColor(color === selectedColor ? null : color)}
                         className={`px-4 py-2 rounded-xl border-2 font-semibold text-sm transition-all ${
                           selectedColor === color 
                            ? 'border-[var(--accent)] bg-[var(--accent)]/5 text-[var(--foreground)] ring-2 ring-[var(--accent)]/30' 
                            : isAvailable 
                              ? 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent)]/50 text-[var(--foreground)]' 
                              : 'border-dashed border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed opacity-60'
                         }`}
                       >
                         {color}
                       </button>
                     )
                   })}
                 </div>
              </div>
            )}

            {uniqueSizes.length > 0 && (
              <div>
                 <h3 className="text-sm font-bold mb-3 flex justify-between">
                   O'lcham (Razmer): <span className="text-[var(--muted)]">{selectedSize || "Tanlanmagan"}</span>
                 </h3>
                 <div className="flex flex-wrap gap-3">
                   {uniqueSizes.map(size => {
                     const isAvailable = variants.some((v:any) => v.size === size && (!selectedColor || v.color === selectedColor) && v.stock > 0);
                     
                     return (
                       <button
                         key={size}
                         onClick={() => setSelectedSize(size === selectedSize ? null : size)}
                         className={`w-12 h-12 flex items-center justify-center rounded-xl border-2 font-bold transition-all ${
                           selectedSize === size 
                            ? 'border-[var(--accent)] bg-[var(--accent)] text-white shadow-md shadow-[var(--accent)]/30' 
                            : isAvailable 
                              ? 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent)]/50 text-[var(--foreground)]' 
                              : 'border-dashed border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed opacity-60 relative overflow-hidden'
                         }`}
                       >
                         {size}
                         {!isAvailable && <div className="absolute inset-0 w-full h-[2px] bg-gray-300 top-1/2 -rotate-45" />}
                       </button>
                     )
                   })}
                 </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
             <div className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
               <ShieldCheck className="w-8 h-8 text-green-500" />
               <div className="text-xs font-semibold leading-tight text-[var(--muted)]">Haqiqiy original <br/> brend mahsulot</div>
             </div>
             <div className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
               <Truck className="w-8 h-8 text-blue-500" />
               <div className="text-xs font-semibold leading-tight text-[var(--muted)]">1 kunda yetkazib <br/> berish xizmati</div>
             </div>
          </div>

          {/* Tavsif (Description) */}
          <div className="mb-8">
            <h2 className="text-lg font-extrabold mb-3">Mahsulot haqida</h2>
            <div className={`relative text-[15px] leading-relaxed text-[var(--foreground)]/80 ${!showFullDesc && 'line-clamp-3'}`}>
              {product.description}
              {!showFullDesc && product.description.length > 150 && (
                <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[var(--background)] to-transparent" />
              )}
            </div>
            {product.description.length > 150 && (
              <button 
                onClick={() => setShowFullDesc(!showFullDesc)}
                className="text-[var(--accent)] text-sm font-bold mt-2 hover:underline focus:outline-none"
              >
                {showFullDesc ? "Qisqacha qilish" : "To'liq o'qish"}
              </button>
            )}
          </div>

          {/* Izohlar (Reviews) */}
          <div className="mb-10">
            <h2 className="text-lg font-extrabold mb-4 flex items-center gap-2">
              Xaridorlar fikrlari <span className="text-sm font-normal text-[var(--muted)]">({reviews.length})</span>
            </h2>
            
            {reviews.length === 0 ? (
              <div className="p-6 text-center rounded-2xl bg-[var(--card)] border border-[var(--border)] border-dashed">
                <p className="text-[var(--muted)] font-medium text-sm">Hali hech kim fikr qoldirmagan. Birinchi bo'ling!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((r: any) => (
                  <div key={r.id} className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)]/50">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-sm">{r.buyer?.name || "Yashirin foydalanuvchi"}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={`w-3.5 h-3.5 ${star <= r.rating ? 'fill-yellow-500 text-yellow-500' : 'fill-gray-200 text-gray-200'}`} />
                        ))}
                      </div>
                    </div>
                    {r.comment && <p className="text-sm text-[var(--foreground)]/80 mt-2">{r.comment}</p>}
                    <div className="text-[10px] text-[var(--muted)] mt-3">
                       {new Date(r.createdAt).toLocaleDateString("uz-UZ", { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Ruxsat etilgan "Savatga Qo'shish" yuzasi (Bottom Sheet) */}
      <div className="fixed bottom-0 left-0 w-full z-40 bg-[var(--background)]/90 backdrop-blur-xl border-t border-[var(--border)] px-4 py-3 sm:px-6 md:sticky md:bottom-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:block">
            <div className="text-sm font-bold text-[var(--muted)]">Jami:</div>
            <div className="text-2xl font-black text-[var(--foreground)]">
              {product.price.toLocaleString('en-US').replace(/,/g, ' ')} <span className="text-sm font-bold">so'm</span>
            </div>
          </div>
          
          <button 
            disabled={!isSelectionComplete || outOfStock}
            onClick={handleAddToCart}
            className={`flex-grow sm:flex-grow-0 sm:w-1/3 h-14 rounded-2xl font-extrabold text-lg flex items-center justify-center gap-2 transition-all ${
              !isSelectionComplete 
                ? 'bg-gray-200 text-gray-500 opacity-80 cursor-not-allowed'
                : outOfStock 
                  ? 'bg-red-100 text-red-500 cursor-not-allowed' 
                  : 'bg-[var(--accent)] text-white hover:scale-[1.02] shadow-xl shadow-[var(--accent)]/20 shadow-lg'
            }`}
          >
            {!isSelectionComplete 
              ? "Razmer tanlang" 
              : outOfStock 
                ? "Sotuvda qolmagan" 
                : <><ShoppingCart className="w-5 h-5" /> Savatga qo'shish</>
            }
          </button>
        </div>
      </div>

    </div>
  );
}
