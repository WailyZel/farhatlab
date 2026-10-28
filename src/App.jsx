import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout/Layout.jsx'
import Home from './pages/Home/Home.jsx'

// Остальные страницы грузятся лениво — первая отрисовка остаётся лёгкой
const Catalog = lazy(() => import('./pages/Catalog/Catalog.jsx'))
const Product = lazy(() => import('./pages/Product/Product.jsx'))
const Cart = lazy(() => import('./pages/Cart/Cart.jsx'))
const Favorites = lazy(() => import('./pages/Favorites/Favorites.jsx'))
const Search = lazy(() => import('./pages/Search/Search.jsx'))
const About = lazy(() => import('./pages/About/About.jsx'))
const Contacts = lazy(() => import('./pages/Contacts/Contacts.jsx'))
const NotFound = lazy(() => import('./pages/NotFound/NotFound.jsx'))

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="category/:category" element={<Catalog />} />
        <Route path="product/:id" element={<Product />} />
        <Route path="cart" element={<Cart />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="search" element={<Search />} />
        <Route path="about" element={<About />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  )
}
