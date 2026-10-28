import { products } from '../data/products.js';

// Поисковый индекс строится один раз: название, бренд, категория, описание и характеристики
const index = products.map((p) => ({
  product: p,
  name: p.name.toLowerCase(),
  brand: p.brand.toLowerCase(),
  category: p.category.toLowerCase(),
  rest: (p.description + ' ' + Object.values(p.specifications).join(' ')).toLowerCase(),
}));

const normalize = (s) => s.toLowerCase().replace(/ё/g, 'е').trim();

export function searchProducts(query, limit = Infinity) {
  const q = normalize(query);
  if (!q) return [];
  const tokens = q.split(/\s+/).filter(Boolean);
  const scored = [];
  for (const item of index) {
    let score = 0;
    let ok = true;
    for (const t of tokens) {
      let s = 0;
      if (item.name.includes(t)) s += item.name.startsWith(t) ? 12 : 8;
      if (item.brand.includes(t)) s += 5;
      if (item.category.includes(t)) s += 3;
      if (item.rest.includes(t)) s += 1;
      if (!s) {
        ok = false;
        break;
      }
      score += s;
    }
    if (ok) scored.push([score + (item.product.isPopular ? 0.5 : 0), item.product]);
  }
  scored.sort((a, b) => b[0] - a[0] || a[1].price - b[1].price);
  const out = scored.map((x) => x[1]);
  return Number.isFinite(limit) ? out.slice(0, limit) : out;
}
