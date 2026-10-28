import { categories } from './categories.js';
import { makeImages } from './productImage.js';
import * as p1 from './catalog/part1.js';
import * as p2 from './catalog/part2.js';
import * as p3 from './catalog/part3.js';

const rows = { ...p1, ...p2, ...p3 };

// Детерминированный генератор случайных чисел: каталог одинаков при каждой загрузке
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const roundPrice = (x) => Math.round(x / 100) * 100 - 10;

function buildDescription(cat, name, brand, specs) {
  const values = Object.values(specs);
  const lead = `${name} — ${cat.noun} от ${brand} для ${cat.purpose}.`;
  const body = `Ключевые параметры: ${values[0]}, ${values[1]}${values[2] ? ', ' + values[2] : ''}.`;
  const tail = `Официальная гарантия, проверка перед отправкой и быстрая доставка по Бишкеку и всему Кыргызстану.`;
  return `${lead} ${body} ${tail}`;
}

let nextId = 1;
export const products = [];

for (const cat of categories) {
  const list = rows[cat.slug === 'gpu' ? 'gpu' : cat.slug];
  if (!list) throw new Error(`Нет данных для категории ${cat.slug}`);
  for (const [name, brand, price, specValues] of list) {
    const id = nextId++;
    const rnd = mulberry32(id * 7919 + 13);

    const hasDiscount = rnd() < 0.42;
    const discount = hasDiscount ? Math.round(5 + rnd() * 20) : 0;
    let oldPrice = null;
    if (hasDiscount) {
      oldPrice = roundPrice(price / (1 - discount / 100));
      if (oldPrice <= price) oldPrice = price + 100;
    }
    const rating = Math.round((4 + rnd() * 0.95) * 10) / 10;
    const reviewCount = Math.round(6 + Math.pow(rnd(), 1.6) * 460);
    const outOfStock = rnd() < 0.06;
    const stock = outOfStock ? 0 : 2 + Math.floor(rnd() * 58);
    const isNew = rnd() < 0.2;
    const isPopular = reviewCount > 160 && rating >= 4.5 ? true : rnd() < 0.08;

    const specifications = {};
    cat.specLabels.forEach((label, i) => {
      specifications[label] = specValues[i];
    });
    specifications['Бренд'] = brand;
    specifications['Гарантия'] = cat.slug === 'accessories' ? '12 месяцев' : '24 месяца';

    const product = {
      id,
      name,
      brand,
      category: cat.name,
      categorySlug: cat.slug,
      price,
      oldPrice,
      discount,
      rating,
      reviewCount,
      stock,
      isNew,
      isPopular,
      description: buildDescription(cat, name, brand, specifications),
      specifications,
    };

    // Изображения генерируются лениво — только когда они реально нужны
    let cached = null;
    Object.defineProperty(product, 'images', {
      enumerable: true,
      get() {
        if (!cached) cached = makeImages(product);
        return cached;
      },
    });
    products.push(product);
  }
}

export const productById = new Map(products.map((p) => [p.id, p]));

export const allBrands = [...new Set(products.map((p) => p.brand))].sort((a, b) => a.localeCompare(b));

export const productsByCategory = (slug) => products.filter((p) => p.categorySlug === slug);
