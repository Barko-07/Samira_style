"use client";

import Link from "next/link";
import { CheckCircle2, ChevronRight, ShoppingBag } from "lucide-react";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-[#F2F2F7] flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-sm bg-white rounded-[32px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)] flex flex-col items-center text-center animate-slide-up">
        
        {/* Animated Check */}
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 bg-[#34C759]/20 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
          <div className="relative w-full h-full bg-[#34C759] rounded-full flex items-center justify-center shadow-lg shadow-[#34C759]/30 text-white">
            <CheckCircle2 className="w-12 h-12" />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-black mb-3">Xush kelibsiz!</h1>
        <p className="text-[#6C6C70] text-[15px] leading-relaxed mb-8">
          Tizimga muvaffaqiyatli kirdingiz. Endi xaridlarni xavfsiz va qulay amalga oshirishingiz mumkin.
        </p>

        <Link
          href="/"
          className="w-full h-14 bg-[#007AFF] hover:bg-[#0066CC] active:scale-[0.98] transition-all rounded-[20px] shadow-[0_8px_20px_rgba(0,122,255,0.3)] flex items-center justify-center gap-2 text-white font-bold text-[16px]"
        >
          <ShoppingBag className="w-5 h-5" />
          Xaridlarga o'tish
          <ChevronRight className="w-5 h-5 opacity-70" />
        </Link>

      </div>
    </div>
  );
}
