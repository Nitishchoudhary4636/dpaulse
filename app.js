/**
 * DPauls Holidays - Complete Multi-Page Client Application
 * Handles Home, PLP (packages.html), PDP (package-detail.html), Flights (flights.html), Hotels & Booking Checkout (booking.html)
 */

document.addEventListener('DOMContentLoaded', () => {
  initTopnavScroll();
  initHeroBannerSlider();
  initSearchTabs();
  initAutosuggest();
  initPassengerSelector();
  initForexCalculator();
  initDealsCarousel();
  initModals();
  initScrollTop();

  // Page Specific Inits
  if (document.getElementById('plp-packages-grid')) {
    initPlpFilters();
  }

  if (document.getElementById('pdp-title-display')) {
    initPdpDynamicLoader();
    initPdpCalculator();
  }

  if (document.getElementById('flight-search-title')) {
    initFlightsPage();
  }
});

/* ==========================================================================
   1. Top Navigation Scroll Effect
   ========================================================================== */
function initTopnavScroll() {
  const topnav = document.getElementById('main-topnav');
  const scrollTopBtn = document.getElementById('scroll-to-top-btn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      if (topnav && !topnav.classList.contains('topHeader-list')) topnav.classList.add('scrolled');
      if (scrollTopBtn) scrollTopBtn.classList.add('visible');
    } else {
      if (topnav && !topnav.classList.contains('topHeader-list')) topnav.classList.remove('scrolled');
      if (scrollTopBtn) scrollTopBtn.classList.remove('visible');
    }
  });
}

/* ==========================================================================
   2. Search Engine Tabs Switching & Page Navigation
   ========================================================================== */
function initSearchTabs() {
  const tabItems = document.querySelectorAll('.search-tab-item');

  tabItems.forEach(tab => {
    tab.addEventListener('click', (e) => {
      const tabName = tab.getAttribute('data-tab');

      // If user clicks direct dedicated service tabs on home
      if (tabName === 'forex') {
        window.location.href = 'forex.html';
        return;
      }
      if (tabName === 'esim') {
        window.location.href = 'esim.html';
        return;
      }
      if (tabName === 'deals') {
        window.location.href = 'deals.html';
        return;
      }
      if (tabName === 'hotels') {
        window.location.href = 'hotels.html';
        return;
      }
      if (tabName === 'bus') {
        window.location.href = 'bus.html';
        return;
      }
      if (tabName === 'cruise') {
        window.location.href = 'cruise.html';
        return;
      }

      window.switchTab(tabName);
    });
  });
}

window.switchTab = function(tabName) {
  const tabItems = document.querySelectorAll('.search-tab-item');
  const tabBodies = document.querySelectorAll('.search-tab-body');

  tabItems.forEach(item => {
    if (item.getAttribute('data-tab') === tabName) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  tabBodies.forEach(body => {
    if (body.id === `tab-body-${tabName}`) {
      body.classList.add('active');
    } else {
      body.classList.remove('active');
    }
  });
};

/* Universal Search Redirect Handlers */
window.handleFlightSearch = function() {
  const origin = document.getElementById('flight-origin') ? document.getElementById('flight-origin').value : 'DEL';
  const dest = document.getElementById('flight-dest') ? document.getElementById('flight-dest').value : 'BOM';
  const depart = document.getElementById('flight-depart-date') ? document.getElementById('flight-depart-date').value : '2026-08-30';
  const cabinClass = document.querySelector('input[name="cabin_class"]:checked') ? document.querySelector('input[name="cabin_class"]:checked').value : 'Economy';
  const paxSummary = document.getElementById('pax-summary-display') ? document.getElementById('pax-summary-display').textContent : '1 Traveller';

  const query = new URLSearchParams({
    from: origin,
    to: dest,
    depart: depart,
    cabin: cabinClass,
    pax: paxSummary
  });

  window.location.href = `flights.html?${query.toString()}`;
};

window.handlePackageSearch = function() {
  const destInput = document.getElementById('package-dest');
  const originInput = document.getElementById('package-origin');
  const monthInput = document.getElementById('package-month');

  const dest = destInput ? destInput.value.trim() : 'Himachal';
  const origin = originInput ? originInput.value.trim() : 'New Delhi';
  const month = monthInput ? monthInput.value : '';

  const query = new URLSearchParams({
    dest: dest || 'Himachal',
    origin: origin,
    month: month
  });

  window.location.href = `packages.html?${query.toString()}`;
};

window.handleHotelSearch = function() {
  window.location.href = 'hotels.html';
};

window.handleBusSearch = function() {
  window.location.href = 'bus.html';
};

window.handleCruiseSearch = function() {
  window.location.href = 'cruise.html';
};

/* ==========================================================================
   3. Origin / Destination Autosuggest & Swap
   ========================================================================== */
function initAutosuggest() {
  const originInput = document.getElementById('flight-origin');
  const originList = document.getElementById('origin-autosuggest');
  const destInput = document.getElementById('flight-dest');
  const destList = document.getElementById('dest-autosuggest');
  const swapBtn = document.getElementById('swap-airports-btn');

  if (originInput && originList) {
    originInput.addEventListener('focus', () => originList.classList.add('active'));
    originInput.addEventListener('click', (e) => e.stopPropagation());
    originList.querySelectorAll('.autosuggest-item').forEach(item => {
      item.addEventListener('click', () => {
        originInput.value = item.getAttribute('data-val');
        originList.classList.remove('active');
      });
    });
  }

  if (destInput && destList) {
    destInput.addEventListener('focus', () => destList.classList.add('active'));
    destInput.addEventListener('click', (e) => e.stopPropagation());
    destList.querySelectorAll('.autosuggest-item').forEach(item => {
      item.addEventListener('click', () => {
        destInput.value = item.getAttribute('data-val');
        destList.classList.remove('active');
      });
    });
  }

  if (swapBtn && originInput && destInput) {
    swapBtn.addEventListener('click', () => {
      const temp = originInput.value;
      originInput.value = destInput.value;
      destInput.value = temp;
    });
  }

  document.addEventListener('click', () => {
    if (originList) originList.classList.remove('active');
    if (destList) destList.classList.remove('active');
  });
}

/* ==========================================================================
   4. Passenger & Cabin Class Selector
   ========================================================================== */
function initPassengerSelector() {
  const trigger = document.getElementById('pax-selector-trigger');
  const panel = document.getElementById('pax-dropdown-panel');
  const container = document.getElementById('pax-dropdown-container');
  const doneBtn = document.getElementById('pax-done-btn');
  const summaryDisplay = document.getElementById('pax-summary-display');

  let adults = 1;
  let children = 0;
  let infants = 0;
  let cabinClass = 'Economy';

  const adultCount = document.getElementById('adult-count');
  const childCount = document.getElementById('child-count');
  const infantCount = document.getElementById('infant-count');

  const adultMinus = document.getElementById('adult-minus');
  const adultPlus = document.getElementById('adult-plus');
  const childMinus = document.getElementById('child-minus');
  const childPlus = document.getElementById('child-plus');
  const infantMinus = document.getElementById('infant-minus');
  const infantPlus = document.getElementById('infant-plus');

  function updateDisplay() {
    if (adultCount) adultCount.textContent = adults;
    if (childCount) childCount.textContent = children;
    if (infantCount) infantCount.textContent = infants;

    if (adultMinus) adultMinus.disabled = (adults <= 1);
    if (childMinus) childMinus.disabled = (children <= 0);
    if (infantMinus) infantMinus.disabled = (infants <= 0);

    const totalPax = adults + children + infants;
    const paxText = totalPax === 1 ? '1 Traveller' : `${totalPax} Travellers`;
    if (summaryDisplay) {
      summaryDisplay.textContent = `${paxText} | ${cabinClass}`;
    }
  }

  if (adultPlus) adultPlus.addEventListener('click', () => { if (adults < 9) { adults++; updateDisplay(); } });
  if (adultMinus) adultMinus.addEventListener('click', () => { if (adults > 1) { adults--; updateDisplay(); } });

  if (childPlus) childPlus.addEventListener('click', () => { if (children < 6) { children++; updateDisplay(); } });
  if (childMinus) childMinus.addEventListener('click', () => { if (children > 0) { children--; updateDisplay(); } });

  if (infantPlus) infantPlus.addEventListener('click', () => { if (infants < adults) { infants++; updateDisplay(); } });
  if (infantMinus) infantMinus.addEventListener('click', () => { if (infants > 0) { infants--; updateDisplay(); } });

  document.querySelectorAll('input[name="cabin_class"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      cabinClass = e.target.value;
      updateDisplay();
    });
  });

  if (trigger && panel) {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      panel.classList.toggle('active');
    });

    panel.addEventListener('click', (e) => e.stopPropagation());

    if (doneBtn) {
      doneBtn.addEventListener('click', () => {
        panel.classList.remove('active');
      });
    }

    document.addEventListener('click', (e) => {
      if (container && !container.contains(e.target)) {
        panel.classList.remove('active');
      }
    });
  }
}

/* ==========================================================================
   5. Forex Calculator
   ========================================================================== */
