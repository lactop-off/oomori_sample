/* ============================================
   大森150メニュー図鑑 - メインJavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all modules
  initHeader();
  initHeroSlider();
  initMobileNav();
  initMenuFilter();
  initScrollAnimations();
  initSmoothScroll();
});

/* ============================================
   Header Scroll Effect
   ============================================ */
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  let lastScroll = 0;

  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });
}

/* ============================================
   Hero Slider
   ============================================ */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length === 0) return;

  const slideData = [
    { shop: 'カフェ バルド', menu: 'スペシャルトッピングピザ', category: '体験' },
    { shop: '大森ベーカリー', menu: '150年海苔ブレッド', category: '販売' },
    { shop: '大森ブルワリー', menu: '150年記念ビール', category: '販売' },
    { shop: '山王銀行', menu: '150年記念タオル', category: 'プレゼント' }
  ];

  let currentSlide = 0;
  const totalSlides = slides.length;

  // Shuffle slides for random display
  const shuffledIndices = shuffleArray([...Array(totalSlides).keys()]);
  currentSlide = shuffledIndices[0];

  // Set initial active slide
  slides.forEach((slide, index) => {
    slide.classList.remove('active');
  });
  slides[currentSlide].classList.add('active');
  updateHeroInfo(slideData[currentSlide]);

  // Auto-advance slides
  let slideIndex = 0;
  setInterval(function() {
    slides[shuffledIndices[slideIndex]].classList.remove('active');
    slideIndex = (slideIndex + 1) % totalSlides;
    slides[shuffledIndices[slideIndex]].classList.add('active');
    updateHeroInfo(slideData[shuffledIndices[slideIndex]]);
  }, 5000);
}

function updateHeroInfo(data) {
  const shopName = document.querySelector('.hero-shop-name');
  const menuName = document.querySelector('.hero-menu-name');

  if (shopName && menuName && data) {
    shopName.textContent = data.shop;
    menuName.textContent = data.menu;
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/* ============================================
   Mobile Navigation
   ============================================ */
function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav');
  const overlay = document.querySelector('.nav-overlay');
  const body = document.body;

  if (!hamburger || !nav) return;

  hamburger.addEventListener('click', function() {
    toggleNav();
  });

  if (overlay) {
    overlay.addEventListener('click', function() {
      closeNav();
    });
  }

  // Close nav when clicking nav links
  const navLinks = nav.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      closeNav();
    });
  });

  function toggleNav() {
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
    body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
  }

  function closeNav() {
    hamburger.classList.remove('active');
    nav.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    body.style.overflow = '';
  }
}

/* ============================================
   Menu Filter
   ============================================ */
function initMenuFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuCards = document.querySelectorAll('.menu-card');

  if (filterBtns.length === 0 || menuCards.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const category = this.dataset.category;

      // Filter cards
      menuCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // Randomize menu card order on page load
  randomizeMenuCards();
}

function randomizeMenuCards() {
  const menuGrid = document.querySelector('.menu-grid');
  if (!menuGrid) return;

  const cards = Array.from(menuGrid.children);
  const shuffled = shuffleArray(cards);

  shuffled.forEach(card => {
    menuGrid.appendChild(card);
  });
}

/* ============================================
   Scroll Animations
   ============================================ */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .menu-card');

  if (animatedElements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(el => {
    observer.observe(el);
  });
}

/* ============================================
   Smooth Scroll
   ============================================ */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ============================================
   Utility Functions
   ============================================ */

// Format date to Japanese style
function formatDateJP(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}/${month}/${day}`;
}

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
