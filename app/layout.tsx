import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Samira Style | Zamonaviy Kiyimlar",
  description: "O'zbekistondagi eng yaxshi va hamyonbop kiyim-kechak do'koni. Telegram Mini App orqali tezkor xaridlar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uz"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        {children}
        <Script src="https://telegram.org/js/telegram-web-app.js" />
      </body>
    </html>
  );
}