function initForexCalculator() {
  const currencySelect = document.getElementById('forex-currency');
  const amountInput = document.getElementById('forex-amount');
  const inrOutput = document.getElementById('forex-inr-output');

  const rates = {
    USD: 84.20,
    EUR: 91.50,
    GBP: 108.20,
    AED: 22.95,
    THB: 2.45,
    SGD: 63.80,
    JPY: 0.56
  };

  function calculate() {
    if (!currencySelect || !amountInput || !inrOutput) return;
    const cur = currencySelect.value;
    const amt = parseFloat(amountInput.value) || 0;
    const rate = rates[cur] || 84.20;
    const totalINR = (amt * rate).toLocaleString('en-IN', { maximumFractionDigits: 2 });
    inrOutput.textContent = `₹ ${totalINR} /-`;
  }

  if (currencySelect) currencySelect.addEventListener('change', calculate);
  if (amountInput) amountInput.addEventListener('input', calculate);
}

/* ==========================================================================
   5b. Hero Banner Slider (Home Top Dynamic Slider)
   ========================================================================== */
function initHeroBannerSlider() {
  const bgTrack = document.getElementById('hero-bg-slider-track');
  const textTrack = document.getElementById('hero-slider-text-track');
  const prevBtn = document.getElementById('hero-slider-prev-btn');
  const nextBtn = document.getElementById('hero-slider-next-btn');
  const dotsContainer = document.getElementById('hero-slider-dots-container');

  if (!bgTrack || !textTrack) return;

  const bgSlides = bgTrack.querySelectorAll('.hero-bg-slide');
  const textSlides = textTrack.querySelectorAll('.hero-text-slide');
  const dots = dotsContainer ? dotsContainer.querySelectorAll('.hero-dot') : [];
  const totalSlides = bgSlides.length;

  if (totalSlides === 0) return;

  let currentSlide = 0;
  let autoplayTimer = null;
  const slideInterval = 5000; // 5 seconds

  function goToSlide(index) {
    if (index < 0) {
      currentSlide = totalSlides - 1;
    } else if (index >= totalSlides) {
      currentSlide = 0;
    } else {
      currentSlide = index;
    }

    // Update background slides
    bgSlides.forEach((slide, i) => {
      if (i === currentSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Update text captions
    textSlides.forEach((slide, i) => {
      if (i === currentSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Update dots
    dots.forEach((dot, i) => {
      if (i === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, slideInterval);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoplay();
    });
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goToSlide(i);
      startAutoplay();
    });
  });

  // Pause on hover
  const heroSection = document.getElementById('hero-section');
  if (heroSection) {
    heroSection.addEventListener('mouseenter', stopAutoplay);
    heroSection.addEventListener('mouseleave', startAutoplay);
  }

  // Keyboard navigation when search is not active
  document.addEventListener('keydown', (e) => {
    if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'SELECT' || document.activeElement.tagName === 'TEXTAREA')) {
      return;
    }
    if (e.key === 'ArrowLeft' && window.scrollY < 400) {
      prevSlide();
      startAutoplay();
    } else if (e.key === 'ArrowRight' && window.scrollY < 400) {
      nextSlide();
      startAutoplay();
    }
  });

  // Start auto-rotation
  startAutoplay();
}

/* ==========================================================================
   6. Deals Carousel Slider
   ========================================================================== */
function initDealsCarousel() {
  const track = document.getElementById('deals-carousel-track');
  const prevBtn = document.getElementById('deal-prev-btn');
  const nextBtn = document.getElementById('deal-next-btn');

  if (!track || !prevBtn || !nextBtn) return;

  let currentIndex = 0;
  const cards = track.children;
  const cardWidth = 380;

  function updateSlider() {
    const maxIndex = Math.max(0, cards.length - 3);
    if (currentIndex < 0) currentIndex = 0;
    if (currentIndex > maxIndex) currentIndex = maxIndex;

    const offset = currentIndex * cardWidth;
    track.style.transform = `translateX(-${offset}px)`;
  }

  nextBtn.addEventListener('click', () => {
    currentIndex += 1;
    if (currentIndex > cards.length - 3) currentIndex = 0;
    updateSlider();
  });

  prevBtn.addEventListener('click', () => {
    currentIndex -= 1;
    if (currentIndex < 0) currentIndex = cards.length - 3;
    updateSlider();
  });
}

/* ==========================================================================
   7. Modals
   ========================================================================== */
function initModals() {
  // Drawer
  const openDrawerBtn = document.getElementById('open-drawer-btn');
  const closeDrawerBtn = document.getElementById('close-drawer-btn');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const sideDrawer = document.getElementById('side-drawer');

  function openDrawer() {
    if (drawerBackdrop && sideDrawer) {
      drawerBackdrop.classList.add('active');
      sideDrawer.classList.add('active');
    }
  }
  function closeDrawer() {
    if (drawerBackdrop && sideDrawer) {
      drawerBackdrop.classList.remove('active');
      sideDrawer.classList.remove('active');
    }
  }

  if (openDrawerBtn) openDrawerBtn.addEventListener('click', openDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', (e) => {
      if (e.target === drawerBackdrop) closeDrawer();
    });
  }

  // ==========================================================================
  // AUTHENTICATION & SESSION ENGINE (localStorage & sessionStorage)
  // ==========================================================================
  const AUTH_STORAGE = {
    USERS_KEY: 'dpauls_registered_users',
    SESSION_KEY: 'dpauls_logged_user'
  };

  // 1. Toast Notification Helper
  window.showToast = function(message, type = 'success') {
    let container = document.getElementById('dpauls-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'dpauls-toast-container';
      container.className = 'dpauls-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `dpauls-toast ${type}`;
    const icon = type === 'success' ? 'fa-circle-check' : (type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-info');
    toast.innerHTML = `
      <i class="fa-solid ${icon}"></i>
      <div style="flex: 1; font-weight: 600;">${message}</div>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(120%)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  };

  // 2. Initialize Seed Users in localStorage
  function initUsersDatabase() {
    if (!localStorage.getItem(AUTH_STORAGE.USERS_KEY)) {
      const defaultUsers = [
        {
          name: 'Shubham Sharma',
          email: 'user@dpauls.com',
          mobile: '9876543210',
          password: 'password123',
          createdAt: new Date().toISOString()
        },
        {
          name: 'Pooja Verma',
          email: 'pooja@example.com',
          mobile: '9812345678',
          password: 'password123',
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem(AUTH_STORAGE.USERS_KEY, JSON.stringify(defaultUsers));
    }
  }
  initUsersDatabase();

  // 3. Get Active Logged-in User (Checks sessionStorage first, fallback to localStorage)
  window.getActiveUser = function() {
    try {
      const sessionUser = sessionStorage.getItem(AUTH_STORAGE.SESSION_KEY);
      if (sessionUser) return JSON.parse(sessionUser);

      const localUser = localStorage.getItem(AUTH_STORAGE.SESSION_KEY);
      if (localUser) {
        // Restore into sessionStorage
        sessionStorage.setItem(AUTH_STORAGE.SESSION_KEY, localUser);
        return JSON.parse(localUser);
      }
    } catch(e) {}
    return null;
  };

  // 4. Update UI across all pages when logged in/out
  window.updateGlobalAuthUI = function() {
    const user = window.getActiveUser();

    // Index / Header Account dropdown
    const accountDropdownWrapper = document.getElementById('account-dropdown-wrapper');
    if (accountDropdownWrapper) {
      const headerUser = accountDropdownWrapper.querySelector('.user-account-header');
      const btnGroup = accountDropdownWrapper.querySelector('.dropdown-btn-group');
      if (user) {
        if (headerUser) {
          headerUser.innerHTML = `
            <div class="user-avatar-circle" style="background: #10b981; color: white;">
              <i class="fa-solid fa-user-check"></i>
            </div>
            <div>
              <div class="font-bold fnt-14 clr-3c" id="user-display-name">${user.name}</div>
              <div class="user-logged-badge"><i class="fa-solid fa-circle fnt-8" style="color: #10b981;"></i> Active Member</div>
              <div class="fnt-11 clr-8f">${user.email}</div>
            </div>
          `;
        }
        if (btnGroup) {
          btnGroup.innerHTML = `
            <button type="button" class="btn-logout-custom" onclick="window.handleLogout()">
              <i class="fa-solid fa-arrow-right-from-bracket mr-1"></i> LOG OUT
            </button>
          `;
        }
      } else {
        if (headerUser) {
          headerUser.innerHTML = `
            <div class="user-avatar-circle">
              <i class="fa-solid fa-user"></i>
            </div>
            <div>
              <div class="font-bold fnt-14 clr-3c">Hello Guest!</div>
              <a href="javascript:void(0)" class="fnt-12 clr-primary modal-trigger-login" onclick="window.openAuth('login')">Login / Sign Up</a>
            </div>
          `;
        }
        if (btnGroup) {
          btnGroup.innerHTML = `
            <button class="btn-dropdown-login modal-trigger-login" onclick="window.openAuth('login')">LOG IN</button>
            <button class="btn-dropdown-signup modal-trigger-signup" onclick="window.openAuth('signup')">SIGN UP</button>
          `;
        }
      }
    }

    // Side Drawer user card
    const drawerHeader = document.querySelector('.drawer-header');
    if (drawerHeader) {
      if (user) {
        drawerHeader.innerHTML = `
          <div class="user-avatar-circle" style="background: #10b981; color: white;"><i class="fa-solid fa-user-check"></i></div>
          <div>
            <div class="font-bold fnt-16">${user.name}</div>
            <div class="fnt-12" style="color: #10b981; font-weight: 700;">Logged In</div>
            <a href="javascript:void(0)" class="fnt-12 clr-primary" onclick="window.handleLogout()">Log Out</a>
          </div>
          <button class="modal-close-btn" style="top: 14px; right: 14px;" id="close-drawer-btn" onclick="document.getElementById('drawer-backdrop').classList.remove('active'); document.getElementById('side-drawer').classList.remove('active');"><i class="fa-solid fa-xmark"></i></button>
        `;
      } else {
        drawerHeader.innerHTML = `
          <div class="user-avatar-circle"><i class="fa-solid fa-user"></i></div>
          <div>
            <div class="font-bold fnt-16">Hello Guest!</div>
            <a href="javascript:void(0)" class="fnt-13 clr-teal modal-trigger-login" style="color: var(--teal);" onclick="window.openAuth('login')">Login / Sign Up</a>
          </div>
          <button class="modal-close-btn" style="top: 14px; right: 14px;" id="close-drawer-btn" onclick="document.getElementById('drawer-backdrop').classList.remove('active'); document.getElementById('side-drawer').classList.remove('active');"><i class="fa-solid fa-xmark"></i></button>
        `;
      }
    }

    // Booking Page Auto Pre-fill
    if (user && window.location.pathname.includes('booking.html')) {
      const nameParts = user.name.split(' ');
      const fnameInput = document.getElementById('traveller-first-name');
      const lnameInput = document.getElementById('traveller-last-name');
      const emailInput = document.getElementById('contact-email');
      const mobileInput = document.getElementById('contact-mobile');

      if (fnameInput && !fnameInput.value) fnameInput.value = nameParts[0] || '';
      if (lnameInput && !lnameInput.value) lnameInput.value = nameParts.slice(1).join(' ') || '';
      if (emailInput && !emailInput.value) emailInput.value = user.email || '';
      if (mobileInput && !mobileInput.value) mobileInput.value = user.mobile || '';
    }
  };

  // 5. Auth Modal Dialog Controller & Dynamic Injection
  function ensureAuthModal() {
    let modal = document.getElementById('auth-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'modal-backdrop-custom';
      modal.id = 'auth-modal';
      modal.innerHTML = `
        <div class="modal-card-dialog">
          <button type="button" class="modal-close-btn" id="close-auth-modal-btn" onclick="window.closeAuth()" aria-label="Close modal">
            <i class="fa-solid fa-xmark"></i>
          </button>

          <div class="text-center pt-4 pb-2">
            <img src="assets/images/logo.0066e88.png" alt="DPauls Logo" style="height: 38px; margin: 0 auto;">
          </div>

          <div class="auth-tabs-bar">
            <div class="auth-tab active" id="auth-tab-login" onclick="window.openAuth('login')">Log In</div>
            <div class="auth-tab" id="auth-tab-signup" onclick="window.openAuth('signup')">Sign Up</div>
          </div>

          <!-- Login Form Body -->
          <div class="auth-form-body" id="auth-body-login">
            <!-- OTP Login Section -->
            <div class="form-group-field">
              <label for="login-mobile">Login using Mobile No. (Instant OTP)</label>
              <div class="pos-r">
                <input type="tel" id="login-mobile" class="form-input-styled" placeholder="e.g. 9876543210" maxlength="10">
              </div>
              <button type="button" class="btn btn-primary w-100 mt-2" id="send-otp-btn" onclick="window.handleSendOtp()">
                <i class="fa-solid fa-paper-plane mr-1"></i> Send Verification OTP
              </button>
            </div>

            <!-- OTP Input Box -->
            <div class="auth-otp-step" id="auth-otp-step-box">
              <label for="login-otp-code" class="font-bold fnt-13 clr-3c">Enter 6-Digit OTP Code</label>
              <input type="text" id="login-otp-code" class="form-input-styled mt-1 mb-2 text-center font-bold" placeholder="• • • • • •" maxlength="6" style="letter-spacing: 4px; font-size: 1.2rem;">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="fnt-12 clr-8f" id="otp-timer-text">Code valid for 5:00 min</span>
                <button type="button" class="btn-clear-filters fnt-12 font-bold" onclick="window.handleSendOtp()">Resend OTP</button>
              </div>
              <button type="button" class="btn btn-search w-100" id="verify-otp-btn" onclick="window.handleVerifyOtp()">
                Verify OTP &amp; Log In
              </button>
            </div>

            <div style="display: flex; align-items: center; margin: 1.25rem 0;">
              <div style="flex: 1; height: 1px; background: var(--border-color);"></div>
              <span class="fnt-12 clr-8f px-3 font-bold">OR LOGIN USING EMAIL</span>
              <div style="flex: 1; height: 1px; background: var(--border-color);"></div>
            </div>

            <!-- Email Password Login -->
            <form onsubmit="event.preventDefault(); window.handleEmailLogin();">
              <div class="form-group-field">
                <label for="login-email">Email ID / Username</label>
                <input type="email" id="login-email" class="form-input-styled" placeholder="user@dpauls.com" value="user@dpauls.com" required>
              </div>
              <div class="form-group-field">
                <label for="login-password">Password</label>
                <input type="password" id="login-password" class="form-input-styled" placeholder="Enter your password" value="password123" required>
              </div>
              <div class="d-flex justify-content-between align-items-center mb-3">
                <label class="d-flex align-items-center gap-1 fnt-12 clr-66 cursor-pointer">
                  <input type="checkbox" id="login-remember-me" checked> Remember me (Stay logged in)
                </label>
                <a href="javascript:void(0)" class="fnt-12 clr-primary" onclick="alert('Password reset link sent to demo registered email.')">Forgot Password?</a>
              </div>
              <button type="submit" class="btn btn-search w-100" id="email-login-submit-btn">
                Log In to DPauls
              </button>
              <div class="fnt-11 clr-8f text-center mt-2">Demo account pre-filled: user@dpauls.com / password123</div>
            </form>
          </div>

          <!-- Signup Form Body -->
          <div class="auth-form-body" id="auth-body-signup" style="display: none;">
            <form onsubmit="event.preventDefault(); window.handleSignup();">
              <div class="form-group-field">
                <label for="signup-name">Full Name *</label>
                <input type="text" id="signup-name" class="form-input-styled" placeholder="e.g. Rahul Sharma" required>
              </div>
              <div class="form-group-field">
                <label for="signup-email">Email Address *</label>
                <input type="email" id="signup-email" class="form-input-styled" placeholder="rahul@example.com" required>
              </div>
              <div class="form-group-field">
                <label for="signup-mobile">Mobile Number (10 Digits) *</label>
                <input type="tel" id="signup-mobile" class="form-input-styled" placeholder="9876543210" maxlength="10" required>
              </div>
              <div class="form-group-field">
                <label for="signup-password">Create Password (min 6 characters) *</label>
                <input type="password" id="signup-password" class="form-input-styled" placeholder="Enter strong password" required minlength="6">
              </div>
              <div class="form-group-field">
                <label for="signup-confirm-password">Confirm Password *</label>
                <input type="password" id="signup-confirm-password" class="form-input-styled" placeholder="Confirm your password" required minlength="6">
              </div>
              <button type="submit" class="btn btn-primary w-100 mt-2" id="signup-submit-btn">
                Create DPauls Account
              </button>
              <div class="fnt-11 clr-8f text-center mt-2">By signing up, you agree to DPauls Terms &amp; Privacy Policy</div>
            </form>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const closeBtn = modal.querySelector('#close-auth-modal-btn') || document.getElementById('close-auth-modal-btn');
    if (closeBtn) {
      closeBtn.onclick = function(e) {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        window.closeAuth();
      };
    }
    modal.onclick = function(e) {
      if (e.target === modal) {
        window.closeAuth();
      }
    };
    return modal;
  }

  window.openAuth = function(mode = 'login') {
    closeDrawer();
    const modal = ensureAuthModal();
    if (modal) {
      modal.classList.add('active');
      const authTabLogin = document.getElementById('auth-tab-login');
      const authTabSignup = document.getElementById('auth-tab-signup');
      const authBodyLogin = document.getElementById('auth-body-login');
      const authBodySignup = document.getElementById('auth-body-signup');

      if (mode === 'signup') {
        if (authTabSignup) authTabSignup.classList.add('active');
        if (authTabLogin) authTabLogin.classList.remove('active');
        if (authBodySignup) authBodySignup.style.display = 'block';
        if (authBodyLogin) authBodyLogin.style.display = 'none';
      } else {
        if (authTabLogin) authTabLogin.classList.add('active');
        if (authTabSignup) authTabSignup.classList.remove('active');
        if (authBodyLogin) authBodyLogin.style.display = 'block';
        if (authBodySignup) authBodySignup.style.display = 'none';
      }
    }
  };

  window.closeAuth = function() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.remove('active');
  };

  document.querySelectorAll('.modal-trigger-login').forEach(b => b.addEventListener('click', () => window.openAuth('login')));
  document.querySelectorAll('.modal-trigger-signup').forEach(b => b.addEventListener('click', () => window.openAuth('signup')));

  // 6. Handle Email + Password Login
  window.handleEmailLogin = function() {
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const rememberMe = document.getElementById('login-remember-me') ? document.getElementById('login-remember-me').checked : true;

    if (!emailInput || !passwordInput) return;

    const emailVal = emailInput.value.trim().toLowerCase();
    const passVal = passwordInput.value.trim();

    if (!emailVal || !passVal) {
      window.showToast('Please enter both email and password.', 'error');
      return;
    }

    const users = JSON.parse(localStorage.getItem(AUTH_STORAGE.USERS_KEY) || '[]');
    const matched = users.find(u => u.email.toLowerCase() === emailVal || u.mobile === emailVal);

    if (matched) {
      if (matched.password === passVal) {
        // Save session in sessionStorage and localStorage
        const sessionData = {
          name: matched.name,
          email: matched.email,
          mobile: matched.mobile,
          token: 'dp_tok_' + Math.random().toString(36).substr(2, 9),
          loggedInAt: new Date().toISOString()
        };
        sessionStorage.setItem(AUTH_STORAGE.SESSION_KEY, JSON.stringify(sessionData));
        if (rememberMe) {
          localStorage.setItem(AUTH_STORAGE.SESSION_KEY, JSON.stringify(sessionData));
        }

        window.showToast(`Welcome back, ${matched.name}! Logged in successfully.`, 'success');
        if (typeof window.mcpTrackLogin === 'function') window.mcpTrackLogin(matched);
        window.closeAuth();
        window.updateGlobalAuthUI();
      } else {
        window.showToast('Incorrect password. Please try again.', 'error');
      }
    } else {
      window.showToast('Account not found with this email. You can create a new account via Sign Up.', 'error');
    }
  };

  // 7. Handle OTP Generation
  let currentGeneratedOtp = null;
  window.handleSendOtp = function() {
    const mobileInput = document.getElementById('login-mobile');
    const sendOtpBtn = document.getElementById('send-otp-btn');
    const otpBox = document.getElementById('auth-otp-step-box');

    if (!mobileInput) return;
    const mobile = mobileInput.value.trim();

    if (mobile.length !== 10 || !/^\d{10}$/.test(mobile)) {
      window.showToast('Please enter a valid 10-digit mobile number.', 'error');
      return;
    }

    if (sendOtpBtn) {
      sendOtpBtn.disabled = true;
      sendOtpBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Sending OTP...';
    }

    setTimeout(() => {
      currentGeneratedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      if (otpBox) otpBox.style.display = 'block';
      if (sendOtpBtn) {
        sendOtpBtn.innerHTML = '<i class="fa-solid fa-check mr-1"></i> OTP Sent to +91 ' + mobile;
        sendOtpBtn.disabled = true;
      }
      const otpCodeInput = document.getElementById('login-otp-code');
      if (otpCodeInput) {
        otpCodeInput.value = currentGeneratedOtp; // Pre-fill for instant seamless test
        otpCodeInput.focus();
      }
      window.showToast(`OTP Code generated: ${currentGeneratedOtp}`, 'info');
      alert(`DPauls Verification Code\n\nYour 6-digit OTP is: ${currentGeneratedOtp}\n(Sent to +91 ${mobile})`);
    }, 600);
  };

  // 8. Handle OTP Verification & Login
  window.handleVerifyOtp = function() {
    const otpCodeInput = document.getElementById('login-otp-code');
    const mobileInput = document.getElementById('login-mobile');
    const rememberMe = document.getElementById('login-remember-me') ? document.getElementById('login-remember-me').checked : true;

    if (!otpCodeInput || !mobileInput) return;
    const enteredOtp = otpCodeInput.value.trim();
    const mobile = mobileInput.value.trim();

    if (enteredOtp !== currentGeneratedOtp) {
      window.showToast('Invalid OTP entered. Please check and try again.', 'error');
      return;
    }

    const users = JSON.parse(localStorage.getItem(AUTH_STORAGE.USERS_KEY) || '[]');
    let user = users.find(u => u.mobile === mobile);

    if (!user) {
      // Auto register user by mobile
      user = {
        name: 'DPauls Traveller',
        email: `user${mobile.substr(6)}@dpauls.com`,
        mobile: mobile,
        password: 'password123',
        createdAt: new Date().toISOString()
      };
      users.push(user);
      localStorage.setItem(AUTH_STORAGE.USERS_KEY, JSON.stringify(users));
    }

    const sessionData = {
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      token: 'dp_tok_' + Math.random().toString(36).substr(2, 9),
      loggedInAt: new Date().toISOString()
    };
    sessionStorage.setItem(AUTH_STORAGE.SESSION_KEY, JSON.stringify(sessionData));
    if (rememberMe) {
      localStorage.setItem(AUTH_STORAGE.SESSION_KEY, JSON.stringify(sessionData));
    }

    window.showToast(`Verified! Welcome to DPauls, ${user.name}!`, 'success');
    if (typeof window.mcpTrackLogin === 'function') window.mcpTrackLogin(user);
    window.closeAuth();
    window.updateGlobalAuthUI();
  };

  // 9. Handle New User Registration (Sign Up)
  window.handleSignup = function() {
    const nameInput = document.getElementById('signup-name');
    const emailInput = document.getElementById('signup-email');
    const mobileInput = document.getElementById('signup-mobile');
    const passInput = document.getElementById('signup-password');
    const confirmPassInput = document.getElementById('signup-confirm-password');

    if (!nameInput || !emailInput || !mobileInput || !passInput) return;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const mobile = mobileInput.value.trim();
    const password = passInput.value;
    const confirmPassword = confirmPassInput ? confirmPassInput.value : password;

    if (name.length < 2) {
      window.showToast('Please enter your full name.', 'error');
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      window.showToast('Please enter a valid email address.', 'error');
      return;
    }
    if (mobile.length !== 10 || !/^\d{10}$/.test(mobile)) {
      window.showToast('Please enter a valid 10-digit mobile number.', 'error');
      return;
    }
    if (password.length < 6) {
      window.showToast('Password must be at least 6 characters long.', 'error');
      return;
    }
    if (password !== confirmPassword) {
      window.showToast('Passwords do not match.', 'error');
      return;
    }

    const users = JSON.parse(localStorage.getItem(AUTH_STORAGE.USERS_KEY) || '[]');
    const existing = users.find(u => u.email.toLowerCase() === email || u.mobile === mobile);

    if (existing) {
      window.showToast('An account with this email or mobile already exists. Please Log In.', 'error');
      window.openAuth('login');
      return;
    }

    const newUser = {
      name,
      email,
      mobile,
      password,
      createdAt: new Date().toISOString()
    };

    // Save in localStorage accounts list
    users.push(newUser);
    localStorage.setItem(AUTH_STORAGE.USERS_KEY, JSON.stringify(users));

    // Save active session in sessionStorage & localStorage
    const sessionData = {
      name: newUser.name,
      email: newUser.email,
      mobile: newUser.mobile,
      token: 'dp_tok_' + Math.random().toString(36).substr(2, 9),
      loggedInAt: new Date().toISOString()
    };
    sessionStorage.setItem(AUTH_STORAGE.SESSION_KEY, JSON.stringify(sessionData));
    localStorage.setItem(AUTH_STORAGE.SESSION_KEY, JSON.stringify(sessionData));

    window.showToast(`Account created successfully! Welcome to DPauls, ${name}!`, 'success');
    if (typeof window.mcpTrackLogin === 'function') window.mcpTrackLogin(newUser);
    window.closeAuth();
    window.updateGlobalAuthUI();
  };

  // 10. Handle Logout
  window.handleLogout = function() {
    sessionStorage.removeItem(AUTH_STORAGE.SESSION_KEY);
    localStorage.removeItem(AUTH_STORAGE.SESSION_KEY);
    window.showToast('You have been logged out successfully.', 'info');
    if (typeof window.mcpTrackLogout === 'function') window.mcpTrackLogout();
    window.updateGlobalAuthUI();
  };

  // Trigger UI update immediately
  window.updateGlobalAuthUI();

  // Gift Card Modal
  const gcModal = document.getElementById('giftcard-modal');
  const gcCloseBtn = document.getElementById('close-giftcard-modal-btn');
  const gcTriggers = document.querySelectorAll('.modal-trigger-giftcard');
  const checkGcBtn = document.getElementById('check-gc-btn');
  const gcResultBox = document.getElementById('gc-result-box');

  gcTriggers.forEach(t => t.addEventListener('click', () => {
    closeDrawer();
    if (gcModal) gcModal.classList.add('active');
  }));
  if (gcCloseBtn && gcModal) gcCloseBtn.addEventListener('click', () => gcModal.classList.remove('active'));

  if (checkGcBtn) {
    checkGcBtn.addEventListener('click', () => {
      const cardNum = document.getElementById('gc-number').value.trim();
      const cardPin = document.getElementById('gc-pin').value.trim();
      if (cardNum.length < 16 || cardPin.length < 6) {
        alert('Please enter a valid 16-digit card number and 6-digit PIN.');
        return;
      }
      checkGcBtn.textContent = 'Verifying...';
      setTimeout(() => {
        checkGcBtn.textContent = 'Check Balance';
        if (gcResultBox) gcResultBox.style.display = 'block';
      }, 800);
    });
  }

  // Call Modal
  const callModal = document.getElementById('call-modal');
  const openCallBtn = document.getElementById('open-call-modal-btn');
  const closeCallBtn = document.getElementById('close-call-modal-btn');

  if (openCallBtn && callModal) openCallBtn.addEventListener('click', () => callModal.classList.add('active'));
  if (closeCallBtn && callModal) closeCallBtn.addEventListener('click', () => callModal.classList.remove('active'));

  // Caution Notice Modal
  const cautionModal = document.getElementById('caution-modal');
  const openCautionBtn = document.getElementById('open-caution-badge-btn');
  const closeCautionBtn = document.getElementById('close-caution-modal-btn');

  if (openCautionBtn && cautionModal) openCautionBtn.addEventListener('click', () => cautionModal.classList.add('active'));
  if (closeCautionBtn && cautionModal) closeCautionBtn.addEventListener('click', () => cautionModal.classList.remove('active'));

  // Results Modal Close
  const resultsModal = document.getElementById('results-modal');
  const closeResultsBtn = document.getElementById('close-results-modal-btn');
  if (closeResultsBtn && resultsModal) closeResultsBtn.addEventListener('click', () => resultsModal.classList.remove('active'));

  // Auth Modal Close Button & Backdrop Listeners
  const authModal = document.getElementById('auth-modal');
  const closeAuthBtn = document.getElementById('close-auth-modal-btn');
  if (closeAuthBtn) {
    closeAuthBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.closeAuth();
    });
  }
  if (authModal) {
    authModal.addEventListener('click', (e) => {
      if (e.target === authModal) window.closeAuth();
    });
  }

  // Global delegation for all modal close buttons and backdrops
  document.addEventListener('click', (e) => {
    const closeBtn = e.target.closest('.modal-close-btn');
    if (closeBtn) {
      if (closeBtn.id === 'close-auth-modal-btn' || closeBtn.closest('#auth-modal')) {
        e.preventDefault();
        window.closeAuth();
      } else if (closeBtn.id === 'close-drawer-btn' || closeBtn.closest('#side-drawer')) {
        e.preventDefault();
        closeDrawer();
      } else {
        const parentModal = closeBtn.closest('.modal-backdrop-custom');
        if (parentModal) {
          e.preventDefault();
          parentModal.classList.remove('active');
        }
      }
    } else if (e.target.classList && e.target.classList.contains('modal-backdrop-custom')) {
      e.target.classList.remove('active');
      if (e.target.id === 'drawer-backdrop') {
        if (sideDrawer) sideDrawer.classList.remove('active');
      }
    }
  });

  // ESC key listener to close modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) {
      window.closeAuth();
      closeDrawer();
      document.querySelectorAll('.modal-backdrop-custom.active').forEach(m => m.classList.remove('active'));
    }
  });
}

