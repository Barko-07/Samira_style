"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Home, Info, LogIn, ChevronRight, Zap, ShieldCheck,
  Truck, Star, MessageCircle, Sparkles, ArrowRight
} from "lucide-react";

type Section = "home" | "about" | "login";

export default function LandingPage() {
  const [active, setActive] = useState<Section>("home");

  return (
    <div className="min-h-screen flex flex-col bg-[#F2F2F7] font-sans pb-[84px]">
      
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-[rgba(242,242,247,0.85)] backdrop-blur-xl border-b border-[rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between px-5 h-12 max-w-xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#007AFF] to-[#5856D6] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-[17px] font-bold tracking-tight text-black">Samira Style</span>
          </div>
          <Link 
            href="/auth/login"
            className="text-[#007AFF] text-[15px] font-semibold active:opacity-60 transition-opacity"
          >
            Kirish
          </Link>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 w-full max-w-xl mx-auto px-4">

        {/* =========== HOME SECTION =========== */}
        {active === "home" && (
          <div className="animate-fade-in">
            
            {/* Hero Card */}
            <div className="mt-6 relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#007AFF] via-[#5856D6] to-[#AF52DE] p-7 text-white shadow-[0_16px_48px_rgba(0,122,255,0.35)] mb-6">
              {/* Decorative circles */}
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-sm"></div>
              <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/10 blur-sm"></div>
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-[12px] font-bold uppercase tracking-wider mb-5">
                  <Zap className="w-3 h-3 text-yellow-300" /> Telegram Mini App
                </div>
                <h1 className="text-[28px] font-extrabold leading-tight mb-3">
                  Kiyim xaridini yangi darajaga olib chiqing
                </h1>
                <p className="text-white/85 text-[15px] leading-relaxed mb-6">
                  Samira Style — Telegram ichida ishlaydi. Ro'yxatdan o'tmasdan xarid qiling. Tez, qulay va xavfsiz.
                </p>
                <Link 
                  href="/auth/login"
                  className="inline-flex items-center gap-2 bg-white text-[#007AFF] font-bold text-[15px] px-6 py-3 rounded-2xl active:scale-95 transition-transform shadow-lg"
                >
                  Xaridni boshlash <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Feature cards */}
            <div className="space-y-3 mb-6">
              {[
                {
                  icon: <Zap className="w-5 h-5 text-[#FF9500]" />,
                  bg: "bg-[#FF9500]/10",
                  title: "Telegram orqali kirish",
                  desc: "Parol eslab qolishsiz — bir marta bosing va Telegram akkauntingiz bilan kiring.",
                },
                {
                  icon: <ShieldCheck className="w-5 h-5 text-[#34C759]" />,
                  bg: "bg-[#34C759]/10",
                  title: "100% xavfsiz to'lov",
                  desc: "Click va Payme orqali shifrlangan to'lov. Karta ma'lumotlaringiz xavfsiz.",
                },
                {
                  icon: <Truck className="w-5 h-5 text-[#007AFF]" />,
                  bg: "bg-[#007AFF]/10",
                  title: "Tezkor yetkazib berish",
                  desc: "Toshkent bo'ylab 1 kunda, viloyatlarga 2–3 kunda yetkazib beramiz.",
                },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-[20px] p-4 flex items-start gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                  <div className={`${item.bg} w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[15px] text-black mb-0.5">{item.title}</h3>
                    <p className="text-[#6C6C70] text-[13px] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Testimonials */}
            <h2 className="text-[20px] font-bold text-black mb-3">Mijozlar fikri</h2>
            <div className="space-y-3 mb-6">
              {[
                { name: "Aziza M.", stars: 5, text: "Materiali ajoyib, rangi o'chmas! 😍 Doim shu yerdan xarid qilaman." },
                { name: "Doniyor T.", stars: 5, text: "Tezkor yetkazib berish va hamyonbop narxlar. Tavsiya qilaman!" },
                { name: "Malika S.", stars: 4, text: "Sifati juda yaxshi, 1 kunda yetib keldi. Rahmat!" },
              ].map((r, i) => (
                <div key={i} className="bg-white rounded-[20px] p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#007AFF] to-[#5856D6] flex items-center justify-center text-white font-bold text-[13px]">
                        {r.name[0]}
                      </div>
                      <span className="font-semibold text-[14px] text-black">{r.name}</span>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, si) => (
                        <Star key={si} className={`w-3.5 h-3.5 ${si < r.stars ? "fill-[#FF9500] text-[#FF9500]" : "fill-gray-200 text-gray-200"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-[#3C3C43] text-[14px] leading-relaxed">{r.text}</p>
                </div>
              ))}
            </div>

            {/* CTA block */}
            <div className="bg-gradient-to-r from-[#1C1C1E] to-[#2C2C2E] rounded-[24px] p-6 text-center text-white mb-2">
              <MessageCircle className="w-8 h-8 mx-auto mb-3 text-[#007AFF]" />
              <h3 className="text-[18px] font-bold mb-1">Telegram botimizda bor!</h3>
              <p className="text-[#EBEBF5]/60 text-[14px] mb-4">@samira_style_bot orqali ham xarid qilishingiz mumkin</p>
              <Link
                href="/auth/login"
                className="block bg-[#007AFF] text-white font-bold text-[15px] py-3.5 rounded-[16px] active:opacity-80 transition-opacity"
              >
                Kirish va xarid qilish
              </Link>
            </div>
          </div>
        )}

        {/* =========== ABOUT SECTION =========== */}
        {active === "about" && (
          <div className="animate-fade-in pt-6 space-y-4">
            
            {/* About Hero */}
            <div className="bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] rounded-[28px] p-6 text-white">
              <div className="w-14 h-14 rounded-[18px] bg-gradient-to-br from-[#007AFF] to-[#5856D6] flex items-center justify-center mb-4">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-[24px] font-extrabold mb-2 leading-tight">Biz Haqimizda</h1>
              <p className="text-white/75 text-[15px] leading-relaxed">
                Samira Style — 2023-yilda tashkil etilgan online kiyim do'koni. Biz premium sifatli kiyimlarni qulay narxlarda Telegram orqali yetkazib beramiz.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "5000+", label: "Mijozlar", color: "text-[#007AFF]" },
                { value: "500+", label: "Mahsulotlar", color: "text-[#34C759]" },
                { value: "4.9★", label: "Reyting", color: "text-[#FF9500]" },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-[20px] p-4 text-center shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                  <p className={`text-[22px] font-extrabold ${s.color}`}>{s.value}</p>
                  <p className="text-[#6C6C70] text-[12px] font-medium mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Values */}
            <div className="bg-white rounded-[20px] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              {[
                { title: "Missiyamiz", desc: "Har bir o'zbek oilasiga sifatli va hamyonbop kiyim yetkazib berish." },
                { title: "Qadriyatlarimiz", desc: "Halollik, sifat va mijoz qoniqishi — bizning asosiy tamoyillarimiz." },
                { title: "Viziyon", desc: "O'zbekistondagi eng ishonchli online kiyim platformasiga aylanish." },
              ].map((item, i) => (
                <div key={i} className={`p-4 flex items-center gap-4 ${i < 2 ? "border-b border-gray-100" : ""}`}>
                  <div className="w-2 h-2 rounded-full bg-[#007AFF] flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-[15px] text-black">{item.title}</h3>
                    <p className="text-[#6C6C70] text-[13px] leading-relaxed mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact */}
            <div className="bg-white rounded-[20px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <h3 className="font-bold text-[16px] text-black mb-3">Bog'lanish</h3>
              <div className="space-y-2.5 text-[14px]">
                <div className="flex justify-between">
                  <span className="text-[#6C6C70]">Telegram bot</span>
                  <span className="text-[#007AFF] font-semibold">@samira_style_bot</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6C6C70]">Ish vaqti</span>
                  <span className="font-semibold text-black">09:00 – 22:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6C6C70]">Yetkazib berish</span>
                  <span className="font-semibold text-black">Butun O'zbekiston</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* =========== LOGIN SECTION =========== */}
        {active === "login" && (
          <div className="animate-fade-in pt-6">
            
            {/* Login card */}
            <div className="bg-white rounded-[28px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] mb-4">
              <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-[#007AFF] to-[#5856D6] flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-[22px] font-extrabold text-center text-black mb-1">Xush kelibsiz!</h2>
              <p className="text-[#6C6C70] text-center text-[14px] mb-6">
                Do'konimizga kirish uchun quyidagi usullardan birini tanlang
              </p>
              
              {/* Login options */}
              <div className="space-y-3">
                {/* Telegram */}
                <Link
                  href="/auth/login"
                  className="flex items-center gap-4 p-4 bg-[#F2F2F7] rounded-[18px] active:bg-gray-200 transition-colors group"
                >
                  <div className="w-11 h-11 rounded-2xl bg-[#0088CC] flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.12 14.09l-2.96-.924c-.643-.203-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.828.469z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[15px] text-black">Telegram orqali kirish</p>
                    <p className="text-[#6C6C70] text-[13px]">Avtomatik — 1 soniyada</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-400 transition-colors" />
                </Link>

                {/* Google */}
                <Link
                  href="/auth/login?tab=google"
                  className="flex items-center gap-4 p-4 bg-[#F2F2F7] rounded-[18px] active:bg-gray-200 transition-colors group"
                >
                  <div className="w-11 h-11 rounded-2xl bg-white border border-gray-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5" viewBox="0 0 48 48">
                      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[15px] text-black">Google orqali kirish</p>
                    <p className="text-[#6C6C70] text-[13px]">Email bilan tizimga kiring</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-400 transition-colors" />
                </Link>
              </div>
            </div>

            {/* Security note */}
            <div className="bg-[#34C759]/10 border border-[#34C759]/20 rounded-[18px] p-4 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#34C759] flex-shrink-0 mt-0.5" />
              <p className="text-[#1C1C1E] text-[13px] leading-relaxed">
                <strong>Xavfsiz kirish.</strong> Parol talab qilinmaydi. Sizning ma'lumotlaringiz shifrlangan va uchinchi tomonlarga berilmaydi.
              </p>
            </div>

          </div>
        )}

      </main>

      {/* ── iOS Tab Bar ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[rgba(242,242,247,0.92)] backdrop-blur-2xl border-t border-[rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-around h-[60px] max-w-xl mx-auto px-6">
          
          {([
            { key: "home",  label: "Asosiy",       Icon: Home },
            { key: "about", label: "Biz haqimizda", Icon: Info },
            { key: "login", label: "Kirish",        Icon: LogIn },
          ] as { key: Section; label: string; Icon: any }[]).map(({ key, label, Icon }) => {
            const isActive = active === key;
            return (
              <button
                key={key}
                onClick={() => setActive(key)}
                className="flex flex-col items-center justify-center gap-[3px] w-20 pt-1 active:opacity-60 transition-opacity"
              >
                <div className={`w-[46px] h-[32px] rounded-[12px] flex items-center justify-center transition-all ${isActive ? "bg-[#007AFF]/15" : "bg-transparent"}`}>
                  <Icon
                    className={`w-[22px] h-[22px] transition-colors ${isActive ? "text-[#007AFF]" : "text-[#8E8E93]"}`}
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                </div>
                <span className={`text-[10px] font-semibold transition-colors ${isActive ? "text-[#007AFF]" : "text-[#8E8E93]"}`}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
        {/* iOS home indicator */}
        <div className="flex justify-center pb-1.5">
          <div className="w-[134px] h-[5px] rounded-full bg-[#1C1C1E]/20"></div>
        </div>
      </nav>
    </div>
  );
}
