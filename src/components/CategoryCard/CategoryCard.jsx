import { Link } from 'react-router-dom';
import { ArrowRight, Box, Cable, CircuitBoard, Cpu, Database, HardDrive, Headphones, Keyboard, MemoryStick, Mic, Microchip, Monitor, Mouse, Plug, Webcam, Wifi } from 'lucide-react';

const icons = { Box, Cable, CircuitBoard, Cpu, Database, HardDrive, Headphones, Keyboard, MemoryStick, Mic, Microchip, Monitor, Mouse, Plug, Webcam, Wifi };

export function CategoryIcon({ name, size = 28 }) {
  const Icon = icons[name] || Box;
  return <Icon size={size} strokeWidth={1.6} />;
}

export default function CategoryCard({ category, count }) {
  return (
    <Link to={`/category/${category.slug}`} className="ccard">
      <span className="ccard-icon">
        <CategoryIcon name={category.icon} />
      </span>
      <span className="ccard-text">
        <strong>{category.short}</strong>
        <small>{category.tagline}</small>
      </span>
      <span className="ccard-meta">
        {count != null && <span className="ccard-count">{count} товаров</span>}
        <ArrowRight size={18} className="ccard-arrow" />
      </span>
    </Link>
  );
}