/* ==========================================================================
   8. Universal Search Engine Handlers
   ========================================================================== */
window.handleFlightSearch = function() {
  const origin = document.getElementById('flight-origin') ? document.getElementById('flight-origin').value : 'DEL - New Delhi';
  const dest = document.getElementById('flight-dest') ? document.getElementById('flight-dest').value : 'BOM - Mumbai';
  const departDate = document.getElementById('flight-depart-date') ? document.getElementById('flight-depart-date').value : '2026-08-30';
  const paxSummary = document.getElementById('pax-summary-display') ? document.getElementById('pax-summary-display').textContent : '1 Traveller | Economy';

  const query = new URLSearchParams({
    from: origin,
    to: dest,
    date: departDate,
    pax: paxSummary
  });
  window.location.href = `flights.html?${query.toString()}`;
};

window.handlePackageSearch = function() {
  const dest = document.getElementById('package-dest') ? document.getElementById('package-dest').value : '';
  const origin = document.getElementById('package-origin') ? document.getElementById('package-origin').value : 'New Delhi';
  const month = document.getElementById('package-month') ? document.getElementById('package-month').value : '';

  const query = new URLSearchParams();
  if (dest) query.append('dest', dest);
  if (origin) query.append('origin', origin);
  if (month) query.append('month', month);

  window.location.href = `packages.html?${query.toString()}`;
};

