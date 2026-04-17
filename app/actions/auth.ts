"use server";

import { cookies } from "next/headers";
import crypto from "crypto";

function verifyTelegramWebAppData(telegramInitData: string): any | false {
  try {
    const initData = new URLSearchParams(telegramInitData);
    const hash = initData.get("hash");
    if (!hash) return false;

    initData.delete("hash");

    const keys = Array.from(initData.keys());
    keys.sort();

    const dataCheckString = keys.map((key) => `${key}=${initData.get(key)}`).join("\n");

    const secretKey = crypto
      .createHmac("sha256", "WebAppData")
      .update(process.env.TELEGRAM_BOT_TOKEN || "")
      .digest();
      
    const expectedHash = crypto
      .createHmac("sha256", secretKey)
      .update(dataCheckString)
      .digest("hex");

    if (expectedHash !== hash) return false;

    const userParam = initData.get("user");
    if (!userParam) return false;

    const authDate = parseInt(initData.get("auth_date") || "0");
    const DateNow = Math.floor(Date.now() / 1000);
    if (DateNow - authDate > 86400) return false; // 1 day expiration

    return JSON.parse(userParam);
  } catch (error) {
    return false;
  }
}

// Very simple built-in signing since we don't have jsonwebtoken/jose installed
function signJWT(payload: any, secret: string) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${header}.${payloadB64}`)
    .digest("base64url");
  return `${header}.${payloadB64}.${signature}`;
}

function verifyJWT(token: string, secret: string): any | false {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const [header, payload, signature] = parts;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${header}.${payload}`)
      .digest("base64url");
    if (expectedSignature !== signature) return false;
    const decodedPayload = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
    if (decodedPayload.exp && decodedPayload.exp < Math.floor(Date.now() / 1000)) return false;
    return decodedPayload;
  } catch {
    return false;
  }
}

export async function requireAdminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!token) throw new Error("Ruxsat berilmagan (Unauthorized)");

  const secret = process.env.JWT_SECRET || process.env.TELEGRAM_BOT_TOKEN || "fallback_secret";
  const decoded = verifyJWT(token, secret);
  
  if (!decoded || decoded.role !== "ADMIN") {
    throw new Error("Ruxsat berilmagan (Unauthorized)");
  }
  return decoded;
}

export async function adminLoginEndpoint(initDataString: string, passwordInput: string) {
  try {
    let isValid = false;
    let userId = null;

    // Check if development bypass or real Telegram initData
    if (initDataString && initDataString !== "bypass") {
      const user = verifyTelegramWebAppData(initDataString);
      if (!user) return { success: false, error: "Telegram ma'lumotlari xato yoki eskirdi!" };
      if (String(user.id) !== process.env.ADMIN_TG_ID) {
        return { success: false, error: "Sizning Telegram profilingizga ruxsat yo'q!" };
      }
      isValid = true;
      userId = user.id;
    } else if (process.env.NODE_ENV === "development") {
      // Allow fallback if needed in local dev, but strictly verifying password
      isValid = true;
      userId = process.env.ADMIN_TG_ID;
    } else {
      return { success: false, error: "Tizimga faqat Telegram Mini App orqali kiriladi." };
    }

    if (passwordInput !== "admin1234") {
      return { success: false, error: "Parol noto'g'ri!" };
    }

    if (isValid) {
      const secret = process.env.JWT_SECRET || process.env.TELEGRAM_BOT_TOKEN || "fallback_secret";
      const token = signJWT(
        { id: userId, role: "ADMIN", exp: Math.floor(Date.now() / 1000) + 86400 }, // 1 day
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

      return { success: true };
    }

    return { success: false, error: "Kirish rad etildi." };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Tizim xatosi." };
  }
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  return { success: true };
}
