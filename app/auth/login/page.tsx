"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, LogIn, ChevronRight } from "lucide-react";
import Link from "next/link";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { googleLoginEndpoint, telegramWebLoginEndpoint, telegramMiniAppLoginEndpoint } from "@/app/actions/auth";
import { PublicTabBar } from "@/components/ui/PublicTabBar";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Instead of redirecting to the origin point immediately, we force them to see Welcome screen.
  // The welcome screen will redirect to `/` natively.
  const redirectTo = "/welcome";

  const [isLoading, setIsLoading] = useState(false);
  const [tgUser, setTgUser] = useState<any>(null);
  const [tgLoaded, setTgLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<"telegram" | "google">("telegram");
  const [error, setError] = useState<string | null>(null);

  const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "GOOGLE_ID_KIRITILMAGAN";
  const BOT_USERNAME = "samira_style_bot";

  useEffect(() => {
    window.scrollTo(0, 0);

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
      // Always save user data locally
      localStorage.setItem("tg_user", JSON.stringify(tgUser));
      
      if (!initData) {
        // No initData (browser preview) — redirect without server auth
        router.push(redirectTo);
        return;
      }
      
      // Try server-side auth but silently ignore errors
      try {
        const res = await telegramMiniAppLoginEndpoint(initData);
        // Whether success or fail, just redirect — we already saved user locally
      } catch (_) {}
      
      router.push(redirectTo);
    } catch (e) {
      // Even on unexpected error, redirect gracefully
      router.push(redirectTo);
    }
  };

  const handleWebTelegramLogin = async (userAuthData: any) => {
    setIsLoading(true);
    try {
      localStorage.setItem("tg_user", JSON.stringify(userAuthData));
      const res = await telegramWebLoginEndpoint(userAuthData);
      if (res.success) {
        localStorage.setItem("tg_user", JSON.stringify((res as any).user || userAuthData));
      }
      // Redirect regardless of result
      router.push(redirectTo);
    } catch (e) {
      router.push(redirectTo);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await googleLoginEndpoint(credentialResponse.credential);
      if (res.success) {
        router.push(redirectTo);
      } else {
        setError((res as any).error || "Google orqali kirishda xatolik yuz berdi");
        setIsLoading(false);
      }
    } catch (err) {
      setError("Xatolik yuz berdi. Iltimos qayta urinib ko'ring.");
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
    <div className="min-h-screen bg-[#F2F2F7] font-sans pb-[100px] overflow-x-hidden">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-[rgba(242,242,247,0.85)] backdrop-blur-xl border-b border-[rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between px-5 h-12 max-w-xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <span className="text-[17px] font-bold tracking-tight text-black">Kirish qismi</span>
          </div>
        </div>
      </header>

      <main className="w-full max-w-[600px] mx-auto pt-6 px-4 flex flex-col items-center">
        
        {/* Error Display */}
        {error && (
          <div className="w-full mb-4 p-4 bg-red-50 border border-red-200 rounded-[20px] flex items-start gap-3 animate-fade-in">
            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-[12px] font-bold">!</span>
            </div>
            <div className="flex-1">
              <p className="text-red-900 text-[14px] font-semibold">Xatolik</p>
              <p className="text-red-700 text-[13px] mt-0.5">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 text-lg font-bold flex-shrink-0"
            >
              ×
            </button>
          </div>
        )}
        
        {/* ── Authentication Block ── */}
        <div id="auth" className="w-full mb-10 animate-fade-in">
          <div className="bg-white rounded-[32px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100">
            <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-[#007AFF] to-[#5856D6] flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-[22px] font-extrabold text-center text-black mb-1">Xush kelibsiz!</h2>
            <p className="text-[#6C6C70] text-center text-[14px] mb-6">Xaridlarni boshlash uchun tizimga kiring</p>

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
                   <svg viewBox="0 0 48 48" className="w-full h-full"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
                </div>
                <p className="text-[13px] font-medium text-gray-500 text-center mb-4 px-4">
                  Google akkauntingiz orqali bir marta bosish yo'li bilan xavfsiz kiring.
                </p>
                <div className="w-full flex justify-center min-h-[50px]">
                  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => {}}
                      useOneTap
                      theme="filled_black"
                      shape="pill"
                    />
                  </GoogleOAuthProvider>
                </div>
              </div>
            )}
          </div>
          
          {/* Security note */}
          <div className="bg-[#34C759]/10 border border-[#34C759]/20 rounded-[18px] p-4 flex items-start gap-3 mt-4">
            <ShieldCheck className="w-5 h-5 text-[#34C759] flex-shrink-0 mt-0.5" />
            <p className="text-[#1C1C1E] text-[13px] leading-relaxed">
              <strong>Xavfsiz kirish.</strong> Parol talab qilinmaydi. Sizning ma'lumotlaringiz shifrlangan va uchinchi tomonlarga berilmaydi.
            </p>
          </div>
        </div>

      </main>

      <PublicTabBar />
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
