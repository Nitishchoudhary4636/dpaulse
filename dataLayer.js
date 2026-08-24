/**
 * SALESFORCE MARKETING CLOUD PERSONALIZATION (MCP) - DATALAYER ENGINE
 * Initializes and manages window.dataLayer across all DPauls pages
 */
(function() {
  window.dataLayer = window.dataLayer || [];

  // Helper to push to window.dataLayer safely
  window.pushToDataLayer = function(payload) {
    window.dataLayer.push(payload);
    console.log('[MCP DataLayer]', payload);
  };

  // Helper to get active user details
  function getMcpUser() {
    let user = null;
    try {
      const storage = typeof window !== 'undefined' && window.localStorage ? window.localStorage : null;
      const sStorage = typeof window !== 'undefined' && window.sessionStorage ? window.sessionStorage : null;
      user = JSON.parse(
        (storage && storage.getItem('dpauls_logged_user')) ||
        (sStorage && sStorage.getItem('dpauls_logged_user')) ||
        (storage && storage.getItem('showoff_user')) ||
        'null'
      );
    } catch(e) {}

    if (user && (user.mobile || user.phone || user.email)) {
      const phone = user.mobile || user.phone || '';
      return {
        id: phone || user.email,
        attributes: {
          phone: phone,
          email: user.email || '',
          name: user.name || '',
          isLoggedIn: true
        }
      };
    }

    return {
      id: 'anonymous',
      attributes: {
        isLoggedIn: false
      }
    };
  }

  // Determine Page Type & Build Initial Payload
  function buildPageDataLayer() {
    const path = (window.location.pathname || '').toLowerCase();
    const urlParams = new URLSearchParams(window.location.search);
    const userPayload = getMcpUser();

    // 1. HOME PAGE
    if (path === '/' || path === '' || path === 'index.html' || path.endsWith('/index.html') || path.endsWith('/index')) {
      return {
        event: 'mcp_pageview',
        MCP: {
          pageType: 'Home',
          currency: 'INR',
          user: userPayload
        }
      };
    }

    // 2. PRODUCT DETAIL PAGE (PDP)
    if (path.includes('package-detail.html') || path.includes('product.html')) {
      const packageId = urlParams.get('id') || 'himachal';
      let pkg = null;
      if (typeof window !== 'undefined' && window.PDP_PACKAGES_DB && window.PDP_PACKAGES_DB[packageId]) {
        pkg = window.PDP_PACKAGES_DB[packageId];
      }

      const id = (pkg && (pkg.code || pkg.id)) || packageId.toUpperCase();
      const domTitleEl = (typeof document !== 'undefined' && document.getElementById) ? document.getElementById('pdp-hero-title') : null;
      const title = (pkg && pkg.title) || (domTitleEl ? domTitleEl.textContent.trim() : 'DPauls Tour Package');
      const rawPrice = (pkg && pkg.price) || 8499;
      const priceNum = typeof rawPrice === 'string' ? parseFloat(rawPrice.replace(/[^0-9.]/g, '')) : Number(rawPrice);
      const desc = (pkg && pkg.overview) || '';
      const img = (pkg && pkg.images && pkg.images[0]) ? (window.location.origin + '/' + pkg.images[0]) : (window.location.origin + '/assets/images/shimla__2_.jpg');
      const cat = (pkg && pkg.destination) || 'Holiday Packages';

      return {
        event: 'mcp_pageview',
        MCP: {
          pageType: 'Product',
          currency: 'INR',
          user: userPayload,
          Item: {
            id: id,
            sku: id,
            name: title,
            description: desc,
            imageUrl: img,
            price: priceNum,
            category: cat,
            availability: 'in_stock'
          }
        }
      };
    }

    // 3. CART & BOOKING PAGE
    if (path.includes('booking.html') || path.includes('cart.html')) {
      let activeBooking = null;
      try {
        const storage = typeof window !== 'undefined' && window.localStorage ? window.localStorage : null;
        activeBooking = JSON.parse((storage && storage.getItem('dpauls_active_booking')) || '{}');
      } catch(e) {}

      const items = [];
      if (activeBooking && activeBooking.title) {
        const itemPrice = typeof activeBooking.price === 'string' ? parseFloat(activeBooking.price.replace(/[^0-9.]/g, '')) : (Number(activeBooking.price) || 8499);
        items.push({
          item_id: activeBooking.id || 'DP_BOOK_1',
          item_sku: activeBooking.id || 'DP_BOOK_1',
          item_name: activeBooking.title,
          price: itemPrice,
          quantity: 1
        });
      }

      return {
        event: 'mcp_pageview',
        MCP: {
          pageType: 'Cart',
          currency: 'INR',
          user: userPayload,
          items: items
        }
      };
    }

    // 4. CATEGORY (PLP) PAGES
    if (
      path.includes('packages.html') ||
      path.includes('disney.html') ||
      path.includes('flights.html') ||
      path.includes('hotels.html') ||
      path.includes('bus.html') ||
      path.includes('cruise.html')
    ) {
      let catId = urlParams.get('dest') || urlParams.get('cat');
      if (!catId) {
        if (path.includes('disney.html')) catId = 'Disney Packages';
        else if (path.includes('flights.html')) catId = 'Flights';
        else if (path.includes('hotels.html')) catId = 'Hotels';
        else if (path.includes('bus.html')) catId = 'Bus Booking';
        else if (path.includes('cruise.html')) catId = 'Cruise Packages';
        else catId = 'All Holiday Packages';
      }

      return {
        event: 'mcp_pageview',
        MCP: {
          pageType: 'Category',
          itemListId: catId,
          itemListName: `${catId} Tour Packages`,
          currency: 'INR',
          user: userPayload
        }
      };
    }

    // 5. CONTACT US PAGE
    if (path.includes('contact.html')) {
      return {
        event: 'mcp_pageview',
        MCP: {
          pageType: 'Contact',
          currency: 'INR',
          user: userPayload
        }
      };
    }

    // 6. CONTENT & ABOUT PAGE
    if (path.includes('about.html') || path.includes('terms.html') || path.includes('privacy.html')) {
      return {
        event: 'mcp_pageview',
        MCP: {
          pageType: 'Content',
          currency: 'INR',
          user: userPayload
        }
      };
    }

    // Default Fallback
    return {
      event: 'mcp_pageview',
      MCP: {
        pageType: 'Default',
        currency: 'INR',
        user: userPayload
      }
    };
  }

  // Push Pageview dataLayer on script load
  const initialPayload = buildPageDataLayer();
  window.pushToDataLayer(initialPayload);

  // Dynamic Event Helpers
  window.mcpTrackLogin = function(user) {
    window.pushToDataLayer({
      event: 'user_login',
      MCP: {
        user: {
          id: user.mobile || user.phone || user.email,
          attributes: {
            phone: user.mobile || user.phone,
            email: user.email,
            name: user.name,
            isLoggedIn: true
          }
        }
      }
    });
  };

  window.mcpTrackLogout = function() {
    window.pushToDataLayer({
      event: 'user_logout',
      MCP: {
        user: {
          id: 'anonymous',
          attributes: {
            isLoggedIn: false
          }
        }
      }
    });
  };

  window.mcpTrackAddToCart = function(item) {
    window.pushToDataLayer({
      event: 'add_to_cart',
      MCP: {
        Item: {
          id: item.id || item.code,
          sku: item.sku || item.code || item.id,
          name: item.title || item.name,
          price: typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.]/g, '')) : item.price,
          quantity: item.quantity || 1
        }
      }
    });
  };

  window.mcpTrackContactForm = function(data) {
    window.pushToDataLayer({
      event: 'contact_form_submit',
      MCP: {
        pageType: 'Contact',
        contactData: data
      }
    });
  };

})();
