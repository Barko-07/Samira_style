"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/app/actions/auth";

export async function createAuditLog(
  userId: string | null,
  action: string,
  target?: string,
  ipAddress?: string
) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        target,
        ipAddress,
      },
    });
  } catch (error) {
    console.error("[log] Failed to create audit log:", error);
  }
}

export async function getAuditLogs() {
  try {
    await requireAdminAuth();
    
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 100, // Fetch the last 100 logs
      include: {
        user: {
          select: { name: true, phone: true, role: true, id: true }
        }
      }
    });

    return { success: true, data: logs };
  } catch (error) {
    console.error("[log] Failed to fetch logs:", error);
    return { success: false, error: "Jurnallarni olishda xatolik yuz berdi" };
  }
}
