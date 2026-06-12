export function toIso(datetimeLocal: string): string {
  return new Date(datetimeLocal).toISOString()
}

export function formatDisplay(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function nowLocal(): string {
  const d = new Date()
  d.setSeconds(0, 0)

  return d.toISOString().slice(0, 16)
}
