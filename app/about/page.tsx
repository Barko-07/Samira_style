"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { PublicTabBar } from "@/components/ui/PublicTabBar";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F2F2F7] font-sans pb-[100px]">
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
          <div className="bg-white rounded-[20px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] mb-4">
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
      </main>

      <PublicTabBar />
    </div>
  );
}
