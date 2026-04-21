"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/app/actions/auth";

// ─── Mock orders for fallback ─────────────────────────────────────────────────
const MOCK_ORDERS = [
  {
    id: "order-1",
    status: "PENDING_PAYMENT",
    total: 370000,
    address: "Toshkent, Chilonzor 14-kvartal",
    createdAt: new Date(Date.now() - 3600000),
    buyer: { name: "Azizbek Toshmatov", telegramId: "12345678" },
    items: [
      { id: "oi-1", qty: 1, price: 120000, productVariant: { product: { title: "Premium Futbolka" }, size: "M", color: "Oq" } },
      { id: "oi-2", qty: 1, price: 250000, productVariant: { product: { title: "Yozgi Ko'ylak" }, size: "M", color: "Qizil" } },
    ],
  },
  {
    id: "order-2",
    status: "PAID",
    total: 450000,
    address: "Samarqand, Registon ko'chasi 5",
    createdAt: new Date(Date.now() - 7200000),
    buyer: { name: "Malika Yusupova", telegramId: "87654321" },
    items: [
      { id: "oi-3", qty: 1, price: 450000, productVariant: { product: { title: "Klassik Krossovka" }, size: "38", color: "Oq" } },
    ],
  },
  {
    id: "order-3",
    status: "DELIVERED",
    total: 620000,
    address: "Andijon, Asaka ko'chasi 12",
    createdAt: new Date(Date.now() - 86400000),
    buyer: { name: "Sardor Mirzayev", telegramId: "11223344" },
    items: [
      { id: "oi-4", qty: 1, price: 620000, productVariant: { product: { title: "Charm Sumka" }, size: "Standart", color: "Qora" } },
    ],
  },
];

// orderStatusLabel is now in @/lib/orderUtils (client-safe)

// ─── Get all orders (admin) ───────────────────────────────────────────────────
export async function getOrders(): Promise<{ success: boolean; data: any[] }> {
  try {
    await requireAdminAuth();
  } catch {
    return { success: false, data: [] };
  }

  if (!prisma) {
    return { success: true, data: MOCK_ORDERS };
  }

  try {
    const orders = await (prisma as unknown as import("@prisma/client").PrismaClient).order.findMany({
      include: {
        buyer: { select: { name: true, telegramId: true } },
        items: {
          include: {
            productVariant: {
              include: {
                product: { select: { title: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return { success: true, data: orders };
  } catch {
    return { success: true, data: MOCK_ORDERS };
  }
}

// ─── Update order status (admin) ──────────────────────────────────────────────
export async function updateOrderStatus(
  orderId: string,
  status: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdminAuth();
  } catch {
    return { success: false, error: "Ruxsat yo'q" };
  }

  if (!prisma || orderId.startsWith("order-")) {
    return { success: true }; // Namoyish ma'lumotlari
  }

  try {
    await (prisma as unknown as import("@prisma/client").PrismaClient).order.update({
      where: { id: orderId },
      data: { status: status as any },
    });
    return { success: true };
  } catch (err) {
    console.error("updateOrderStatus error:", err);
    return { success: false, error: "Status yangilashda xatolik" };
  }
}

// ─── Get buyer's orders ───────────────────────────────────────────────────────
export async function getMyOrders(telegramId: string): Promise<{ success: boolean; data: any[] }> {
  if (!prisma || !telegramId) {
    return {
      success: true,
      data: MOCK_ORDERS.filter((o) => o.buyer.telegramId === telegramId).slice(0, 5),
    };
  }

  try {
    const user = await (prisma as unknown as import("@prisma/client").PrismaClient).user.findUnique({
      where: { telegramId },
      select: { id: true },
    });

    if (!user) return { success: true, data: [] };

    const orders = await (prisma as unknown as import("@prisma/client").PrismaClient).order.findMany({
      where: { buyerId: user.id },
      include: {
        items: {
          include: {
            productVariant: {
              include: {
                product: { select: { title: true, images: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return { success: true, data: orders };
  } catch {
    return { success: true, data: [] };
  }
}

// ─── Place an order (buyer) ───────────────────────────────────────────────────
export async function placeOrder(data: {
  telegramId?: string;
  items: Array<{ productId: string; variantId?: string; qty: number; price: number }>;
  address: string;
  total: number;
}): Promise<{ success: boolean; orderId?: string; error?: string }> {
  if (!prisma) {
    // Namoyish rejimida muvaffaqiyat qaytaramiz
    return { success: true, orderId: "mock-order-" + Date.now() };
  }

  try {
    const pc = prisma as unknown as import("@prisma/client").PrismaClient;

    let buyer = data.telegramId
      ? await pc.user.findUnique({ where: { telegramId: data.telegramId } })
      : null;

    if (!buyer) {
      // Telegram foydalanuvchi uchun vaqtinchalik account
      buyer = await pc.user.create({
        data: {
          phone: `tg_${data.telegramId ?? "anon"}`,
          phoneHash: `tg_hash_${data.telegramId ?? Date.now()}`,
          telegramId: data.telegramId,
          role: "BUYER",
        },
      });
    }

    const order = await pc.order.create({
      data: {
        buyerId: buyer.id,
        total: data.total,
        address: data.address,
        status: "PENDING_PAYMENT",
      },
    });

    return { success: true, orderId: order.id };
  } catch (err) {
    console.error("placeOrder error:", err);
    return { success: false, error: "Buyurtma berishda xatolik yuz berdi" };
  }
}
