const nf = new Intl.NumberFormat('ru-RU')

export function formatNumber(n) {
  return nf.format(n)
}

export function formatPrice(value) {
  return `${nf.format(Math.round(value))} сом`
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function pluralize(n, one, few, many) {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return one
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few
  return many
}

// Короткое имя для уведомлений: «RTX 5070», «Ryzen 7 9800X3D», «Archer C6»
export function shortName(product) {
  const gpu = product.name.match(/\b(RTX|GTX|RX|Arc)\s?[A-Z]?\d{3,4}(\s(Ti Super|Super|Ti|XT|GRE))?/)
  if (gpu) return gpu[0]
  let n = product.name
  if (n.startsWith(product.brand)) n = n.slice(product.brand.length).trim()
  const words = n.split(/\s+/)
  return words.slice(0, 3).join(' ')
}

const FEMININE = new Set(['gpu', 'motherboards', 'ram', 'keyboards', 'mice', 'headsets', 'webcams'])

export function addedVerb(product) {
  return FEMININE.has(product.categorySlug) ? 'добавлена' : 'добавлен'
}
