export function maskDate(raw) {
  const d = raw.replace(/\D/g, '').slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0,2)}/${d.slice(2)}`;
  return `${d.slice(0,2)}/${d.slice(2,4)}/${d.slice(4)}`;
}

export function maskTime(raw) {
  const d = raw.replace(/\D/g, '').slice(0, 4);
  if (d.length <= 2) return d;
  return `${d.slice(0,2)}:${d.slice(2)}`;
}

export function todayStr() {
  const now = new Date();
  const d = String(now.getDate()).padStart(2,'0');
  const m = String(now.getMonth()+1).padStart(2,'0');
  return `${d}/${m}/${now.getFullYear()}`;
}

// Convert dd/mm/yyyy (UI) → yyyy-mm-dd (DB/ISO) — returns null if input is falsy
export function ddmmToIso(dateStr) {
  if (!dateStr) return null;
  // Already ISO?
  if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) return dateStr.slice(0, 10);
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;
  const [dd, mm, yyyy] = parts;
  if (!dd || !mm || !yyyy || yyyy.length < 4) return null;
  return `${yyyy}-${mm.padStart(2,'0')}-${dd.padStart(2,'0')}`;
}

// Convert yyyy-mm-dd or ISO timestamp (DB) → dd/mm/yyyy (UI display)
export function isoToDdmm(isoStr) {
  if (!isoStr) return null;
  const str = String(isoStr).slice(0, 10); // take only date portion
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const [yyyy, mm, dd] = str.split('-');
    return `${dd}/${mm}/${yyyy}`;
  }
  return isoStr; // already dd/mm/yyyy or unknown — return as-is
}

// Parse dd/mm/aaaa → year integer (returns null if invalid)
export function parseYear(dateStr) {
  if (!dateStr) return null;
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const y = parseInt(parts[2]);
    if (!isNaN(y) && y > 1900 && y <= new Date().getFullYear()) return y;
  }
  const y = parseInt(dateStr);
  return (!isNaN(y) && y > 1900) ? y : null;
}

// Parse dd/mm/aaaa → age in years (returns null if invalid)
export function calcAgeFromDate(dateStr) {
  if (!dateStr) return null;
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;
  const [dd, mm, yyyy] = parts.map(Number);
  if (isNaN(dd) || isNaN(mm) || isNaN(yyyy)) return null;
  const birth = new Date(yyyy, mm - 1, dd);
  const today = new Date();
  const age = Math.floor((today - birth) / (365.25 * 24 * 60 * 60 * 1000));
  return age >= 0 ? age : null;
}
