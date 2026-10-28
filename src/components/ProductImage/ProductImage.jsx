import { memo, useState } from 'react';

// Изображение с ленивой загрузкой и плавным появлением
function ProductImage({ src, alt, className = '', priority = false }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <img
      className={`product-img ${loaded ? 'is-loaded' : ''} ${className}`}
      src={src}
      alt={alt}
      width="600"
      height="600"
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      onLoad={() => setLoaded(true)}
    />
  );
}

export default memo(ProductImage);
