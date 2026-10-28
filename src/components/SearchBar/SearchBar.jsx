import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { searchProducts } from '../../utils/search.js';
import { useDebounce } from '../../hooks/useDebounce.js';
import { useClickOutside } from '../../hooks/useClickOutside.js';
import { formatPrice } from '../../utils/format.js';
import ProductImage from '../ProductImage/ProductImage.jsx';

export default function SearchBar({ autoFocus = false, onDone }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const navigate = useNavigate();
  const location = useLocation();
  const wrapRef = useRef(null);
  const debounced = useDebounce(query, 150);

  const allResults = useMemo(() => (debounced.trim().length >= 1 ? searchProducts(debounced) : []), [debounced]);
  const results = allResults.slice(0, 6);

  useClickOutside(wrapRef, () => setOpen(false), open);
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);
  useEffect(() => setActive(-1), [debounced]);

  const goSearch = () => {
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    navigate(`/search?q=${encodeURIComponent(q)}`);
    onDone?.();
  };

  const goProduct = (p) => {
    setOpen(false);
    setQuery('');
    navigate(`/product/${p.id}`);
    onDone?.();
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(results.length - 1, a + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(-1, a - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (active >= 0 && results[active]) goProduct(results[active]);
      else goSearch();
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div className="searchbar" ref={wrapRef} role="search">
      <Search size={18} className="searchbar-icon" aria-hidden="true" />
      <input
        className="searchbar-input"
        type="search"
        placeholder="Поиск: RTX 5070, SSD 1 ТБ, мышь…"
        aria-label="Поиск по каталогу"
        aria-expanded={open}
        aria-autocomplete="list"
        autoFocus={autoFocus}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
      />
      {query && (
        <button type="button" className="searchbar-clear" onClick={() => setQuery('')} aria-label="Очистить поиск">
          <X size={16} />
        </button>
      )}

      {open && query.trim() && (
        <div className="search-dropdown" role="listbox">
          {results.length === 0 ? (
            <div className="search-empty">Ничего не найдено по запросу «{query.trim()}»</div>
          ) : (
            <>
              <div className="search-dropdown-title">Поиск: {query.trim()}</div>
              <ul>
                {results.map((p, i) => (
                  <li key={p.id} role="option" aria-selected={i === active}>
                    <button type="button" className={`search-item ${i === active ? 'is-active' : ''}`} onMouseEnter={() => setActive(i)} onClick={() => goProduct(p)}>
                      <span className="search-thumb">
                        <ProductImage src={p.images[0]} alt="" />
                      </span>
                      <span className="search-item-text">
                        <span className="search-item-name">{p.name}</span>
                        <span className="muted small">{p.category}</span>
                      </span>
                      <span className="search-item-price">{formatPrice(p.price)}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <button type="button" className="search-all" onClick={goSearch}>
                Показать все результаты ({allResults.length})
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
