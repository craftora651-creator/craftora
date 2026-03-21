// components/onboarding/SkipConfirmModal.tsx
import React from 'react';
import styles from './styles/onboarding.scss';

interface SkipConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const SkipConfirmModal: React.FC<SkipConfirmModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm 
}) => {
  if (!isOpen) return null;
  
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalIcon}>⚠️</div>
        <h3 className={styles.modalTitle}>Emin misin?</h3>
        <p className={styles.modalText}>
          CRAFTORA'yı tam olarak keşfetmeden geçmek istiyor musun? 
          Sadece 2 dakikanda nasıl daha fazla kazanacağını öğrenebilirsin!
        </p>
        
        <div className={styles.modalButtons}>
          <button 
            className={`${styles.modalButton} ${styles.cancelButton}`}
            onClick={onClose}
          >
            Devam Et
          </button>
          <button 
            className={`${styles.modalButton} ${styles.confirmButton}`}
            onClick={onConfirm}
          >
            Evet, Atla
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkipConfirmModal;