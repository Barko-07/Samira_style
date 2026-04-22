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
      {/* ── Floating circular iOS buttons ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          background: "rgba(20, 20, 22, 0.92)",
          backdropFilter: "blur(32px) saturate(200%)",
          WebkitBackdropFilter: "blur(32px) saturate(200%)",
          border: "1px solid rgba(255,255,255,0.18)",
          borderRadius: 56,
          padding: "12px 16px",
          boxShadow: "0 16px 48px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.35), inset 0 1px 1px rgba(255,255,255,0.05)",
        }}
      >
        {tabs.map(({ href, label, Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 50,
                height: 50,
                borderRadius: "50%",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                textDecoration: "none",
              }}
            >
              {/* Active circle highlight */}
              {isActive && (
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background: "rgba(0, 122, 255, 0.2)",
                    boxShadow: "0 0 20px rgba(0, 122, 255, 0.4), inset 0 0 10px rgba(0, 122, 255, 0.1)",
                  }}
                />
              )}

              {/* Icon */}
              <Icon
                style={{
                  position: "relative",
                  zIndex: 1,
                  width: 26,
                  height: 26,
                  color: isActive ? "#007AFF" : "rgba(255,255,255,0.5)",
                  strokeWidth: isActive ? 2.5 : 2,
                }}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
