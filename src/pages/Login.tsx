import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Login.css';
import RobotBuddy from '../components/RobotBuddy';
import { useGoogleLogin, useAppleLogin } from "../server/FastAPI/auth.hooks"
import { setCurrentUser } from '../redux/userSlice';
import { useDispatch } from 'react-redux';
import type { UserResponse } from '../types/user.types';
import { useQueryClient } from '@tanstack/react-query';
import { useCurrentUser } from '../server/FastAPI/user.hooks';


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
        AppleID?: {
            auth: {
                signIn: () => void;
                init: (config: {
                    clientId: string;
                    scope: string;
                    redirectURI: string;
                    usePopup: boolean;
                }) => void;
            };
        };
    }
}

const LoginCard: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);  // ✅ YENİ
    const cardRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [rotation, setRotation] = useState({ x: 0, y: 0 });

    const queryClient = useQueryClient();
    const { refetch } = useCurrentUser();

    const navigate = useNavigate();
    const dispatch = useDispatch();

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
        const currentCard = cardRef.current;
        window.addEventListener('mousemove', handleMouseMove);
        if (currentCard) {
            currentCard.addEventListener('mouseleave', handleMouseLeave);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (currentCard) {
                currentCard.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        if (email === 'admin' && password === '0941') {
            setIsSuccess(true);
            console.log('✅ Başarılı giriş!');
            if (cardRef.current) {
                cardRef.current.classList.add('login-success');
            }
            setTimeout(() => {
                setIsLoading(false);
                navigate('/onboarding');
            }, 1500);
        } else if (email === "sus" && password === "0909") {
            navigate("/admin");
        } else {
            setTimeout(() => {
                setIsLoading(false);
                setError('Kullanıcı adı veya şifre hatalı! (admin2345 / 0941)');
                if (cardRef.current) {
                    cardRef.current.classList.add('shake');
                    setTimeout(() => {
                        cardRef.current?.classList.remove('shake');
                    }, 500);
                }
            }, 800);
        }
    };

    const googleLoginMutation = useGoogleLogin();
    const appleLoginMutation = useAppleLogin();

    const handleAppleLogin = () => {
        console.log('🍎 Apple login butonuna tıklandı!');
        if (window.AppleID) {
            window.AppleID.auth.signIn();
        } else {
            // Apple SDK'yı yükle
            const script = document.createElement('script');
            script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
            script.async = true;
            script.onload = () => {
                initAppleLogin();
            };
            document.body.appendChild(script);
        }
    };
    const initAppleLogin = () => {
        if (!window.AppleID) return;
        window.AppleID.auth.init({
            clientId: import.meta.env.VITE_APPLE_CLIENT_ID,
            scope: 'name email',
            redirectURI: import.meta.env.VITE_APPLE_REDIRECT_URI,
            usePopup: true
        });
        window.AppleID.auth.signIn();
        window.addEventListener('appleid_signin', async (event: any) => {
            try {
                const { authorization } = event.detail;
                const identityToken = authorization.id_token;
                console.log('🍎 Apple token alındı, backend\'e gönderiliyor...');
                const result = await appleLoginMutation.mutateAsync({
                    identity_token: identityToken,
                    authorization_code: authorization.code,
                    user: undefined  
                });
                localStorage.setItem('access_token', result.access_token);
                localStorage.setItem('refresh_token', result.refresh_token);
                localStorage.setItem('user', JSON.stringify(result.user));
                await refetch();
                const user = queryClient.getQueryData<UserResponse>(['user', 'current']);
                if (user) {
                    dispatch(setCurrentUser(user));
                }
                if (result.is_new_user) {
                    navigate('/onboarding?first=true');
                } else {
                    navigate('/onboarding');
                }

            } catch (error) {
                console.error('🍎 Apple login hatası:', error);
                setError('Apple ile giriş yapılamadı. Lütfen tekrar deneyin.');
            }
        });
    };

    const handleGoogleLogin = () => {
        console.log('🟢 Google login butonuna tıklandı!');
        const token = localStorage.getItem('access_token');
        if (token) {
            console.log('🔄 Eski token siliniyor, yeni giriş yapılıyor...');
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
        }
        if (!window.google) {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.onload = () => {
                initGoogleLogin();
            };
            document.body.appendChild(script);
            return;
        }
        initGoogleLogin();
    };

    const initGoogleLogin = () => {
        if (!window.google) return;
        window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            auto_select: false,
            cancel_on_tap_outside: false,
            callback: async (response: { credential: string }) => {
                try {
                    console.log('Google token alındı, backend\'e gönderiliyor...');
                    const result = await googleLoginMutation.mutateAsync({
                        id_token: response.credential
                    });
                    console.log('🔥 MUTATION RESULT:', result);
                    console.log('🔥 access_token:', result?.access_token);
                    console.log('🔥 refresh_token:', result?.refresh_token);
                    console.log('🔥 user:', result?.user)
                    localStorage.setItem('access_token', result.access_token);
                    localStorage.setItem('refresh_token', result.refresh_token);
                    localStorage.setItem('user', JSON.stringify(result.user));
                    await refetch();
                    const user = queryClient.getQueryData<UserResponse>(['user', 'current']);
                    if (user) {
                        dispatch(setCurrentUser(user));
                    }

                    if (result.is_new_user) {
                        navigate('/onboarding?first=true');
                    } else {
                        navigate('/onboarding');
                    }

                } catch (error) {
                    console.error('Google login hatası:', error);
                    setError('Google ile giriş yapılamadı. Lütfen tekrar deneyin.');
                }
            }
        });
        window.google.accounts.id.prompt();
        setTimeout(() => {
            if (window.google?.accounts?.id?.show) {
                window.google.accounts.id.show();
            }
        }, 2000);
    };

    const handleGithubLogin = () => {
        console.log('GitHub login');
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

                {/* SOL: Login Form */}
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
                            <h1 className="el-welcome-title">Welcome back!</h1>
                            <p className="el-welcome-sub">Glad to see you again. Log in to explore the latest crafts.</p>
                        </div>

                        {/* Login Card */}
                        <div
                            ref={cardRef}
                            className={`el-glass-card ${isSuccess ? 'el-success' : ''}`}  // ✅ düzeltildi
                            style={cardStyle}
                        >
                            <form className="el-form" onSubmit={handleSubmit}>

                                {/* Email Input */}
                                <div className="el-form-group">
                                    <label className="el-label">Kullanıcı Adı</label>
                                    <div className="el-input-wrapper">
                                        <span className="el-input-icon material-icons">person</span>
                                        <input
                                            type="text"
                                            className="el-input"
                                            placeholder="admin2345"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password Input */}
                                <div className="el-form-group">
                                    <div className="el-forgot-wrapper">
                                        <label className="el-label-small">Şifre</label>
                                        <button
                                            type="button"
                                            onClick={() => alert('Şifre sıfırlama bağlantısı gönderildi!')}
                                            className="el-forgot-btn"
                                        >
                                            Forgot?
                                        </button>
                                    </div>
                                    <div className="el-input-wrapper">
                                        <span className="el-input-icon material-icons">lock_open</span>
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

                                {/* Remember Me */}
                                <div className="el-remember-wrapper">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        className="el-checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <label htmlFor="remember" className="el-checkbox-label">
                                        Remember me for 30 days
                                    </label>
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
                                            Giriş Yapılıyor...
                                        </span>
                                    ) : (
                                        'Login to Dashboard'
                                    )}
                                </button>

                                {/* Social Login */}
                                <div className="el-social-section">
                                    <div className="el-divider">
                                        <div className="el-divider-line"></div>
                                        <span className="el-divider-text">OR CONTINUE WITH</span>
                                    </div>

                                    <div className="el-social-grid">
                                        <button
                                            type="button"
                                            onClick={handleGoogleLogin}
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
                                            onClick={handleGithubLogin}
                                            className="el-social-btn"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24">
                                                <path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                            </svg>
                                        </button>

                                        {/* Fingerprint butonunu kaldır, Apple butonu ekle */}
                                        <button
                                            type="button"
                                            onClick={handleAppleLogin}
                                            className="el-social-btn"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M17.05 20.28c-.98.95-2.05.86-3.08.41-1.09-.48-2.09-.48-3.18 0-1.03.45-2.1.54-3.08-.41-2.98-2.84-3.28-8.28-1.45-11.81 1.13-2.18 3.07-3.12 4.98-3.12 1.27 0 2.44.56 3.26.56.81 0 2.08-.68 3.48-.68 1.38 0 2.56.64 3.48 1.68-1.38.89-2.16 2.58-1.74 4.48.45 2.02 2.07 3.06 3.08 3.48-.46 1.18-1.18 2.32-1.85 3.4zM15.5 4.25c.58-.71.97-1.68.85-2.68-.9.05-1.99.61-2.62 1.36-.56.68-.94 1.66-.81 2.62.94.05 1.88-.5 2.58-1.3z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Sign Up Link */}
                        <div className="el-signup-wrapper">
                            Don't have an account?{' '}
                            <Link to="/register" className="el-signup-link">
                                Sign up for free
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
                                <p className="el-card-label">Security</p>
                                <p className="el-card-title">Safe & Secured</p>
                            </div>
                        </div>
                        <div className="el-info-card">
                            <div className="el-icon-blue">
                                <span className="material-icons">support_agent</span>
                            </div>
                            <div>
                                <p className="el-card-label">Support</p>
                                <p className="el-card-title">24/7 AI Helper</p>
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

export default LoginCard;