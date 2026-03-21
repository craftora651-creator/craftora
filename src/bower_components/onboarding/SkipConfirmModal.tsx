// components/onboarding/SkipConfirmModal.tsx
import React, { useEffect } from 'react';
import './styles/onboarding.css';

interface SkipConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

const SkipConfirmModal: React.FC<SkipConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Emin misin?",
  message = "CRAFTORA'yı tam olarak keşfetmeden geçmek istiyor musun? Sadece 2 dakikanda nasıl daha fazla kazanacağını öğrenebilirsin!"
}) => {
  // ESC tuşu ile kapatma
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);
  
  // Modal açıkken body scroll'unu engelle
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };
  
  return (
    <div 
      className="modal-overlay" 
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-content">
        <div className="modal-icon">⚠️</div>
        
        <h3 id="modal-title" className="modal-title">{title}</h3>
        
        <p className="modal-text">{message}</p>
        
        <div className="modal-stats">
          <div className="stat-item">
            <span className="stat-number">2</span>
            <span className="stat-label">dakika</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">4</span>
            <span className="stat-label">adım</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">%0</span>
            <span className="stat-label">komisyon</span>
          </div>
        </div>
        
        <div className="modal-buttons">
          <button 
            className="modal-button cancel-button"
            onClick={onClose}
            aria-label="Devam et"
          >
            <span className="button-icon">→</span>
            Devam Et
          </button>
          
          <button 
            className="modal-button confirm-button"
            onClick={handleConfirm}
            aria-label="Evet, atla ve dashboard'a git"
          >
            <span className="button-icon">🚀</span>
            Evet, Atla
          </button>
        </div>
        
        <button 
          className="modal-close-button"
          onClick={onClose}
          aria-label="Modalı kapat"
        >
          ×
        </button>
        
        <div className="modal-footer">
          <p className="footer-text">
            <span className="highlight">İpucu:</span> Her adımda özel ipuçları ve fırsatlar seni bekliyor!
          </p>
        </div>
      </div>
    </div>
  );
};

export default SkipConfirmModal;