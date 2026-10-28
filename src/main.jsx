import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource-variable/inter'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { FavoritesProvider } from './context/FavoritesContext.jsx'
import { ReviewsProvider } from './context/ReviewsContext.jsx'
import './styles/base.css'
import './styles/components.css'
import './styles/pages.css'

// basename берётся из vite base — сайт одинаково работает и в корне, и в /<repo>/ на GitHub Pages
const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <ThemeProvider>
        <ToastProvider>
          <CartProvider>
            <FavoritesProvider>
              <ReviewsProvider>
                <App />
              </ReviewsProvider>
            </FavoritesProvider>
          </CartProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