window.handleHotelSearch = function() {
  window.location.href = 'hotels.html';
};

window.handleBusSearch = function() {
  window.location.href = 'bus.html';
};

window.handleCruiseSearch = function() {
  window.location.href = 'cruise.html';
};

/* ==========================================================================
   9. Universal Booking Navigation Method (Opens Review Your Booking UI)
   ========================================================================== */
window.confirmBooking = function(item, price, extra = {}) {
  const cleanPrice = (price + '').replace(/[^\d]/g, '') || '6530';
  const bookingData = {
    id: extra.code || 'DP_BOOK_' + Date.now().toString(36),
    type: extra.type || 'flight',
    title: item || 'DEL ➔ BOM',
    price: cleanPrice,
    airline: extra.airline || 'IndiGo',
    code: extra.code || '6E-322',
    from: extra.from || 'DEL',
    to: extra.to || 'BOM',
    depart: extra.depart || '23:30',
    arrive: extra.arrive || '01:45',
    duration: extra.duration || '2hr 15mins'
  };

  try {
    localStorage.setItem('dpauls_active_booking', JSON.stringify(bookingData));
  } catch(e) {}

  if (typeof window.mcpTrackAddToCart === 'function') {
    window.mcpTrackAddToCart({
      id: bookingData.id,
      sku: bookingData.code,
      name: bookingData.title,
      price: parseFloat(cleanPrice),
      quantity: 1
    });
  }

  const query = new URLSearchParams(bookingData);
  window.location.href = `booking.html?${query.toString()}`;
};

