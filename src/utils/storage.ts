export function loadLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`career-os-${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function saveLS(key: string, data: unknown) {
  localStorage.setItem(`career-os-${key}`, JSON.stringify(data));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
