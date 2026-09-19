export function formatAuditDateTime(dateStr?: string | null): {
  formatted: string;
  relative: string;
} {
  if (!dateStr) return { formatted: "N/A", relative: "" };
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return { formatted: dateStr, relative: "" };

    const formatted = date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const now = Date.now();
    const diffSec = Math.floor((now - date.getTime()) / 1000);

    let relative = "";
    if (diffSec < 60) {
      relative = "just now";
    } else if (diffSec < 3600) {
      const mins = Math.floor(diffSec / 60);
      relative = `${mins}m ago`;
    } else if (diffSec < 86400) {
      const hours = Math.floor(diffSec / 3600);
      relative = `${hours}h ago`;
    } else {
      const days = Math.floor(diffSec / 86400);
      relative = `${days}d ago`;
    }

    return { formatted, relative };
  } catch {
    return { formatted: dateStr, relative: "" };
  }
}

export function parseDeviceString(ua?: string | null): string {
  if (!ua) return "Unknown device";
  if (ua.includes("Chrome")) return "Chrome / Web";
  if (ua.includes("Firefox")) return "Firefox / Web";
  if (ua.includes("Safari")) return "Safari / Web";
  if (ua.includes("Postman") || ua.includes("curl")) return "API Client";
  return ua.length > 25 ? `${ua.slice(0, 25)}...` : ua;
}

export function truncateSnippet(str?: string | null, len = 8): string {
  if (!str) return "—";
  if (str.length <= len) return str;
  return `${str.slice(0, len)}...`;
}
