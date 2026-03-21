import React from 'react';
import { StepProps } from './admin.types';

const Step4: React.FC<StepProps & { onPrev: () => void; onComplete: () => void }> = ({ 
  data, onPrev, onComplete 
}) => {
  return (
    <div className="onboarding-form">
      <h2>🎉 Mağazanız Hazır!</h2>
      <p className="form-subtitle">Bilgileri kontrol edin ve mağazanızı açın</p>

      <div className="summary-card">
        <h3>🏪 Mağaza Bilgileri</h3>
        <div className="summary-row"><strong>Mağaza Adı:</strong> {data.shopName}</div>
        <div className="summary-row"><strong>Açıklama:</strong> {data.shopDescription}</div>
        {data.shortDescription && (
          <div className="summary-row"><strong>Kısa Açıklama:</strong> {data.shortDescription}</div>
        )}
        <div className="summary-row"><strong>Logo:</strong> {data.logo ? '✓ Yüklendi' : '—'}</div>
        <div className="summary-row"><strong>Banner:</strong> {data.banner ? '✓ Yüklendi' : '—'}</div>
      </div>

      <div className="summary-card">
        <h3>📧 İletişim</h3>
        <div className="summary-row"><strong>Email:</strong> {data.contactEmail}</div>
        {data.supportEmail && <div className="summary-row"><strong>Destek:</strong> {data.supportEmail}</div>}
        {data.phone && <div className="summary-row"><strong>Telefon:</strong> {data.phone}</div>}
        {(data.address.street || data.address.city) && (
          <div className="summary-row">
            <strong>Adres:</strong> {[data.address.street, data.address.city, data.address.country].filter(Boolean).join(', ')}
          </div>
        )}
      </div>

      <div className="summary-card">
        <h3>🔗 Sosyal Medya</h3>
        {Object.entries(data.socialMedia).map(([key, value]) => value && (
          <div key={key} className="summary-row">
            <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
          </div>
        ))}
        {!Object.values(data.socialMedia).some(Boolean) && (
          <div className="summary-row">Sosyal medya hesabı eklenmemiş</div>
        )}
      </div>

      <div className="form-actions">
        <button type="button" className="btn-prev" onClick={onPrev}>← Geri</button>
        <button type="button" className="btn-complete" onClick={onComplete}>🚀 Mağazamı Aç</button>
      </div>
    </div>
  );
};

export default Step4;