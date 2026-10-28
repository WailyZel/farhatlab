import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Zap } from 'lucide-react';
import { categories } from '../../data/categories.js';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link to="/" className="logo">
            <span className="logo-mark">
              <Zap size={18} strokeWidth={2.6} />
            </span>
            <span className="logo-text">
              Farhat<b>Lab</b>
            </span>
          </Link>
          <p className="muted">Технологии для работы, игр и создания. Комплектующие и периферия с гарантией и быстрой доставкой.</p>
          <p className="muted small">Это демонстрационный интернет-магазин. Товары и цены вымышлены.</p>
        </div>

        <div>
          <h4>Каталог</h4>
          <ul>
            {categories.slice(0, 8).map((c) => (
              <li key={c.slug}>
                <Link to={`/category/${c.slug}`}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4>&nbsp;</h4>
          <ul>
            {categories.slice(8).map((c) => (
              <li key={c.slug}>
                <Link to={`/category/${c.slug}`}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Магазин</h4>
          <ul>
            <li>
              <Link to="/about">О магазине</Link>
            </li>
            <li>
              <Link to="/contacts">Контакты</Link>
            </li>
            <li>
              <Link to="/favorites">Избранное</Link>
            </li>
            <li>
              <Link to="/cart">Корзина</Link>
            </li>
          </ul>
          <ul className="footer-contacts">
            <li>
              <Phone size={15} /> +996 (555) 00-00-00
            </li>
            <li>
              <Mail size={15} /> hello@farhatlab.example
            </li>
            <li>
              <MapPin size={15} /> Бишкек, Кыргызстан
            </li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} FarhatLab. Все права защищены.</span>
        <span className="muted">Цены указаны в сомах (KGS)</span>
      </div>
    </footer>
  );
}
