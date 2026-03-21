import React, { useState } from 'react';
import { StepProps, FormErrors } from '../types/admin.types';

const Step1: React.FC<StepProps & { onNext: () => void }> = ({ data, updateData, onNext }) => {
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateData({ [name]: value });
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'banner') => {
    const file = e.target.files?.[0];
    if (file) updateData({ [field]: file });
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!data.shopName?.trim()) newErrors.shopName = 'Mağaza adı zorunludur';
    if (!data.shopDescription?.trim()) newErrors.shopDescription = 'Açıklama zorunludur';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="onboarding-form">
      <h2>🏪 Mağaza Bilgileri</h2>
      <p className="form-subtitle">Mağazanızı tanıtın</p>

      <div className="form-group">
        <label>Mağaza Adı *</label>
        <input
          type="text"
          name="shopName"
          value={data.shopName}
          onChange={handleChange}
          placeholder="Örn: Craftora Digital Store"
          className={errors.shopName ? 'error' : ''}
        />
        {errors.shopName && <span className="error-message">{errors.shopName}</span>}
      </div>

      <div className="form-group">
        <label>Mağaza Açıklaması *</label>
        <textarea
          name="shopDescription"
          value={data.shopDescription}
          onChange={handleChange}
          placeholder="Mağazanızı kısaca tanıtın..."
          rows={4}
          className={errors.shopDescription ? 'error' : ''}
        />
        {errors.shopDescription && <span className="error-message">{errors.shopDescription}</span>}
      </div>

      <div className="form-group">
        <label>Kısa Açıklama</label>
        <input
          type="text"
          name="shortDescription"
          value={data.shortDescription || ''}
          onChange={handleChange}
          placeholder="Tek satırda mağazanız"
        />
      </div>

      <div className="form-row">
        <div className="form-group half">
          <label>Logo</label>
          <div className="file-upload">
            <input type="file" id="logo" accept="image/*" onChange={(e) => handleFileUpload(e, 'logo')} />
            <label htmlFor="logo" className="upload-label">
              {data.logo ? '✓ Logo Seçildi' : '+ Logo Yükle'}
            </label>
          </div>
        </div>
        <div className="form-group half">
          <label>Banner</label>
          <div className="file-upload">
            <input type="file" id="banner" accept="image/*" onChange={(e) => handleFileUpload(e, 'banner')} />
            <label htmlFor="banner" className="upload-label">
              {data.banner ? '✓ Banner Seçildi' : '+ Banner Yükle'}
            </label>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-next">İleri →</button>
      </div>
    </form>
  );
};

export default Step1;