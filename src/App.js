import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiShoppingBag, FiSearch, FiUser, FiHeart, FiCheck, FiTruck, FiRefreshCw, FiMenu, FiX, FiPackage, FiAperture, FiSend } from "react-icons/fi";
import { FaHeart, FaRuler } from "react-icons/fa";
import './App.css';

// --- TRANSLATIONS (UPDATED NAME) ---
const TRANSLATIONS = {
  en: {
    nav_home: "Home", nav_catalog: "Catalog", nav_about: "About", nav_contact: "Contact", nav_stylist: "Nova AI",
    hero_title: "New Season Arrivals", hero_subtitle: "Fall-Winter 2025 Collection", btn_shop: "Shop Now",
    cat_women: "Women", cat_men: "Men", cat_new: "New Collection", section_bestsellers: "Bestsellers",
    ben_ship_title: "Free Shipping", ben_ship_text: "Orders over $150",
    ben_auth_title: "Authentic Brands", ben_auth_text: "100% authentic",
    ben_ret_title: "14-Day Returns", ben_ret_text: "Money back guarantee",
    news_title: "Join the Club", news_text: "Get -10% on first order", btn_sub: "Subscribe",
    search_place: "Search...", cart_empty: "Your shopping bag is empty", cart_title: "Shopping Bag", cart_total: "Total",
    btn_checkout: "Proceed to Checkout", btn_remove: "Remove", fav_title: "Favorites", fav_empty: "Wishlist is empty",
    contact_title: "Contact Us", contact_addr: "Kyiv, Khreshchatyk St. 24", btn_send: "Send",
    auth_signin: "Sign In", auth_reg: "Register", auth_login_btn: "Log In", auth_create_btn: "Create Account",
    auth_welcome: "Welcome back", auth_logout: "Log Out",
    orders_title: "My Orders", orders_empty: "No orders yet", orders_start: "Start Shopping",
    about_title: "ÉPOQUE Heritage", about_phil: "Quality Philosophy", about_text1: "Curators of style.", about_text2: "Investment in wardrobe.",
    cat_all: "All", cat_out: "Outerwear", cat_dresses: "Dresses", cat_suits: "Suits", cat_shoes: "Shoes", cat_acc: "Accessories",
    gen_all: "All", gen_women: "Women", gen_men: "Men", gen_unisex: "Unisex",
    btn_add: "Add to Cart", msg_added: "added to cart", 
    msg_login_fav: "Login to add favorites", msg_login_cart: "Please log in to add to cart!",
    msg_removed_fav: "Removed", msg_saved_fav: "Saved", msg_logged_out: "Logged out", no_items: "No items found.",
    ph_name: "Name", ph_email: "Email", ph_password: "Password", ph_message: "Message",
    prod_size: "Select Size", prod_desc: "Description", prod_guide: "Size Guide", err_size: "Please select size",
    sg_size: "Size", sg_bust: "Bust", sg_waist: "Waist", sg_hips: "Hips", sg_eu: "EU", sg_us: "US", sg_uk: "UK", sg_cm: "CM",
    ai_welcome: "Hello! I am Nova, your AI stylist. Tell me what you are looking for.",
    ai_input_ph: "Ask Nova...", ai_send: "Send",
    cart_subtotal: "Subtotal", cart_ship: "Shipping", cart_free: "Free", cart_secure: "Secure Checkout"
  },
  ua: {
    nav_home: "Головна", nav_catalog: "Каталог", nav_about: "О нас", nav_contact: "Контакти", nav_stylist: "Nova AI",
    hero_title: "Нові Надходження", hero_subtitle: "Колекція Осінь-Зима 2025", btn_shop: "Дивитись",
    cat_women: "Жінкам", cat_men: "Чоловікам", cat_new: "Нова Колекція", section_bestsellers: "Хіти Продажів",
    ben_ship_title: "Безкоштовна Доставка", ben_ship_text: "Від $150",
    ben_auth_title: "Оригінальні Бренди", ben_auth_text: "100% оригінал",
    ben_ret_title: "Повернення 14 днів", ben_ret_text: "Повернемо гроші",
    news_title: "Вступай в клуб", news_text: "-10% на перше замовлення", btn_sub: "Підписатись",
    search_place: "Пошук...", cart_empty: "Ваш кошик порожній", cart_title: "Мій Кошик", cart_total: "Разом",
    btn_checkout: "Оформити замовлення", btn_remove: "Видалити", fav_title: "Обране", fav_empty: "Список бажань порожній",
    contact_title: "Наші Контакти", contact_addr: "Київ, вул. Хрещатик 24", btn_send: "Надіслати",
    auth_signin: "Вхід", auth_reg: "Реєстрація", auth_login_btn: "Увійти", auth_create_btn: "Створити акаунт",
    auth_welcome: "З поверненням", auth_logout: "Вийти",
    orders_title: "Мої Замовлення", orders_empty: "Ще немає замовлень", orders_start: "Почати Шопінг",
    about_title: "ÉPOQUE. Спадщина", about_phil: "Філософія Якості", about_text1: "Ми — куратори стилю.", about_text2: "Інвестиція у ваш гардероб.",
    cat_all: "Всі", cat_out: "Верхній одяг", cat_dresses: "Сукні", cat_suits: "Костюми", cat_shoes: "Взуття", cat_acc: "Аксесуари",
    gen_all: "Всі", gen_women: "Жінки", gen_men: "Чоловіки", gen_unisex: "Унісекс",
    btn_add: "У Кошик", msg_added: "додано в кошик", 
    msg_login_fav: "Увійдіть для обраного", msg_login_cart: "Увійдіть, щоб додати в кошик!",
    msg_removed_fav: "Видалено", msg_saved_fav: "Збережено", msg_logged_out: "Ви вийшли", no_items: "Нічого не знайдено.",
    ph_name: "Ім'я", ph_email: "Email", ph_password: "Пароль", ph_message: "Повідомлення",
    prod_size: "Оберіть розмір", prod_desc: "Опис", prod_guide: "Розмірна сітка", err_size: "Оберіть розмір",
    sg_size: "Розмір", sg_bust: "Бюст", sg_waist: "Талія", sg_hips: "Стегна", sg_eu: "EU", sg_us: "US", sg_uk: "UK", sg_cm: "СМ",
    ai_welcome: "Привіт! Я Nova, твій AI-стиліст. Розкажи, що ти шукаєш.",
    ai_input_ph: "Напиши Nova...", ai_send: "Надіслати",
    cart_subtotal: "Сума", cart_ship: "Доставка", cart_free: "Безкоштовно", cart_secure: "Безпечна оплата"
  }
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// --- COMPONENTS ---

const Navbar = ({ cartCount, favCount, onSearch, user, lang, setLang, t }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    if (e.key === 'Enter') { onSearch(searchText); navigate('/catalog'); setShowSearch(false); }
  };
  
  const clearSearch = () => {
    setSearchText("");
    onSearch(""); 
  };

  const resetAndNavigate = () => {
    onSearch("");
    setSearchText("");
    setMobileMenuOpen(false);
  };

  const closeMenu = () => setMobileMenuOpen(false);
  const toggleLang = () => setLang(lang === 'en' ? 'ua' : 'en');

  return (
    <>
      <nav className="navbar">
        <div className="burger-menu" onClick={() => setMobileMenuOpen(true)}><FiMenu /></div>
        {/* LOGO UPDATED HERE */}
        <Link to="/" className="logo" onClick={resetAndNavigate}>ÉPOQUE</Link>
        <div className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={resetAndNavigate}>{t('nav_home')}</Link>
          <Link to="/catalog" className={`nav-link ${location.pathname === '/catalog' ? 'active' : ''}`} onClick={resetAndNavigate}>{t('nav_catalog')}</Link>
          <Link to="/stylist" className={`nav-link ${location.pathname === '/stylist' ? 'active' : ''}`} style={{display:'flex', alignItems:'center', gap:'5px'}}>
            <FiAperture /> {t('nav_stylist')}
          </Link>
          <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>{t('nav_about')}</Link>
          <Link to="/contacts" className={`nav-link ${location.pathname === '/contacts' ? 'active' : ''}`}>{t('nav_contact')}</Link>
        </div>
        <div className="nav-icons">
          <div className="lang-switch" onClick={toggleLang}>{lang.toUpperCase()}</div>
          <div style={{display:'flex', alignItems:'center', position: 'relative'}}>
            {showSearch && (
              <>
                <input 
                  className="news-input" 
                  style={{padding:'5px', paddingRight: '25px', marginRight:'5px', width:'150px'}} 
                  autoFocus 
                  placeholder={t('search_place')} 
                  value={searchText} 
                  onChange={e => { setSearchText(e.target.value); if(e.target.value === "") onSearch(""); }} 
                  onKeyDown={handleSearch} 
                />
                {searchText && <FiX onClick={clearSearch} style={{position: 'absolute', right: '10px', color: '#000', cursor: 'pointer'}} />}
              </>
            )}
            <FiSearch className="icon-btn" onClick={() => setShowSearch(!showSearch)} />
          </div>
          <Link to="/favorites" className="icon-btn"><FiHeart />{favCount > 0 && <span className="badge">{favCount}</span>}</Link>
          <Link to="/cart" className="icon-btn"><FiShoppingBag />{cartCount > 0 && <span className="badge">{cartCount}</span>}</Link>
          <Link to="/account" className="icon-btn">{user ? (<div className="nav-user-initial">{user.name.charAt(0)}</div>) : (<FiUser />)}</Link>
        </div>
      </nav>
      <div className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="close-menu" onClick={closeMenu}><FiX /></div>
        <div className="lang-switch" onClick={toggleLang} style={{marginBottom:'20px', fontSize:'1.2rem', marginRight:0}}>{lang === 'en' ? 'Українська' : 'English'}</div>
        <Link to="/" className="mobile-link" onClick={resetAndNavigate}>{t('nav_home')}</Link>
        <Link to="/catalog" className="mobile-link" onClick={resetAndNavigate}>{t('nav_catalog')}</Link>
        <Link to="/stylist" className="mobile-link" onClick={closeMenu}>{t('nav_stylist')}</Link>
        <Link to="/contacts" className="mobile-link" onClick={closeMenu}>{t('nav_contact')}</Link>
      </div>
    </>
  );
};

