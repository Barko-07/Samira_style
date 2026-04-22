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
      {/* ── Floating dark pill with iOS glass effect ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          background: "rgba(20, 20, 22, 0.92)",
          backdropFilter: "blur(32px) saturate(200%)",
          WebkitBackdropFilter: "blur(32px) saturate(200%)",
          border: "1px solid rgba(255,255,255,0.18)",
          borderRadius: 48,
          padding: "8px 10px",
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
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                padding: "10px 24px",
                borderRadius: 38,
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                textDecoration: "none",
              }}
            >
              {/* Active oval highlight with glow */}
              {isActive && (
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 38,
                    background: "rgba(0, 122, 255, 0.25)",
                    boxShadow: "0 0 16px rgba(0, 122, 255, 0.2)",
                  }}
                />
              )}

              {/* Icon */}
              <span style={{ position: "relative", zIndex: 1 }}>
                <Icon
                  style={{
                    width: 24,
                    height: 24,
                    color: isActive ? "#007AFF" : "rgba(255,255,255,0.5)",
                    strokeWidth: isActive ? 2.5 : 2,
                  }}
                />
              </span>

              {/* Label */}
              <span
                style={{
                  position: "relative",
                  zIndex: 1,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                  color: isActive ? "#007AFF" : "rgba(255,255,255,0.4)",
                }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* iOS home indicator bar */}
      <div
        style={{
          width: 134,
          height: 5,
          borderRadius: 9999,
          background: "rgba(255,255,255,0.25)",
          marginTop: 12,
        }}
      />
    </nav>
  );
}
          height: 5,
          borderRadius: 9999,
          background: "rgba(255,255,255,0.22)",
          marginTop: 8,
        }}
      />
    </nav>
  );
}
