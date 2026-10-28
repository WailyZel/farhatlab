import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Heart, Menu, Moon, Search, ShoppingCart, Sun, X, Zap } from 'lucide-react';
import SearchBar from '../SearchBar/SearchBar.jsx';
import { categories } from '../../data/categories.js';
import { useCart } from '../../context/CartContext.jsx';
import { useFavorites } from '../../context/FavoritesContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useClickOutside } from '../../hooks/useClickOutside.js';

export default function Header() {
  const { count: cartCount } = useCart();
  const { count: favCount } = useFavorites();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const catRef = useRef(null);
  const location = useLocation();

  useClickOutside(catRef, () => setCatOpen(false), catOpen);

  useEffect(() => {
    setMenuOpen(false);
    setCatOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const isDark = theme === 'dark';

  return (
    <header className="header">
      <div className="container header-inner">
        <button type="button" className="icon-btn header-burger" onClick={() => setMenuOpen(true)} aria-label="Открыть меню">
          <Menu size={22} />
        </button>

        <Link to="/" className="logo" aria-label="FarhatLab — на главную">
          <span className="logo-mark">
            <Zap size={18} strokeWidth={2.6} />
          </span>
          <span className="logo-text">
            Farhat<b>Lab</b>
          </span>
        </Link>

        <nav className="nav" aria-label="Основная навигация">
          <NavLink to="/" end>
            Главная
          </NavLink>
          <NavLink to="/catalog">Каталог</NavLink>
          <div className="nav-dropdown" ref={catRef}>
            <button type="button" className={`nav-btn ${catOpen ? 'is-open' : ''}`} onClick={() => setCatOpen((o) => !o)} aria-expanded={catOpen} aria-haspopup="true">
              Категории <ChevronDown size={15} />
            </button>
            {catOpen && (
              <div className="mega" role="menu">
                {categories.map((c) => (
                  <Link key={c.slug} to={`/category/${c.slug}`} role="menuitem">
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <NavLink to="/about">О магазине</NavLink>
          <NavLink to="/contacts">Контакты</NavLink>
        </nav>

        <div className="header-search">
          <SearchBar />
        </div>

        <div className="header-actions">
          <button type="button" className="icon-btn header-search-toggle" onClick={() => setSearchOpen((o) => !o)} aria-label="Поиск" aria-expanded={searchOpen}>
            {searchOpen ? <X size={21} /> : <Search size={21} />}
          </button>
          <Link to="/favorites" className="icon-btn" aria-label={`Избранное: ${favCount}`}>
            <Heart size={21} />
            {favCount > 0 && <span className="badge-count" key={favCount}>{favCount}</span>}
          </Link>
          <Link to="/cart" className="icon-btn" aria-label={`Корзина: ${cartCount}`}>
            <ShoppingCart size={21} />
            {cartCount > 0 && <span className="badge-count" key={cartCount}>{cartCount}</span>}
          </Link>
          <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label={isDark ? 'Включить светлую тему' : 'Включить тёмную тему'} title={isDark ? 'Light' : 'Dark'}>
            <span className={`theme-toggle-thumb ${isDark ? 'is-dark' : ''}`}>{isDark ? <Moon size={15} /> : <Sun size={15} />}</span>
            <span className="theme-toggle-label">{isDark ? 'Dark' : 'Light'}</span>
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="header-search-mobile container">
          <SearchBar autoFocus onDone={() => setSearchOpen(false)} />
        </div>
      )}

      {menuOpen && (
        <div className="drawer-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setMenuOpen(false)}>
          <aside className="drawer" aria-label="Меню">
            <div className="drawer-head">
              <span className="logo-text">
                Farhat<b>Lab</b>
              </span>
              <button type="button" className="icon-btn" onClick={() => setMenuOpen(false)} aria-label="Закрыть меню">
                <X size={22} />
              </button>
            </div>
            <nav className="drawer-nav">
              <NavLink to="/" end>
                Главная
              </NavLink>
              <NavLink to="/catalog">Каталог</NavLink>
              <NavLink to="/about">О магазине</NavLink>
              <NavLink to="/contacts">Контакты</NavLink>
              <NavLink to="/favorites">Избранное {favCount > 0 && <span className="drawer-count">{favCount}</span>}</NavLink>
              <NavLink to="/cart">Корзина {cartCount > 0 && <span className="drawer-count">{cartCount}</span>}</NavLink>
            </nav>
            <div className="drawer-section">Категории</div>
            <div className="drawer-cats">
              {categories.map((c) => (
                <Link key={c.slug} to={`/category/${c.slug}`}>
                  {c.name}
                </Link>
              ))}
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
