/**
 * Format currency using South Asian numbering system with BDT '৳' symbol.
 * Example: 1842000 => "৳18,42,000", 4900 => "৳4,900"
 */
export function formatBdtCurrency(amount: number): string {
  const rounded = Math.round(amount || 0);
  const isNegative = rounded < 0;
  const absStr = Math.abs(rounded).toString();

  if (absStr.length <= 3) {
    return `${isNegative ? "-" : ""}৳${absStr}`;
  }

  const lastThree = absStr.substring(absStr.length - 3);
  const otherNumbers = absStr.substring(0, absStr.length - 3);
  const formattedOthers = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",");

  return `${isNegative ? "-" : ""}৳${formattedOthers},${lastThree}`;
}

/**
 * Generate 2-letter uppercase initials for store avatar.
 * Example: "Nabin Fashion" => "NF", "Rangmohol Craft" => "RC"
 */
export function getStoreInitials(name?: string | null): string {
  if (!name || typeof name !== "string") return "SD";
  const clean = name.trim();
  if (!clean) return "SD";

  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
}

/**
 * Format date string into human-readable date.
 * Example: "2026-07-12T00:00:00.000Z" => "Jul 12, 2026"
 */
export function formatDisplayDate(dateStr?: string | null): string {
  if (!dateStr) return "N/A";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}
