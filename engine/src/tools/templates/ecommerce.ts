import type { BuildArtifactFile } from '../../types.js';
import { BASE_CSS, STARFIELD_HTML, STARFIELD_JS, SCROLL_REVEAL_JS, TOAST_JS } from '../designSystem.js';

export interface EcommerceSlots {
  storeName: string;
  tagline: string;
  product1Name: string;
  product1Price: string;
  product1Desc: string;
  product2Name: string;
  product2Price: string;
  product2Desc: string;
  product3Name: string;
  product3Price: string;
  product3Desc: string;
  product4Name: string;
  product4Price: string;
  product4Desc: string;
  category1: string;
  category2: string;
  category3: string;
}

export function generateEcommerce(slots: EcommerceSlots): BuildArtifactFile[] {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="${slots.tagline} — ${slots.storeName}" />
  <title>${slots.storeName} — Shop</title>
  <style>
    ${BASE_CSS}
    body { overflow-x: hidden; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

    /* Nav */
    nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 50;
      padding: 16px 24px;
      background: rgba(5,5,8,0.9);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--glass-border);
      display: flex; align-items: center; justify-content: space-between;
    }
    .logo { font-weight: 700; font-size: 20px; color: var(--lime); letter-spacing: -0.02em; }
    .nav-right { display: flex; align-items: center; gap: 24px; }
    .nav-links { display: flex; gap: 28px; }
    .nav-links a { color: var(--text-muted); text-decoration: none; font-size: 14px; transition: color 0.2s; }
    .nav-links a:hover { color: var(--text); }
    .cart-btn {
      position: relative; background: none; border: 1px solid var(--glass-border);
      border-radius: 8px; padding: 8px 16px; color: var(--text); cursor: pointer;
      font-family: var(--sans); font-size: 14px; transition: all 0.2s;
    }
    .cart-btn:hover { border-color: var(--lime); color: var(--lime); }
    .cart-count {
      position: absolute; top: -6px; right: -6px;
      background: var(--lime); color: #050508;
      font-size: 10px; font-weight: 700;
      width: 18px; height: 18px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
    }

    /* Hero */
    .hero {
      position: relative; z-index: 1;
      padding: 140px 0 80px;
      text-align: center;
    }
    .hero-badge {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 16px; border-radius: 999px;
      border: 1px solid rgba(210,255,85,0.3);
      background: rgba(210,255,85,0.08);
      color: var(--lime); font-size: 13px; font-weight: 500;
      margin-bottom: 24px;
    }
    h1 {
      font-size: clamp(36px, 6vw, 72px);
      font-weight: 700; line-height: 1.05;
      letter-spacing: -0.03em; margin-bottom: 16px;
    }
    h1 em { font-style: normal; color: var(--lime); }
    .hero-sub { font-size: 18px; color: var(--text-muted); margin-bottom: 36px; max-width: 500px; margin-left: auto; margin-right: auto; }

    /* Categories */
    .categories {
      position: relative; z-index: 1;
      display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;
      margin-bottom: 60px;
    }
    .cat-chip {
      padding: 8px 20px; border-radius: 999px;
      background: var(--glass); border: 1px solid var(--glass-border);
      color: var(--text-muted); font-size: 14px; cursor: pointer;
      transition: all 0.2s; font-family: var(--sans);
    }
    .cat-chip:hover, .cat-chip.active { border-color: var(--lime); color: var(--lime); background: rgba(210,255,85,0.08); }

    /* Products */
    .products {
      position: relative; z-index: 1;
      padding: 0 0 80px;
    }
    .section-label {
      text-align: center; font-size: 12px; font-weight: 600;
      text-transform: uppercase; letter-spacing: 0.15em;
      color: var(--lime); margin-bottom: 12px;
    }
    .section-title {
      text-align: center; font-size: clamp(24px, 4vw, 40px);
      font-weight: 700; letter-spacing: -0.02em;
      margin-bottom: 48px;
    }
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 24px;
    }
    .product-card {
      background: var(--glass); border: 1px solid var(--glass-border);
      border-radius: 16px; overflow: hidden;
      transition: transform 0.3s, border-color 0.3s, box-shadow 0.3s;
    }
    .product-card:hover {
      transform: translateY(-6px);
      border-color: rgba(210,255,85,0.3);
      box-shadow: 0 12px 40px rgba(0,0,0,0.3);
    }
    .product-img {
      height: 200px; background: linear-gradient(135deg, rgba(210,255,85,0.08), rgba(183,80,178,0.08));
      display: flex; align-items: center; justify-content: center;
      font-size: 48px; border-bottom: 1px solid var(--glass-border);
    }
    .product-body { padding: 20px; }
    .product-name { font-size: 16px; font-weight: 600; margin-bottom: 6px; }
    .product-desc { font-size: 14px; color: var(--text-muted); line-height: 1.5; margin-bottom: 16px; }
    .product-bottom { display: flex; align-items: center; justify-content: space-between; }
    .product-price { font-family: var(--mono); font-size: 20px; font-weight: 700; color: var(--lime); }
    .add-btn {
      background: rgba(210,255,85,0.1); border: 1px solid rgba(210,255,85,0.3);
      color: var(--lime); padding: 8px 16px; border-radius: 8px;
      font-family: var(--sans); font-size: 13px; font-weight: 600;
      cursor: pointer; transition: all 0.2s;
    }
    .add-btn:hover { background: var(--lime); color: #050508; }

    /* Cart Sidebar */
    .cart-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.6);
      z-index: 200; opacity: 0; pointer-events: none;
      transition: opacity 0.3s;
    }
    .cart-overlay.open { opacity: 1; pointer-events: all; }
    .cart-panel {
      position: fixed; top: 0; right: -400px; bottom: 0;
      width: 380px; max-width: 90vw;
      background: var(--bg2); border-left: 1px solid var(--glass-border);
      z-index: 201; padding: 24px;
      transition: right 0.3s;
      display: flex; flex-direction: column;
    }
    .cart-overlay.open .cart-panel { right: 0; }
    .cart-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
    .cart-header h2 { font-size: 20px; font-weight: 700; }
    .close-cart {
      background: none; border: 1px solid var(--glass-border);
      color: var(--text); width: 32px; height: 32px;
      border-radius: 8px; cursor: pointer; font-size: 16px;
      transition: border-color 0.2s;
    }
    .close-cart:hover { border-color: var(--text); }
    .cart-items { flex: 1; overflow-y: auto; }
    .cart-item {
      display: flex; align-items: center; gap: 12px;
      padding: 12px; border-radius: 10px;
      background: var(--glass); margin-bottom: 8px;
    }
    .cart-item-icon { font-size: 24px; }
    .cart-item-info { flex: 1; }
    .cart-item-name { font-size: 14px; font-weight: 500; }
    .cart-item-price { font-size: 13px; color: var(--lime); font-family: var(--mono); }
    .remove-item {
      background: none; border: none; color: var(--text-muted);
      cursor: pointer; font-size: 14px;
    }
    .remove-item:hover { color: #ff4444; }
    .cart-total {
      padding-top: 16px; border-top: 1px solid var(--glass-border);
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 16px;
    }
    .cart-total span { font-size: 14px; color: var(--text-muted); }
    .cart-total strong { font-size: 20px; font-family: var(--mono); color: var(--lime); }
    .empty-cart { text-align: center; color: var(--text-muted); padding: 40px 0; font-size: 14px; }

    footer {
      position: relative; z-index: 1;
      text-align: center; padding: 40px 24px;
      border-top: 1px solid var(--glass-border);
      color: var(--text-muted); font-size: 14px;
    }
    @media (max-width: 768px) {
      .nav-links { display: none; }
    }
  </style>
</head>
<body>
  ${STARFIELD_HTML}

  <nav>
    <div class="logo">${slots.storeName}</div>
    <div class="nav-right">
      <div class="nav-links">
        <a href="#products">Products</a>
        <a href="#categories">Categories</a>
      </div>
      <button class="cart-btn" onclick="toggleCart()">
        🛒 Cart <span class="cart-count" id="cartCount">0</span>
      </button>
    </div>
  </nav>

  <section class="hero">
    <div class="container">
      <div class="hero-badge">✨ New Collection</div>
      <h1>${slots.storeName.split(' ').map(function(w, i) { return i === 0 ? '<em>' + w + '</em>' : w; }).join(' ')}</h1>
      <p class="hero-sub">${slots.tagline}</p>
      <button class="btn-lime" onclick="document.getElementById('products').scrollIntoView({behavior:'smooth'})">Browse Products</button>
    </div>
  </section>

  <div class="categories" id="categories">
    <button class="cat-chip active" onclick="filterCat(this,'all')">All</button>
    <button class="cat-chip" onclick="filterCat(this,'cat1')">${slots.category1}</button>
    <button class="cat-chip" onclick="filterCat(this,'cat2')">${slots.category2}</button>
    <button class="cat-chip" onclick="filterCat(this,'cat3')">${slots.category3}</button>
  </div>

  <section class="products" id="products">
    <div class="container">
      <div class="section-label">Our Products</div>
      <div class="section-title">Featured Collection</div>
      <div class="product-grid" id="productGrid">
        <div class="product-card reveal" data-cat="cat1">
          <div class="product-img">🎁</div>
          <div class="product-body">
            <div class="product-name">${slots.product1Name}</div>
            <div class="product-desc">${slots.product1Desc}</div>
            <div class="product-bottom">
              <span class="product-price">$${slots.product1Price}</span>
              <button class="add-btn" onclick="addToCart('${slots.product1Name}',${slots.product1Price},'🎁')">Add to Cart</button>
            </div>
          </div>
        </div>
        <div class="product-card reveal" data-cat="cat2">
          <div class="product-img">✨</div>
          <div class="product-body">
            <div class="product-name">${slots.product2Name}</div>
            <div class="product-desc">${slots.product2Desc}</div>
            <div class="product-bottom">
              <span class="product-price">$${slots.product2Price}</span>
              <button class="add-btn" onclick="addToCart('${slots.product2Name}',${slots.product2Price},'✨')">Add to Cart</button>
            </div>
          </div>
        </div>
        <div class="product-card reveal" data-cat="cat1">
          <div class="product-img">💎</div>
          <div class="product-body">
            <div class="product-name">${slots.product3Name}</div>
            <div class="product-desc">${slots.product3Desc}</div>
            <div class="product-bottom">
              <span class="product-price">$${slots.product3Price}</span>
              <button class="add-btn" onclick="addToCart('${slots.product3Name}',${slots.product3Price},'💎')">Add to Cart</button>
            </div>
          </div>
        </div>
        <div class="product-card reveal" data-cat="cat3">
          <div class="product-img">🚀</div>
          <div class="product-body">
            <div class="product-name">${slots.product4Name}</div>
            <div class="product-desc">${slots.product4Desc}</div>
            <div class="product-bottom">
              <span class="product-price">$${slots.product4Price}</span>
              <button class="add-btn" onclick="addToCart('${slots.product4Name}',${slots.product4Price},'🚀')">Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Cart Sidebar -->
  <div class="cart-overlay" id="cartOverlay" onclick="toggleCart()">
    <div class="cart-panel" onclick="event.stopPropagation()">
      <div class="cart-header">
        <h2>Your Cart</h2>
        <button class="close-cart" onclick="toggleCart()">✕</button>
      </div>
      <div class="cart-items" id="cartItems">
        <div class="empty-cart" id="emptyCart">Your cart is empty</div>
      </div>
      <div class="cart-total">
        <span>Total</span>
        <strong id="cartTotal">$0.00</strong>
      </div>
      <button class="btn-lime" style="width:100%" onclick="checkout()">Checkout</button>
    </div>
  </div>

  <footer>
    <p>© ${new Date().getFullYear()} ${slots.storeName}. Built with Kawamura Agent.</p>
  </footer>

  <script>
    ${STARFIELD_JS}
    ${SCROLL_REVEAL_JS}
    ${TOAST_JS}

    var cart = [];

    function toggleCart() {
      document.getElementById('cartOverlay').classList.toggle('open');
    }

    function addToCart(name, price, icon) {
      cart.push({ name: name, price: price, icon: icon });
      renderCart();
      showToast(name + ' added to cart!');
    }

    function removeFromCart(index) {
      cart.splice(index, 1);
      renderCart();
    }

    function renderCart() {
      var container = document.getElementById('cartItems');
      var countEl = document.getElementById('cartCount');
      var totalEl = document.getElementById('cartTotal');
      var emptyEl = document.getElementById('emptyCart');

      countEl.textContent = cart.length;

      if (cart.length === 0) {
        container.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        totalEl.textContent = '$0.00';
        return;
      }

      var total = 0;
      var html = '';
      cart.forEach(function(item, i) {
        total += item.price;
        html += '<div class="cart-item">' +
          '<span class="cart-item-icon">' + item.icon + '</span>' +
          '<div class="cart-item-info"><div class="cart-item-name">' + item.name + '</div>' +
          '<div class="cart-item-price">$' + item.price.toFixed(2) + '</div></div>' +
          '<button class="remove-item" onclick="removeFromCart(' + i + ')">✕</button></div>';
      });
      container.innerHTML = html;
      totalEl.textContent = '$' + total.toFixed(2);
    }

    function filterCat(btn, cat) {
      document.querySelectorAll('.cat-chip').forEach(function(c) { c.classList.remove('active'); });
      btn.classList.add('active');
      document.querySelectorAll('.product-card').forEach(function(card) {
        if (cat === 'all' || card.getAttribute('data-cat') === cat) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    }

    function checkout() {
      if (cart.length === 0) {
        showToast('Your cart is empty!');
        return;
      }
      var total = cart.reduce(function(s, i) { return s + i.price; }, 0);
      showToast('Order placed! Total: $' + total.toFixed(2));
      cart = [];
      renderCart();
      toggleCart();
    }
  </script>
</body>
</html>`;

  return [
    { path: 'index.html', content: html },
    { path: 'README.md', content: `# ${slots.storeName}\\n\\n${slots.tagline}\\n\\n## Features\\n\\n- Product grid with category filtering\\n- Shopping cart with add/remove\\n- Checkout flow\\n- Responsive design\\n\\n## How to Use\\n\\nOpen index.html in any browser.\\n\\n## Tech Stack\\n\\n- HTML5, CSS3, Vanilla JavaScript\\n- Plus Jakarta Sans + JetBrains Mono\\n\\nGenerated by Kawamura Agent.` },
  ];
}
