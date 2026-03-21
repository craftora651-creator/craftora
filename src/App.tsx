// App.tsx
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import type { CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Header from "./components/Header";
import Hero from "./components/Hero";
import LogosSection from "./components/LogoSection";
import Features from "./components/Features";
import Gallery from "./components/Gallery";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import SignupCard from "./pages/SignupCard";
import Admin from "./pages/Admin";
import Medya from "./pages/Medya";
import Shop from './pages/shop';
import OnboardingFlow from "./bower_components/onboarding/OnboardingFlow";
import VipSelection from './pages/VipSelection';
import Payment from './pages/Payment';
import Checkout from './pages/Checkout';
import AdminOnboarding from './webpack/AdminOnboarding';
import CategoryShowcase from "./nix/CategoryShowcase";
import StatsShowcase from "./nix/StatsShowcase";
import CraftoraStudio from "./nix/CraftoraStudio";
import CraftoraTestimonials from "./nix/CraftoraTestimonials";
import CraftoraLeaderboard from "./nix/CraftoraLeaderboard";
import Demo from "./nix/Demo";
import AddProduct from './helpers/AddProduct';
import EditProduct from './helpers/EditProduct';
import ProductDetail from './lib/ProductDetail';
import AnalyticsDetail from './lib/AnalyticsDetail';
import CrafotraGPT from './pages/CrafotraGPT'; // <-- YENİ
import Intro from './share/intro';
import ShopThemesPage from './pages/ShopThemesPage';
import EcoMartTheme from './pages/EcoMartTheme';
import CraftoraThemes from './pages/CraftoraThemes';
import AddPhysicalProduct from './helpers/AddPhysicalProduct';
import CJProductImport from './pages/CJProductImport';
import CJTest from './pages/CJTest';

import "./index.css";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  // ✅ INTRO STATE - SADECE İLK ZİYARETTE GÖSTER
  const [showIntro, setShowIntro] = useState(() => {
    const introShown = localStorage.getItem('craftora-intro-shown');
    return introShown !== 'true';
  });

  const [portalParticles, setPortalParticles] = useState<CSSProperties[]>([]);
  const [stardust, setStardust] = useState<CSSProperties[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // ✅ INTRO BİTTİĞİNDE
  const handleIntroComplete = () => {
    setShowIntro(false);
    localStorage.setItem('craftora-intro-shown', 'true');
    console.log('Intro gösterildi ve kaydedildi!');
  };

  const handleGetStarted = () => {
    setIsTransitioning(true);
    const newParticles: CSSProperties[] = Array.from({ length: 40 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 1}s`,
      width: `${Math.random() * 8 + 2}px`,
      height: `${Math.random() * 8 + 2}px`,
      backgroundColor: `hsl(${Math.random() * 60 + 200}, 80%, 60%)`
    }));
    setPortalParticles(newParticles);
    const newStardust: CSSProperties[] = Array.from({ length: 50 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
      width: `${Math.random() * 3 + 1}px`,
      height: `${Math.random() * 3 + 1}px`
    }));
    setStardust(newStardust);
    navigate("/shop", { replace: true });
    setTimeout(() => {
      setIsTransitioning(false);
      setPortalParticles([]);
      setStardust([]);
    }, 1400);
  };

  // ✅ TEST BUTONU İÇİN NAVIGASYON
  const goToCrafotraGPT = () => {
    navigate('/crafotra-gpt');
  };

  return (
    <>
      {/* ✅ INTRO - SADECE showIntro true ise göster */}
      <AnimatePresence mode="wait">
        {showIntro && (
          <Intro
            key="intro"
            onComplete={handleIntroComplete}
            duration={6000}
          />
        )}
      </AnimatePresence>

      {/* ANA İÇERİK */}
      <AnimatePresence mode="wait">
        {!showIntro && (
          <motion.div
            key="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ width: '100%' }}
          >
            {/* 🧪 TEST BUTONU - En üstte sabit */}
            {!isTransitioning && (
              <div style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 9999,
                display: 'flex',
                gap: '10px'
              }}>
                

                {/* Ana sayfaya dönüş butonu - sadece GPT sayfasındayken göster */}
                {location.pathname === '/crafotra-gpt' && (
                  <button
                    onClick={() => navigate('/')}
                    style={{
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '50px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <span>🏠</span>
                    Ana Sayfa
                  </button>
                )}
              </div>
            )}

            {/* PORTAL TRANSITION */}
            {isTransitioning && (
              <div className="cr-portal">
                <div className="cr-field"></div>
                <div className="cr-pillar"></div>
                <div className="cr-pillar-2"></div>
                <div className="cr-pillar-3"></div>
                <div className="cr-sphere"></div>
                <div className="cr-sphere-2"></div>
                <div className="cr-ring"></div>
                <div className="cr-ring-2"></div>
                <div className="cr-ring-3"></div>
                <div className="cr-ring-4"></div>
                {portalParticles.map((p, i) => (
                  <div key={i} className="cr-quantum" style={p} />
                ))}
                <div className="cr-lightbeam" style={{ top: '15%' }}></div>
                <div className="cr-lightbeam-2" style={{ top: '45%' }}></div>
                <div className="cr-lightbeam-3" style={{ top: '75%' }}></div>
                <div className="cr-digital"></div>
                <div className="cr-scan"></div>
                <div className="cr-wave"></div>
                <div className="cr-wave-2"></div>
                <div className="cr-wave-3"></div>
                {stardust.map((s, i) => (
                  <div key={i} className="cr-stardust" style={s} />
                ))}
                <div className="cr-master">
                  <span className="cr-master-icon">🎨</span>
                  <h1 className="cr-master-text" data-text="CRAFTORA">CRAFTORA</h1>
                  <div className="cr-master-line"></div>
                  <span className="cr-master-shop">.shop</span>
                </div>
              </div>
            )}

            {isHomePage && !isTransitioning && <Header onGetStarted={handleGetStarted} />}

            <Routes>
              <Route
                path="/"
                element={!isTransitioning ? (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Hero />
                    {/* GroqTester'ı kaldırdık, butonla erişeceğiz */}
                    
                    <CategoryShowcase isDarkMode={false} />
                    <div className="premium-background">
                      <StatsShowcase />
                    </div>
                    <CraftoraLeaderboard />
                    <div className="premium-background">
                      <CraftoraStudio />
                    </div>
                    <CraftoraTestimonials />
                    <div className="premium-background">
                      <LogosSection />
                    </div>
                    <Features />
                    <div className="premium-background">
                      <Gallery />
                    </div>
                    <div className="premium-background">
                      <CTA />
                    </div>
                    <Footer />
                  </motion.div>
                ) : null}
              />
              
              {/* YENİ ROUTE - CrafotraGPT */}
              <Route path="/crafotra-gpt" element={<CrafotraGPT />} />
              <Route path="/craftora-themes" element={<CraftoraThemes />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<SignupCard />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/admin/*" element={<Admin />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/products/view/:id" element={<ProductDetail />} />
              <Route path="/products/add" element={<AddProduct />} />
              <Route path="/vip-selection" element={<VipSelection />} />
              <Route path="/products/edit/:id" element={<EditProduct />} />
              <Route path="/analytics-shop" element={<AnalyticsDetail />} />
              <Route path="/onboarding" element={<OnboardingFlow />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/physical-products/add" element={<AddPhysicalProduct />} />
              <Route path="/admin-onboarding" element={<AdminOnboarding />} />
              <Route path="/medya" element={<Medya />} />
              <Route path="/cj-test" element={<CJTest />} />
              <Route path="/theme/eco-mart" element={<EcoMartTheme />} />
              <Route path="/cj-import" element={<CJProductImport />} />

<Route 
  path="/themes" 
  element={
    <ShopThemesPage 
      colors={{
        bg: '#f6f8f6',
        surface: '#ffffff',
        border: '#e2e8f0',
        text: '#0f172a',
        textSecondary: '#64748b',
        hover: '#f1f5f9'
      }} 
    />
  } 
/>
            </Routes>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;