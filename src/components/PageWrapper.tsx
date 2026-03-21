// components/PageWrapper.tsx
import React, { useEffect } from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children, className = '' }) => {
  useEffect(() => {
    // 1. MEVCUT STILLERI KAYDET
    const originalBodyClass = document.body.className;
    const originalHtmlClass = document.documentElement.className;
    
    // 2. TUM SINIFLARI TEMIZLE
    document.body.className = '';
    document.documentElement.className = '';
    
    // 3. TUM INLINE STILLERI SIL
    document.body.style.cssText = '';
    document.documentElement.style.cssText = '';
    
    // 4. INDEX.CSS'TEKI TUM OZEL SINIFLARI ENGELLE
    const style = document.createElement('style');
    style.id = 'page-wrapper-reset';
    style.innerHTML = `
      /* INDEX.CSS SIFIRLAMA - TUM CRAFTORA PORTAL SINIFLARINI DEVRE DISI BIRAK */
      .cr-portal, .cr-field, .cr-pillar, .cr-sphere, .cr-ring, 
      .cr-quantum, .cr-lightbeam, .cr-digital, .cr-scan, .cr-master,
      .cr-wave, .cr-stardust, .float-animation, .scroll-animation,
      .text-gradient, .hover-card, .btn-animate {
        display: none !important;
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
        animation: none !important;
        transform: none !important;
      }
      
      /* BODY'YI TEMIZLE */
      body {
        background: transparent !important;
        color: inherit !important;
        font-family: 'Space Grotesk', sans-serif !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: auto !important;
      }
      
      /* TUM VARSAYILAN MARGIN/PADDING'I SIFIRLA */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
    `;
    
    document.head.appendChild(style);

    return () => {
      // TEMIZLIK - ESKI HALINE DON
      document.body.className = originalBodyClass;
      document.documentElement.className = originalHtmlClass;
      const oldStyle = document.getElementById('page-wrapper-reset');
      if (oldStyle) oldStyle.remove();
    };
  }, []);

  return (
    <div className={`min-h-screen w-full ${className}`}>
      {children}
    </div>
  );
};

export default PageWrapper;