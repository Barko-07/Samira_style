"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/app/actions/auth";

export async function getCategories() {
  try {
    const categories = await prisma.customCategory.findMany({
      orderBy: { order: "asc" },
    });
    return { success: true, data: categories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, error: "Xatolik yuz berdi" };
  }
}

export async function addCategory(name: string) {
  try {
    await requireAdminAuth();
    
    const existing = await prisma.customCategory.findUnique({
      where: { name },
    });
    if (existing) {
      return { success: false, error: "Bunday menyu mavjud" };
    }

    const maxOrder = await prisma.customCategory.aggregate({
      _max: { order: true },
    });
    
    await prisma.customCategory.create({
      data: {
        name,
        order: (maxOrder._max.order ?? 0) + 1,
      },
    });

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error adding category:", error);
    return { success: false, error: "Xatolik yuz berdi saqlashda" };
  }
}

export async function deleteCategory(id: string) {
  try {
    await requireAdminAuth();
    
    await prisma.customCategory.delete({
      where: { id },
    });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "Xatolik yuz berdi o'chirishda" };
  }
}

export async function toggleCategory(id: string, isActive: boolean) {
  try {
    await requireAdminAuth();
    
    await prisma.customCategory.update({
      where: { id },
      data: { isActive },
    });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error toggling category:", error);
    return { success: false, error: "Xatolik yuz berdi o'zgartirishda" };
  }
}