window.bookHotel = function(name, price) {
  const cleanPrice = (price + '').replace(/[^\d]/g, '') || '3499';
  const bookingData = {
    id: 'HOTEL_' + Date.now().toString(36),
    type: 'hotel',
    title: name,
    price: cleanPrice
  };
  try {
    localStorage.setItem('dpauls_active_booking', JSON.stringify(bookingData));
  } catch(e) {}

  if (typeof window.mcpTrackAddToCart === 'function') {
    window.mcpTrackAddToCart({
      id: bookingData.id,
      sku: bookingData.id,
      name: bookingData.title,
      price: parseFloat(cleanPrice),
      quantity: 1
    });
  }

  window.location.href = `booking.html?type=hotel&title=${encodeURIComponent(name)}&price=${cleanPrice}`;
};

window.previewDeal = function(name, price) {
  window.confirmBooking(name, price, { type: 'package', title: name });
};

/* ==========================================================================
   10. PDP Dynamic Package Loader & Price Calculator (package-detail.html)
   ========================================================================== */
const PDP_PACKAGES_DB = {
  europe: {
    code: 'DP205 • GROUP DEPARTURE',
    title: 'Best of Switzerland with France',
    category: 'International Tours',
    duration: '6 Nights / 7 Days',
    destinations: '2N Paris, 4N Zurich (Mt. Titlis & Lucerne)',
    price: 164999,
    originalPrice: '₹1,99,999',
    mainImage: 'assets/images/eiffel-tower.jpg',
    thumbs: ['assets/images/eiffel-tower.jpg', 'assets/images/swiss-alps.jpg', 'assets/images/Europe3.jpg', 'assets/images/europe-holdiay-deal.jpg']
  },
  thailand: {
    code: 'DP316 • FAMILY SPECIAL',
    title: 'Thailand Family Holiday Spectacular',
    category: 'International Tours',
    duration: '5 Nights / 6 Days',
    destinations: '2N Pattaya, 3N Bangkok (Coral Island & Safari World)',
    price: 45999,
    originalPrice: '₹58,999',
    mainImage: 'assets/images/thailand-holiday-package.jpg',
    thumbs: ['assets/images/thailand-holiday-package.jpg', 'assets/images/thailand1.jpg', 'assets/images/thailand.jpg']
  },
  goa: {
    code: 'DP189 • RESORT GETAWAY',
    title: 'Aastha Escape Resort Goa Beach Holiday',
    category: 'Dekho My India (Domestic)',
    duration: '3 Nights / 4 Days',
    destinations: '3N Calangute, North Goa (Beach Cottage Stay)',
    price: 15999,
    originalPrice: '₹22,000',
    mainImage: 'assets/images/goa1.jpg',
    thumbs: ['assets/images/goa1.jpg', 'assets/images/goa.jpg', 'assets/images/Goa-15999-package-image.jpg']
  },
  himachal: {
    code: 'DP477 • SCENIC HILLS',
    title: 'Himachal Scenic Wonder (Shimla & Manali)',
    category: 'Dekho My India (Domestic)',
    duration: '5 Nights / 6 Days',
    destinations: '2N Shimla, 3N Manali (Solang & Rohtang)',
    price: 8499,
    originalPrice: '₹12,999',
    mainImage: 'assets/images/shimla__2_.jpg',
    thumbs: ['assets/images/shimla__2_.jpg', 'assets/images/Manali_Travel_Guide_.jpg']
  },
  japan: {
    code: 'DP581 • GRAND ASIA COMBO',
    title: 'Discover South Korea & Japan Luxury Tour',
    category: 'International Tours',
    duration: '10 Nights / 11 Days',
    destinations: '4N Seoul, 3N Tokyo, 3N Osaka/Kyoto',
    price: 253999,
    originalPrice: '₹2,99,999',
    mainImage: 'assets/images/japan-holiday-deal-package.jpg',
    thumbs: ['assets/images/japan-holiday-deal-package.jpg', 'assets/images/amazing-japan-218999.jpg', 'assets/images/japan-korea-holiday-package.jpg']
  },
  singapore: {
    code: 'DP612 • TOP RATED INTL',
    title: 'Dazzling Singapore with Sentosa & Universal Studios',
    category: 'International Tours',
    duration: '4 Nights / 5 Days',
    destinations: '4N Singapore (Universal, Sentosa, Marina Bay)',
    price: 63999,
    originalPrice: '₹78,000',
    mainImage: 'assets/images/singapore.jpg',
    thumbs: ['assets/images/singapore.jpg', 'assets/images/MT26-web-banner.jpg']
  },
  'south-africa': {
    code: 'DP793 • WILDLIFE & SAFARI',
    title: 'South Africa Safari & Cape Town Escape',
    category: 'International Tours',
    duration: '8 Nights / 9 Days',
    destinations: '4N Cape Town, 2N Kruger Park, 2N Johannesburg',
    price: 244999,
    originalPrice: '₹2,85,000',
    mainImage: 'assets/images/south-africa-cape-town.jpg',
    thumbs: ['assets/images/south-africa-cape-town.jpg', 'assets/images/south-africa-top-pick.jpg']
  },
  andaman: {
    code: 'DP150 • ISLAND PARADISE',
    title: 'Andaman Emerald Islands & Radhanagar Beach',
    category: 'Dekho My India (Domestic)',
    duration: '5 Nights / 6 Days',
    destinations: '2N Port Blair, 2N Havelock Island, 1N Neil Island',
    price: 45999,
    originalPrice: '₹56,000',
    mainImage: 'assets/images/andaman.jpg',
    thumbs: ['assets/images/andaman.jpg']
  },
  disney: {
    code: 'DP880 • OFFICIAL DISNEY PARTNER',
    title: 'Hong Kong Disneyland & Disney Adventure Magic Tour',
    category: 'Family Vacation, Theme Parks',
    duration: '5 Nights / 6 Days',
    destinations: '2N Hong Kong City, 2N Disney\'s Hollywood Hotel (Disneyland Resort), 1N Macau',
    price: 78999,
    originalPrice: '₹95,000',
    mainImage: 'assets/images/disney-adventure-cruise-web-banner.jpg',
    thumbs: ['assets/images/disney-adventure-cruise-web-banner.jpg', 'assets/images/disneyland-hong-kong-package.jpg']
  },
  rajasthan: {
    code: 'DP310 • ROYAL HERITAGE',
    title: 'Royal Heritage Jaipur & Udaipur Tour',
    category: 'Dekho My India (Domestic)',
    duration: '4 Nights / 5 Days',
    destinations: '2N Jaipur (Amber Fort), 2N Udaipur (Lake Pichola)',
    price: 14499,
    originalPrice: '₹19,500',
    mainImage: 'assets/images/rajasthan-jaipur-deal.jpg',
    thumbs: ['assets/images/rajasthan-jaipur-deal.jpg', 'assets/images/rajasthan.jpg']
  },
  kashmir: {
    code: 'DP405 • HEAVEN ON EARTH',
    title: 'Srinagar Dal Lake & Gulmarg Snow Magic',
    category: 'Dekho My India (Domestic)',
    duration: '4 Nights / 5 Days',
    destinations: '2N Srinagar Houseboat, 2N Gulmarg Snow Resort',
    price: 21999,
    originalPrice: '₹28,000',
    mainImage: 'assets/images/kashmir-package-srinagar.jpg',
    thumbs: ['assets/images/kashmir-package-srinagar.jpg', 'assets/images/kashmir.jpg']
  },
  kerala: {
    code: 'DP510 • GODS OWN COUNTRY',
    title: 'Munnar Tea Hills & Alleppey Houseboat',
    category: 'Dekho My India (Domestic)',
    duration: '4 Nights / 5 Days',
    destinations: '2N Munnar Tea Hills, 1N Thekkady, 1N Alleppey Houseboat',
    price: 19499,
    originalPrice: '₹26,500',
    mainImage: 'assets/images/kerala-package-alleppey.jpg',
    thumbs: ['assets/images/kerala-package-alleppey.jpg', 'assets/images/kerala.jpg']
  },
  dubai: {
    code: 'DP102 • DESERT & LUXURY',
    title: 'Dazzling Dubai Desert & Marina Discovery',
    category: 'International Tours',
    duration: '4 Nights / 5 Days',
    destinations: '4N Dubai (Burj Khalifa, Desert Safari, Marina Cruise)',
    price: 49999,
    originalPrice: '₹62,000',
    mainImage: 'assets/images/dubai-mall.jpg',
    thumbs: ['assets/images/dubai-mall.jpg', 'assets/images/dubai.jpg']
  }
};

