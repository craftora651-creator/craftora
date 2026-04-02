import React, { useState, useRef, useEffect } from 'react';
import { useGoogleLogin } from "../server/FastAPI/auth.hooks";
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '../redux/userSlice';
import { apiClient } from '../api/apiClient';
import type { UserResponse } from '../types/user.types';
import { Link, useNavigate } from 'react-router-dom';
import '../css/SignupCard.css';
import RobotBuddy from '../components/RobotBuddy';

// Dosyanın en üstüne, import'lardan sonra ekle:
declare global {
    interface Window {
        google?: {
            accounts: {
                id: {
                    initialize: (config: {
                        client_id: string;
                        auto_select?: boolean;
                        cancel_on_tap_outside?: boolean;
                        callback: (response: { credential: string }) => void;
                    }) => void;
                    prompt: () => void;
                    show?: () => void;
                };
            };
        };
    }
}

const SignupCard: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Mouse hareketi efekti
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;

      const card = cardRef.current;
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      const rotateY = (mouseX / rect.width) * 8;
      const rotateX = -(mouseY / rect.height) * 8;

      setRotation({ x: rotateX, y: rotateY });
      setMousePosition({ x: e.clientX, y: e.clientY });

      const lightX = (mouseX / rect.width) * 50 + 50;
      const lightY = (mouseY / rect.height) * 50 + 50;

      card.style.setProperty('--light-x', `${lightX}%`);
      card.style.setProperty('--light-y', `${lightY}%`);
    };

    const handleMouseLeave = () => {
      setRotation({ x: 0, y: 0 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    if (cardRef.current) {
      cardRef.current.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (cardRef.current) {
        cardRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  const googleLoginMutation = useGoogleLogin();

  const handleGoogleSignup = () => {
    console.log('🟢 Google signup butonuna tıklandı!');

    // Eski token varsa temizle
    const token = localStorage.getItem('access_token');
    if (token) {
      console.log('🔄 Eski token siliniyor, yeni kayıt yapılıyor...');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }

    // Google script yüklü mü kontrol et
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initGoogleSignup();
      };
      document.body.appendChild(script);
      return;
    }

    initGoogleSignup();
  };

  const initGoogleSignup = () => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      auto_select: false,
      cancel_on_tap_outside: false,
      callback: async (response: { credential: string }) => {
        try {
          console.log('Google token alındı, backend\'e gönderiliyor...');
          setIsLoading(true);

          const result = await googleLoginMutation.mutateAsync({
            id_token: response.credential
          });

          console.log('✅ Google signup başarılı:', result);

          // Token'ları kaydet
          localStorage.setItem('access_token', result.access_token);
          localStorage.setItem('refresh_token', result.refresh_token);
          localStorage.setItem('user', JSON.stringify(result.user));

          // Kullanıcı bilgilerini Redux'a kaydet
          const me = await apiClient.get<UserResponse>('/api/users/me');
          dispatch(setCurrentUser(me));

          setIsLoading(false);

          // Yeni kullanıcı olduğu için onboarding'e yönlendir
          navigate('/onboarding?first=true');

        } catch (error) {
          console.error('Google signup hatası:', error);
          setError('Google ile kayıt yapılamadı. Lütfen tekrar deneyin.');
          setIsLoading(false);
        }
      }
    });

    // One Tap UI göster
    window.google.accounts.id.prompt();

    // 2 saniye sonra popup zorla
    setTimeout(() => {
      if (window.google?.accounts?.id?.show) {
        window.google.accounts.id.show();
      }
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validasyon
    if (!name || !email || !password || !confirmPassword) {
      setError('Tüm alanları doldurun!');
      return;
    }

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor!');
      return;
    }

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalı!');
      return;
    }

    if (!agreeTerms) {
      setError('Devam etmek için şartları kabul etmelisiniz!');
      return;
    }

    setIsLoading(true);

    // Başarılı kayıt simülasyonu
    setTimeout(() => {
      setIsLoading(false);
      if (cardRef.current) {
        cardRef.current.classList.add('el-success');
      }
      setTimeout(() => {
        navigate('/onboarding');
      }, 1500);
    }, 1500);
  };

  const handleGithubSignup = () => {
    console.log('GitHub signup');
  };

  const cardStyle = {
    transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
    transition: 'transform 0.1s ease-out'
  };

  return (
    <div className="el-container">
      {/* Dekoratif arkaplan daireleri */}
      <div className="el-blob-primary"></div>
      <div className="el-blob-accent"></div>

      <div className="el-layout">

        {/* SOL: Signup Form */}
        <section className="el-left-section">
          <div className="el-form-container">

            {/* Logo */}
            <div className="el-logo-wrapper">
              <div className="el-logo-box">
                <div className="el-logo-icon">
                  <span className="material-icons text-white">bolt</span>
                </div>
                <span className="el-logo-text">Craftora</span>
              </div>
              <h1 className="el-welcome-title">Create account!</h1>
              <p className="el-welcome-sub">Join our creative community and start selling your crafts.</p>
            </div>

            {/* Signup Card */}
            <div
              ref={cardRef}
              className="el-glass-card"
              style={cardStyle}
            >
              <form className="el-form" onSubmit={handleSubmit}>

                {/* Full Name Input */}
                <div className="el-form-group">
                  <label className="el-label">Full Name</label>
                  <div className="el-input-wrapper">
                    <span className="el-input-icon material-icons">person</span>
                    <input
                      type="text"
                      className="el-input"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="el-form-group">
                  <label className="el-label">Email Address</label>
                  <div className="el-input-wrapper">
                    <span className="el-input-icon material-icons">email</span>
                    <input
                      type="email"
                      className="el-input"
                      placeholder="hello@craftora.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="el-form-group">
                  <label className="el-label">Password</label>
                  <div className="el-input-wrapper">
                    <span className="el-input-icon material-icons">lock</span>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="el-input-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="el-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <span className="material-icons text-sm">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div className="el-form-group">
                  <label className="el-label">Confirm Password</label>
                  <div className="el-input-wrapper">
                    <span className="el-input-icon material-icons">lock_outline</span>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="el-input-password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="el-password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <span className="material-icons text-sm">
                        {showConfirmPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div className="el-password-strength">
                    <div className="el-strength-bar">
                      <div
                        className={`el-strength-fill ${password.length < 6 ? 'weak' :
                            password.length < 10 ? 'medium' : 'strong'
                          }`}
                        style={{
                          width: `${password.length < 6 ? '33%' :
                              password.length < 10 ? '66%' : '100%'
                            }`
                        }}
                      ></div>
                    </div>
                    <span className="el-strength-text">
                      {password.length < 6 ? 'Zayıf' :
                        password.length < 10 ? 'Orta' : 'Güçlü'}
                    </span>
                  </div>
                )}

                {/* Terms & Conditions */}
                <div className="el-terms-wrapper">
                  <div className="el-checkbox-wrapper">
                    <input
                      type="checkbox"
                      id="terms"
                      className="el-checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                    />
                    <label htmlFor="terms" className="el-checkbox-label">
                      I agree to the <a href="#" className="el-terms-link">Terms of Service</a> and{' '}
                      <a href="#" className="el-terms-link">Privacy Policy</a>
                    </label>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="el-error">
                    ⚠️ {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="el-submit-btn"
                >
                  {isLoading ? (
                    <span className="el-spinner-wrapper">
                      <span className="el-spinner"></span>
                      Hesap Oluşturuluyor...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </button>

                {/* Social Signup */}
                <div className="el-social-section">
                  <div className="el-divider">
                    <div className="el-divider-line"></div>
                    <span className="el-divider-text">OR SIGN UP WITH</span>
                  </div>

                  <div className="el-social-grid">
                    <button
                      type="button"
                      onClick={handleGoogleSignup}
                      className="el-social-btn"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={handleGithubSignup}
                      className="el-social-btn"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      className="el-social-btn"
                    >
                      <span className="material-icons text-slate-500">fingerprint</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Login Link */}
            <div className="el-signup-wrapper">
              Already have an account?{' '}
              <Link to="/login" className="el-signup-link">
                Sign in
              </Link>
            </div>
          </div>
        </section>

        {/* SAĞ: Robot Section */}
        <section className="el-right-section">

          {/* Abstract background */}
          <div className="el-bg-radial"></div>

          {/* Robot Container */}
          <div className="el-robot-container">

            {/* Robot Buddy Component */}
            <RobotBuddy
              mousePosition={mousePosition}
              isListening={!isLoading && !error}
              mood={
                isLoading ? 'thinking' :
                  error ? 'sad' :
                    'happy'
              }
            />

            {/* Floating Shadow */}
            <div className="el-shadow"></div>
          </div>

          {/* Bottom Decorative Cards */}
          <div className="el-cards-wrapper">
            <div className="el-info-card">
              <div className="el-icon-green">
                <span className="material-icons">verified_user</span>
              </div>
              <div>
                <p className="el-card-label">Community</p>
                <p className="el-card-title">100k+ Creators</p>
              </div>
            </div>
            <div className="el-info-card">
              <div className="el-icon-blue">
                <span className="material-icons">rocket_launch</span>
              </div>
              <div>
                <p className="el-card-label">Start Free</p>
                <p className="el-card-title">No credit card</p>
              </div>
            </div>
          </div>

        </section>

      </div>

      {/* Footer */}
      <footer className="el-footer">
        <nav className="el-footer-nav">
          <a href="#" className="el-footer-link">Privacy Policy</a>
          <a href="#" className="el-footer-link">Terms of Service</a>
          <a href="#" className="el-footer-link">Help Center</a>
        </nav>
      </footer>
    </div>
  );
};

export default SignupCard;