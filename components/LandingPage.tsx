"use client";

import Link from "next/link";
import { Zap, ShieldCheck, Truck, Star, MessageCircle, Sparkles, ArrowRight } from "lucide-react";
import { PublicTabBar } from "./ui/PublicTabBar";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F2F2F7] font-sans pb-[100px]">
      
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-[rgba(242,242,247,0.85)] backdrop-blur-xl border-b border-[rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-center px-5 h-12 max-w-xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#007AFF] to-[#5856D6] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-[17px] font-bold tracking-tight text-black">Samira Style</span>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 w-full max-w-xl mx-auto px-4">
        <div className="animate-fade-in">
          {/* Hero Card */}
          <div className="mt-6 relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#007AFF] via-[#5856D6] to-[#AF52DE] p-7 text-white shadow-[0_16px_48px_rgba(0,122,255,0.35)] mb-6">
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
      </main>

      <PublicTabBar />
    </div>
  );
}