let currentPdpBasePrice = 164999;

function initPdpDynamicLoader() {
  const urlParams = new URLSearchParams(window.location.search);
  const pkgId = urlParams.get('id') || 'europe';
  const data = PDP_PACKAGES_DB[pkgId] || PDP_PACKAGES_DB.europe;

  currentPdpBasePrice = data.price;

  // Update Breadcrumb & Header
  document.title = `${data.title} | DPauls Holidays`;
  const breadcrumbCat = document.getElementById('pdp-breadcrumb-category');
  const breadcrumbName = document.getElementById('pdp-breadcrumb-name');
  const codeDisplay = document.getElementById('pdp-code-display');
  const titleDisplay = document.getElementById('pdp-title-display');
  const durationTag = document.getElementById('pdp-duration-tag');
  const destTag = document.getElementById('pdp-destinations-tag');
  const origPrice = document.getElementById('pdp-original-price');
  const mainPrice = document.getElementById('pdp-main-price');
  const activeImg = document.getElementById('pdp-active-gallery-img');

  if (breadcrumbCat) breadcrumbCat.textContent = data.category;
  if (breadcrumbName) breadcrumbName.textContent = data.title;
  if (codeDisplay) codeDisplay.textContent = `CODE : ${data.code}`;
  if (titleDisplay) titleDisplay.textContent = data.title;
  if (durationTag) durationTag.innerHTML = `<i class="fa-regular fa-clock clr-primary mr-1"></i> ${data.duration}`;
  if (destTag) destTag.innerHTML = `<i class="fa-solid fa-map-pin clr-primary mr-1"></i> ${data.destinations}`;
  if (origPrice) origPrice.textContent = data.originalPrice;
  if (mainPrice) mainPrice.textContent = `₹${data.price.toLocaleString('en-IN')}`;
  if (activeImg) activeImg.src = data.mainImage;

  // Thumbs
  const thumbsRow = document.querySelector('.pdp-thumbs-row');
  if (thumbsRow && data.thumbs) {
    let thumbsHtml = '';
    data.thumbs.forEach((t, i) => {
      thumbsHtml += `
        <div class="pdp-thumb-item ${i === 0 ? 'active' : ''}" onclick="window.switchPdpImage(this, '${t}')">
          <img src="${t}" alt="${data.title}">
        </div>
      `;
    });
    thumbsRow.innerHTML = thumbsHtml;
  }
}

window.switchPdpImage = function(thumbEl, src) {
  const activeImg = document.getElementById('pdp-active-gallery-img');
  if (activeImg) activeImg.src = src;
  document.querySelectorAll('.pdp-thumb-item').forEach(t => t.classList.remove('active'));
  thumbEl.classList.add('active');
};

window.selectDate = function(cellEl, dateStr) {
  document.querySelectorAll('.cal-day-cell').forEach(c => c.classList.remove('selected'));
  cellEl.classList.add('selected');
  const input = document.getElementById('calc-selected-date');
  if (input) input.value = dateStr;
};

function initPdpCalculator() {
  let adults = 1;
  let children = 0;

  const adultMinus = document.getElementById('calc-adult-minus');
  const adultPlus = document.getElementById('calc-adult-plus');
  const adultCount = document.getElementById('calc-adult-count');

  const childMinus = document.getElementById('calc-child-minus');
  const childPlus = document.getElementById('calc-child-plus');
  const childCount = document.getElementById('calc-child-count');

  window.recalcPdpTotal = function() {
    const insuranceChecked = document.getElementById('calc-addon-insurance') ? document.getElementById('calc-addon-insurance').checked : false;
    const insurancePerPax = insuranceChecked ? 1500 : 0;

    const adultFare = adults * (currentPdpBasePrice + insurancePerPax);
    const childFare = children * (Math.round(currentPdpBasePrice * 0.75) + insurancePerPax);
    const total = adultFare + childFare;

    const baseDisplay = document.getElementById('calc-base-subtotal');
    const priceDisplay = document.getElementById('calc-price-display');
    const finalTotal = document.getElementById('calc-final-total');

    if (baseDisplay) baseDisplay.textContent = `₹ ${(adults * currentPdpBasePrice).toLocaleString('en-IN')}`;
    if (priceDisplay) priceDisplay.textContent = `₹ ${total.toLocaleString('en-IN')}`;
    if (finalTotal) finalTotal.textContent = `₹ ${total.toLocaleString('en-IN')}`;
  };

  if (adultPlus) {
    adultPlus.addEventListener('click', () => {
      if (adults < 10) {
        adults++;
        if (adultCount) adultCount.textContent = adults;
        window.recalcPdpTotal();
      }
    });
  }

  if (adultMinus) {
    adultMinus.addEventListener('click', () => {
      if (adults > 1) {
        adults--;
        if (adultCount) adultCount.textContent = adults;
        window.recalcPdpTotal();
      }
    });
  }

  if (childPlus) {
    childPlus.addEventListener('click', () => {
      if (children < 6) {
        children++;
        if (childCount) childCount.textContent = children;
        window.recalcPdpTotal();
      }
    });
  }

  if (childMinus) {
    childMinus.addEventListener('click', () => {
      if (children > 0) {
        children--;
        if (childCount) childCount.textContent = children;
        window.recalcPdpTotal();
      }
    });
  }

  window.recalcPdpTotal();
}

