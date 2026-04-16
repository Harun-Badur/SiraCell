import { LogOut, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    // We use window.location.href instead of navigate to completely wipe React Query cache and application state
    window.location.href = '/login';
  };

  return (
    <nav className="tc-navbar">
      <div className="tc-navbar-inner">

        {/* ── Turkcell Logosu + Ürün Adı ── */}
        <button
          onClick={() => navigate('/')}
          className="tc-navbar-brand"
          aria-label="Ana sayfaya dön"
        >
          {/* Resmi Turkcell Logosu — turkcell.com.tr'den */}
          <img
            src="https://www.turkcell.com.tr/content/dam/turkcell/genel/logo/turkcell-logo.png"
            alt="Turkcell"
            className="tc-logo-img"
            onError={(e) => {
              // Fallback: logo yüklenemezse SVG ile göster
              const img = e.currentTarget;
              img.style.display = 'none';
              const fallback = img.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
          {/* Fallback SVG logosu (img yüklenemezse gösterilir) */}
          <span className="tc-logo-fallback" aria-hidden="true">
            <svg viewBox="0 0 110 32" xmlns="http://www.w3.org/2000/svg" className="tc-logo-svg">
              <rect width="110" height="32" rx="4" fill="#ffcc00"/>
              <text
                x="55" y="22"
                textAnchor="middle"
                fontFamily="'Arial Black', Arial, sans-serif"
                fontWeight="900"
                fontSize="15"
                letterSpacing="-0.3"
                fill="#003399"
              >turkcell</text>
            </svg>
          </span>

          {/* Ürün adı */}
          <span className="tc-navbar-product">
            <span className="tc-navbar-product-name">SıraCell</span>
            <span className="tc-navbar-product-sub">Dijital Sıra Yönetimi</span>
          </span>
        </button>

        {/* ── Sağ Taraf ── */}
        {token && (
          <div className="tc-navbar-actions">
            <button
              onClick={() => navigate('/history')}
              className="flex items-center gap-1.5 text-sm font-semibold text-blue-200 hover:text-white transition-colors mr-2"
              aria-label="Geçmiş işlemleri gör"
            >
              <Clock size={16} />
              <span className="hidden sm:inline">Geçmiş</span>
            </button>
            <button
              onClick={() => navigate('/staff')}
              className="tc-navbar-staff-btn"
            >
              Personel Paneli
            </button>
            <button
              onClick={handleLogout}
              className="tc-navbar-logout"
              aria-label="Çıkış yap"
            >
              <LogOut size={15} />
              <span>Çıkış</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};