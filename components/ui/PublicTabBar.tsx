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
      className="fixed left-0 right-0 z-50 bg-white border-t border-[rgba(0,0,0,0.08)] shadow-[0_-4px_24px_rgba(0,0,0,0.02)]"
      style={{ bottom: 0, paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          width: "100%",
          maxWidth: 600,
          margin: "0 auto",
          height: 64,
          padding: "0 8px",
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
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                width: "33%",
                height: "100%",
                textDecoration: "none",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 56,
                  height: 32,
                  borderRadius: 16,
                  background: isActive ? "rgba(249, 115, 22, 0.15)" : "transparent",
                  transition: "background 0.2s ease",
                }}
              >
                <Icon
                  style={{
                    width: 24,
                    height: 24,
                    color: isActive ? "#ea580c" : "#0f172a",
                    strokeWidth: isActive ? 2.5 : 2,
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "#ea580c" : "#0f172a",
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
