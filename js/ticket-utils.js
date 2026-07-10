/**
 * Ticket show-date helpers. A ticket expires after 11:59:59 PM on the show day (local time).
 */

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function parseDateFieldToIso(dateStr) {
  const raw = String(dateStr || '').trim();
  if (!raw) return null;

  if (ISO_DATE_RE.test(raw)) {
    return raw;
  }

  const embedded = raw.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (embedded) {
    return embedded[0];
  }

  const slash = raw.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (slash) {
    const day = slash[1].padStart(2, '0');
    const month = slash[2].padStart(2, '0');
    return `${slash[3]}-${month}-${day}`;
  }

  const parsed = Date.parse(raw);
  if (!Number.isNaN(parsed)) {
    return toLocalIsoDate(new Date(parsed));
  }

  return null;
}

export function resolveShowDateIso(ticket) {
  if (!ticket) return null;

  // Prefer visible show date (from booking URL) — numericDate was often saved as "today" by an old bug
  const fromDisplayDate = parseDateFieldToIso(ticket.date);
  if (fromDisplayDate) {
    return fromDisplayDate;
  }

  if (ticket.numericDate && ISO_DATE_RE.test(ticket.numericDate)) {
    return ticket.numericDate;
  }

  return null;
}

export function getShowDayEnd(ticket) {
  const iso = resolveShowDateIso(ticket);
  if (!iso) return null;

  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day, 23, 59, 59, 999);
}

export function isTicketExpired(ticket, now = new Date()) {
  const end = getShowDayEnd(ticket);
  if (!end) return false;
  return now.getTime() > end.getTime();
}

function toLocalIsoDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
