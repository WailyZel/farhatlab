import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../Header/Header.jsx';
import Footer from '../Footer/Footer.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }, [pathname]);
  return null;
}

export default function Layout() {
  return (
    <div className="app">
      <a href="#main" className="skip-link">
        Перейти к содержимому
      </a>
      <ScrollToTop />
      <Header />
      <main id="main">
        <Suspense fallback={<div className="page-loader" role="status" aria-label="Загрузка"><span className="spinner" /></div>}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