const ProductCard = ({ product, toggleFav, isFav, lang, t }) => {
  const navigate = useNavigate();
  let genderText = product.gender === "Women" ? t('gen_women') : product.gender === "Men" ? t('gen_men') : t('gen_unisex');
  
  const goToDetails = (e) => {
    if(e) e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  const handleFavClick = (e) => {
    e.stopPropagation();
    if (isFav) { toggleFav(product); } else { navigate(`/product/${product.id}`); }
  };

  return (
    <div className="product-card" onClick={goToDetails}>
      <div className="img-box">
        <img src={product.img} alt={product.name_en} onError={(e) => {e.target.src = "https://via.placeholder.com/400x500?text=No+Image"}} />
        <button className={`fav-btn ${isFav ? 'active' : ''}`} onClick={handleFavClick}>
          {isFav ? <FaHeart /> : <FiHeart />}
        </button>
        <button className="add-btn" onClick={goToDetails}>{t('btn_add')}</button>
      </div>
      <div className="product-details">
        <div className="brand">{product.brand}</div>
        <div style={{fontSize: '0.75rem', color: '#999', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '1px'}}>{genderText}</div>
        <div className="name">{product[`name_${lang}`]}</div>
        <div className="price">${product.price.toLocaleString()}</div>
      </div>
    </div>
  );
};

const NovaChat = ({ products, addToCart, toggleFav, favorites, lang, t }) => {
  const [messages, setMessages] = useState([{ role: 'assistant', content: t('ai_welcome') }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('https://epoque-fashion-store.onrender.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] })
      });
      const data = await res.json();

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.reply, 
        products: data.products ? data.products.map(id => products.find(p => p.id === id)).filter(Boolean) : []
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Server connection error." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{maxWidth: '800px', height: '80vh', display: 'flex', flexDirection: 'column'}}>
      <div className="chat-header" style={{borderBottom:'1px solid #eee', paddingBottom:'1rem', marginBottom:'1rem', display:'flex', alignItems:'center', gap:'1rem'}}>
        <div style={{width:'50px', height:'50px', background:'#c5a059', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'1.5rem'}}><FiAperture /></div>
        <div><h2 style={{margin:0}}>Nova AI</h2><span style={{color:'green', fontSize:'0.8rem'}}>Online</span></div>
      </div>
      
      <div className="chat-window" style={{flex:1, overflowY:'auto', padding:'1rem', background:'#f9f9f9', borderRadius:'10px'}}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{display:'flex', flexDirection:'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom:'1.5rem'}}>
            <div style={{maxWidth: '80%', padding: '15px', borderRadius: '15px', background: msg.role === 'user' ? '#1a1a1a' : 'white', color: msg.role === 'user' ? 'white' : 'black', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'}}>{msg.content}</div>
            {msg.products && msg.products.length > 0 && (
              <div className="chat-products" style={{display:'flex', gap:'10px', marginTop:'10px', overflowX:'auto', maxWidth:'100%'}}>
                {msg.products.map(p => (
                  <div key={p.id} style={{minWidth:'150px', background:'white', padding:'10px', borderRadius:'10px', border:'1px solid #eee', cursor:'pointer'}} onClick={() => window.location.href=`/product/${p.id}`}>
                    <img src={p.img} alt="" style={{width:'100%', height:'150px', objectFit:'cover', borderRadius:'5px'}} />
                    <div style={{fontSize:'0.8rem', marginTop:'5px', fontWeight:'bold'}}>{p.brand}</div>
                    <div style={{fontSize:'0.7rem'}}>{p[`name_${lang}`].substring(0, 20)}...</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && <div style={{color:'#999', fontStyle:'italic'}}>Nova is typing...</div>}
        <div ref={chatEndRef} />
      </div>

      <div className="chat-input-area" style={{marginTop:'1rem', display:'flex', gap:'10px'}}>
        <input className="news-input" value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} placeholder={t('ai_input_ph')} autoFocus />
        <button className="btn-black" onClick={handleSend}><FiSend /></button>
      </div>
    </div>
  );
};

const Cart = ({ cart, removeFromCart, lang, t }) => {
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  if (cart.length === 0) return (
    <div className="container" style={{ textAlign: 'center', padding: '10rem 2rem' }}>
      <FiShoppingBag size={60} color="#eee" style={{marginBottom: '2rem'}} />
      <h2 style={{fontSize: '2rem', marginBottom: '1rem'}}>{t('cart_empty')}</h2>
      <p style={{color:'#888', marginBottom:'3rem', fontSize: '1.1rem'}}>Looks like you haven't added anything yet.</p>
      <Link to="/catalog" className="btn-black" style={{display:'inline-block', padding: '15px 40px'}}>Go to Catalog</Link>
    </div>
  );

  return (
    <div className="container" style={{ maxWidth: '1100px' }}>
      <h2 className="section-title" style={{textAlign:'left'}}>{t('cart_title')} <span style={{fontSize:'1rem', color:'#999', fontWeight:'normal'}}>({cart.length})</span></h2>
      
      <div className="cart-layout" style={{display:'grid', gridTemplateColumns: '2fr 1fr', gap:'40px', alignItems:'start'}}>
        
        {/* Left Column: Items */}
        <div className="cart-items">
          {cart.map((item, i) => (
            <div key={i} className="cart-item-row" style={{display:'flex', gap:'20px', paddingBottom:'25px', marginBottom:'25px', borderBottom:'1px solid #eee'}}>
              <Link to={`/product/${item.id}`} style={{flexShrink:0}}>
                <img src={item.img} alt="" style={{width:'120px', height:'160px', objectFit:'cover', borderRadius:'4px', background:'#f4f4f4'}} />
              </Link>
              <div style={{flex: 1, display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
                <div>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                    <div>
                      <div style={{fontSize:'0.8rem', color:'#888', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'5px'}}>{item.brand}</div>
                      <Link to={`/product/${item.id}`} style={{textDecoration:'none', color:'inherit', fontSize:'1.1rem', fontWeight:'500'}}>{item[`name_${lang}`]}</Link>
                    </div>
                    <div style={{fontSize:'1.1rem', fontWeight:'600'}}>${item.price.toLocaleString()}</div>
                  </div>
                  {item.selectedSize && <div style={{marginTop:'10px', fontSize:'0.9rem', background:'#f9f9f9', display:'inline-block', padding:'4px 8px', borderRadius:'4px', color:'#555'}}><span style={{color:'#999'}}>{t('sg_size')}:</span> {item.selectedSize}</div>}
                </div>
                
                <div style={{textAlign:'right'}}>
                   <button onClick={() => removeFromCart(i)} style={{background:'none', border:'none', color:'#999', textDecoration:'underline', cursor:'pointer', fontSize:'0.85rem', padding:0}}>{t('btn_remove')}</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Summary */}
        <div className="cart-summary" style={{background:'#fcfcfc', padding:'30px', borderRadius:'12px', border:'1px solid #eee', position:'sticky', top:'100px'}}>
          <h3 style={{marginTop:0, marginBottom:'25px', fontSize:'1.2rem'}}>{t('cart_total')}</h3>
          
          <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px', fontSize:'0.95rem', color:'#555'}}>
            <span>{t('cart_subtotal')}</span>
            <span>${total.toLocaleString()}</span>
          </div>
          <div style={{display:'flex', justifyContent:'space-between', marginBottom:'25px', fontSize:'0.95rem', color:'#555'}}>
            <span>{t('cart_ship')}</span>
            <span style={{color:'green'}}>{t('cart_free')}</span>
          </div>

          <div style={{borderTop:'1px solid #eee', margin:'15px 0'}}></div>

          <div style={{display:'flex', justifyContent:'space-between', marginBottom:'30px', fontWeight:'700', fontSize:'1.3rem'}}>
            <span>{t('cart_total')}</span>
            <span>${total.toLocaleString()}</span>
          </div>

          <button className="btn-black" style={{width:'100%', padding:'15px'}} onClick={() => toast.success("Order successfully paid!")}>{t('btn_checkout')}</button>
          
          <div style={{marginTop:'20px', fontSize:'0.8rem', color:'#999', textAlign:'center', display:'flex', alignItems:'center', justifyContent:'center', gap:'5px'}}>
            <FiCheck size={14} /> {t('cart_secure')}
          </div>
        </div>

      </div>
    </div>
  );
};

const ProductPage = ({ products, addToCart, toggleFav, favorites, lang, t }) => {
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState(null);

  if (!products || products.length === 0) return <div className="container" style={{padding:'5rem', textAlign:'center'}}><h2>Wait... Loading...</h2></div>;

  const product = products.find(p => p.id === parseInt(id));

  if (!product) return <div className="container" style={{padding:'5rem', textAlign:'center'}}><h2>Product Not Found</h2></div>;

  const isFav = favorites.some(f => f.id === product.id);
  const handleAddToCart = () => { if (!selectedSize) { toast.error(t('err_size')); return; } addToCart({ ...product, selectedSize }); };
  const handleToggleFav = () => {
    if (isFav) { toggleFav(product); } 
    else { if (!selectedSize) { toast.error(t('err_size')); return; } toggleFav({ ...product, selectedSize }); }
  };
  const isShoes = product.category === "Shoes";

  return (
    <div className="container product-page-container">
      <div className="product-img-col"><img src={product.img} alt={product[`name_${lang}`]} className="product-main-img" /></div>
      <div className="product-info-col">
        <div className="prod-brand">{product.brand}</div>
        <h1 className="prod-title">{product[`name_${lang}`]}</h1>
        <div className="prod-price">${product.price.toLocaleString()}</div>
        <p className="prod-desc-box"><strong>{t('prod_desc')}:</strong><br/>{product[`desc_${lang}`]}</p>
        <div className="size-selector">
          <div className="size-label">{t('prod_size')}:</div>
          <div className="sizes-grid">{product.sizes.map(size => <button key={size} className={`size-btn ${selectedSize === size ? 'active' : ''}`} onClick={() => setSelectedSize(size)}>{size}</button>)}</div>
        </div>
        <div className="action-buttons">
          <button className="btn-black" style={{flex: 1}} onClick={handleAddToCart}>{t('btn_add')}</button>
          <button className={`btn-fav-large ${isFav ? 'active' : ''}`} onClick={handleToggleFav}>{isFav ? <FaHeart /> : <FiHeart />}</button>
        </div>
        <details className="size-guide-details">
          <summary className="size-guide-summary">{t('prod_guide')} <FaRuler /></summary>
          {isShoes ? <table className="size-table"><thead><tr><th>{t('sg_eu')}</th><th>{t('sg_us')}</th><th>{t('sg_uk')}</th><th>{t('sg_cm')}</th></tr></thead><tbody><tr><td>36</td><td>5</td><td>3</td><td>23</td></tr><tr><td>38</td><td>7</td><td>5</td><td>24.5</td></tr></tbody></table> 
          : <table className="size-table"><thead><tr><th>{t('sg_size')}</th><th>{t('sg_bust')}</th><th>{t('sg_waist')}</th><th>{t('sg_hips')}</th></tr></thead><tbody><tr><td>XS</td><td>82</td><td>62</td><td>88</td></tr><tr><td>S</td><td>86</td><td>66</td><td>92</td></tr></tbody></table>}
        </details>
      </div>
    </div>
  );
};

const Catalog = ({ products, addToCart, toggleFav, favorites, searchQuery, lang, t }) => {
  const [filter, setFilter] = useState("All");
  const [genderFilter, setGenderFilter] = useState("All");
  const location = useLocation();

  useEffect(() => {
    if (location.state?.gender) {
      setGenderFilter(location.state.gender);
    }
  }, [location.state]);

  const categories = ["All", "Outerwear", "Dresses", "Suits", "Shoes", "Accessories"];
  const genders = ["All", "Women", "Men", "Unisex"];
  const catMap = { "All": "cat_all", "Outerwear": "cat_out", "Dresses": "cat_dresses", "Suits": "cat_suits", "Shoes": "cat_shoes", "Accessories": "cat_acc" };
  const genMap = { "All": "gen_all", "Women": "gen_women", "Men": "gen_men", "Unisex": "gen_unisex" };
  
  const safeProducts = Array.isArray(products) ? products : [];
  
  const filtered = safeProducts.filter(p => {
    const matchCat = filter === "All" || p.category === filter;
    const matchGender = genderFilter === "All" || p.gender === genderFilter;
    const matchSearch = p.name_en.toLowerCase().includes(searchQuery.toLowerCase()) || p.name_ua.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchGender && matchSearch;
  });

  return (
    <div className="container">
      <div className="page-header"><h2 className="section-title">{t('nav_catalog')}</h2></div>
      <div className="filters">{categories.map(cat => <div key={cat} className={`filter-link ${filter === cat ? 'active' : ''}`} onClick={() => setFilter(cat)}>{t(catMap[cat])}</div>)}</div>
      <div className="filters" style={{marginTop: '-20px', fontSize: '0.8rem'}}>{genders.map(g => <div key={g} className={`filter-link ${genderFilter === g ? 'active' : ''}`} onClick={() => setGenderFilter(g)} style={{color: genderFilter === g ? '#c5a059' : '#999', margin: '0 10px'}}>{t(genMap[g])}</div>)}</div>
      <div className="products-grid">
        {filtered.map(p => <ProductCard key={p.id} product={p} addToCart={addToCart} toggleFav={toggleFav} isFav={favorites.some(f => f.id === p.id)} lang={lang} t={t} />)}
        {filtered.length === 0 && <p style={{gridColumn:'1/-1', textAlign:'center'}}>{t('no_items')}</p>}
      </div>
    </div>
  );
};

const Home = ({ products, addToCart, toggleFav, favorites, lang, t }) => {
  const safeProducts = Array.isArray(products) ? products : [];
  const trending = safeProducts.filter(p => [2, 4, 8, 9].includes(p.id)); 
  
  const navigate = useNavigate();
  return (
    <>
      <header className="hero"><div className="hero-content"><h1>{t('hero_title')}</h1><p>{t('hero_subtitle')}</p><button className="btn-hero" onClick={() => navigate('/catalog')}>{t('btn_shop')}</button></div></header>
      <section className="categories-section">
        <div className="cat-card" onClick={() => navigate('/catalog', { state: { gender: 'Women' } })}><img src="https://images.unsplash.com/photo-1581044777550-4cfa60707c03?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Women" /><div className="cat-overlay"><h3 className="cat-title">{t('cat_women')}</h3><span className="btn-link">{t('cat_new')}</span></div></div>
        <div className="cat-card" onClick={() => navigate('/catalog', { state: { gender: 'Men' } })}><img src="https://images.unsplash.com/photo-1594938328870-9623159c8c99?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" alt="Men" /><div className="cat-overlay"><h3 className="cat-title">{t('cat_men')}</h3><span className="btn-link">{t('btn_shop')}</span></div></div>
      </section>
      <section className="trending-section"><h2 className="section-title">{t('section_bestsellers')}</h2><div className="trending-grid">{trending.map(p => <ProductCard key={p.id} product={p} addToCart={addToCart} toggleFav={toggleFav} isFav={favorites.some(f => f.id === p.id)} lang={lang} t={t} />)}</div></section>
      <section className="benefits-section">
        <div className="benefit-item"><div className="benefit-icon"><FiTruck /></div><div className="benefit-title">{t('ben_ship_title')}</div><div className="benefit-text">{t('ben_ship_text')}</div></div>
        <div className="benefit-item"><div className="benefit-icon"><FiCheck /></div><div className="benefit-title">{t('ben_auth_title')}</div><div className="benefit-text">{t('ben_auth_text')}</div></div>
        <div className="benefit-item"><div className="benefit-icon"><FiRefreshCw /></div><div className="benefit-title">{t('ben_ret_title')}</div><div className="benefit-text">{t('ben_ret_text')}</div></div>
      </section>
      <section className="newsletter"><h3>{t('news_title')}</h3><p>{t('news_text')}</p><form className="news-form" onSubmit={(e) => { e.preventDefault(); toast.success("Check your email, promo code is there!"); }}><input type="email" placeholder="Email" className="news-input" required /><button type="submit" className="btn-black">{t('btn_sub')}</button></form></section>
    </>
  );
};

const Account = ({ user, setUser, onLogout, t }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/register';
    const payload = isLoginMode ? { email: formData.email, password: formData.password } : formData;

    try {
      const res = await fetch(`https://epoque-fashion-store.onrender.com${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      if (isLoginMode) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        toast.success(`${t('auth_welcome')}, ${data.user.name}!`);
      } else {
        toast.success("Account created! Please log in.");
        setIsLoginMode(true);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (user) return (
    <div className="profile-container">
      <div className="profile-header"><div className="avatar">{user.name.charAt(0).toUpperCase()}</div><div className="user-info"><h2>{t('auth_welcome')}, {user.name}</h2><p className="user-email">{user.email}</p><button className="btn-logout" onClick={onLogout}>{t('auth_logout')}</button></div></div>
      <div className="orders-section"><h3>{t('orders_title')}</h3><div className="empty-orders"><FiPackage size={40} style={{marginBottom:'10px'}} /><p>{t('orders_empty')}</p><Link to="/catalog" style={{textDecoration:'underline', marginTop:'10px', display:'block'}}>{t('orders_start')}</Link></div></div>
    </div>
  );
  return (
    <div className="auth-container">
      <div className="auth-tabs"><div className={`auth-tab ${isLoginMode ? 'active' : ''}`} onClick={() => setIsLoginMode(true)}>{t('auth_signin')}</div><div className={`auth-tab ${!isLoginMode ? 'active' : ''}`} onClick={() => setIsLoginMode(false)}>{t('auth_reg')}</div></div>
      <form onSubmit={handleSubmit}>
        {!isLoginMode && <div className="form-group"><label className="form-label">{t('ph_name')}</label><input type="text" name="name" className="form-input" placeholder={t('ph_name')} value={formData.name} onChange={handleChange} /></div>}
        <div className="form-group"><label className="form-label">{t('ph_email')}</label><input type="email" name="email" className="form-input" placeholder={t('ph_email')} value={formData.email} onChange={handleChange} /></div>
        <div className="form-group"><label className="form-label">{t('ph_password')}</label><input type="password" name="password" className="form-input" placeholder={t('ph_password')} value={formData.password} onChange={handleChange} /></div>
        <button type="submit" className="btn-black" style={{width: '100%'}}>{isLoginMode ? t('auth_login_btn') : t('auth_create_btn')}</button>
      </form>
    </div>
  );
};

const Favorites = ({ favorites, addToCart, toggleFav, lang, t }) => (
  <div className="container">
    <h2 className="section-title">{t('fav_title')}</h2>
    <div className="products-grid">{favorites.length === 0 ? <p style={{textAlign:'center', width:'100%', gridColumn:'1/-1'}}>{t('fav_empty')}</p> : favorites.map(p => (
      <div key={p.id} className="product-card" onClick={() => window.location.href=`/product/${p.id}`}>
        <div className="img-box">
          <img src={p.img} alt={p.name_en} />
          <button className={`fav-btn active`} onClick={(e) => {e.stopPropagation(); toggleFav(p);}}><FaHeart /></button>
          <button className="add-btn" onClick={(e) => {e.stopPropagation(); window.location.href=`/product/${p.id}`;}}>{t('btn_add')}</button>
        </div>
        <div className="product-details">
          <div className="brand">{p.brand}</div>
          <div className="name">{p[`name_${lang}`]}</div>
          {p.selectedSize && <div style={{fontSize:'0.8rem', color: '#c5a059', marginTop: '5px'}}>Size: {p.selectedSize}</div>}
          <div className="price">${p.price.toLocaleString()}</div>
        </div>
      </div>
    ))}</div>
  </div>
);

const Contacts = ({ t }) => (
  <div className="container" style={{maxWidth:'600px', textAlign:'center'}}>
    <h2 className="section-title">{t('contact_title')}</h2>
    <p style={{marginBottom:'1rem', color:'#666'}}>{t('contact_addr')}</p>
    <form className="news-form" style={{flexDirection:'column', gap:'15px'}} onSubmit={e => {e.preventDefault(); toast.info("Sent!");}}>
      <input className="news-input" placeholder={t('ph_name')} required />
      <input className="news-input" placeholder={t('ph_email')} required />
      <textarea className="news-input" rows="4" placeholder={t('ph_message')} required></textarea>
      <button className="btn-black">{t('btn_send')}</button>
    </form>
  </div>
);

const About = ({ t }) => (
  <div className="container">
    <div className="page-header"><h2 className="section-title">{t('about_title')}</h2></div>
    <div className="about-content">
      <div className="about-img"><img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" alt="Atelier" style={{width:'100%', height:'auto'}} /></div>
      <div className="about-text"><h3 style={{fontSize:'1.5rem', marginBottom:'1rem', fontFamily:'Playfair Display, serif'}}>{t('about_phil')}</h3><p>{t('about_text1')}</p><p>{t('about_text2')}</p></div>
    </div>
  </div>
);

// --- APP (Main Logic) ---
function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState('en');
  const t = (key) => TRANSLATIONS[lang][key] || key;

  // SET PAGE TITLE
  useEffect(() => {
    document.title = "ÉPOQUE | Fashion Store";
  }, []);

  // FETCH PRODUCTS AND RESTORE SESSION
  useEffect(() => {
    // 1. Get Products
    fetch('https://epoque-fashion-store.onrender.com')
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) setProducts(data);
        else setProducts([]);
      })
      .catch(err => {
        console.error("Server Error:", err);
        toast.error("Connecting to database...");
        setProducts([]);
      });

    // 2. Restore User Session
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const addToCart = (p) => { 
    if (!user) {
      toast.error(t('msg_login_cart'));
      return;
    }
    const item = p.selectedSize ? p : { ...p, selectedSize: "Standard" }; 
    setCart([...cart, item]); 
    toast.success(`${p[`name_${lang}`]} ${t('msg_added')}`); 
  };

  const toggleFav = (p) => {
    if (!user) { toast.error(t('msg_login_fav')); return; }
    if(favorites.find(f => f.id === p.id)) { setFavorites(favorites.filter(f => f.id !== p.id)); toast.info(t('msg_removed_fav')); }
    else { setFavorites([...favorites, p]); toast.error(t('msg_saved_fav') + " ❤️"); }
  };

  const handleLogout = () => { 
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null); 
    setFavorites([]); 
    setCart([]); 
    toast.info(t('msg_logged_out')); 
  };

  return (
    <Router>
      <ScrollToTop />
      <Navbar cartCount={cart.length} favCount={favorites.length} onSearch={setSearchQuery} user={user} lang={lang} setLang={setLang} t={t} />
      <Routes>
        <Route path="/" element={<Home products={products} addToCart={addToCart} toggleFav={toggleFav} favorites={favorites} lang={lang} t={t} />} />
        <Route path="/catalog" element={<Catalog products={products} addToCart={addToCart} toggleFav={toggleFav} favorites={favorites} searchQuery={searchQuery} lang={lang} t={t} />} />
        <Route path="/stylist" element={<NovaChat products={products} addToCart={addToCart} toggleFav={toggleFav} favorites={favorites} lang={lang} t={t} />} />
        <Route path="/about" element={<About t={t} />} />
        <Route path="/contacts" element={<Contacts t={t} />} />
        <Route path="/cart" element={<Cart cart={cart} removeFromCart={(i) => setCart(cart.filter((_, idx) => idx !== i))} lang={lang} t={t} />} />
        <Route path="/favorites" element={<Favorites favorites={favorites} addToCart={addToCart} toggleFav={toggleFav} lang={lang} t={t} />} />
        <Route path="/account" element={<Account user={user} setUser={setUser} onLogout={handleLogout} t={t} />} />
        <Route path="/product/:id" element={<ProductPage products={products} addToCart={addToCart} toggleFav={toggleFav} favorites={favorites} lang={lang} t={t} />} />
      </Routes>
      {/* FOOTER UPDATED NAME */}
      <footer style={{background:'#111', color:'#888', padding:'3rem', textAlign:'center', fontSize:'0.8rem'}}><p>© 2025 ÉPOQUE Studios | Designed in Ukraine</p></footer>
      <ToastContainer />
    </Router>
  );
}

export default App;