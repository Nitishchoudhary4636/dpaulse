/**
 * SALESFORCE MARKETING CLOUD PERSONALIZATION (MCP / EVERGAGE) SITEMAP
 * DPauls Travel & Tours Implementation
 */
if (typeof SalesforceInteractions !== 'undefined') {
  SalesforceInteractions.init({
    cookieDomain: window.location.hostname || undefined
  }).then(function () {
    "use strict";

    // Helper to read from window.dataLayer
    function getDataLayerValue(path) {
      if (!window.dataLayer || !Array.isArray(window.dataLayer)) return null;
      for (var i = window.dataLayer.length - 1; i >= 0; i--) {
        var obj = window.dataLayer[i];
        if (!obj || typeof obj !== "object") continue;
        var current = obj;
        var found = true;
        for (var j = 0; j < path.length; j++) {
          if (current && current[path[j]] !== undefined) {
            current = current[path[j]];
          } else {
            found = false;
            break;
          }
        }
        if (found && current !== null && current !== undefined) {
          return current;
        }
      }
      return null;
    }

    function parsePrice(value) {
      if (typeof value === "number") return value;
      if (!value) return 0;
      var cleaned = String(value).replace(/[^0-9.]/g, "");
      var num = parseFloat(cleaned);
      return Number.isFinite(num) ? num : 0;
    }

    // Active Traveller Profile Resolver
    function getUserResolver() {
      var storedUser = null;
      try {
        storedUser = JSON.parse(
          localStorage.getItem("dpauls_logged_user") ||
          sessionStorage.getItem("dpauls_logged_user") ||
          "{}"
        );
      } catch (e) {}

      var phone =
        (storedUser && (storedUser.mobile || storedUser.phone)) ||
        getDataLayerValue(["MCP", "user", "attributes", "phone"]);

      var isLoggedIn =
        !!(storedUser && (storedUser.email || storedUser.mobile)) ||
        getDataLayerValue(["MCP", "user", "attributes", "isLoggedIn"]) === true;

      if (isLoggedIn && phone) {
        return {
          id: phone,
          attributes: {
            phone: phone,
            email: storedUser.email || undefined,
            name: storedUser.name || undefined,
            isLoggedIn: true,
            preferredDestination: localStorage.getItem("dpauls_last_dest") || undefined
          }
        };
      }
      return undefined;
    }

    function getActiveBookingLineItems() {
      var items = getDataLayerValue(["MCP", "items"]);
      if (Array.isArray(items) && items.length > 0) {
        return items.map(function (item) {
          return {
            catalogObjectType: "Product",
            catalogObjectId: item.item_id || item.item_sku || item.id,
            price: parsePrice(item.price),
            quantity: parseInt(item.quantity, 10) || 1,
            attributes: {
              name: item.item_name || item.title,
              currency: "INR"
            }
          };
        });
      }
      try {
        var booking = JSON.parse(localStorage.getItem("dpauls_active_booking") || "{}");
        if (booking && booking.title) {
          return [{
            catalogObjectType: "Product",
            catalogObjectId: booking.id || booking.code || "DP_TOUR",
            price: parsePrice(booking.price),
            quantity: 1,
            attributes: {
              name: booking.title,
              currency: "INR"
            }
          }];
        }
      } catch (e) {}
      return [];
    }

    var sitemapConfig = {
      global: {
        user: getUserResolver,
        contentZones: [
          { name: "global_header_nav", selector: "nav.topnav" },
          { name: "global_footer", selector: "footer.footer" },
          { name: "global_exit_intent_offer" }
        ],
        listeners: [
          // Login Tracker
          SalesforceInteractions.listener("click", "#verify-otp-btn, #email-login-submit-btn", function () {
            setTimeout(function () {
              var user = getUserResolver();
              if (user) {
                SalesforceInteractions.sendEvent({
                  interaction: { name: "User Logged In" },
                  user: user
                });
              }
            }, 400);
          }),
          // Logout Tracker
          SalesforceInteractions.listener("click", ".btn-logout-custom", function () {
            SalesforceInteractions.sendEvent({
              interaction: { name: "User Logged Out" },
              user: { id: "anonymous", attributes: { isLoggedIn: false } }
            });
          })
        ]
      },

      pageTypeDefault: {
        name: "default",
        interaction: { name: "Default Page" }
      },

      pageTypes: [
        // 1. HOME PAGE
        {
          name: "home",
          isMatch: function () {
            var pt = getDataLayerValue(["MCP", "pageType"]);
            if (pt === "Home") return true;
            var path = (window.location.pathname || "").toLowerCase();
            return path === "/" || path === "" || path.indexOf("index") !== -1 || !!document.getElementById("search-tabs-container");
          },
          interaction: { name: "Viewed Travel Home Page" },
          contentZones: [
            { name: "home_hero_offers_banner", selector: "#hero-slider-viewport, .hero-slider-container" },
            { name: "home_personalized_recommendations", selector: "#home-recommendations-container, .mcp-recommendation-zone" },
            { name: "home_domestic_tours_recommendations", selector: ".packages-grid-5" },
            { name: "home_international_packages_recommendations", selector: ".intl-grid" },
            { name: "home_destination_guides", selector: ".destination-grid-8" }
          ],
          listeners: [
            // Search submission listener
            SalesforceInteractions.listener("click", "#btn-search-packages, #btn-search-flights", function () {
              var dest = document.getElementById("package-dest") ? document.getElementById("package-dest").value : "";
              if (dest) localStorage.setItem("dpauls_last_dest", dest);
              SalesforceInteractions.sendEvent({
                interaction: { name: "Searched Holidays", destination: dest }
              });
            })
          ]
        },

        // 2. CATEGORY / DESTINATION PLP (Himachal, Goa, Europe, Disney, Flights, etc.)
        {
          name: "category",
          isMatch: function () {
            var pt = getDataLayerValue(["MCP", "pageType"]);
            if (pt === "Category") return true;
            var path = (window.location.pathname || "").toLowerCase();
            return (
              path.indexOf("packages") !== -1 ||
              path.indexOf("holiday-packages") !== -1 ||
              path.indexOf("disney") !== -1 ||
              path.indexOf("flights") !== -1 ||
              path.indexOf("hotels") !== -1 ||
              path.indexOf("bus") !== -1 ||
              path.indexOf("cruise") !== -1 ||
              path.indexOf("forex") !== -1 ||
              path.indexOf("esim") !== -1 ||
              path.indexOf("deals") !== -1 ||
              !!document.getElementById("plp-packages-grid") ||
              !!document.getElementById("dest-plp-hero-container") ||
              !!document.getElementById("flight-results-list")
            );
          },
          interaction: {
            name: SalesforceInteractions.CatalogObjectInteractionName.ViewCatalogObject,
            catalogObject: {
              type: "Category",
              id: function () {
                return (
                  getDataLayerValue(["MCP", "itemListId"]) ||
                  new URLSearchParams(window.location.search).get("dest") ||
                  "Holiday Packages"
                );
              },
              attributes: {
                name: function () {
                  return (
                    getDataLayerValue(["MCP", "itemListName"]) ||
                    (new URLSearchParams(window.location.search).get("dest") ? new URLSearchParams(window.location.search).get("dest") + " Tour Packages" : "Holiday Packages")
                  );
                },
                url: SalesforceInteractions.resolvers.fromHref()
              }
            }
          },
          contentZones: [
            { name: "dest_plp_hero_banner", selector: "#dest-plp-hero-container, .flight-breadcrumb-bar" },
            { name: "plp_packages_recommendations", selector: "#plp-packages-grid, #flight-results-list" }
          ],
          listeners: [
            // Brochure download listener
            SalesforceInteractions.listener("click", ".dest-pdf-btn", function () {
              SalesforceInteractions.sendEvent({
                interaction: { name: "Downloaded Destination PDF Brochure" }
              });
            })
          ]
        },

        // 3. PRODUCT / PACKAGE DETAIL PAGE (PDP)
        {
          name: "pdp",
          isMatch: function () {
            var pt = getDataLayerValue(["MCP", "pageType"]);
            if (pt === "Product") return true;
            var path = (window.location.pathname || "").toLowerCase();
            return path.indexOf("package-detail") !== -1 || !!document.getElementById("pdp-hero-title");
          },
          interaction: {
            name: SalesforceInteractions.CatalogObjectInteractionName.ViewCatalogObject,
            catalogObject: {
              type: "Product",
              id: function () {
                return (
                  getDataLayerValue(["MCP", "Item", "id"]) ||
                  new URLSearchParams(window.location.search).get("id") ||
                  "DP477"
                );
              },
              attributes: {
                sku: function () {
                  return (
                    getDataLayerValue(["MCP", "Item", "sku"]) ||
                    new URLSearchParams(window.location.search).get("id") ||
                    "DP477"
                  );
                },
                name: function () {
                  var mcpName = getDataLayerValue(["MCP", "Item", "name"]);
                  if (mcpName) return mcpName;
                  var el = document.getElementById("pdp-hero-title");
                  return el ? el.textContent.trim() : "Holiday Tour Package";
                },
                description: function () {
                  var el = document.getElementById("pdp-overview-text");
                  return el ? el.textContent.trim() : "";
                },
                imageUrl: function () {
                  var el = document.getElementById("pdp-main-gallery-img");
                  return el ? el.src : window.location.origin + "/assets/images/shimla__2_.jpg";
                },
                price: function () {
                  var p = getDataLayerValue(["MCP", "Item", "price"]);
                  if (p) return parsePrice(p);
                  var el = document.getElementById("pdp-sidebar-price");
                  return el ? parsePrice(el.textContent) : 8499;
                },
                url: SalesforceInteractions.resolvers.fromHref(),
                currency: "INR",
                availability: "in_stock"
              },
              relatedCatalogObjects: {
                Destination: function () {
                  var dest = getDataLayerValue(["MCP", "Item", "category"]);
                  return dest ? [dest] : ["Himachal"];
                }
              }
            }
          },
          contentZones: [
            { name: "pdp_similar_tours_recommendations", selector: ".pdp-hotels-card, #pdp-similar-grid" }
          ],
          listeners: [
            // Book Tour Package Click
            SalesforceInteractions.listener("click", "#btn-pdp-book-now, .btn-plp-book", function () {
              var title = (document.getElementById("pdp-hero-title") ? document.getElementById("pdp-hero-title").textContent.trim() : "Tour Package");
              var price = parsePrice(document.getElementById("pdp-sidebar-price") ? document.getElementById("pdp-sidebar-price").textContent : 8499);
              var id = new URLSearchParams(window.location.search).get("id") || "DP477";

              SalesforceInteractions.sendEvent({
                interaction: {
                  name: SalesforceInteractions.CartInteractionName.AddToCart,
                  lineItem: {
                    catalogObjectType: "Product",
                    catalogObjectId: id,
                    quantity: 1,
                    price: price,
                    attributes: { name: title, sku: id }
                  }
                }
              });
            })
          ]
        },

        // 4. REVIEW BOOKING & CART (Checkout)
        {
          name: "cart",
          isMatch: function () {
            var pt = getDataLayerValue(["MCP", "pageType"]);
            if (pt === "Cart") return true;
            var path = (window.location.pathname || "").toLowerCase();
            return path.indexOf("booking") !== -1 || !!document.getElementById("booking-main-form");
          },
          interaction: {
            name: SalesforceInteractions.CartInteractionName.ReplaceCart,
            lineItems: getActiveBookingLineItems
          },
          contentZones: [
            { name: "booking_cross_sell_offers", selector: ".booking-summary-card" }
          ]
        },

        // 5. CONTACT US
        {
          name: "contact",
          isMatch: function () {
            var pt = getDataLayerValue(["MCP", "pageType"]);
            if (pt === "Contact") return true;
            var path = (window.location.pathname || "").toLowerCase();
            return path.indexOf("contact") !== -1 || !!document.getElementById("contact-form");
          },
          interaction: { name: "Viewed Contact Us Page" },
          contentZones: [
            { name: "contact_us_form", selector: "#contact-form" }
          ],
          listeners: [
            SalesforceInteractions.listener("submit", "#contact-form", function () {
              SalesforceInteractions.sendEvent({
                interaction: { name: "Contact Inquiry Submitted" }
              });
            })
          ]
        },

        // 6. CONTENT & ABOUT
        {
          name: "content",
          isMatch: function () {
            var pt = getDataLayerValue(["MCP", "pageType"]);
            if (pt === "Content") return true;
            var path = (window.location.pathname || "").toLowerCase();
            return path.indexOf("about") !== -1 || path.indexOf("terms") !== -1 || path.indexOf("privacy") !== -1;
          },
          interaction: { name: "Viewed About / Policy Page" }
        }
      ]
    };

    SalesforceInteractions.initSitemap(sitemapConfig);
  });
}
