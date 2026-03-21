import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  id: string;
  title: string;
  badge?: string;
  price?: string;
  period?: string;
  description: string;
  buttonText: string;
  features: PlanFeature[];
  isPopular?: boolean;
  gradient: string;
  shadowColor: string;
}

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<any[]>([]);

  // SADECE 2 PLAN: Basic ve Enterprise
  const plans: Plan[] = [
    {
      id: 'basic',
      title: 'Basic',
      badge: 'PERFECT FOR INDIVIDUALS',
      price: '9',
      period: 'month',
      description: 'Everyday you need to kickstart your personal projects with professional-grade tools.',
      buttonText: 'Get Started',
      features: [
        { text: 'Project Workspace', included: true },
        { text: 'GSE Secure Cloud Storage', included: true },
        { text: 'Basic Analytics Dashboard', included: true },
        { text: 'Weekly Data Backups', included: true },
        { text: 'Priority 24/7 Support', included: true },
        { text: 'Custom Domain & SSL Integration', included: true }
      ],
      gradient: 'linear-gradient(145deg, #0A0C1A, #15182B)',
      shadowColor: 'rgba(0, 255, 163, 0.2)'
    },
    {
      id: 'enterprise',
      title: 'Enterprise',
      badge: 'ENTERPRISE SOLUTIONS',
      price: '99',
      period: 'month',
      description: 'Customizable infrastructure and dedicated support for large-scale operations.',
      buttonText: 'Contact Sales',
      features: [
        { text: 'Everything in Professional', included: true },
        { text: 'Custom ISO & BAML Auth.', included: true },
        { text: 'Unified High-speed Storage', included: true },
        { text: 'Dedicated Success Manager', included: true },
        { text: '95% Uptime SLA Guarantee', included: true },
        { text: 'Custom Security Audits', included: true }
      ],
      gradient: 'linear-gradient(145deg, #0C0E1A, #1E1A2C)',
      shadowColor: 'rgba(128, 0, 255, 0.25)'
    }
  ];

  // Mouse hareketi efekti
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Arkaplan partikülleri
  useEffect(() => {
    const particleArray = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.5 + 0.1,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.5 + 0.1
    }));
    setParticles(particleArray);
  }, []);

  // 🎯 KART TIKLAMA - ÖDEME SAYFASINA YÖNLENDİR
  const handleCardClick = (planId: string) => {
    console.log(`Plan seçildi: ${planId}`);
    
    // State'e seçilen planı kaydet (localStorage veya context kullanabilirsin)
    localStorage.setItem('selected_plan', planId);
    localStorage.setItem('selected_plan_price', planId === 'basic' ? '9' : '99');
    localStorage.setItem('selected_plan_name', planId === 'basic' ? 'Basic' : 'Enterprise');
    
    // Ödeme detay sayfasına yönlendir
    navigate('/checkout');
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  return (
    <div className="vip-container">
      {/* Arkaplan partikülleri */}
      <div className="vip-particles">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              animation: `floatParticle ${particle.speed * 10}s linear infinite`,
              animationDelay: `${particle.delay}s`
            }}
          />
        ))}
      </div>

      {/* Ana ışık efekti (mouse takibi) */}
      <div 
        className="vip-light-effect"
        style={{
          background: `radial-gradient(circle 200px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.03), transparent 80%)`
        }}
      />

      {/* Header */}
      <div className="vip-header">
        <h1 className="vip-title">
          Choose Your <span className="vip-title-gradient">Plan</span>
        </h1>
        <p className="vip-subtitle">
          Select the perfect plan for your store. Upgrade to unlock premium features.
        </p>
      </div>

      {/* Kartlar */}
      <div className="vip-cards">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`vip-card ${hoveredCard === plan.id ? 'vip-card-hovered' : ''}`}
            onMouseEnter={() => setHoveredCard(plan.id)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => handleCardClick(plan.id)}
            style={{
              background: plan.gradient,
              boxShadow: hoveredCard === plan.id ? `0 30px 60px ${plan.shadowColor}` : 'none'
            }}
          >
            {/* Parlama efekti */}
            <div className="vip-card-glow" style={{ background: `radial-gradient(circle at 50% 0%, ${plan.shadowColor}, transparent 70%)` }} />
            
            {/* Badge */}
            {plan.badge && (
              <div className="vip-card-badge">
                {plan.badge}
              </div>
            )}

            {/* İçerik */}
            <div className="vip-card-content">
              <h2 className="vip-card-title">{plan.title}</h2>
              
              {plan.price && (
                <div className="vip-card-price">
                  <span className="vip-card-price-currency">$</span>
                  <span className="vip-card-price-amount">{plan.price}</span>
                  <span className="vip-card-price-period">/{plan.period}</span>
                </div>
              )}

              <p className="vip-card-description">{plan.description}</p>

              <button className="vip-card-button">
                {plan.buttonText}
                <span className="vip-card-button-arrow">→</span>
              </button>

              <div className="vip-card-features">
                {plan.features.map((feature, index) => (
                  <div key={index} className="vip-card-feature">
                    <span className="vip-card-feature-check">✓</span>
                    <span className="vip-card-feature-text">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Skip butonu */}
      <button className="vip-skip-button" onClick={handleSkip}>
        Maybe later, take me to dashboard →
      </button>
    </div>
  );
};

export default Payment;