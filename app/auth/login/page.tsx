"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, ChevronRight, Star, Quote, Home, Info, UserCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { googleLoginEndpoint, telegramWebLoginEndpoint, telegramMiniAppLoginEndpoint } from "@/app/actions/auth";
import { getProducts, type ProductSummary } from "@/app/actions/products";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("from") || "/";
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [tgUser, setTgUser] = useState<any>(null);
  const [tgLoaded, setTgLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<"telegram" | "google">("telegram");

  const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "GOOGLE_ID_KIRITILMAGAN";
  const BOT_USERNAME = "samira_style_bot";

  const MOCK_COMMENTS = [
    { id: 1, name: "Aziza M.", rating: 5, date: "Kecha", text: "Materiali ajoyib, roppa-rosa buyurtma berganimdek keng tushdi va rangi o'chmas ekan! 😍", avatar: "/placeholder-avatar.jpg" },
    { id: 2, name: "Doniyor T.", rating: 5, date: "3 kun oldin", text: "Tezkor yetkazib berish va do'stona xizmat. Narxlar juda hamyonbop.", avatar: null },
    { id: 3, name: "Jasur Q.", rating: 4, date: "1 hafta oldin", text: "Sifati premium darajada yomon emas. 1 kunda yetib keldi. Rahmat!", avatar: null },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    getProducts().then(res => {
      if (res.success) setProducts(res.data);
    });

    if (typeof window !== "undefined" && (window as any).Telegram?.WebApp) {
      const webApp = (window as any).Telegram.WebApp;
      webApp.ready();
      webApp.expand();
      if (webApp.initDataUnsafe?.user) {
        setTgUser(webApp.initDataUnsafe.user);
        setActiveTab("telegram");
      }
      setTgLoaded(true);
    } else {
      setTgLoaded(true);
      setActiveTab("telegram");
    }
  }, []);

  const handleTelegramLogin = async () => {
    if (!tgUser) return;
    setIsLoading(true);
    
    try {
      const initData = (window as any).Telegram?.WebApp?.initData;
      if (!initData) {
        localStorage.setItem("tg_user", JSON.stringify(tgUser));
        router.push(redirectTo);
        return;
      }
      
      const res = await telegramMiniAppLoginEndpoint(initData);
      if (res.success) {
        localStorage.setItem("tg_user", JSON.stringify(tgUser));
        router.push(redirectTo);
      } else {
        setError((res as any).error || "Xatolik yuz berdi");
        setIsLoading(false);
      }
    } catch (e) {
      setError("Tarmoq xatosi");
      setIsLoading(false);
    }
  };

  const handleWebTelegramLogin = async (userAuthData: any) => {
    setIsLoading(true);
    try {
      const res = await telegramWebLoginEndpoint(userAuthData);
      if (res.success) {
        localStorage.setItem("tg_user", JSON.stringify((res as any).user));
        router.push(redirectTo);
      } else {
        setError((res as any).error || "Xatolik yuz berdi");
        setIsLoading(false);
      }
    } catch (e) {
      setError("Tarmoq xatosi");
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    try {
      const res = await googleLoginEndpoint(credentialResponse.credential);
      if (res.success) {
        router.push(redirectTo);
      } else {
        setError((res as any).error || "Google orqali kirishda xato");
        setIsLoading(false);
      }
    } catch (err) {
      setError("Tarmoq xatosi");
      setIsLoading(false);
    }
  };

  // Telegram Widget effect
  useEffect(() => {
    if (activeTab !== "telegram" || tgUser) return;
    const container = document.getElementById("telegram-widget-container");
    if (container && container.childNodes.length === 0) {
      (window as any).onTelegramAuth = handleWebTelegramLogin;
      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-widget.js?22";
      script.setAttribute("data-telegram-login", BOT_USERNAME);
      script.setAttribute("data-size", "large");
      script.setAttribute("data-onauth", "onTelegramAuth(user)");
      script.setAttribute("data-request-access", "write");
      script.async = true;
      container.appendChild(script);
    }
  }, [activeTab, tgUser]);

  return (
    <div className="min-h-screen bg-[#F2F2F7] pb-[90px] font-sans overflow-x-hidden">
      {/* ── iOS Style Header ── */}
      <header className="sticky top-0 w-full z-40 bg-[#F2F2F7]/80 backdrop-blur-xl border-b border-gray-200/50">
        <div className="flex items-center justify-between px-4 h-11">
          <span className="text-lg font-bold tracking-tight text-black">
            Samira style
          </span>
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
            <UserCircle className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </header>

      <main className="w-full max-w-[600px] mx-auto flex flex-col items-center">
        
        {/* Banner Section - iOS App Store Style Featured Card */}
        <div className="w-full px-4 mt-6 mb-6">
          <div className="relative w-full aspect-[4/5] sm:aspect-video rounded-[32px] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.12)] bg-black">
            <Image 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800" 
              alt="Banner" 
              fill 
              className="object-cover opacity-80"
              priority
            />
            {/* Gradient Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 flex flex-col justify-end">
              <span className="text-white/80 font-semibold text-xs tracking-wider uppercase mb-1 drop-shadow-md">
                Kolleksiya
              </span>
              <h1 className="text-3xl font-bold text-white leading-tight mb-2 drop-shadow-md">
                O'zbekistondagi eng zamonaviy do'kon
              </h1>
              <p className="text-white/90 text-sm font-medium drop-shadow">
                Barcha ehtiyojlaringiz uchun premium dizayn. Pastki qismda ro'yxatdan o'ting!
              </p>
            </div>
          </div>
        </div>

        {/* ── Authentication Block ── */}
        <div id="auth" className="w-full px-4 mb-10 scroll-mt-16 animate-slide-up">
          <div className="bg-white rounded-[32px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100">
            <h2 className="text-2xl font-bold text-black mb-1">Xush kelibsiz!</h2>
            <p className="text-[#3C3C43] text-[15px] font-medium mb-6">Xaridlarni boshlash uchun tizimga kiring.</p>

            {/* Tab Switcher */}
            <div className="flex bg-[#F2F2F7] rounded-2xl p-1 mb-6">
              <button
                onClick={() => setActiveTab("telegram")}
                className={`flex-1 py-2.5 rounded-[12px] text-sm font-bold transition-all duration-200 ${
                  activeTab === "telegram"
                    ? "bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)] text-black"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                Telegram
              </button>
              <button
                onClick={() => setActiveTab("google")}
                className={`flex-1 py-2.5 rounded-[12px] text-sm font-bold transition-all duration-200 ${
                  activeTab === "google"
                    ? "bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)] text-black"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                Google (Email)
              </button>
            </div>

            {error && (
               <div className="p-3 mb-4 rounded-xl bg-red-100 text-red-600 text-[13px] font-semibold text-center border border-red-200">
                 {error}
               </div>
            )}

            {/* Telegram Login */}
            {activeTab === "telegram" && (
              <div className="space-y-4">
                {tgUser ? (
                  <div className="p-4 rounded-[20px] bg-[#007AFF]/10 border border-[#007AFF]/20 text-center">
                    <div className="w-14 h-14 rounded-full bg-[#007AFF]/20 text-[#007AFF] flex items-center justify-center font-bold text-2xl mx-auto mb-3">
                      {tgUser.first_name?.charAt(0) || "T"}
                    </div>
                    <p className="font-bold text-base text-black">{tgUser.first_name} {tgUser.last_name}</p>
                    {tgUser.username && (
                      <p className="text-gray-500 text-sm mt-0.5">@{tgUser.username}</p>
                    )}
                    <div className="flex items-center justify-center gap-1.5 mt-2 text-green-600 text-[13px] font-semibold mb-4">
                      <ShieldCheck className="w-4 h-4" />
                      Telegram orqali tasdiqlandi
                    </div>
                    <button
                      onClick={handleTelegramLogin}
                      disabled={isLoading}
                      className="w-full h-12 bg-[#007AFF] hover:bg-[#005bb5] active:scale-[0.98] text-white rounded-2xl font-bold flex items-center justify-center transition-all disabled:opacity-50"
                    >
                      {isLoading ? "Kuting..." : "Davom etish"}
                    </button>
                  </div>
                ) : (
                  <div className="p-4 rounded-[20px] bg-gray-50 border border-gray-100 text-center">
                    <div className="w-12 h-12 rounded-full bg-[#007AFF]/10 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-[#007AFF]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.12 14.09l-2.96-.924c-.643-.203-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.828.469z"/>
                      </svg>
                    </div>
                    <p className="text-[14px] font-semibold text-black">
                      Telegram Mini App'ni oching
                    </p>
                    <p className="text-[12px] text-gray-500 mt-1">
                      Avtomatik kirish uchun Mini App orqali kirish kerak
                    </p>
                  </div>
                )}

                {/* Telegram Web Widget xuddi shu joyda paydo bo'ladi agar tgUser bo'lmasa */}
                {!tgUser && (
                  <div className="mt-4 flex flex-col items-center justify-center fade-in">
                    <p className="text-[13px] font-medium text-gray-600 mb-3">Yoki Veb brauzer orqali kiring:</p>
                    {isLoading && <p className="text-[12px] text-gray-400 mb-2 animate-pulse">Kutilmoqda...</p>}
                    <div id="telegram-widget-container" className="flex justify-center min-h-[40px]"></div>
                  </div>
                )}
                
              </div>
            )}

            {/* Google Login */}
            {activeTab === "google" && (
              <div className="space-y-4 flex flex-col items-center py-2">
                <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center p-3 mb-2 border border-gray-100">
                   <svg viewBox="0 0 48 48" className="w-full h-full"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
                </div>
                <p className="text-[13px] font-medium text-gray-500 text-center mb-4 px-4">
                  Google akkauntingiz orqali bir marta bosish yo'li bilan xavfsiz kiring.
                </p>
                
                <div className="w-full flex justify-center min-h-[50px]">
                  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => {
                        setError("Google orqali kirish bekor qilindi yoki xato.");
                      }}
                      useOneTap
                      theme="filled_black"
                      shape="pill"
                    />
                  </GoogleOAuthProvider>
                </div>
              </div>
            )}
            
            <div className="mt-5 pt-5 border-t border-gray-100 text-center">
              <p className="text-[11px] text-gray-400">
                Kirish orqali siz bizning shartlarimizga rozilik bildirasiz.
              </p>
            </div>
          </div>
        </div>

        {/* Products Horizontal Scroll - App Store "More to explore" style */}
        <div className="w-full mb-10 overflow-hidden">
          <div className="px-4 mb-3 flex items-end justify-between">
            <h2 className="text-[22px] font-bold text-black tracking-tight">Tavsiya etiladiganlar</h2>
          </div>
          
          <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 gap-4 pb-4">
            {products.slice(0, 5).map((p) => (
              <div 
                key={p.id} 
                className="snap-start shrink-0 w-[140px] sm:w-[160px]"
                onClick={() => document.getElementById("auth")?.scrollIntoView({ behavior: "smooth" })}
              >
                <div className="relative w-full aspect-[4/5] rounded-[20px] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden mb-2">
                   <Image 
                     src={p.image || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80"} 
                     alt={p.title} 
                     fill 
                     className="object-cover" 
                   />
                </div>
                <div className="px-1">
                  <h3 className="font-semibold text-[13px] text-black leading-tight line-clamp-1 mb-1">
                    {p.title}
                  </h3>
                  <p className="text-[#007AFF] font-bold text-[13px]">
                    {p.price.toLocaleString("ru")} so'm
                  </p>
                </div>
              </div>
            ))}
            
            {/* View More Card */}
            <div 
              className="snap-start shrink-0 w-[140px] sm:w-[160px] flex items-center justify-center rounded-[20px] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] text-center p-4 cursor-pointer"
              onClick={() => document.getElementById("auth")?.scrollIntoView({ behavior: "smooth" })}
            >
              <div className="flex flex-col items-center text-[#007AFF]">
                <div className="w-10 h-10 rounded-full bg-[#007AFF]/10 flex items-center justify-center mb-2">
                   <ChevronRight className="w-5 h-5" />
                </div>
                <span className="font-semibold text-[13px]">Kirish shart</span>
              </div>
            </div>
          </div>
        </div>

        {/* Comment/Testimonial Section - iOS Message/Review Style */}
        <div id="about" className="w-full px-4 mb-6 scroll-mt-16">
          <h2 className="text-[22px] font-bold text-black tracking-tight mb-4">Mijozlar fikri</h2>
          <div className="space-y-4">
            {MOCK_COMMENTS.map((comment) => (
              <div key={comment.id} className="bg-white rounded-[20px] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < comment.rating ? "fill-current" : "text-gray-300"}`} />
                    ))}
                  </div>
                  <span className="text-gray-400 text-[13px] font-medium">{comment.date}</span>
                </div>
                <h3 className="font-semibold text-[15px] text-black mb-1.5">{comment.name}</h3>
                <p className="text-[#3C3C43] text-[15px] leading-relaxed relative">
                  <Quote className="w-4 h-4 absolute text-gray-200 -left-1 -top-1 opacity-50" />
                  <span className="pl-4">{comment.text}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* ── iOS Tab Bar Bottom Nav ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#F2F2F7]/90 backdrop-blur-2xl border-t border-[rgba(0,0,0,0.1)] pb-safe-area shadow-[0_-1px_10px_rgba(0,0,0,0.02)]">
        <div className="flex flex-row justify-around items-center h-[60px] pb-1 max-w-[600px] mx-auto">
          
          <button 
             onClick={() => document.getElementById("auth")?.scrollIntoView({ behavior: "smooth" })}
             className="flex flex-col items-center justify-center w-20 pt-1 group pointer-events-none"
          >
            <Home className="w-6 h-6 mb-0.5 text-[#007AFF] fill-[#007AFF]/20 stroke-2" />
            <span className="text-[10px] font-medium text-[#007AFF]">Tizim</span>
          </button>

          <button 
             onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
             className="flex flex-col items-center justify-center w-20 pt-1 group active:opacity-50 transition-opacity"
          >
            <Info className="w-6 h-6 mb-0.5 text-[#999999] stroke-2" />
            <span className="text-[10px] font-medium text-[#999999]">Biz haqimizda</span>
          </button>

          <button 
            onClick={() => document.getElementById("auth")?.scrollIntoView({ behavior: "smooth" })}
            className="flex flex-col items-center justify-center w-20 pt-1 group active:opacity-50 transition-opacity"
          >
            <UserCircle className="w-6 h-6 mb-0.5 text-[#999999] stroke-2" />
            <span className="text-[10px] font-medium text-[#999999]">Kirish</span>
          </button>

        </div>
        {/* iOS Home Indicator mock area */}
        <div className="h-[20px] flex items-end justify-center pb-2">
           <div className="w-[134px] h-[5px] bg-black/40 rounded-full"></div>
        </div>
      </nav>
      
      <style jsx global>{`
        .pb-safe-area {
           padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F2F2F7] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#007AFF]/30 border-t-[#007AFF] animate-spin"></div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}
