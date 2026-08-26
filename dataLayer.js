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
    let lastLead = null;
    try {
      const storage = typeof window !== 'undefined' && window.localStorage ? window.localStorage : null;
      const sStorage = typeof window !== 'undefined' && window.sessionStorage ? window.sessionStorage : null;
      user = JSON.parse(
        (storage && storage.getItem('dpauls_logged_user')) ||
        (sStorage && sStorage.getItem('dpauls_logged_user')) ||
        (storage && storage.getItem('showoff_user')) ||
        'null'
      );
      lastLead = JSON.parse((storage && storage.getItem('dpauls_last_lead')) || 'null');
    } catch(e) {}

    const phone = (lastLead && lastLead.phone) || (user && (user.mobile || user.phone)) || '';
    const email = (lastLead && lastLead.email) || (user && user.email) || '';
    const firstName = (lastLead && lastLead.firstName) || (user && user.name ? user.name.split(' ')[0] : '');
    const lastName = (lastLead && lastLead.lastName) || (user && user.name && user.name.split(' ').length > 1 ? user.name.split(' ').slice(1).join(' ') : '');

    if (phone || email) {
      return {
        id: phone || email,
        attributes: {
          firstname: firstName || undefined,
          lastname: lastName || undefined,
          emailAddress: email || undefined,
          mobileNumber: phone || undefined,
          Service: (lastLead && lastLead.service) || undefined,
          TravelDate: (lastLead && lastLead.travelDetails) || undefined,
          Message: (lastLead && lastLead.notes) || undefined
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
    const urlParams = new URLSearchParams(window.location.search || '');
    const userPayload = getMcpUser();

    // 1. PRODUCT DETAIL PAGE (PDP) - matches /package-detail, /package-detail.html, /product
    if (
      path.indexOf('package-detail') !== -1 ||
      path.indexOf('product') !== -1 ||
      (typeof document !== 'undefined' && (document.getElementById('pdp-hero-title') || document.getElementById('pdp-title')))
    ) {
      const packageId = urlParams.get('id') || 'himachal';
      let pkg = null;
      if (typeof window !== 'undefined' && window.PDP_PACKAGES_DB && window.PDP_PACKAGES_DB[packageId]) {
        pkg = window.PDP_PACKAGES_DB[packageId];
      }

      const id = (pkg && (pkg.code || pkg.id)) || packageId.toUpperCase();
      const domTitleEl = (typeof document !== 'undefined' && document.getElementById) ? (document.getElementById('pdp-hero-title') || document.getElementById('pdp-title')) : null;
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

    // 2. CART & BOOKING PAGE - matches /booking, /booking.html, /cart, /checkout
    if (
      path.indexOf('booking') !== -1 ||
      path.indexOf('cart') !== -1 ||
      path.indexOf('checkout') !== -1 ||
      (typeof document !== 'undefined' && (document.getElementById('booking-main-form') || document.getElementById('full-cart-layout')))
    ) {
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

    // 3. CATEGORY (PLP) PAGES - matches /packages, /disney, /flights, /hotels, /bus, /cruise, /forex, /esim, /deals
    if (
      path.indexOf('packages') !== -1 ||
      path.indexOf('holiday-packages') !== -1 ||
      path.indexOf('disney') !== -1 ||
      path.indexOf('flights') !== -1 ||
      path.indexOf('hotels') !== -1 ||
      path.indexOf('bus') !== -1 ||
      path.indexOf('cruise') !== -1 ||
      path.indexOf('forex') !== -1 ||
      path.indexOf('esim') !== -1 ||
      path.indexOf('deals') !== -1 ||
      (typeof document !== 'undefined' && (document.getElementById('plp-packages-grid') || document.getElementById('flight-results-list') || document.getElementById('shop-all-grid')))
    ) {
      let catId = urlParams.get('dest') || urlParams.get('cat');
      if (!catId) {
        if (path.indexOf('disney') !== -1) catId = 'Disney Packages';
        else if (path.indexOf('flights') !== -1) catId = 'Flights';
        else if (path.indexOf('hotels') !== -1) catId = 'Hotels';
        else if (path.indexOf('bus') !== -1) catId = 'Bus Booking';
        else if (path.indexOf('cruise') !== -1) catId = 'Cruise Packages';
        else if (path.indexOf('forex') !== -1) catId = 'Foreign Exchange (Forex)';
        else if (path.indexOf('esim') !== -1) catId = 'International eSIM';
        else if (path.indexOf('deals') !== -1) catId = 'Travel Deals';
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

    // 4. CONTACT US PAGE - matches /contact, /contact.html
    if (path.indexOf('contact') !== -1 || (typeof document !== 'undefined' && document.getElementById('contact-form'))) {
      return {
        event: 'mcp_pageview',
        MCP: {
          pageType: 'Contact',
          currency: 'INR',
          user: userPayload
        }
      };
    }

    // 5. CONTENT & ABOUT PAGE - matches /about, /about.html, /terms, /privacy, /faqs
    if (
      path.indexOf('about') !== -1 ||
      path.indexOf('terms') !== -1 ||
      path.indexOf('privacy') !== -1 ||
      path.indexOf('faqs') !== -1 ||
      path.indexOf('shipping') !== -1 ||
      path.indexOf('returns') !== -1
    ) {
      return {
        event: 'mcp_pageview',
        MCP: {
          pageType: 'Content',
          currency: 'INR',
          user: userPayload
        }
      };
    }

    // 6. HOME PAGE (Default for root / or index)
    return {
      event: 'mcp_pageview',
      MCP: {
        pageType: 'Home',
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

  window.mcpTrackWhatsAppLead = function(leadData) {
    const phone = leadData.phone || '';
    const email = leadData.email || '';
    const firstName = leadData.firstName || '';
    const lastName = leadData.lastName || '';
    const service = leadData.service || '';
    const travelDate = leadData.travelDetails || '';
    const message = leadData.notes || leadData.requirements || '';

    window.pushToDataLayer({
      event: 'whatsapp_lead_submitted',
      MCP: {
        interaction: {
          name: 'WhatsApp Lead Submitted'
        },
        user: {
          id: phone || email,
          attributes: {
            firstname: firstName || undefined,
            lastname: lastName || undefined,
            emailAddress: email || undefined,
            mobileNumber: phone || undefined,
            Service: service || undefined,
            TravelDate: travelDate || undefined,
            Message: message || undefined
          }
        },
        leadDetails: leadData
      }
    });
  };

})();
