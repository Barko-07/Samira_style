"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Info, LogIn } from "lucide-react";

const tabs = [
  { href: "/", label: "Asosiy", Icon: Home },
  { href: "/about", label: "Biz haqimizda", Icon: Info },
  { href: "/auth/login", label: "Kirish", Icon: LogIn },
];

export function PublicTabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed left-0 right-0 z-50 flex flex-col items-center"
      style={{ bottom: "env(safe-area-inset-bottom, 12px)", paddingBottom: 12 }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          background: "#ffffff",
          border: "1px solid rgba(0,0,0,0.05)",
          borderRadius: 48,
          padding: "10px 24px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.08), 0 2px 10px rgba(0,0,0,0.04)",
        }}
      >
        {tabs.map(({ href, label, Icon }) => {
          const isActive = pathname === href || (href !== "/" && pathname?.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                width: 64,
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 44,
                  height: 32,
                  borderRadius: 16,
                  background: isActive ? "rgba(249, 115, 22, 0.15)" : "transparent",
                  transition: "background 0.2s ease",
                }}
              >
                <Icon
                  style={{
                    width: 22,
                    height: 22,
                    color: isActive ? "#ea580c" : "#64748b",
                    strokeWidth: isActive ? 2.5 : 2,
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#ea580c" : "#64748b",
                  letterSpacing: "-0.01em",
                }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