window.confirmPdpBooking = function() {
  const date = document.getElementById('calc-selected-date') ? document.getElementById('calc-selected-date').value : '05 Sep 2026';
  const total = document.getElementById('calc-final-total') ? document.getElementById('calc-final-total').textContent : '₹1,64,999';
  const title = document.getElementById('pdp-title-display') ? document.getElementById('pdp-title-display').textContent : 'Best of Switzerland with France';
  const cleanPrice = total.replace(/[^\d]/g, '') || '164999';

  window.location.href = `booking.html?type=package&title=${encodeURIComponent(title)}&price=${cleanPrice}&date=${encodeURIComponent(date)}`;
};

/* ==========================================================================
   11. Destination Category PLP Database & Dynamic Renderer (packages.html)
   ========================================================================== */
const DESTINATION_PLP_DB = {
  himachal: {
    name: 'Himachal',
    count: 51,
    startingPrice: '8,499',
    category: 'India Tour Packages',
    title: 'Himachal Tour Packages',
    aboutTitle: 'Himachal Holiday Packages',
    aboutText: 'Considered as one of the best holiday destinations in India, Himachal Pradesh has beautiful valleys and snow-covered peaks that offer tranquillity and adventure. Explore Shimla, Kufri slopes, Beas River in Manali, Rohtang Pass, Dharamshala, McLeod Ganj and scenic Chamba with tailor-made packages.',
    popularPackages: [
      { name: 'Queen of Hills - Shimla Tour Package', duration: '2 Nights', price: '₹8,499', code: 'DP477', link: 'package-detail.html?id=himachal' },
      { name: 'Mesmerizing Shimla & Manali', duration: '5 Nights', price: '₹16,999', code: 'DP371', link: 'package-detail.html?id=himachal' },
      { name: 'Classic Hill Top Resort Package, Chamba', duration: '2 Nights', price: '₹12,499', code: 'DP488', link: 'package-detail.html?id=himachal' },
      { name: 'Paragliding In Bir Billing Adventure Tour', duration: '1 Night', price: '₹5,999', code: 'DP709', link: 'package-detail.html?id=himachal' },
      { name: 'Splendid Dalhousie & Dharamshala', duration: '5 Nights', price: '₹19,499', code: 'DP742', link: 'package-detail.html?id=himachal' }
    ]
  },
  goa: {
    name: 'Goa',
    count: 42,
    startingPrice: '15,999',
    category: 'India Tour Packages',
    title: 'Goa Tour Packages',
    aboutTitle: 'Goa Beach Holiday & Resort Packages',
    aboutText: 'Experience the sun, golden sand and sea with our exclusive Goa holiday packages. From Calangute, Baga and Candolim beaches to historic Old Goa churches, luxury Mandovi river cruises, water sports, beachfront shacks and nightlife, enjoy Goa with flights and 4-star resort stay.',
    popularPackages: [
      { name: 'Aastha Escape Resort Goa Beach Holiday', duration: '3 Nights', price: '₹15,999', code: 'DP189', link: 'package-detail.html?id=goa' },
      { name: 'Goa North & South Beach Getaway', duration: '4 Nights', price: '₹18,999', code: 'DP190', link: 'package-detail.html?id=goa' },
      { name: 'Luxury Villa Stay & Mandovi River Cruise Goa', duration: '3 Nights', price: '₹22,499', code: 'DP192', link: 'package-detail.html?id=goa' }
    ]
  },
  rajasthan: {
    name: 'Rajasthan',
    count: 36,
    startingPrice: '14,499',
    category: 'India Tour Packages',
    title: 'Rajasthan Tour Packages',
    aboutTitle: 'Royal Rajasthan Tour Packages',
    aboutText: 'Step into royal heritage, grand forts and majestic palaces. Explore the Pink City of Jaipur, romantic lakes of Udaipur, golden desert sands of Jaisalmer, and majestic Mehrangarh Fort of Jodhpur with guided sightseeing and heritage hotel stays.',
    popularPackages: [
      { name: 'Royal Heritage Jaipur & Udaipur Tour', duration: '4 Nights', price: '₹14,499', code: 'DP310', link: 'package-detail.html?id=rajasthan' },
      { name: 'Golden Triangle Spectacular (Delhi, Agra, Jaipur)', duration: '5 Nights', price: '₹18,999', code: 'DP312', link: 'package-detail.html?id=rajasthan' },
      { name: 'Desert Fantasy Jaisalmer & Jodhpur Forts', duration: '4 Nights', price: '₹16,999', code: 'DP315', link: 'package-detail.html?id=rajasthan' }
    ]
  },
  kashmir: {
    name: 'Kashmir',
    count: 28,
    startingPrice: '21,999',
    category: 'India Tour Packages',
    title: 'Kashmir Tour Packages',
    aboutTitle: 'Heaven on Earth - Kashmir Holiday Packages',
    aboutText: 'Discover paradise on earth with Dal Lake shikara rides, luxury wooden houseboat stays in Srinagar, snow valleys in Gulmarg, gondola cable cars, and scenic pine meadows of Pahalgam and Sonmarg.',
    popularPackages: [
      { name: 'Srinagar Dal Lake & Gulmarg Snow Magic', duration: '4 Nights', price: '₹21,999', code: 'DP405', link: 'package-detail.html?id=kashmir' },
      { name: 'Kashmir Heaven (Srinagar, Gulmarg & Pahalgam)', duration: '5 Nights', price: '₹26,999', code: 'DP408', link: 'package-detail.html?id=kashmir' }
    ]
  },
  kerala: {
    name: 'Kerala',
    count: 34,
    startingPrice: '19,499',
    category: 'India Tour Packages',
    title: 'Kerala Tour Packages',
    aboutTitle: 'God\'s Own Country - Kerala Holiday Packages',
    aboutText: 'Lush green tea hills of Munnar, wildlife boat safari in Periyar Thekkady, and serene backwaters of Alleppey on a traditional deluxe houseboat with authentic Kerala meals.',
    popularPackages: [
      { name: 'Munnar Tea Hills & Alleppey Houseboat', duration: '4 Nights', price: '₹19,499', code: 'DP510', link: 'package-detail.html?id=kerala' },
      { name: 'Grand Kerala Discovery (Cochin, Munnar, Thekkady)', duration: '5 Nights', price: '₹24,999', code: 'DP512', link: 'package-detail.html?id=kerala' }
    ]
  },
  europe: {
    name: 'Europe',
    count: 64,
    startingPrice: '1,64,999',
    category: 'International Tour Packages',
    title: 'Europe Tour Packages',
    aboutTitle: 'Magical Europe & Switzerland Holiday Packages',
    aboutText: 'Experience romantic Paris (Eiffel Tower & Seine Cruise), snow-capped Swiss Alps (Mt. Titlis cable car & Lucerne), Amsterdam canals, and Italian wonders with return flights, 4-star hotels, daily meals, and Schengen visa support.',
    popularPackages: [
      { name: 'Best of Switzerland with France', duration: '6 Nights', price: '₹1,64,999', code: 'DP205', link: 'package-detail.html?id=europe' },
      { name: 'Grand Europe Scenic Explorer (Paris, Zurich, Rome)', duration: '9 Nights', price: '₹2,24,999', code: 'DP208', link: 'package-detail.html?id=europe' }
    ]
  },
  thailand: {
    name: 'Thailand',
    count: 48,
    startingPrice: '45,999',
    category: 'International Tour Packages',
    title: 'Thailand Tour Packages',
    aboutTitle: 'Thailand Holiday Packages',
    aboutText: 'Explore vibrant Bangkok and Pattaya with Coral Island speedboat tours, Alcazar Cabaret Show, Safari World & Marine Park, 4-star hotels, and return flights.',
    popularPackages: [
      { name: 'Thailand Family Holiday Spectacular', duration: '5 Nights', price: '₹45,999', code: 'DP316', link: 'package-detail.html?id=thailand' },
      { name: 'Phuket & Krabi Island Paradise', duration: '5 Nights', price: '₹49,999', code: 'DP320', link: 'package-detail.html?id=thailand' }
    ]
  },
  dubai: {
    name: 'Dubai',
    count: 52,
    startingPrice: '49,999',
    category: 'International Tour Packages',
    title: 'Dubai Tour Packages',
    aboutTitle: 'Dazzling Dubai & UAE Holiday Packages',
    aboutText: 'Burj Khalifa 124th floor observation deck, thrilling Desert Safari with BBQ dinner & belly dance, Dhow Marina cruise dinner, Ferrari World Abu Dhabi, and luxury city stay with return flights.',
    popularPackages: [
      { name: 'Dazzling Dubai Desert & Marina Discovery', duration: '4 Nights', price: '₹49,999', code: 'DP102', link: 'package-detail.html?id=dubai' },
      { name: 'Dubai with Abu Dhabi & Ferrari World', duration: '5 Nights', price: '₹59,999', code: 'DP105', link: 'package-detail.html?id=dubai' }
    ]
  }
};

