import { useEffect } from 'react';

const DEFAULT_TITLE = 'FarhatLab — Компьютерная техника и периферия';
const DEFAULT_DESC =
  'FarhatLab — компьютерная техника, комплектующие и периферия для работы, игр и создания. Видеокарты, процессоры, мониторы, клавиатуры, мыши, роутеры и многое другое.';

export function useSEO(title, description) {
  useEffect(() => {
    document.title = title ? `${title} — FarhatLab` : DEFAULT_TITLE;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', description || DEFAULT_DESC);
    return () => {
      document.title = DEFAULT_TITLE;
      if (meta) meta.setAttribute('content', DEFAULT_DESC);
    };
  }, [title, description]);
}
