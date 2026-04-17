"use server";

import { prisma } from "@/lib/prisma";

const FALLBACK_PRODUCTS = [
  { 
    id: "mock-1", title: "Premium Paxta Futbolka - Uniseks", price: 120000, category: "Erkaklar", 
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80",
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80", "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=500&q=80"],
    description: "Sof 100% paxtadan ishlangan premium sifatli futbolka. Kundalik kiyish uchun juda qulay. Yozgi ob-havoda terlatmaydi va rangi uzoq cho'milishlarga chidamli.",
    variants: [
      { id: "v1", size: "S", color: "Oq", stock: 10 },
      { id: "v2", size: "M", color: "Oq", stock: 0 },
      { id: "v3", size: "L", color: "Qora", stock: 5 },
    ],
    reviews: [
      { id: "r1", rating: 5, comment: "Materiali juda zo'r", buyer: { name: "Azizbek" }, createdAt: new Date() }
    ]
  },
  { 
    id: "mock-2", title: "Yozgi Ko'ylak Ayollar Uchun", price: 250000, category: "Ayollar", 
    image: "https://images.unsplash.com/photo-1515347619362-e6fd1b82fb1a?auto=format&fit=crop&w=500&q=80",
    images: ["https://images.unsplash.com/photo-1515347619362-e6fd1b82fb1a?auto=format&fit=crop&w=500&q=80"],
    description: "Issiq yoz kunlarida sizga nafislik ulashuvchi yengil paxtali ayollar ko'ylagi.",
    variants: [{ id: "v4", size: "M", color: "Qizil", stock: 2 }],
    reviews: []
  },
  { 
    id: "mock-3", title: "Klassik Krossovka Oq Rangda", price: 450000, category: "Poyabzal", 
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=500&q=80",
    images: ["https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=500&q=80"],
    description: "Zamon bilan hamnafas ko'rinish. Bardoshli va aql bovar qilmas darajada qulay sport poyabzali.",
    variants: [{ id: "v5", size: "40", color: "Oq", stock: 15 }, { id: "v6", size: "42", color: "Oq", stock: 0 }],
    reviews: [{ id: "r2", rating: 4, comment: "Kiyishga yaxshi", buyer: { name: "Doniyor" }, createdAt: new Date() }]
  },
  { id: "mock-4", title: "Kuzgi Pidjak Qora Rang", price: 340000, category: "Erkaklar", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=500&q=80", images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=500&q=80"], description: "Kuz va bahor uchun ajoyib ishlangan paltosimon pidjak.", variants: [], reviews: [] },
  { id: "mock-5", title: "Bolalar Qulay Sportivkasi", price: 180000, category: "Bolalar", image: "https://images.unsplash.com/photo-1519241047957-be31d7379a5d?auto=format&fit=crop&w=500&q=80", images: ["https://images.unsplash.com/photo-1519241047957-be31d7379a5d?auto=format&fit=crop&w=500&q=80"], description: "Chaqaloqlar va yosh bolalar uchun qulay.", variants: [], reviews: [] },
  { id: "mock-6", title: "Quyosh Ko'zoynagi", price: 850000, category: "Aksessuar", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=500&q=80", images: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=500&q=80"], description: "Quyosh nuridan himoyalovchi polarizatsiyalangan ko'zoynaklar.", variants: [], reviews: [] },
];

export async function getProducts(query: string = "") {
  try {
    const products = await prisma.product.findMany({
      where: query ? {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ]
      } : undefined,
      select: {
        id: true,
        title: true,
        price: true,
        images: true,
        category: true,
      },
      take: 20
    });

    const formattedDbProducts = products.map((p: { id: string; title: string; price: number; images: string[]; category: string }) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      image: p.images[0] || FALLBACK_PRODUCTS[0].image,
      category: p.category.toString()
    }));

    let results = formattedDbProducts;

    // Use mock products if DB is completely empty (no stores setup yet)
    if (products.length === 0) {
      if (query) {
        results = FALLBACK_PRODUCTS.filter(p => 
          p.title.toLowerCase().includes(query.toLowerCase()) || 
          p.category.toLowerCase().includes(query.toLowerCase())
        );
      } else {
        results = FALLBACK_PRODUCTS;
      }
    }

    return { success: true, data: results };
  } catch (error) {
    console.error("Error fetching products:", error);
    // If DB fails (like edge initialization error), return fallbacks
    return { 
      success: true, 
      data: query 
        ? FALLBACK_PRODUCTS.filter(p => p.title.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase())) 
        : FALLBACK_PRODUCTS 
    };
  }
}

export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        variants: true,
        reviews: {
          include: {
            buyer: {
              select: { name: true }
            }
          }
        }
      }
    });

    if (product) {
      return { success: true, data: product };
    }
  } catch (error) {
    console.error("Error fetching product by id:", error);
  }

  // Fallback if not found in DB or DB errs
  const fallback = FALLBACK_PRODUCTS.find(p => p.id === id);
  if (fallback) {
    return { success: true, data: fallback };
  }

  return { success: false, data: null };
}
