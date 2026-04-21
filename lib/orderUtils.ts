// ─── Client-safe utility (no "use server") ───────────────────────────────────

export function orderStatusLabel(status: string): { label: string; color: string } {
  const map: Record<string, { label: string; color: string }> = {
    PENDING_PAYMENT: { label: "To'lov kutilmoqda", color: "warning" },
    PAID:            { label: "To'langan",         color: "success" },
    PROCESSING:      { label: "Tayyorlanmoqda",    color: "info" },
    READY:           { label: "Tayyor",             color: "info" },
    SHIPPED:         { label: "Yo'lda",             color: "info" },
    DELIVERED:       { label: "Yetkazildi",         color: "success" },
    CANCELED:        { label: "Bekor qilindi",      color: "error" },
    REFUNDED:        { label: "Qaytarildi",          color: "muted" },
  };
  return map[status] ?? { label: status, color: "muted" };
}
