"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/app/actions/auth";

export async function getAdminStats() {
  try {
    await requireAdminAuth();
    const usersCount = await prisma.user.count();
    const ordersCount = await prisma.order.count();
    const productsCount = await prisma.product.count();
    const transactionsCount = await prisma.transaction.count();

    const revenueAggr = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { status: "PERFORMED" } // only successful
    });
    
    const revenue = revenueAggr._sum.amount || 0;

    return { 
      success: true, 
      stats: {
        users: usersCount,
        orders: ordersCount,
        products: productsCount,
        transactions: transactionsCount,
        revenue: revenue
      }
    };
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return { success: false, error: "Statistikani yuklashda xatolik yuz berdi" };
  }
}
