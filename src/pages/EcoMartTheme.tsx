// pages/EcoMartTheme.tsx
import { useState } from 'react';

const EcoMartTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [cartCount, setCartCount] = useState(3);

  // Renkler
  const colors = {
    primary: '#5ff042',
    primaryLight: '#7ff362',
    primaryDark: '#4ac035',
    bgLight: '#f6f8f6',
    bgDark: '#132210',
    textLight: '#0f172a',
    textDark: '#f1f5f9',
    slate500: '#64748b',
    slate600: '#475569',
    slate800: '#1e293b',
    slate900: '#0f172a',
    slate950: '#020617',
    white: '#ffffff',
    black: '#000000'
  };

  return (
    <div style={{
      backgroundColor: isDarkMode ? colors.bgDark : colors.bgLight,
      color: isDarkMode ? colors.textDark : colors.textLight,
      minHeight: '100vh',
      fontFamily: 'Manrope, sans-serif',
      transition: 'all 0.3s ease',
      overflowX: 'hidden'
    }}>
      {/* Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: isDarkMode ? 'rgba(19, 34, 16, 0.8)' : 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${isDarkMode ? 'rgba(95, 240, 66, 0.1)' : 'rgba(255, 255, 255, 0.3)'}`,
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '32px'
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              backgroundColor: colors.primary,
              padding: '8px',
              borderRadius: '8px',
              boxShadow: `0 4px 6px ${colors.primary}20`
            }}>
              <span style={{
                color: colors.bgDark,
                fontSize: '24px',
                fontWeight: 'bold',
                fontFamily: 'Material Symbols Outlined'
              }}>eco</span>
            </div>
            <h1 style={{
              fontSize: '20px',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: isDarkMode ? colors.textDark : colors.textLight
            }}>
              Eco<span style={{ color: colors.primary }}>Mart</span>
            </h1>
          </div>

          {/* Nav - Desktop */}
          <nav style={{
            display: 'none',
            alignItems: 'center',
            gap: '40px'
          }}>
            <a href="#" style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'inherit',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}>Shop</a>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer'
            }}>
              <span style={{
                fontSize: '14px',
                fontWeight: 600
              }}>Categories</span>
              <span style={{ fontSize: '14px' }}>expand_more</span>
            </div>
            <a href="#" style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'inherit',
              textDecoration: 'none'
            }}>Sustainability</a>
            <a href="#" style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'inherit',
              textDecoration: 'none'
            }}>Journal</a>
          </nav>

          {/* Search */}
          <div style={{
            flex: 1,
            maxWidth: '448px',
            display: 'none'
          }}>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Search curated goods..." 
                style={{
                  width: '100%',
                  backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(226, 232, 240, 0.5)',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '10px 16px 10px 48px',
                  fontSize: '14px',
                  color: 'inherit',
                  outline: 'none'
                }}
              />
              <span style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: colors.slate500,
                fontFamily: 'Material Symbols Outlined',
                fontSize: '20px'
              }}>search</span>
            </div>
          </div>

          {/* Right Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Dark Mode Toggle */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              style={{
                padding: '10px',
                borderRadius: '50%',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: 'inherit'
              }}
            >
              <span style={{ fontFamily: 'Material Symbols Outlined', fontSize: '24px' }}>
                {isDarkMode ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* Cart */}
            <button style={{
              padding: '10px',
              borderRadius: '50%',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              position: 'relative',
              color: 'inherit'
            }}>
              <span style={{ fontFamily: 'Material Symbols Outlined', fontSize: '24px' }}>
                shopping_cart
              </span>
              <span style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                backgroundColor: colors.primary,
                color: colors.bgDark,
                fontSize: '10px',
                fontWeight: 'bold',
                width: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%'
              }}>
                {cartCount}
              </span>
            </button>

            {/* Profile */}
            <button style={{
              padding: '10px',
              borderRadius: '50%',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: 'inherit'
            }}>
              <span style={{ fontFamily: 'Material Symbols Outlined', fontSize: '24px' }}>
                person
              </span>
            </button>

            <div style={{
              height: '32px',
              width: '1px',
              backgroundColor: isDarkMode ? colors.slate800 : colors.slate200,
              margin: '0 8px'
            }} />

            {/* Join Button */}
            <button style={{
              backgroundColor: colors.primary,
              color: colors.bgDark,
              fontWeight: 'bold',
              padding: '10px 24px',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s',
              display: 'none'
            }}>
              Join Community
            </button>
          </div>
        </div>
      </header>

      <main style={{ paddingTop: '80px' }}>
        {/* Hero Section */}
        <section style={{
          position: 'relative',
          minHeight: '85vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          padding: '0 24px'
        }}>
          {/* Background Blurs */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '50%',
            height: '100%',
            background: `linear-gradient(to left, ${colors.primary}10, transparent)`,
            zIndex: 0
          }} />
          <div style={{
            position: 'absolute',
            top: '-96px',
            right: '-96px',
            width: '384px',
            height: '384px',
            backgroundColor: `${colors.primary}20`,
            borderRadius: '50%',
            filter: 'blur(120px)',
            zIndex: 0
          }} />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '320px',
            height: '320px',
            backgroundColor: `${colors.primary}10`,
            borderRadius: '50%',
            filter: 'blur(100px)',
            zIndex: 0
          }} />

          <div style={{
            maxWidth: '1280px',
            margin: '0 auto',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '48px',
            alignItems: 'center',
            position: 'relative',
            zIndex: 10
          }}>
            {/* Left Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '9999px',
                backgroundColor: `${colors.primary}10`,
                border: `1px solid ${colors.primary}20`,
                color: colors.primary,
                fontSize: '12px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                <span style={{
                  position: 'relative',
                  display: 'flex',
                  width: '8px',
                  height: '8px'
                }}>
                  <span style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backgroundColor: colors.primary,
                    borderRadius: '50%',
                    opacity: 0.75,
                    animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite'
                  }} />
                  <span style={{
                    position: 'relative',
                    width: '8px',
                    height: '8px',
                    backgroundColor: colors.primary,
                    borderRadius: '50%'
                  }} />
                </span>
                Summer Collection 2024
              </div>

              <h1 style={{
                fontSize: '60px',
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                margin: 0
              }}>
                Elevate Your <br />
                <span style={{
                  background: `linear-gradient(to right, ${colors.primary}, #059669)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>Sustainable</span> <br />
                Lifestyle
              </h1>

              <p style={{
                fontSize: '18px',
                color: isDarkMode ? colors.slate400 : colors.slate600,
                maxWidth: '512px',
                lineHeight: 1.6
              }}>
                Experience premium eco-conscious living with our curated collection of high-end organic goods designed for the modern minimalist.
              </p>

              <div style={{ display: 'flex', gap: '16px', paddingTop: '16px' }}>
                <button style={{
                  padding: '16px 32px',
                  backgroundColor: colors.primary,
                  color: colors.bgDark,
                  fontWeight: 'bold',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: `0 10px 15px ${colors.primary}20`,
                  transition: 'transform 0.2s'
                }}>
                  Explore Collection
                </button>
                <button style={{
                  padding: '16px 32px',
                  background: isDarkMode ? 'rgba(19, 34, 16, 0.8)' : 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: `1px solid ${isDarkMode ? colors.slate700 : colors.slate200}`,
                  fontWeight: 'bold',
                  borderRadius: '12px',
                  cursor: 'pointer'
                }}>
                  View Lookbook
                </button>
              </div>
            </div>

            {/* Right Image - Hidden on mobile */}
            <div style={{ position: 'relative', display: 'none' }}>
              {/* Image content - can be added later */}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section style={{
          padding: '96px 24px',
          maxWidth: '1280px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '48px',
            gap: '24px'
          }}>
            <div>
              <h2 style={{ fontSize: '30px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '8px' }}>
                Curated Categories
              </h2>
              <p style={{ color: colors.slate500 }}>
                Discover sustainable essentials for every corner of your life.
              </p>
            </div>
            <a href="#" style={{
              color: colors.primary,
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none'
            }}>
              Browse All <span style={{ fontFamily: 'Material Symbols Outlined', fontSize: '14px' }}>arrow_forward</span>
            </a>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '32px'
          }}>
            {[
              { name: 'Living', icon: 'home' },
              { name: 'Beauty', icon: 'spa' },
              { name: 'Fashion', icon: 'apparel' },
              { name: 'Kitchen', icon: 'restaurant' },
              { name: 'Tech', icon: 'devices_other' },
              { name: 'Wellness', icon: 'self_improvement' }
            ].map((cat, index) => (
              <div key={index} style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '50%',
                  background: isDarkMode ? 'rgba(19, 34, 16, 0.8)' : 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: `2px solid ${colors.primary}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s'
                }}>
                  <span style={{
                    fontFamily: 'Material Symbols Outlined',
                    fontSize: '30px',
                    color: colors.primary
                  }}>
                    {cat.icon}
                  </span>
                </div>
                <span style={{ fontWeight: 'bold', fontSize: '14px', letterSpacing: '0.05em' }}>
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Products */}
        <section style={{
          padding: '96px 24px',
          backgroundColor: isDarkMode ? 'rgba(2, 6, 23, 0.5)' : '#f1f5f9'
        }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <h2 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '16px' }}>
                Popular This Week
              </h2>
              <p style={{ color: colors.slate500, maxWidth: '672px', margin: '0 auto' }}>
                Our most loved sustainable items chosen by the EcoMart community.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '32px'
            }}>
              {[1, 2, 3, 4].map((product) => (
                <div key={product} style={{
                  background: isDarkMode ? 'rgba(19, 34, 16, 0.8)' : 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: `1px solid ${isDarkMode ? colors.slate800 : colors.slate200}`,
                  transition: 'all 0.5s'
                }}>
                  <div style={{ height: '288px', overflow: 'hidden', position: 'relative' }}>
                    <img 
                      src="https://images.unsplash.com/photo-1583847268964-b28dc8aaecf8?w=500&auto=format" 
                      alt="Product"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      background: isDarkMode ? 'rgba(19, 34, 16, 0.8)' : 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: colors.bgDark
                    }}>
                      Eco Choice
                    </div>
                  </div>
                  <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                      <div>
                        <h3 style={{ fontWeight: 'bold', fontSize: '18px', margin: 0 }}>Pure Cotton Set</h3>
                        <p style={{ fontSize: '12px', color: colors.slate500, textTransform: 'uppercase', fontWeight: 'bold' }}>
                          Bath & Living
                        </p>
                      </div>
                      <span style={{ fontWeight: 800, color: colors.primary }}>
                        $49.00
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#eab308', marginBottom: '24px' }}>
                      {[...Array(5)].map((_, i) => (
                        <span key={i} style={{ fontSize: '14px' }}>
                          {i < 4 ? '★' : i < 4.5 ? '½' : '☆'}
                        </span>
                      ))}
                      <span style={{ fontSize: '12px', color: colors.slate500, marginLeft: '4px' }}>(128)</span>
                    </div>

                    <button style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: isDarkMode ? colors.primary : colors.slate900,
                      color: isDarkMode ? colors.bgDark : 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}>
                      <span style={{ fontFamily: 'Material Symbols Outlined', fontSize: '18px' }}>add_shopping_cart</span>
                      Quick Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          backgroundColor: isDarkMode ? colors.slate950 : 'white',
          borderTop: `1px solid ${isDarkMode ? colors.slate800 : colors.slate200}`,
          padding: '80px 24px 40px'
        }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '48px',
              marginBottom: '64px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                  <div style={{ backgroundColor: colors.primary, padding: '8px', borderRadius: '8px' }}>
                    <span style={{
                      color: colors.bgDark,
                      fontSize: '20px',
                      fontWeight: 'bold',
                      fontFamily: 'Material Symbols Outlined'
                    }}>eco</span>
                  </div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em' }}>
                    Eco<span style={{ color: colors.primary }}>Mart</span>
                  </h2>
                </div>
                <p style={{ color: colors.slate500, maxWidth: '384px', marginBottom: '32px', lineHeight: 1.6 }}>
                  Redefining commerce for a conscious world. We believe that premium quality and sustainability should never be mutually exclusive.
                </p>
                <div style={{ display: 'flex', gap: '16px' }}>
                  {['public', 'photo_camera', 'smart_display'].map((icon, i) => (
                    <a key={i} href="#" style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: isDarkMode ? colors.slate800 : colors.slate100,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textDecoration: 'none',
                      color: isDarkMode ? colors.slate400 : colors.slate600
                    }}>
                      <span style={{ fontFamily: 'Material Symbols Outlined', fontSize: '20px' }}>{icon}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div style={{
              paddingTop: '32px',
              borderTop: `1px solid ${isDarkMode ? colors.slate800 : colors.slate200}`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '24px'
            }}>
              <p style={{ fontSize: '12px', color: colors.slate400 }}>© 2024 EcoMart Global Inc. All rights reserved.</p>
              <div style={{ display: 'flex', gap: '32px', fontSize: '12px', color: colors.slate400 }}>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Cookie Settings</a>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Global Styles için style tag */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
        
        body {
          margin: 0;
          padding: 0;
        }
        
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default EcoMartTheme;