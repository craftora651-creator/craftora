import React from 'react';
import { StepProps } from './admin.types';

const Step3: React.FC<StepProps & { onNext: () => void; onPrev: () => void }> = ({ 
  data, updateData, onNext, onPrev 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateData({
      socialMedia: { ...data.socialMedia, [name]: value }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const socialFields = [
    { name: 'instagram', prefix: 'instagram.com/' },
    { name: 'twitter', prefix: 'twitter.com/' },
    { name: 'facebook', prefix: 'facebook.com/' },
    { name: 'tiktok', prefix: 'tiktok.com/@' },
    { name: 'linkedin', prefix: 'linkedin.com/company/' },
    { name: 'youtube', prefix: 'youtube.com/@' }
  ];

  return (
    <form onSubmit={handleSubmit} className="onboarding-form">
      <h2>🔗 Sosyal Medya Hesapları</h2>
      <p className="form-subtitle">Mağazanızı sosyal medyada tanıtın</p>

      {socialFields.map(({ name, prefix }) => (
        <div key={name} className="form-group">
          <label>{name.charAt(0).toUpperCase() + name.slice(1)}</label>
          <div className="social-input">
            <span className="social-prefix">{prefix}</span>
            <input
              type="text"
              name={name}
              value={data.socialMedia[name as keyof typeof data.socialMedia] || ''}
              onChange={handleChange}
              placeholder="kullaniciadi"
            />
          </div>
        </div>
      ))}

      <div className="form-actions">
        <button type="button" className="btn-prev" onClick={onPrev}>← Geri</button>
        <button type="submit" className="btn-next">İleri →</button>
      </div>
    </form>
  );
};

export default Step3;