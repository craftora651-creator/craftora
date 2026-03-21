// Medya.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
    FaHeart,
    FaShare,
    FaPlay,
    FaPause,
    FaHome,
    FaCompass,
    FaClock,
    FaCog,
    FaUser,
    FaRegHeart,
    FaStar,
    FaRegStar,
    FaMusic,
    FaShoppingBag,
    FaBookmark,
    FaRegBookmark,
    FaSearch,
    FaFire,
    FaGem,
    FaTshirt,
    FaCrown,
    FaTruck,
    FaShieldAlt,
    FaUndo,
    FaEllipsisH,
    FaBell,
    FaGift,
    FaInfoCircle,

} from 'react-icons/fa';
import { BsThreeDots, } from 'react-icons/bs';
import { MdVerified } from 'react-icons/md';
import { GiPriceTag, GiClothes } from 'react-icons/gi';
import { MdOutlineStyle } from 'react-icons/md'; // veya
import styles from '../css/Medya.module.css';

const Medya: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [selectedColor, setSelectedColor] = useState('emerald');
    const [selectedSize, setSelectedSize] = useState('M');
    const [activeTab, setActiveTab] = useState('details');
    const [quantity, setQuantity] = useState(1);
    const [searchFocused, setSearchFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const videoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Parallax efekti için
        const handleMouseMove = (e: MouseEvent) => {
            if (videoRef.current) {
                const { clientX, clientY } = e;
                const x = (clientX / window.innerWidth - 0.5) * 20;
                const y = (clientY / window.innerHeight - 0.5) * 20;
                videoRef.current.style.transform = `scale(1.05) translate(${x}px, ${y}px)`;
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const colors = [
        { name: 'emerald', code: '#046307', label: 'Emerald Green' },
        { name: 'ruby', code: '#9B111E', label: 'Ruby Red' },
        { name: 'sapphire', code: '#0F52BA', label: 'Sapphire Blue' },
        { name: 'amber', code: '#FFBF00', label: 'Amber Gold' },
        { name: 'onyx', code: '#353839', label: 'Onyx Black' },
        { name: 'pearl', code: '#F5F5F5', label: 'Pearl White' },
    ];

    const sizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

    const recentSearches = ['silk dress', 'evening gown', 'backless', 'summer collection', 'limited edition'];

    const features = [
        { icon: <FaTruck />, label: 'Free Shipping', value: 'On orders $100+' },
        { icon: <FaShieldAlt />, label: 'Authentic', value: '100% Genuine' },
        { icon: <FaUndo />, label: 'Easy Returns', value: '30 days return' },
        { icon: <FaGift />, label: 'Gift Wrap', value: 'Available' },
    ];

    const reviews = [
        { name: 'Sarah J.', rating: 5, comment: 'Absolutely stunning! The fabric is incredible.', date: '2 days ago' },
        { name: 'Emily R.', rating: 5, comment: 'Perfect fit and so elegant. Worth every penny!', date: '1 week ago' },
        { name: 'Jessica M.', rating: 4, comment: 'Beautiful dress, but sizing runs a bit small.', date: '2 weeks ago' },
    ];

    return (
        <div className={`${styles.container} ${isDarkMode ? styles.containerDark : styles.containerLight}`}>
            <div className={styles.grid}>

                {/* ===== SOL SIDEBAR ===== */}
                <aside className={`${styles.sidebar} ${isDarkMode ? styles.sidebarDark : styles.sidebarLight}`}>

                    {/* Sidebar Header */}
                    <div className={`${styles.sidebarHeader} ${isDarkMode ? styles.sidebarHeaderDark : styles.sidebarHeaderLight}`}>
                        <div className={`${styles.logo} ${isDarkMode ? styles.logoDark : styles.logoLight}`}>
                            CRAFT<span>ORA</span>
                        </div>

                        {/* Arama Kutusu */}
                        <div className={styles.searchContainer}>
                            <FaSearch className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Search products, brands, styles..."
                                className={`${styles.searchInput} ${isDarkMode ? styles.searchInputDark : styles.searchInputLight}`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                            />
                            {!searchFocused && (
                                <span className={`${styles.searchShortcut} ${isDarkMode ? styles.searchShortcutDark : ''}`}>
                                    ⌘K
                                </span>
                            )}
                        </div>

                        {/* Son Aramalar */}
                        {searchFocused && (
                            <div className={styles.recentSearches}>
                                {recentSearches.map((term) => (
                                    <span key={term} className={styles.recentTag} onClick={() => setSearchQuery(term)}>
                                        {term}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Navigasyon */}
                    <nav className={styles.sidebarNav}>
                        {/* Ana Menü */}
                        <div className={styles.navSection}>
                            <h3 className={`${styles.navSectionTitle} ${isDarkMode ? styles.navSectionTitleDark : styles.navSectionTitleLight}`}>
                                Main Menu
                            </h3>
                            <ul className={styles.navList}>
                                <li className={`${styles.navItem} ${isDarkMode ? styles.navItemDark : styles.navItemLight} ${styles.navItemActive}`}>
                                    <span className={styles.navIcon}><FaHome /></span>
                                    <span>Home</span>
                                    <span className={styles.navBadge}>New</span>
                                </li>
                                <li className={`${styles.navItem} ${isDarkMode ? styles.navItemDark : styles.navItemLight}`}>
                                    <span className={styles.navIcon}><FaFire /></span>
                                    <span>Trending</span>
                                    <span className={styles.navBadge}>12</span>
                                </li>
                                <li className={`${styles.navItem} ${isDarkMode ? styles.navItemDark : styles.navItemLight}`}>
                                    <span className={styles.navIcon}><FaPlay /></span>
                                    <span>Reels</span>
                                </li>
                                <li className={`${styles.navItem} ${isDarkMode ? styles.navItemDark : styles.navItemLight}`}>
                                    <span className={styles.navIcon}><FaCompass /></span>
                                    <span>Discover</span>
                                </li>
                                <li className={`${styles.navItem} ${isDarkMode ? styles.navItemDark : styles.navItemLight}`}>
                                    <span className={styles.navIcon}><FaClock /></span>
                                    <span>Recent</span>
                                </li>
                            </ul>
                        </div>

                        {/* Koleksiyonlar */}
                        <div className={styles.navSection}>
                            <h3 className={`${styles.navSectionTitle} ${isDarkMode ? styles.navSectionTitleDark : styles.navSectionTitleLight}`}>
                                Collections
                            </h3>
                            <ul className={styles.navList}>
                                <li className={`${styles.navItem} ${isDarkMode ? styles.navItemDark : styles.navItemLight}`}>
                                    <span className={styles.navIcon}><FaGem /></span>
                                    <span>Luxury Edit</span>
                                </li>
                                <li className={`${styles.navItem} ${isDarkMode ? styles.navItemDark : styles.navItemLight}`}>
                                    <span className={styles.navIcon}><FaTshirt /></span>
                                    <span>Summer Breeze</span>
                                </li>
                                <li className={`${styles.navItem} ${isDarkMode ? styles.navItemDark : styles.navItemLight}`}>
                                    <span className={styles.navIcon}><FaCrown /></span>
                                    <span>Evening Gowns</span>
                                    <span className={styles.navBadge}>VIP</span>
                                </li>
                                <li className={`${styles.navItem} ${isDarkMode ? styles.navItemDark : styles.navItemLight}`}>
                                    <span className={styles.navIcon}><GiPriceTag /></span>
                                    <span>Sale</span>
                                </li>
                            </ul>
                        </div>

                        {/* Kategoriler */}
                        <div className={styles.navSection}>
                            <h3 className={`${styles.navSectionTitle} ${isDarkMode ? styles.navSectionTitleDark : styles.navSectionTitleLight}`}>
                                Categories
                            </h3>
                            <ul className={styles.navList}>
                                <li className={`${styles.navItem} ${isDarkMode ? styles.navItemDark : styles.navItemLight}`}>
                                    <span className={styles.navIcon}><GiClothes /></span>
                                    <span>Dresses</span>
                                </li>
                                <li className={`${styles.navItem} ${isDarkMode ? styles.navItemDark : styles.navItemLight}`}>
                                    <span className={styles.navIcon}><MdOutlineStyle /></span>
                                    <span>Silk Collection</span>
                                </li>
                                <li className={`${styles.navItem} ${isDarkMode ? styles.navItemDark : styles.navItemLight}`}>
                                    <span className={styles.navIcon}><FaBell /></span>
                                    <span>New Arrivals</span>
                                </li>
                                <li className={`${styles.navItem} ${isDarkMode ? styles.navItemDark : styles.navItemLight}`}>
                                    <span className={styles.navIcon}><FaGift /></span>
                                    <span>Gift Cards</span>
                                </li>
                            </ul>
                        </div>
                    </nav>

                    {/* Sidebar Footer */}
                    <div className={`${styles.sidebarFooter} ${isDarkMode ? styles.sidebarFooterDark : styles.sidebarFooterLight}`}>
                        <div className={styles.userInfo}>
                            <img
                                src="https://images.unsplash.com/photo-1494790108777-466d5eb9166c?w=100&h=100&fit=crop"
                                alt="User"
                                className={styles.userAvatar}
                            />
                            <div className={styles.userDetails}>
                                <div className={styles.userName}>Emma Watson</div>
                                <div className={styles.userEmail}>emma@craftora.com</div>
                            </div>
                            <FaEllipsisH style={{ opacity: 0.5, cursor: 'pointer' }} />
                        </div>

                        <button
                            onClick={toggleDarkMode}
                            className={`${styles.darkToggle} ${isDarkMode ? styles.darkToggleDark : styles.darkToggleLight}`}
                        >
                            {isDarkMode ? '☀️ Switch to Light' : '🌙 Switch to Dark'}
                        </button>
                    </div>
                </aside>

                {/* ===== ORTA VIDEO ALANI ===== */}
                <section className={styles.videoSection}>
                    <div className={styles.videoContainer}>
                        {/* Video Arkaplan */}
                        <div
                            ref={videoRef}
                            className={styles.videoBackground}
                            style={{
                                backgroundImage: 'url(https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
                            }}
                        >
                            <div className={styles.videoOverlay} />
                        </div>

                        {/* Üst Badgeler */}

                        {/* Mobil Üst Bar */}
                        {/* Mobil Üst Bar */}
                        <div className={styles.mobileTopBar}>
                            <div className={styles.mobileLogo}>
                                CRAFT<span>ORA</span>
                            </div>
                            <div className={styles.mobileRightButtons}>
                                <div className={styles.mobileSearch}>
                                    <FaSearch />
                                </div>
                                <div
                                    className={styles.mobileDarkToggle}
                                    onClick={toggleDarkMode}
                                >
                                    {isDarkMode ? '☀️' : '🌙'}
                                </div>
                            </div>
                        </div>

                        {/* Sol Alt - Ürün Bilgisi */}
                        <div className={styles.productInfo}>
                            <h2 className={styles.productTitle}>Emerald Silk Gala Dress</h2>
                            <p className={styles.productDesc}>
                                Handcrafted from premium mulberry silk. Featuring a backless design and a fluid silhouette. Perfect for summer evenings, galas, and special occasions.
                            </p>

                            <div className={styles.priceContainer}>
                                <span className={styles.currentPrice}>$249.00</span>
                                <span className={styles.originalPrice}>$580.00</span>
                            </div>

                            <div className={styles.audioInfo}>
                                <span className={styles.audioIcon}>
                                    <FaMusic />
                                </span>
                                <span>Original Audio - Premium Boutique</span>
                                <MdVerified style={{ color: 'var(--color-primary)', marginLeft: '4px' }} />
                            </div>
                        </div>

                        {/* Sağ Aksiyon Butonları */}
                        <div className={styles.actionBar}>
                            <div className={styles.actionItem} onClick={() => setIsFollowing(!isFollowing)}>
                                <div className={styles.actionCircle}>
                                    <FaUser />
                                </div>
                                <span className={styles.actionCount}>12.5K</span>
                                <span className={styles.actionLabel}>{isFollowing ? 'Following' : 'Follow'}</span>
                            </div>

                            <div className={styles.actionItem} onClick={() => setIsLiked(!isLiked)}>
                                <div className={`${styles.actionCircle} ${isLiked ? styles.actionCircleLiked : ''}`}>
                                    {isLiked ? <FaHeart /> : <FaRegHeart />}
                                </div>
                                <span className={styles.actionCount}>2.5K</span>
                                <span className={styles.actionLabel}>Like</span>
                            </div>

                            <div className={styles.actionItem} onClick={() => setIsSaved(!isSaved)}>
                                <div className={styles.actionCircle}>
                                    {isSaved ? <FaBookmark /> : <FaRegBookmark />}
                                </div>
                                <span className={styles.actionCount}>Save</span>
                            </div>

                            <div className={styles.actionItem}>
                                <div className={styles.actionCircle}>
                                    <FaShare />
                                </div>
                                <span className={styles.actionLabel}>Share</span>
                            </div>

                            <div className={styles.actionItem}>
                                <div className={styles.actionCircle}>
                                    <BsThreeDots />
                                </div>
                                <span className={styles.actionLabel}>More</span>
                            </div>
                        </div>

                        {/* Alt Butonlar */}
                        <div className={styles.bottomButtons}>
                            <div className={styles.buySection}>
                                <button className={styles.buyNowBtn}>
                                    <FaShoppingBag />
                                    BUY NOW
                                </button>
                                <span className={styles.limitedBadge}>Limited Edition</span>
                            </div>

                            <button className={styles.shareBtn}>
                                <FaShare />
                            </button>
                        </div>
                    </div>
                </section>

                {/* ===== SAĞ PANEL ===== */}
                <div className={`${styles.rightPanel} ${isDarkMode ? styles.rightPanelDark : styles.rightPanelLight}`}>

                    {/* Panel Header */}
                    <div className={`${styles.panelHeader} ${isDarkMode ? styles.panelHeaderDark : styles.panelHeaderLight}`}>
                        <h3 className={`${styles.panelTitle} ${isDarkMode ? styles.panelTitleDark : styles.panelTitleLight}`}>
                            Product Details
                        </h3>
                        <div className={styles.panelNav}>
                            <span
                                className={`${styles.panelNavItem} ${activeTab === 'details' ? styles.panelNavItemActive : ''}`}
                                onClick={() => setActiveTab('details')}
                            >
                                Details
                            </span>
                            <span
                                className={`${styles.panelNavItem} ${activeTab === 'reviews' ? styles.panelNavItemActive : ''}`}
                                onClick={() => setActiveTab('reviews')}
                            >
                                Reviews
                            </span>
                            <span
                                className={`${styles.panelNavItem} ${activeTab === 'shipping' ? styles.panelNavItemActive : ''}`}
                                onClick={() => setActiveTab('shipping')}
                            >
                                Shipping
                            </span>
                        </div>
                    </div>

                    {/* İçerik - Details Tab */}
                    {activeTab === 'details' && (
                        <>
                            {/* Ürün Kartı */}
                            <div className={styles.productCard}>
                                <h4 className={`${styles.productName} ${isDarkMode ? styles.productNameDark : styles.productNameLight}`}>
                                    Emerald Silk Gala Dress
                                </h4>
                                <div className={styles.productPrice}>$249.00</div>

                                <div className={styles.productRating}>
                                    <div className={styles.stars}>
                                        <FaStar /><FaStar /><FaStar /><FaStar /><FaRegStar />
                                    </div>
                                    <span className={styles.reviewCount}>(128 reviews)</span>
                                </div>
                            </div>

                            {/* Detaylar Grid */}
                            <div className={styles.detailsGrid}>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>Material</span>
                                    <span className={styles.detailValue}>100% Mulberry Silk</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>Fit</span>
                                    <span className={styles.detailValue}>True to Size</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>Care</span>
                                    <span className={styles.detailValue}>Dry Clean Only</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>Origin</span>
                                    <span className={styles.detailValue}>Italy</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>Designer</span>
                                    <span className={styles.detailValue}>Maria Grazia</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>Collection</span>
                                    <span className={styles.detailValue}>Summer 2024</span>
                                </div>
                            </div>

                            {/* Renk Seçenekleri */}
                            <div className={styles.colorsSection}>
                                <h5 className={styles.colorsTitle}>
                                    <FaGem /> Available Colors
                                </h5>
                                <div className={styles.colorOptions}>
                                    {colors.map((color) => (
                                        <div
                                            key={color.name}
                                            className={`${styles.colorOption} ${selectedColor === color.name ? styles.colorOptionActive : ''}`}
                                            style={{ backgroundColor: color.code }}
                                            onClick={() => setSelectedColor(color.name)}
                                            title={color.label}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Beden Seçenekleri */}
                            <div className={styles.sizesSection}>
                                <h5 className={styles.sizesTitle}>Select Size</h5>
                                <div className={styles.sizeOptions}>
                                    {sizes.map((size) => (
                                        <button
                                            key={size}
                                            className={`${styles.sizeOption} ${isDarkMode ? styles.sizeOptionDark : styles.sizeOptionLight} ${selectedSize === size ? styles.sizeOptionActive : ''}`}
                                            onClick={() => setSelectedSize(size)}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                                <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.6 }}>
                                    <FaInfoCircle style={{ marginRight: '4px' }} /> Size guide available
                                </div>
                            </div>

                            {/* Sepete Ekle Butonu */}
                            <button className={styles.addToCartBtn}>
                                <FaShoppingBag />
                                ADD TO CART
                            </button>
                        </>
                    )}

                    {/* İçerik - Reviews Tab */}
                    {activeTab === 'reviews' && (
                        <>
                            <div className={styles.productCard}>
                                <h4 className={`${styles.productName} ${isDarkMode ? styles.productNameDark : styles.productNameLight}`}>
                                    Customer Reviews
                                </h4>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '48px', fontWeight: '700', color: 'var(--color-primary)' }}>4.5</div>
                                        <div className={styles.stars}>
                                            <FaStar /><FaStar /><FaStar /><FaStar /><FaRegStar />
                                        </div>
                                        <div style={{ fontSize: '12px', opacity: 0.6 }}>128 reviews</div>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        {[5, 4, 3, 2, 1].map((rating) => (
                                            <div key={rating} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                <span style={{ fontSize: '12px', minWidth: '30px' }}>{rating}★</span>
                                                <div style={{ flex: 1, height: '6px', background: 'rgba(0,0,0,0.1)', borderRadius: '3px' }}>
                                                    <div style={{ width: `${rating === 5 ? 60 : rating === 4 ? 25 : rating === 3 ? 10 : rating === 2 ? 3 : 2}%`, height: '100%', background: 'var(--color-primary)', borderRadius: '3px' }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {reviews.map((review, index) => (
                                <div key={index} className={styles.detailItem} style={{ marginBottom: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <strong>{review.name}</strong>
                                        <span style={{ fontSize: '11px', opacity: 0.5 }}>{review.date}</span>
                                    </div>
                                    <div className={styles.stars} style={{ marginBottom: '8px' }}>
                                        {[...Array(5)].map((_, i) => (
                                            i < review.rating ? <FaStar key={i} /> : <FaRegStar key={i} />
                                        ))}
                                    </div>
                                    <p style={{ fontSize: '13px', lineHeight: '1.5' }}>{review.comment}</p>
                                </div>
                            ))}
                        </>
                    )}

                    {/* İçerik - Shipping Tab */}
                    {activeTab === 'shipping' && (
                        <>
                            <div className={styles.deliveryInfo}>
                                {features.map((feature, index) => (
                                    <div key={index} className={`${styles.deliveryRow} ${isDarkMode ? styles.deliveryRowDark : styles.deliveryRowLight}`}>
                                        <span className={styles.deliveryIcon}>{feature.icon}</span>
                                        <div className={styles.deliveryText}>
                                            <strong>{feature.label}</strong>
                                            <div style={{ fontSize: '12px', opacity: 0.6 }}>{feature.value}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.detailItem} style={{ marginBottom: '16px' }}>
                                <h5 style={{ marginBottom: '12px' }}>Delivery Options</h5>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span>Standard (3-5 days)</span>
                                    <span style={{ fontWeight: '600' }}>$5.99</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span>Express (1-2 days)</span>
                                    <span style={{ fontWeight: '600' }}>$12.99</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Next Day</span>
                                    <span style={{ fontWeight: '600' }}>$24.99</span>
                                </div>
                            </div>

                            <div className={styles.detailItem}>
                                <h5 style={{ marginBottom: '12px' }}>Return Policy</h5>
                                <p style={{ fontSize: '13px', lineHeight: '1.6' }}>
                                    Free returns within 30 days of delivery. Items must be unworn with original tags attached.
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* ===== MOBİL ALT NAVİGASYON ===== */}
            <div className={`${styles.mobileNav} ${isDarkMode ? styles.mobileNavDark : styles.mobileNavLight}`}>
                <div className={styles.mobileNavItem}>
                    <FaHome className={styles.mobileNavIcon} />
                    <span>Home</span>
                </div>
                <div className={`${styles.mobileNavItem} ${styles.mobileNavItemActive}`}>
                    <FaPlay className={styles.mobileNavIcon} />
                    <span>Reels</span>
                </div>
                <div className={styles.mobileNavItem}>
                    <FaCompass className={styles.mobileNavIcon} />
                    <span>Discover</span>
                </div>
                <div className={styles.mobileNavItem}>
                    <FaUser className={styles.mobileNavIcon} />
                    <span>Profile</span>
                </div>
                <div className={styles.mobileNavItem}>
                    <FaCog className={styles.mobileNavIcon} />
                    <span>Settings</span>
                </div>
            </div>
        </div>
    );
};

export default Medya;