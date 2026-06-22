// ============================================
// Shopping Cart Management System
// ============================================

// Cart Data Structure
let cart = [];

// DOM Elements
const cartIcon = document.getElementById('cart-icon');
const cartDrawer = document.querySelector('.cart-drawer');
const cartOverlay = document.querySelector('.cart-overlay');
const cartClose = document.querySelector('.cart-close');
const cartItemsContainer = document.querySelector('.cart-items');
const cartCountBadge = document.querySelector('.cart-count');
const totalPriceElement = document.querySelector('.total-price');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const goUpBtn = document.querySelector('.goUp');
const loadingScreen = document.querySelector('.loading_sec');

// ============================================
// Product Data (Extracted from HTML)
// ============================================
const products = [
  {
    id: 1,
    name: 'Syltherine',
    description: 'Stylish cafe chair',
    price: 2500000,
    image: './img/4-prouduct/image 1.svg'
  },
  {
    id: 2,
    name: 'Leviosa',
    description: 'Stylish cafe chair',
    price: 2500000,
    image: './img/4-prouduct/image 2.svg'
  },
  {
    id: 3,
    name: 'Lolito',
    description: 'Luxury big sofa',
    price: 7000000,
    image: './img/4-prouduct/image 3.svg'
  },
  {
    id: 4,
    name: 'Respira',
    description: 'Outdoor bar table and stool',
    price: 500000,
    image: './img/4-prouduct/image 4.svg'
  },
  {
    id: 5,
    name: 'Grifo',
    description: 'Night lamp',
    price: 1500000,
    image: './img/4-prouduct/image 5.svg'
  },
  {
    id: 6,
    name: 'Muggo',
    description: 'Small mug',
    price: 150000,
    image: './img/4-prouduct/image 6.svg'
  },
  {
    id: 7,
    name: 'Pingky',
    description: 'Cute bed set',
    price: 7000000,
    image: './img/4-prouduct/image 7.svg'
  },
  {
    id: 8,
    name: 'Potty',
    description: 'Minimalist flower pot',
    price: 500000,
    image: './img/4-prouduct/image 8.svg'
  }
];

// ============================================
// Cart Functions
// ============================================

// Add product to cart
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  
  if (!product) return;

  // Check if product already exists in cart
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  updateCart();
  showNotification(`${product.name} added to cart!`);
}

// Remove product from cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCart();
}

// Update quantity
function updateQuantity(productId, newQuantity) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      item.quantity = newQuantity;
      updateCart();
    }
  }
}

// Update cart display
function updateCart() {
  // Update cart count badge
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountBadge.textContent = totalItems;

  // Update cart items display
  renderCartItems();

  // Update total price
  updateTotalPrice();

  // Save to localStorage
  saveCartToLocalStorage();
}

// Render cart items
function renderCartItems() {
  cartItemsContainer.innerHTML = '';

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p style="text-align: center; padding: 2rem; color: #999;">Your cart is empty</p>';
    return;
  }

  cart.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p style="font-size: 1.2rem; color: #999; margin-top: 0.5rem;">${item.description}</p>
        <div class="cart-item-price">
          <span class="qty">
            <input type="number" min="1" value="${item.quantity}" class="qty-input" data-id="${item.id}" style="width: 50px; padding: 0.5rem; border: 1px solid #ddd; border-radius: 0.3rem;" />
          </span>
          <span class="price-val">Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</span>
        </div>
      </div>
      <i class="fa-solid fa-trash remove-item" data-id="${item.id}" style="cursor: pointer; color: #e97171;"></i>
    `;
    cartItemsContainer.appendChild(cartItem);
  });

  // Add event listeners to quantity inputs and remove buttons
  document.querySelectorAll('.qty-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const productId = parseInt(e.target.dataset.id);
      const newQuantity = parseInt(e.target.value);
      updateQuantity(productId, newQuantity);
    });
  });

  document.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const productId = parseInt(e.target.dataset.id);
      removeFromCart(productId);
    });
  });
}

// Update total price
function updateTotalPrice() {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  totalPriceElement.textContent = `Rp ${total.toLocaleString('id-ID')}`;
}

// ============================================
// Cart UI Functions
// ============================================

// Open cart drawer
function openCart() {
  cartDrawer.classList.add('active');
  cartOverlay.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

// Close cart drawer
function closeCart() {
  cartDrawer.classList.remove('active');
  cartOverlay.style.display = 'none';
  document.body.style.overflow = 'auto';
}

// ============================================
// Notification System
// ============================================

function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: #b88e2f;
    color: #fff;
    padding: 1.5rem 2rem;
    border-radius: 0.5rem;
    font-size: 1.4rem;
    z-index: 10000;
    animation: slideIn 0.3s ease-in-out;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// ============================================
// LocalStorage Functions
// ============================================

function saveCartToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCart();
  }
}

// ============================================
// Event Listeners
// ============================================

// Cart icon click
cartIcon.addEventListener('click', (e) => {
  e.preventDefault();
  openCart();
});

// Cart close button
cartClose.addEventListener('click', closeCart);

// Cart overlay click
cartOverlay.addEventListener('click', closeCart);

// Add to cart buttons
addToCartButtons.forEach((button, index) => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    const productId = index + 1;
    addToCart(productId);
  });
});

// Go up button
goUpBtn.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Prevent cart overlay click from closing when clicking inside cart drawer
cartDrawer.addEventListener('click', (e) => {
  e.stopPropagation();
});

// ============================================
// Inspiration Slider
// ============================================

const slides = document.querySelectorAll('.slide');
const pages = document.querySelectorAll('.pagination .page');
const nextButtons = document.querySelectorAll('#btn_next');
let currentSlide = 0;

function showSlide(n) {
  slides.forEach(slide => slide.classList.remove('active'));
  pages.forEach(page => page.classList.remove('active'));
  
  slides[n].classList.add('active');
  pages[n].classList.add('active');
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

// Add event listeners to next buttons
nextButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    nextSlide();
  });
});

// Add event listeners to pagination dots
pages.forEach((page, index) => {
  page.addEventListener('click', () => {
    currentSlide = index;
    showSlide(currentSlide);
  });
});

// ============================================
// Loading Screen
// ============================================

window.addEventListener('load', () => {
  setTimeout(() => {
    loadingScreen.style.display = 'none';
  }, 1500);
});

// ============================================
// Initialize
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  loadCartFromLocalStorage();
});
