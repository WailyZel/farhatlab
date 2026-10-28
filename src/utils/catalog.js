export const SORT_OPTIONS = [
  { value: 'popular', label: 'Популярные' },
  { value: 'price-asc', label: 'Сначала дешёвые' },
  { value: 'price-desc', label: 'Сначала дорогие' },
  { value: 'rating', label: 'Высокий рейтинг' },
  { value: 'new', label: 'Новинки' },
  { value: 'discount', label: 'Большая скидка' },
];

export const DEFAULT_FILTERS = {
  category: '',
  brands: [],
  minPrice: '',
  maxPrice: '',
  minRating: 0,
  inStock: false,
  onSale: false,
  isNew: false,
};

export function applyFilters(list, f) {
  const min = f.minPrice === '' ? null : Number(f.minPrice);
  const max = f.maxPrice === '' ? null : Number(f.maxPrice);
  return list.filter((p) => {
    if (f.category && p.categorySlug !== f.category) return false;
    if (f.brands.length && !f.brands.includes(p.brand)) return false;
    if (min !== null && !Number.isNaN(min) && p.price < min) return false;
    if (max !== null && !Number.isNaN(max) && p.price > max) return false;
    if (f.minRating && p.rating < f.minRating) return false;
    if (f.inStock && p.stock <= 0) return false;
    if (f.onSale && !p.discount) return false;
    if (f.isNew && !p.isNew) return false;
    return true;
  });
}

const popularScore = (p) => (p.isPopular ? 100000 : 0) + p.reviewCount * p.rating;

export function sortProducts(list, sort) {
  const arr = [...list];
  switch (sort) {
    case 'price-asc':
      return arr.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return arr.sort((a, b) => b.price - a.price);
    case 'rating':
      return arr.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    case 'new':
      return arr.sort((a, b) => Number(b.isNew) - Number(a.isNew) || b.id - a.id);
    case 'discount':
      return arr.sort((a, b) => b.discount - a.discount || a.price - b.price);
    default:
      return arr.sort((a, b) => popularScore(b) - popularScore(a));
  }
}

export function countActiveFilters(f) {
  let n = 0;
  if (f.brands.length) n++;
  if (f.minPrice !== '' || f.maxPrice !== '') n++;
  if (f.minRating) n++;
  if (f.inStock) n++;
  if (f.onSale) n++;
  if (f.isNew) n++;
  return n;
}
