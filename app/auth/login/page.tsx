"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Phone, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { googleLoginEndpoint, telegramWebLoginEndpoint } from "@/app/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [tgUser, setTgUser] = useState<any>(null);
  const [tgLoaded, setTgLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<"telegram" | "google">("telegram"); // Tahrirlangan tab

  const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "GOOGLE_ID_KIRITILMAGAN";
  const BOT_USERNAME = "samira_style_bot";

  useEffect(() => {
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
      setActiveTab("phone");
    }
  }, []);

  const handleTelegramLogin = () => {
    if (!tgUser) return;
    setIsLoading(true);
    localStorage.setItem("tg_user", JSON.stringify(tgUser));
    
    // Simulate server side login passing the user data 
    // We already do this via Mini App implicitly if we had cookies, but for now just redirect
    setTimeout(() => {
      router.push("/");
    }, 800);
  };

  const handleWebTelegramLogin = async (userAuthData: any) => {
    setIsLoading(true);
    try {
      const res = await telegramWebLoginEndpoint(userAuthData);
      if (res.success) {
        localStorage.setItem("tg_user", JSON.stringify(res.user));
        router.push("/");
      } else {
        setError(res.error || "Xatolik yuz berdi");
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
        router.push("/");
      } else {
        setError(res.error || "Google orqali kirishda xato");
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
    <div className="min-h-screen flex flex-col bg-[var(--background)] overflow-hidden">
      {/* Fon Gradienti */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[var(--accent)] opacity-[0.06] blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-orange-400 opacity-[0.06] blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-amber-400 opacity-[0.04] blur-[80px]" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
        {/* Logo & Brand */}
        <div className="mb-8 text-center animate-fade-in">
          <div className="relative w-20 h-20 mx-auto mb-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-lg overflow-hidden flex items-center justify-center">
            <div className="text-3xl font-black gradient-text">S</div>
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-transparent" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">
            Samira <span className="gradient-text">Style</span>
          </h1>
          <p className="text-[var(--muted)] text-sm mt-1 font-medium">
            O'zbekistonning zamonaviy kiyim do'koni
          </p>
        </div>

        {/* Karta */}
        <div className="w-full max-w-sm animate-slide-up">
          <div className="glass rounded-3xl p-6 shadow-[var(--shadow-lg)]">
            
            {/* Tab Switcher */}
            <div className="flex bg-[var(--background)] rounded-2xl p-1 mb-6">
              <button
                onClick={() => setActiveTab("telegram")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                  activeTab === "telegram"
                    ? "bg-[var(--card)] shadow-sm text-[var(--foreground)]"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                Telegram
              </button>
              <button
                onClick={() => setActiveTab("google")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                  activeTab === "google"
                    ? "bg-[var(--card)] shadow-sm text-[var(--foreground)]"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                Google (Email)
              </button>
            </div>

            {/* Telegram Login */}
            {activeTab === "telegram" && (
              <div className="space-y-4">
                {tgUser ? (
                  <div className="p-4 rounded-2xl bg-[var(--accent)]/8 border border-[var(--accent)]/20 text-center">
                    <div className="w-14 h-14 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center font-black text-2xl mx-auto mb-3">
                      {tgUser.first_name?.charAt(0) || "T"}
                    </div>
                    <p className="font-bold text-base">{tgUser.first_name} {tgUser.last_name}</p>
                    {tgUser.username && (
                      <p className="text-[var(--muted)] text-sm mt-0.5">@{tgUser.username}</p>
                    )}
                    <div className="flex items-center justify-center gap-1.5 mt-2 text-green-600 text-xs font-bold">
                      <ShieldCheck className="w-4 h-4" />
                      Telegram orqali tasdiqlandi
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-center">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.12 14.09l-2.96-.924c-.643-.203-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.828.469z"/>
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-[var(--muted)]">
                      Telegram Mini App'ni oching
                    </p>
                    <p className="text-xs text-[var(--muted)]/70 mt-1">
                      Telegram orqali avtomatik kirish uchun Mini App ichidan kirish kerak
                    </p>
                  </div>
                )}

                {/* Telegram Web Widget xuddi shu joyda paydo bo'ladi agar tgUser bo'lmasa */}
                {!tgUser && (
                  <div className="mt-4 flex flex-col items-center justify-center fade-in">
                    <p className="text-sm font-semibold text-[var(--foreground)] mb-3">Yoki Veb brauzer orqali kiring:</p>
                    {isLoading && <p className="text-xs text-[var(--muted)] mb-2 animate-pulse">Kutilmoqda...</p>}
                    <div id="telegram-widget-container" className="flex justify-center min-h-[40px]"></div>
                  </div>
                )}
                
              </div>
            )}

            {/* Google Login */}
            {activeTab === "google" && (
              <div className="space-y-4 flex flex-col items-center py-4">
                <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center p-3 mb-2 border border-[var(--border)]">
                   <svg viewBox="0 0 48 48" className="w-full h-full"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
                </div>
                <p className="text-sm font-semibold text-[var(--muted)] text-center mb-4">
                  Google akkauntingiz orqali bir marta bosish orqali xavfsiz kiring.
                </p>

                {error && (
                  <div className="w-full p-3 rounded-xl bg-red-500/8 border border-red-500/18 text-red-500 text-sm font-semibold text-center mt-2 mb-4">
                    {error}
                  </div>
                )}
                
                <div className="w-full flex justify-center mt-2 min-h-[50px]">
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

            {/* Footer */}
            <div className="mt-5 pt-5 border-t border-[var(--border)] text-center">
              <p className="text-xs text-[var(--muted)]">
                Kirish orqali siz bizning{" "}
                <span className="text-[var(--accent)] font-semibold cursor-pointer hover:underline">
                  foydalanish shartlari
                </span>
                {" "}ga rozilik bildirasiz
              </p>
            </div>
          </div>

          {/* Asosiy sahifaga qaytish */}
          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-sm font-semibold text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
            >
              ← Asosiy sahifaga qaytish
            </Link>
          </div>
        </div>
      </div>

      {/* Pastki brand */}
      <div className="relative z-10 py-4 text-center">
        <p className="text-xs text-[var(--muted)]/60 flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3" />
          Samira Style © 2025. Barcha huquqlar himoyalangan.
        </p>
      </div>
    </div>
  );
}
