"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Phone, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [tgUser, setTgUser] = useState<any>(null);
  const [tgLoaded, setTgLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<"phone" | "telegram">("telegram");

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
    // Telegram foydalanuvchi ma'lumotlarini saqlash
    localStorage.setItem("tg_user", JSON.stringify(tgUser));
    setTimeout(() => {
      router.push("/");
    }, 800);
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !password.trim()) {
      setError("Telefon va parolni kiriting");
      return;
    }
    setError("");
    setIsLoading(true);
    // Simulatsiya (haqiqiy auth keyinchalik)
    await new Promise((r) => setTimeout(r, 1200));
    setIsLoading(false);
    setError("Bu xizmat tez orada ishga tushadi. Telegram orqali kiring.");
  };

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
                onClick={() => setActiveTab("phone")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                  activeTab === "phone"
                    ? "bg-[var(--card)] shadow-sm text-[var(--foreground)]"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                Telefon
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

                <button
                  onClick={handleTelegramLogin}
                  disabled={!tgUser || isLoading}
                  className={`w-full h-13 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
                    tgUser && !isLoading
                      ? "bg-[var(--accent)] text-white hover:bg-[var(--accent-dark)] shadow-[var(--shadow-accent)] hover:-translate-y-0.5"
                      : "bg-[var(--border)] text-[var(--muted)] cursor-not-allowed opacity-60"
                  }`}
                  style={{ height: "52px" }}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Telegram orqali kirish
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Phone Login */}
            {activeTab === "phone" && (
              <form onSubmit={handlePhoneLogin} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                    Telefon raqam
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+998 90 123 45 67"
                      className="input h-13 pl-10 pr-4"
                      style={{ height: "52px", paddingLeft: "40px", paddingRight: "16px" }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                    Parol
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="input h-13 pl-10 pr-12"
                      style={{ height: "52px", paddingLeft: "40px", paddingRight: "48px" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-500/8 border border-red-500/18 text-red-500 text-sm font-semibold">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-2xl bg-[var(--foreground)] text-[var(--background)] font-bold text-base flex items-center justify-center gap-2 hover:bg-[var(--accent)] hover:text-white transition-all shadow-md hover:-translate-y-0.5"
                  style={{ height: "52px" }}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                  ) : (
                    <>Kirish <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>
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
