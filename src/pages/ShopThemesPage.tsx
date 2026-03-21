// config/ShopThemes.tsx
import { useState, useEffect } from 'react';

interface ShopThemesPageProps {
  colors: {
    bg: string;
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
    hover: string;
  };
}

const ShopThemesPage = ({ colors }: ShopThemesPageProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [cartCount, setCartCount] = useState(3);

  // Tailwind config'i dinamik ekleyelim
  useEffect(() => {
    // Tailwind CDN'ini ekle
    if (!document.querySelector('#tailwind-cdn')) {
      const tailwind = document.createElement('script');
      tailwind.id = 'tailwind-cdn';
      tailwind.src = 'https://cdn.tailwindcss.com';
      document.head.appendChild(tailwind);
    }

    // Tailwind config
    if (!document.querySelector('#tailwind-config')) {
      const config = document.createElement('script');
      config.id = 'tailwind-config';
      config.innerHTML = `
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              colors: {
                primary: "#5ff042",
                "background-light": "#f6f8f6",
                "background-dark": "#132210",
              },
              fontFamily: {
                "display": ["Manrope", "sans-serif"]
              },
              borderRadius: {
                "xl": "0.75rem",
                "2xl": "1.5rem",
                "full": "9999px"
              },
            },
          },
        }
      `;
      document.head.appendChild(config);
    }

    // Google Fonts
    if (!document.querySelector('#google-fonts')) {
      const fonts = document.createElement('link');
      fonts.id = 'google-fonts';
      fonts.rel = 'stylesheet';
      fonts.href = 'https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap';
      document.head.appendChild(fonts);
    }

    // Material Icons
    if (!document.querySelector('#material-icons')) {
      const icons = document.createElement('link');
      icons.id = 'material-icons';
      icons.rel = 'stylesheet';
      icons.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap';
      document.head.appendChild(icons);
    }

    // Özel CSS
    if (!document.querySelector('#custom-css')) {
      const style = document.createElement('style');
      style.id = 'custom-css';
      style.innerHTML = `
        .glass {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .glass-dark {
          background: rgba(19, 34, 16, 0.8);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(95, 240, 66, 0.1);
        }
        body {
          font-family: 'Manrope', sans-serif;
        }
      `;
      document.head.appendChild(style);
    }

    // Dark mode class'ını body'e ekle
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    return () => {
      // Temizlik
      document.documentElement.classList.remove('dark');
    };
  }, [isDarkMode]);

  // Ürünler
  const products = [
    {
      id: 1,
      name: 'Pure Cotton Set',
      category: 'Bath & Living',
      price: 49.00,
      rating: 4.5,
      reviews: 128,
      image: 'https://images.unsplash.com/photo-1583847268964-b28dc8aaecf8?w=500&auto=format',
      badge: 'Eco Choice'
    },
    {
      id: 2,
      name: 'Botanical Serum',
      category: 'Beauty & Care',
      price: 85.00,
      rating: 5,
      reviews: 94,
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&auto=format'
    },
    {
      id: 3,
      name: 'Recycled Smartwatch',
      category: 'Gadgets',
      price: 299.00,
      rating: 4,
      reviews: 210,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format'
    },
    {
      id: 4,
      name: 'Mood Diffuser Set',
      category: 'Wellness',
      price: 35.00,
      rating: 5,
      reviews: 45,
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&auto=format'
    }
  ];

  // Kategoriler
  const categories = [
    { name: 'Living', icon: 'home' },
    { name: 'Beauty', icon: 'spa' },
    { name: 'Fashion', icon: 'apparel' },
    { name: 'Kitchen', icon: 'restaurant' },
    { name: 'Tech', icon: 'devices_other' },
    { name: 'Wellness', icon: 'self_improvement' }
  ];

  return (
    <div className={`${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased min-h-screen overflow-x-hidden">
        
        {/* Navigation Header */}
        <header className="fixed top-0 left-0 right-0 z-50 glass dark:glass-dark border-b border-primary/10">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-lg shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-background-dark text-2xl font-bold">eco</span>
              </div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                Eco<span className="text-primary">Mart</span>
              </h1>
            </div>

            {/* Nav Links - Desktop */}
            <nav className="hidden lg:flex items-center gap-10">
              <a href="#" className="text-sm font-semibold hover:text-primary transition-colors">Shop</a>
              <div className="relative group cursor-pointer flex items-center gap-1">
                <span className="text-sm font-semibold hover:text-primary transition-colors">Categories</span>
                <span className="material-symbols-outlined text-sm">expand_more</span>
              </div>
              <a href="#" className="text-sm font-semibold hover:text-primary transition-colors">Sustainability</a>
              <a href="#" className="text-sm font-semibold hover:text-primary transition-colors">Journal</a>
            </nav>

            {/* Search - Desktop */}
            <div className="flex-1 max-w-md hidden md:block">
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Search curated goods..." 
                  className="w-full bg-slate-200/50 dark:bg-slate-800/50 border-none rounded-full py-2.5 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 text-sm transition-all"
                />
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">
                  search
                </span>
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-4">
              {/* Dark Mode Toggle */}
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2.5 rounded-full hover:bg-primary/10 transition-colors"
              >
                <span className="material-symbols-outlined">
                  {isDarkMode ? 'light_mode' : 'dark_mode'}
                </span>
              </button>

              {/* Cart */}
              <button className="p-2.5 rounded-full hover:bg-primary/10 transition-colors relative">
                <span className="material-symbols-outlined">shopping_cart</span>
                <span className="absolute top-1 right-1 bg-primary text-[10px] font-bold text-background-dark size-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              </button>

              {/* Profile */}
              <button className="p-2.5 rounded-full hover:bg-primary/10 transition-colors">
                <span className="material-symbols-outlined">person</span>
              </button>

              <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>

              {/* Join Button */}
              <button className="bg-primary hover:shadow-lg hover:shadow-primary/30 text-background-dark font-bold py-2.5 px-6 rounded-full text-sm transition-all hidden sm:block">
                Join Community
              </button>
            </div>
          </div>
        </header>

        <main className="pt-20">
          {/* Hero Section */}
          <section className="relative min-h-[85vh] flex items-center overflow-hidden px-6">
            {/* Background Blurs */}
            <div className="absolute inset-0 z-0">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent"></div>
              <div className="absolute -top-24 -right-24 size-96 bg-primary/20 rounded-full blur-[120px]"></div>
              <div className="absolute bottom-0 left-0 size-80 bg-primary/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
              {/* Left Content */}
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  Summer Collection 2024
                </div>

                <h1 className="text-6xl md:text-7xl font-extrabold leading-[1.1] tracking-tight text-slate-900 dark:text-slate-100">
                  Elevate Your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600">Sustainable</span> <br />
                  Lifestyle
                </h1>

                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
                  Experience premium eco-conscious living with our curated collection of high-end organic goods designed for the modern minimalist.
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  <button className="px-8 py-4 bg-primary text-background-dark font-bold rounded-xl shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                    Explore Collection
                  </button>
                  <button className="px-8 py-4 glass dark:bg-slate-800/50 font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors">
                    View Lookbook
                  </button>
                </div>
              </div>

              {/* Right Image */}
              <div className="relative hidden lg:block">
                <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 rotate-2">
                  <img 
                    src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format" 
                    alt="Luxury eco-friendly interior design"
                    className="w-full aspect-[4/5] object-cover"
                  />
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-12 -left-12 glass dark:glass-dark p-6 rounded-2xl shadow-xl z-20 -rotate-3 border border-white/50">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">eco</span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase">Certified Organic</p>
                      <p className="font-bold">100% Sustainable</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-8 -right-8 glass dark:glass-dark p-6 rounded-2xl shadow-xl z-20 rotate-3 border border-white/50">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                      <div className="size-10 rounded-full border-2 border-white bg-slate-300 bg-cover" style={{backgroundImage: "url('https://images.unsplash.com/photo-1494790108777-2fd95bb464a8?w=100&auto=format')"}}></div>
                      <div className="size-10 rounded-full border-2 border-white bg-slate-300 bg-cover" style={{backgroundImage: "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format')"}}></div>
                      <div className="size-10 rounded-full border-2 border-white bg-slate-300 bg-cover" style={{backgroundImage: "url('https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format')"}}></div>
                    </div>
                    <p className="text-sm font-bold">12k+ Happy Customers</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Categories Section */}
          <section className="py-24 px-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight mb-2">Curated Categories</h2>
                <p className="text-slate-500">Discover sustainable essentials for every corner of your life.</p>
              </div>
              <a href="#" className="text-primary font-bold flex items-center gap-2 hover:underline">
                Browse All <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {categories.map((cat, index) => (
                <div key={index} className="group cursor-pointer flex flex-col items-center gap-4">
                  <div className="size-24 rounded-full glass dark:bg-slate-800 border-2 border-primary/20 flex items-center justify-center shadow-lg group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                    <span className="material-symbols-outlined text-3xl text-primary group-hover:text-background-dark transition-colors">
                      {cat.icon}
                    </span>
                  </div>
                  <span className="font-bold text-sm tracking-wide">{cat.name}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Popular Products */}
          <section className="py-24 px-6 bg-slate-100 dark:bg-slate-900/50">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-extrabold tracking-tight mb-4">Popular This Week</h2>
                <p className="text-slate-500 max-w-2xl mx-auto">Our most loved sustainable items chosen by the EcoMart community.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                  <div key={product.id} className="group glass dark:glass-dark rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                    <div className="relative h-72 overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      {product.badge && (
                        <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-background-dark">
                          {product.badge}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-lg">{product.name}</h3>
                          <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">{product.category}</p>
                        </div>
                        <span className="font-extrabold text-primary">${product.price.toFixed(2)}</span>
                      </div>

                      <div className="flex items-center gap-1 text-yellow-500 mb-6">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-sm">
                            {i < Math.floor(product.rating) ? 'star' : i < product.rating ? 'star_half' : 'star_outline'}
                          </span>
                        ))}
                        <span className="text-xs text-slate-500 ml-1">({product.reviews})</span>
                      </div>

                      <button className="w-full py-3 bg-background-dark dark:bg-primary dark:text-background-dark text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-background-dark transition-colors">
                        <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
                        Quick Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Bento Box Featured Collection */}
          <section className="py-24 px-6 max-w-7xl mx-auto">
            <h2 className="text-4xl font-extrabold tracking-tight mb-12">Collections that Matter</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-[800px]">
              {/* Large */}
              <div className="md:col-span-2 md:row-span-2 relative group rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format" 
                  alt="Kitchen Essentials"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-10 left-10 text-white">
                  <span className="text-primary font-extrabold uppercase text-xs tracking-[0.2em] mb-4 block">Sustainable Home</span>
                  <h3 className="text-4xl font-extrabold mb-4">The Conscious <br/> Kitchen</h3>
                  <p className="max-w-xs mb-6 text-slate-300">Upgrade your daily routine with tools that are as beautiful as they are ethical.</p>
                  <button className="bg-white text-background-dark font-bold px-8 py-3 rounded-full hover:bg-primary transition-colors">Explore</button>
                </div>
              </div>

              {/* Small 1 */}
              <div className="md:col-span-2 md:row-span-1 relative group rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format" 
                  alt="Ethical Fashion"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background-dark/60 via-transparent to-transparent"></div>
                <div className="absolute inset-y-0 left-8 flex flex-col justify-center text-white">
                  <span className="text-primary font-extrabold uppercase text-xs tracking-[0.2em] mb-2 block">Slow Fashion</span>
                  <h3 className="text-2xl font-extrabold mb-2">Summer Linen</h3>
                  <button className="text-sm font-bold border-b-2 border-primary w-fit pb-1 hover:text-primary transition-colors">Shop Now</button>
                </div>
              </div>

              {/* Small 2 */}
              <div className="md:col-span-1 md:row-span-1 relative group rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format" 
                  alt="Zero Waste"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-background-dark/20 group-hover:bg-background-dark/40 transition-colors"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-xl font-extrabold">Zero Waste</h3>
                </div>
              </div>

              {/* Small 3 - Manifesto */}
              <div className="md:col-span-1 md:row-span-1 relative group rounded-2xl overflow-hidden shadow-xl bg-primary/90">
                <div className="absolute inset-0 bg-primary/90 flex flex-col items-center justify-center text-center p-6">
                  <span className="material-symbols-outlined text-4xl text-background-dark mb-4">eco</span>
                  <h3 className="text-xl font-extrabold text-background-dark mb-2">Our Manifesto</h3>
                  <p className="text-sm text-background-dark/80 mb-4">Why we believe in a greener future for commerce.</p>
                  <a href="#" className="bg-background-dark text-white p-2 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Trust Signals */}
          <section className="py-16 border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="flex items-center gap-6">
                  <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-3xl">local_shipping</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Carbon Neutral Shipping</h4>
                    <p className="text-sm text-slate-500">Every delivery offset with verifiable carbon credits.</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-3xl">verified</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Eco Certified</h4>
                    <p className="text-sm text-slate-500">100% of our vendors meet strict organic & fair-trade standards.</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-3xl">recycling</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Infinite Recycling</h4>
                    <p className="text-sm text-slate-500">Send back any used product for responsible recycling credits.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Newsletter */}
          <section className="py-24 px-6 overflow-hidden">
            <div className="max-w-5xl mx-auto relative glass dark:glass-dark rounded-[2.5rem] p-12 md:p-20 flex flex-col items-center text-center overflow-hidden border border-primary/20">
              <div className="absolute -top-24 -left-24 size-64 bg-primary/30 rounded-full blur-[80px]"></div>
              <div className="absolute -bottom-24 -right-24 size-64 bg-primary/20 rounded-full blur-[80px]"></div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 relative z-10">Join the <span className="text-primary">Eco</span> Movement</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-xl relative z-10">Subscribe for early access to product drops, sustainability tips, and exclusive offers.</p>
              <form className="w-full max-w-md flex flex-col sm:flex-row gap-4 relative z-10">
                <input 
                  type="email" 
                  placeholder="your@email.com"
                  className="flex-1 bg-white dark:bg-slate-800 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary shadow-lg text-slate-900 dark:text-slate-100"
                />
                <button className="bg-primary hover:bg-emerald-500 text-background-dark font-extrabold px-10 py-4 rounded-2xl shadow-xl shadow-primary/30 transition-all hover:scale-105">
                  Subscribe
                </button>
              </form>
              <p className="mt-6 text-xs text-slate-500 relative z-10">By subscribing, you agree to our Privacy Policy and Terms of Service.</p>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-20 pb-10 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2 mb-6">
                  <div className="bg-primary p-2 rounded-lg">
                    <span className="material-symbols-outlined text-background-dark text-xl font-bold">eco</span>
                  </div>
                  <h2 className="text-xl font-extrabold tracking-tight">Eco<span className="text-primary">Mart</span></h2>
                </div>
                <p className="text-slate-500 max-w-sm mb-8 leading-relaxed">
                  Redefining commerce for a conscious world. We believe that premium quality and sustainability should never be mutually exclusive.
                </p>
                <div className="flex gap-4">
                  <a href="#" className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors group">
                    <span className="material-symbols-outlined text-xl text-slate-600 dark:text-slate-400 group-hover:text-background-dark">public</span>
                  </a>
                  <a href="#" className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors group">
                    <span className="material-symbols-outlined text-xl text-slate-600 dark:text-slate-400 group-hover:text-background-dark">photo_camera</span>
                  </a>
                  <a href="#" className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors group">
                    <span className="material-symbols-outlined text-xl text-slate-600 dark:text-slate-400 group-hover:text-background-dark">smart_display</span>
                  </a>
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-6">Shop</h4>
                <ul className="space-y-4 text-sm text-slate-500">
                  <li><a href="#" className="hover:text-primary transition-colors">All Products</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Bestsellers</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">New Arrivals</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Gift Cards</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-6">Company</h4>
                <ul className="space-y-4 text-sm text-slate-500">
                  <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Sustainability Report</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Impact Partners</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-6">Support</h4>
                <ul className="space-y-4 text-sm text-slate-500">
                  <li><a href="#" className="hover:text-primary transition-colors">Track Order</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Returns & Exchanges</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-xs text-slate-400">© 2024 EcoMart Global Inc. All rights reserved.</p>
              <div className="flex gap-8 text-xs text-slate-400">
                <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-slate-900 transition-colors">Cookie Settings</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ShopThemesPage;