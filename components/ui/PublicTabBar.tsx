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
      className="fixed left-0 right-0 z-50 px-4"
      style={{ bottom: "calc(16px + env(safe-area-inset-bottom, 0px))" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: 400,
          margin: "0 auto",
          background: "#F2F2F7", // light gray pill background
          borderRadius: 9999,
          padding: 8,
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        }}
      >
        {tabs.map(({ href, label, Icon }) => {
          const isActive = pathname === href || (href !== "/" && pathname?.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: isActive ? "8px 20px" : "8px 16px",
                background: isActive ? "#ffffff" : "transparent",
                borderRadius: 9999,
                textDecoration: "none",
                WebkitTapHighlightColor: "transparent",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: isActive ? "0 2px 10px rgba(0,0,0,0.04)" : "none",
              }}
            >
              <Icon
                style={{
                  width: 22,
                  height: 22,
                  color: isActive ? "#ea580c" : "#0f172a",
                  strokeWidth: isActive ? 2.5 : 2,
                  transition: "color 0.3s ease",
                }}
              />
              {isActive && (
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#ea580c",
                    letterSpacing: "-0.01em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
