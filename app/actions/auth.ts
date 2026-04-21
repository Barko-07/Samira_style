"use server";

import { cookies } from "next/headers";
import crypto from "crypto";
import { createAuditLog } from "./logs";
import { prisma } from "@/lib/prisma";

// ─── Telegram WebApp data verification ───────────────────────────────────────
function verifyTelegramWebAppData(telegramInitData: string): Record<string, unknown> | false {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) return false;

    const initData = new URLSearchParams(telegramInitData);
    const hash = initData.get("hash");
    if (!hash) return false;

    initData.delete("hash");

    const keys = Array.from(initData.keys()).sort();
    const dataCheckString = keys.map((key) => `${key}=${initData.get(key)}`).join("\n");

    const secretKey = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
    const expectedHash = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

    if (expectedHash !== hash) return false;

    const userParam = initData.get("user");
    if (!userParam) return false;

    const authDate = parseInt(initData.get("auth_date") || "0");
    const now = Math.floor(Date.now() / 1000);
    if (now - authDate > 86400) return false; // expired after 1 day

    return JSON.parse(userParam) as Record<string, unknown>;
  } catch {
    return false;
  }
}

// ─── Minimal JWT implementation (no external deps) ───────────────────────────
function signJWT(payload: Record<string, unknown>, secret: string): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", secret).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${sig}`;
}

function verifyJWT(token: string, secret: string): Record<string, unknown> | false {
  try {
    const [header, body, sig] = token.split(".");
    if (!header || !body || !sig) return false;
    const expected = crypto.createHmac("sha256", secret).update(`${header}.${body}`).digest("base64url");
    if (expected !== sig) return false;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf-8")) as Record<string, unknown>;
    const exp = payload.exp as number | undefined;
    if (exp && exp < Math.floor(Date.now() / 1000)) return false;
    return payload;
  } catch {
    return false;
  }
}

// ─── Admin auth guard (used by protected server actions) ─────────────────────
export async function requireAdminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!token) throw new Error("Ruxsat berilmagan (Unauthorized)");

  const secret = process.env.JWT_SECRET || process.env.TELEGRAM_BOT_TOKEN || "samira_admin_secret_key";
  const decoded = verifyJWT(token, secret);

  if (!decoded || decoded.role !== "ADMIN") {
    throw new Error("Ruxsat berilmagan (Unauthorized)");
  }
  return decoded;
}

// ─── Admin login ──────────────────────────────────────────────────────────────
export async function adminLoginEndpoint(initDataString: string, passwordInput: string) {
  try {
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin1234";
    const ADMIN_TG_ID = process.env.ADMIN_TG_ID;
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

    // 1. Always verify password first
    if (passwordInput !== ADMIN_PASSWORD) {
      return { success: false, error: "Parol noto'g'ri!" };
    }

    let telegramUserId: string | null = null;

    // 2. If Telegram init data is provided AND bot token is configured → verify it
    if (initDataString && initDataString !== "bypass" && BOT_TOKEN) {
      const tgUser = verifyTelegramWebAppData(initDataString);
      if (!tgUser) {
        return { success: false, error: "Telegram ma'lumotlari xato yoki eskirdi!" };
      }

      // 3. If ADMIN_TG_ID is configured, enforce Telegram ID check
      if (ADMIN_TG_ID && String(tgUser.id) !== ADMIN_TG_ID) {
        return { success: false, error: "Sizning Telegram profilingizga ruxsat yo'q!" };
      }

      telegramUserId = String(tgUser.id);
    } else if (initDataString && initDataString !== "bypass" && !BOT_TOKEN) {
      // Telegram data received but no bot token configured → extract user ID from unsafe data
      // This is acceptable as fallback since password was already verified
      try {
        const raw = new URLSearchParams(initDataString);
        const userStr = raw.get("user");
        if (userStr) {
          const user = JSON.parse(userStr) as Record<string, unknown>;
          if (ADMIN_TG_ID && String(user.id) !== ADMIN_TG_ID) {
            return { success: false, error: "Sizning Telegram profilingizga ruxsat yo'q!" };
          }
          telegramUserId = String(user.id);
        }
      } catch {
        // ignore parse errors, password already verified
      }
    }

    // 4. Create session token
    const secret = process.env.JWT_SECRET || process.env.TELEGRAM_BOT_TOKEN || "samira_admin_secret_key";
    const token = signJWT(
      { id: telegramUserId ?? "admin", role: "ADMIN", exp: Math.floor(Date.now() / 1000) + 86400 },
      secret
    );

    const cookieStore = await cookies();
    cookieStore.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 86400,
    });
    
    let adminDbUser = null;
    if (telegramUserId) {
      adminDbUser = await prisma.user.findUnique({ where: { telegramId: telegramUserId } });
    }
    await createAuditLog(adminDbUser?.id || null, "ADMIN_LOGIN", "Admin Panel", "");

    return { success: true };
  } catch (err) {
    console.error("[auth] adminLoginEndpoint error:", err);
    return { success: false, error: "Tizim xatosi. Qayta urinib ko'ring." };
  }
}

export async function adminLogout() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  
  if (token) {
    const secret = process.env.JWT_SECRET || process.env.TELEGRAM_BOT_TOKEN || "samira_admin_secret_key";
    const decoded = verifyJWT(token, secret);
    if (decoded && decoded.id) {
       const adminDbUser = await prisma.user.findUnique({ where: { telegramId: String(decoded.id) } });
       await createAuditLog(adminDbUser?.id || null, "ADMIN_LOGOUT", "Admin Panel", "");
    }
  }

  cookieStore.delete("admin_session");
  return { success: true };
}

// ─── Claim Admin Role ────────────────────────────────────────────────────────
export async function checkIsAdmin(telegramId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { telegramId } });
  return user?.role === "ADMIN";
}

export async function claimAdminRole(telegramId: string, secret?: string) {
  try {
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
    
    // First user claim, or secret-based claim
    const SUPER_SECRET = process.env.ADMIN_PASSWORD || "admin1234";

    if (adminCount === 0 || secret === SUPER_SECRET) {
      // Upsert user if missing, then make admin
      const user = await prisma.user.upsert({
        where: { telegramId },
        update: { role: "ADMIN" },
        create: {
          telegramId,
          role: "ADMIN",
          phone: "unknown",
          phoneHash: crypto.randomBytes(16).toString("hex"),
        }
      });
      await createAuditLog(user.id, "ADMIN_CLAIM", "Admin Role Granted", "");
      return { success: true };
    }
    
    return { success: false, error: "maxfiy so'z noto'g'ri yoki ruxsat yo'q" };
  } catch (error) {
    console.error("[auth] claim admin error:", error);
    return { success: false, error: "Xatolik yuz berdi" };
  }
}

