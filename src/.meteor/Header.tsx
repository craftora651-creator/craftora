import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import './Header.css';
import { useMyShops } from '../server/FastAPI/shop.hooks';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [cartCount] = useState(4);
  const [favCount] = useState(12);

  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { data: shops, isLoading: shopsLoading } = useMyShops();

  // Login durumunu kontrol et
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserEmail(user.email || 'Kullanıcı');
        setIsLoggedIn(true);
      } catch (e) {
        console.error('User parse error:', e);
      }
    } else {
      setIsLoggedIn(false);
      setUserEmail('');
    }
  }, []);

  // Dışarı tıklayınca menü kapansın
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Storage değişikliklerini dinle
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('access_token');
      const userStr = localStorage.getItem('user');

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          setUserEmail(user.email || 'Kullanıcı');
          setIsLoggedIn(true);
        } catch (e) {
          console.error('User parse error:', e);
        }
      } else {
        setIsLoggedIn(false);
        setUserEmail('');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Logout işlemi
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserEmail('');
    setIsUserMenuOpen(false);
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* TOP BAR - Ultra Modern */}
      <div className={`pxTopBar ${isScrolled ? 'pxTopBarScrolled' : ''}`}>
        <div className="pxContainer">
          <div className="pxTopLeft">
            <a href="#" className="pxTopLink">
              <span className="material-icons-outlined" style={{ fontSize: '16px' }}>location_on</span>
              <span className="pxLinkText">Store Locations</span>
            </a>
            <a href="#" className="pxTopLink">
              <span className="material-icons-outlined" style={{ fontSize: '16px' }}>local_shipping</span>
              <span className="pxLinkText">Track Your Order</span>
            </a>
          </div>

          <div className="pxTopCenter">
            <span className="pxBadge">30 DAYS FREE RETURN</span>
            <span className="pxBadge">FREE SHIPPING</span>
            <span className="pxBadge">BEST ECOMMERCE IN ASIA</span>
          </div>

          <div className="pxTopRight">
            <button className="pxTopButton">
              <span>$ Dollar (US)</span>
              <span className="material-icons-outlined pxExpandIcon">expand_more</span>
            </button>
            <button className="pxTopButton">
              <span>EN</span>
              <span className="material-icons-outlined pxExpandIcon">expand_more</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN HEADER - Glassmorphism Masterpiece */}
      <header className={`pxMainHeader ${isScrolled ? 'pxMainHeaderScrolled' : ''}`}>
        <div className="pxContainer">
          {/* LOGO - Animasyonlu */}
          <div className="pxLogoWrap">
            <div className="pxLogoIconBox">
              <span className="material-symbols-outlined pxLogoIcon">hexagon</span>
              <div className="pxLogoGlow"></div>
            </div>
            <span className="pxLogoText">Craftora</span>
          </div>

          {/* SEARCH - Ultra Modern */}
          <div className={`pxSearchWrap ${isSearchFocused ? 'pxSearchFocused' : ''}`}>
            <input
              type="text"
              placeholder="Search products, brands, categories..."
              className="pxSearchInput"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            <div className="pxSearchDivider"></div>
            <button className="pxCategoryBtn">
              All Categories
              <span className="material-icons-outlined">expand_more</span>
            </button>
            <button className="pxSearchBtn">
              <span className="material-icons-outlined pxSearchIcon">search</span>
              <div className="pxRipple"></div>
            </button>
          </div>

          {/* USER ACTIONS - Neon Efektli */}
          <div className="pxUserActions">
            {/* FAVORİ */}
            <div className="pxIconGroup">
              <div className="pxIconWrap">
                <span className="material-icons-outlined pxIcon">favorite_border</span>
                <span className="pxBadge">{favCount}</span>
                <div className="pxIconGlow"></div>
              </div>

              {/* SEPET */}
              <div className="pxIconWrap">
                <span className="material-icons-outlined pxIcon">shopping_cart</span>
                <span className="pxBadge">{cartCount}</span>
                <div className="pxIconGlow"></div>
              </div>

              {/* KULLANICI */}
              <div className="pxUserWrap" ref={menuRef}>
                <button
                  className={`pxUserBtn ${isUserMenuOpen ? 'pxUserBtnActive' : ''}`}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <span className="material-icons-outlined pxIcon">person_outline</span>
                  <div className="pxUserGlow"></div>
                </button>

                {/* DROPDOWN MENU - Modern */}
                {isUserMenuOpen && (
                  <div className="pxDropdown">
                    {isLoggedIn ? (
                      <>
                        <div className="pxDropdownHeader">
                          <div className="pxUserAvatar">
                            {userEmail.charAt(0).toUpperCase()}
                          </div>
                          <div className="pxUserInfo">
                            <span className="pxUserName">{userEmail}</span>
                            <span className="pxUserRole">Member</span>
                          </div>
                        </div>

                        <div className="pxDropdownMenu">
                          <div className="pxMenuItem" onClick={() => navigate('/shop')}>
                            <span className="material-icons-outlined">storefront</span>
                            <span>Craftora Shop</span>
                          </div>

                          <div className="pxMenuItem" onClick={() => {
                            if (shops && shops.length > 0) {
                              navigate('/admin');
                            } else {
                              navigate('/admin-onboarding');
                            }
                          }}>
                            <span className="material-icons-outlined">store</span>
                            <span>Mağazam</span>
                          </div>

                          <div className="pxMenuItem" onClick={() => navigate('/my-courses')}>
                            <span className="material-icons-outlined">school</span>
                            <span>Kurslarım</span>
                          </div>

                          <div className="pxMenuItem" onClick={() => navigate('/my-media')}>
                            <span className="material-icons-outlined">play_circle</span>
                            <span>Medya Kütüphanem</span>
                          </div>

                          <div className="pxDivider"></div>

                          <div className="pxMenuItem" onClick={() => navigate('/dashboard')}>
                            <span className="material-icons-outlined">dashboard</span>
                            <span>Dashboard</span>
                          </div>

                          <div className="pxMenuItem" onClick={() => navigate('/favorites')}>
                            <span className="material-icons-outlined">favorite</span>
                            <span>Favorilerim</span>
                          </div>

                          <div className="pxMenuItem" onClick={() => navigate('/orders')}>
                            <span className="material-icons-outlined">shopping_bag</span>
                            <span>Siparişlerim</span>
                          </div>

                          <div className="pxDivider"></div>

                          <div className="pxMenuItem" onClick={() => navigate('/settings')}>
                            <span className="material-icons-outlined">settings</span>
                            <span>Hesap Ayarları</span>
                          </div>

                          {userEmail === 'test@craftora.com' && (
                            <div className="pxMenuItem" onClick={() => navigate('/admin')}>
                              <span className="material-icons-outlined">admin_panel_settings</span>
                              <span>Admin Panel</span>
                            </div>
                          )}

                          <div className="pxMenuItem pxLogout" onClick={handleLogout}>
                            <span className="material-icons-outlined">logout</span>
                            <span>Çıkış Yap</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="pxDropdownMenu">
                        <div className="pxMenuItem" onClick={() => navigate('/login')}>
                          <span className="material-icons-outlined">login</span>
                          <span>Giriş Yap</span>
                        </div>
                        <div className="pxMenuItem" onClick={() => navigate('/register')}>
                          <span className="material-icons-outlined">person_add</span>
                          <span>Kayıt Ol</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;