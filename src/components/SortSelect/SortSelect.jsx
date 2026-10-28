import { ChevronDown } from 'lucide-react';
import { SORT_OPTIONS } from '../../utils/catalog.js';

export default function SortSelect({ value, onChange }) {
  return (
    <label className="sort-select">
      <span className="sr-only">Сортировка</span>
      <span className="muted sort-label">Сортировка:</span>
      <span className="select-wrap">
        <select className="select" value={value} onChange={(e) => onChange(e.target.value)}>
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="select-chevron" />
      </span>
    </label>
  );
}
