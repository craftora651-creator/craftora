import React, { useState } from 'react';
import { StepProps, FormErrors } from './admin.types';

const Step2: React.FC<StepProps & { onNext: () => void; onPrev: () => void }> = ({ 
  data, updateData, onNext, onPrev 
}) => {
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      updateData({ address: { ...data.address, [field]: value } });
    } else {
      updateData({ [name]: value });
    }
    
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!data.contactEmail?.trim()) {
      newErrors.contactEmail = 'İletişim emaili zorunludur';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail)) {
      newErrors.contactEmail = 'Geçerli bir email adresi girin';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="onboarding-form">
      <h2>📧 İletişim Bilgileri</h2>
      <p className="form-subtitle">Müşterileriniz size nasıl ulaşsın?</p>

      <div className="form-group">
        <label>İletişim Emaili *</label>
        <input
          type="email"
          name="contactEmail"
          value={data.contactEmail}
          onChange={handleChange}
          placeholder="ornek@craftora.com"
          className={errors.contactEmail ? 'error' : ''}
        />
        {errors.contactEmail && <span className="error-message">{errors.contactEmail}</span>}
      </div>

      <div className="form-group">
        <label>Destek Emaili</label>
        <input
          type="email"
          name="supportEmail"
          value={data.supportEmail || ''}
          onChange={handleChange}
          placeholder="destek@craftora.com"
        />
      </div>

      <div className="form-group">
        <label>Telefon</label>
        <input
          type="tel"
          name="phone"
          value={data.phone || ''}
          onChange={handleChange}
          placeholder="+90 555 123 4567"
        />
      </div>

      <h3 className="section-title">Adres Bilgileri</h3>

      <div className="form-group">
        <label>Cadde / Sokak</label>
        <input
          type="text"
          name="address.street"
          value={data.address.street || ''}
          onChange={handleChange}
          placeholder="Bağdat Caddesi No:123"
        />
      </div>

      <div className="form-row">
        <div className="form-group half">
          <label>Şehir</label>
          <input
            type="text"
            name="address.city"
            value={data.address.city || ''}
            onChange={handleChange}
            placeholder="İstanbul"
          />
        </div>
        <div className="form-group half">
          <label>Posta Kodu</label>
          <input
            type="text"
            name="address.postalCode"
            value={data.address.postalCode || ''}
            onChange={handleChange}
            placeholder="34700"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Ülke</label>
        <input
          type="text"
          name="address.country"
          value={data.address.country || ''}
          onChange={handleChange}
          placeholder="Türkiye"
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn-prev" onClick={onPrev}>← Geri</button>
        <button type="submit" className="btn-next">İleri →</button>
      </div>
    </form>
  );
};

export default Step2;