function renderDestinationPlpHeader(destKey) {
  const container = document.getElementById('dest-plp-hero-container');
  if (!container) return;

  const key = (destKey || '').toLowerCase();
  let matched = null;

  for (const k of Object.keys(DESTINATION_PLP_DB)) {
    if (key.includes(k)) {
      matched = DESTINATION_PLP_DB[k];
      break;
    }
  }

  if (!matched) {
    container.innerHTML = '';
    return;
  }

  // Update Breadcrumb
  const breadcrumb = document.getElementById('plp-breadcrumb-display');
  if (breadcrumb) {
    breadcrumb.innerHTML = `
      <a href="index.html">DPauls Holidays</a>
      <span class="mx-2">/</span>
      <a href="packages.html">Holiday Packages</a>
      <span class="mx-2">/</span>
      <a href="packages.html?cat=${matched.category.includes('India') ? 'domestic' : 'international'}">${matched.category}</a>
      <span class="mx-2">/</span>
      <span style="color: var(--white); font-weight: 700;">${matched.title}</span>
    `;
  }

  // Render Snippet Table Rows
  const tableRows = (matched.popularPackages || []).map(p => `
    <tr>
      <td style="height:32px; padding: 6px 12px;"><a href="${p.link}">${p.name}</a></td>
      <td style="height:32px; padding: 6px 12px; font-weight: 600;">${p.duration}</td>
      <td style="height:32px; padding: 6px 12px; font-weight: 800; color: #0284c7;">${p.price}</td>
    </tr>
  `).join('');

  container.innerHTML = `
    <div class="dest-plp-hero-box">
      <div class="dest-plp-title-row">
        <div class="d-flex align-items-center flex-wrap gap-2">
          <h1 class="dest-plp-main-title">
            <span class="dest-plp-count-tag">(${matched.count})</span>
            ${matched.title}
          </h1>
          <div class="dest-plp-price-tag">
            Starting From : <strong>₹ ${matched.startingPrice}</strong>
          </div>
        </div>
        <button type="button" class="dest-pdf-btn" onclick="alert('Downloading ${matched.name} Tour Packages PDF Brochure...')">
          <i class="fa-solid fa-file-pdf"></i>
          <span>Download PDF</span>
        </button>
      </div>

      <div class="dest-about-box">
        <h3 class="fnt-15 font-bold clr-3c mb-1">${matched.aboutTitle}</h3>
        <div class="dest-about-text" id="dest-about-text-el">
          ${matched.aboutText}
        </div>
        <button type="button" class="dest-read-more-btn" id="dest-read-more-btn" onclick="window.toggleDestAbout()">
          <span>Read More</span> <i class="fa-solid fa-chevron-down fnt-11"></i>
        </button>
      </div>

      <div class="dest-snippet-container">
        <h2 class="dest-snippet-title">Popular ${matched.name} Packages</h2>
        <table class="dest-snippet-table">
          <thead>
            <tr>
              <th style="width: 55%;">${matched.name} Packages</th>
              <th style="width: 25%;">Duration</th>
              <th style="width: 20%;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

window.toggleDestAbout = function() {
  const textEl = document.getElementById('dest-about-text-el');
  const btnEl = document.getElementById('dest-read-more-btn');
  if (!textEl || !btnEl) return;

  const isExpanded = textEl.classList.toggle('expanded');
  btnEl.innerHTML = isExpanded 
    ? `<span>Read Less</span> <i class="fa-solid fa-chevron-up fnt-11"></i>`
    : `<span>Read More</span> <i class="fa-solid fa-chevron-down fnt-11"></i>`;
};

/* ==========================================================================
   12. PLP Filter & Sorting Engine (packages.html)
   ========================================================================== */
function initPlpFilters() {
  const keywordInput = document.getElementById('plp-keyword-filter');
  const catCheckboxes = document.querySelectorAll('input[name="cat_filter"]');
  const durationCheckboxes = document.querySelectorAll('input[name="duration_filter"]');
  const budgetCheckboxes = document.querySelectorAll('input[name="budget_filter"]');
  const sortSelect = document.getElementById('plp-sort-select');
  const resetBtn = document.getElementById('btn-reset-filters');
  const countDisplay = document.getElementById('plp-results-count');
  const grid = document.getElementById('plp-packages-grid');

  const urlParams = new URLSearchParams(window.location.search);
  const destQuery = urlParams.get('dest') || urlParams.get('search');
  const catQuery = urlParams.get('cat');

  if (destQuery && keywordInput) {
    keywordInput.value = destQuery;
  }

  if (destQuery) {
    renderDestinationPlpHeader(destQuery);
  }

  if (catQuery) {
    catCheckboxes.forEach(c => {
      c.checked = (c.value === catQuery);
    });
  }

  function applyFilters() {
    if (!grid) return;
    const keyword = (keywordInput ? keywordInput.value : '').toLowerCase().trim();
    const selectedCats = Array.from(catCheckboxes).filter(c => c.checked).map(c => c.value);
    const selectedDurations = Array.from(durationCheckboxes).filter(c => c.checked).map(c => c.value);
    const selectedBudgets = Array.from(budgetCheckboxes).filter(c => c.checked).map(c => c.value);

    let visibleCount = 0;
    const cards = Array.from(grid.children);

    cards.forEach(card => {
      const title = (card.getAttribute('data-title') || '').toLowerCase();
      const dest = (card.getAttribute('data-dest') || '').toLowerCase();
      const cat = card.getAttribute('data-category') || '';
      const dur = parseInt(card.getAttribute('data-duration') || '0', 10);
      const price = parseInt(card.getAttribute('data-price') || '0', 10);

      const matchesKeyword = !keyword || title.includes(keyword) || dest.includes(keyword) || card.textContent.toLowerCase().includes(keyword);
      const matchesCat = selectedCats.length === 0 || selectedCats.includes('all') || selectedCats.includes(cat);

      let matchesDur = selectedDurations.length === 0;
      if (!matchesDur) {
        matchesDur = selectedDurations.some(d => {
          if (d === '1-3') return dur >= 1 && dur <= 3;
          if (d === '4-6') return dur >= 4 && dur <= 6;
          if (d === '7-9') return dur >= 7 && dur <= 9;
          if (d === '10+') return dur >= 10;
          return false;
        });
      }

      let matchesBudget = selectedBudgets.length === 0;
      if (!matchesBudget) {
        matchesBudget = selectedBudgets.some(b => {
          if (b === '0-25000') return price <= 25000;
          if (b === '25000-50000') return price > 25000 && price <= 50000;
          if (b === '50000-150000') return price > 50000 && price <= 150000;
          if (b === '150000+') return price > 150000;
          return false;
        });
      }

      if (matchesKeyword && matchesCat && matchesDur && matchesBudget) {
        card.style.display = 'grid';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (countDisplay) {
      countDisplay.textContent = `Showing ${visibleCount} Holiday Packages`;
    }
  }

  function applySorting() {
    const val = sortSelect ? sortSelect.value : 'popularity';
    const cards = Array.from(grid.children);

    cards.sort((a, b) => {
      const priceA = parseInt(a.getAttribute('data-price'), 10);
      const priceB = parseInt(b.getAttribute('data-price'), 10);
      const durA = parseInt(a.getAttribute('data-duration'), 10);
      const durB = parseInt(b.getAttribute('data-duration'), 10);

      if (val === 'price_asc') return priceA - priceB;
      if (val === 'price_desc') return priceB - priceA;
      if (val === 'duration_desc') return durB - durA;
      return 0;
    });

    cards.forEach(card => grid.appendChild(card));
  }

  if (keywordInput) keywordInput.addEventListener('input', applyFilters);
  catCheckboxes.forEach(c => c.addEventListener('change', applyFilters));
  durationCheckboxes.forEach(c => c.addEventListener('change', applyFilters));
  budgetCheckboxes.forEach(c => c.addEventListener('change', applyFilters));

  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      applySorting();
      applyFilters();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (keywordInput) keywordInput.value = '';
      catCheckboxes.forEach(c => c.checked = (c.value === 'all'));
      durationCheckboxes.forEach(c => c.checked = false);
      budgetCheckboxes.forEach(c => c.checked = false);
      if (sortSelect) sortSelect.value = 'popularity';
      applyFilters();
    });
  }

  applyFilters();
}

function initScrollTop() {
  const btn = document.getElementById('scroll-to-top-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
