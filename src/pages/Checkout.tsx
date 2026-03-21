import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState({
    id: '',
    name: '',
    price: ''
  });
  const [saveCard, setSaveCard] = useState(false);
  const [formData, setFormData] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  useEffect(() => {
    const planId = localStorage.getItem('selected_plan');
    const planName = localStorage.getItem('selected_plan_name');
    const planPrice = localStorage.getItem('selected_plan_price');

    if (planId && planName && planPrice) {
      setSelectedPlan({
        id: planId,
        name: planName,
        price: planPrice
      });
    } else {
      navigate('/payment');
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`✅ Ödeme başarıyla tamamlandı! ${selectedPlan.name} planınız aktif edildi.`);
    
    localStorage.removeItem('selected_plan');
    localStorage.removeItem('selected_plan_name');
    localStorage.removeItem('selected_plan_price');
    
    navigate('/admin-onboarding');
  };

  const handleReturn = () => {
    navigate('/payment');
  };

  const getPlanDetails = () => {
    switch(selectedPlan.id) {
      case 'pro':
        return {
          name: 'Craftora Pro',
          annualPrice: 299.00,
          tax: 29.90,
          discount: 50.00,
          total: 278.90
        };
      case 'enterprise':
        return {
          name: 'Craftora Enterprise',
          annualPrice: 999.00,
          tax: 99.90,
          discount: 100.00,
          total: 998.90
        };
      default:
        return {
          name: 'Craftora Pro',
          annualPrice: 299.00,
          tax: 29.90,
          discount: 50.00,
          total: 278.90
        };
    }
  };

  const planDetails = getPlanDetails();

  if (!selectedPlan.id) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-grid">
        
        {/* SOL: ÖDEME FORMU */}
        <div className="payment-section">
          
          {/* Header */}
          <div className="payment-header">
            <div className="secure-badge">
              <span className="material-icons">lock</span>
              SECURE CHECKOUT
            </div>
            <h1>Complete your upgrade</h1>
            <p>Join 10,000+ creators building the future on Craftora.</p>
          </div>

          {/* Express Checkout */}
          <div className="express-checkout">
            <div className="express-label">EXPRESS CHECKOUT</div>
            <div className="express-buttons">
              <button className="express-btn">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAd5pslhtR2ujmscQd-RKODs1ebngd1oj4drQt6Nb9HuVZ5NYksXt7x8g5V_B5gD4zx7G0v8z2jrlWCnitmWhUYfKZqoDz2Md7cCwpm7ZQ7pWUNScOEpJ_lK5dsiu2jViFN5T27E_bWNsNJIpSz7059jXUyWpDvXULkMCj14-ZadNRvhd6mr_7anyWtSIgk2g3dScBU3N9IhAOQb5uXPZnkF98jEz6idR4uQLfgI8wkp9cXnMZ6N4IADnM2bI70HfJJYfw6WWekGXk" alt="Apple Pay" />
                <span>Pay</span>
              </button>
              <button className="express-btn">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGOm18GV9KJXUtuzzuem-FTEuijzjaW_4X7nYdDCAJtRha0XeLw_pzcvP4arkjmcIMSnclovIDpoLy9mjT3OViy-S7-0jd5JqWKKPTFYVwdj_YPGKwpWNpjswm2c74ZQIRJNgXDLzkvDoSJomonMmggF9qiZ7xj1h8YlyEkUAYjxC-aWVJiBD8dzXaFuhdt0r_qxzpTkUu685JqUQzkSYYyEl8ijVuIweQUWk2nwnjTg5dpGmPnRTGkOfzVDAoswfttdJzvq6nSc8" alt="Google Pay" />
                <span>Pay</span>
              </button>
              <button className="express-btn">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAk0zG5wzmCuN29h5RuM8ekv_2FocEjYdXb2qWoHok95aEYzNAfUlKaryGeDWBtoVmALOni989ASCnphSER_QXY4x5oiX3XUUoPUA2MnvQYTsGp-9KSd4EF8OaUFJS2it1Qt8Mi_Ab0BsiYPM59g5QRZFqrixZWIzZQPxXhJl9X51frwlGrJhvfATb7VK7jFZ4Al3vLGZUa-UswSo80CZ_zdHOktE0m929ipKYiZ17KmJSvTqXtY-UXAKvuJV9_zm80Sm2R60NZOgw" alt="PayPal" />
              </button>
              <button className="express-btn">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAd95LI5CnXkCQlypxasc2h_TDkRgHWCkZC9-C-_iZf4xWhGN9Z32bO3bIsLQrTPTZZtPHftjcqAHx24RBjFfwmK8Z6bAN4D25Xw2zxaz9xfcVBnT19kbfx4yuBAt8QmBjPhHImw72yJGpkuoKsngCgCTvVSgPW2sB1fIn4Vm_KkEPOYvlwVqL-QsbiycAhi33LdAHoJV8q2i6ZwG0zXIENJmZl6egsnepLxsbFc4M8scdhASlyomP-AxFpdu8tRyIj3En5BOfLfsI" alt="Stripe" />
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="divider">
            <span>Or pay with card</span>
          </div>

          {/* Card Form */}
          <form className="card-form" onSubmit={handleSubmit}>
            
            <div className="form-group">
              <label>Cardholder Name</label>
              <input
                type="text"
                name="cardholderName"
                placeholder="Alex Rivera"
                value={formData.cardholderName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Card Number</label>
              <div className="card-input">
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="0000 0000 0000 0000"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  maxLength={19}
                  required
                />
                <span className="material-icons card-icon">credit_card</span>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  placeholder="MM / YY"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  maxLength={7}
                  required
                />
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input
                  type="password"
                  name="cvv"
                  placeholder="***"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  maxLength={3}
                  required
                />
              </div>
            </div>

            <div className="checkbox-group">
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={saveCard}
                  onChange={(e) => setSaveCard(e.target.checked)}
                />
                <span>Save card information for faster future checkout</span>
              </label>
            </div>

            <button type="submit" className="complete-purchase">
              <span className="material-icons">verified_user</span>
              Complete Purchase
            </button>

            <p className="ssl-text">
              <span className="material-icons">info</span>
              Payments are SSL encrypted and processed via Stripe.
            </p>
          </form>
        </div>

        {/* SAĞ: SİPARİŞ ÖZETİ */}
        <div className="summary-section">
          <div className="summary-card">
            <div className="summary-header">
              <h2>Order Summary</h2>
              <span className="material-icons">receipt_long</span>
            </div>

            <div className="selected-plan">
              <div className="plan-image"></div>
              <div className="plan-info">
                <span className="plan-badge">SELECTED PLAN</span>
                <span className="plan-name">{planDetails.name}</span>
                <span className="plan-period">Billed annually</span>
              </div>
            </div>

            <div className="price-details">
              <div className="price-row">
                <span>Annual Subscription</span>
                <span>${planDetails.annualPrice.toFixed(2)}</span>
              </div>
              <div className="price-row">
                <span>Tax (10%)</span>
                <span>${planDetails.tax.toFixed(2)}</span>
              </div>
              <div className="price-row discount">
                <span>Discount (Early Adopter)</span>
                <span>-${planDetails.discount.toFixed(2)}</span>
              </div>
            </div>

            <div className="total-row">
              <div>
                <div className="total-label">Total amount</div>
                <div className="total-amount">${planDetails.total.toFixed(2)}</div>
              </div>
              <div className="currency">
                <div className="currency-label">CURRENCY</div>
                <div className="currency-value">USD</div>
              </div>
            </div>
          </div>

          <div className="badges">
            <div className="badge">
              <span className="material-icons">security</span>
              <span>SECURE SSL</span>
            </div>
            <div className="badge">
              <span className="material-icons">history</span>
              <span>30-DAY TRIAL</span>
            </div>
          </div>

          <button className="return-link" onClick={handleReturn}>
            <span className="material-icons">arrow_back</span>
            Return to Plans
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;