// /**
//  * SALESFORCE MARKETING CLOUD PERSONALIZATION (MCP / EVERGAGE) SITEMAP
//  * DPauls Travel & Tours Implementation
//  */
// if (typeof SalesforceInteractions !== 'undefined') {
//   SalesforceInteractions.init({
//     cookieDomain: window.location.hostname || undefined
//   }).then(function () {
//     "use strict";

//     // Helper to read from window.dataLayer
//     function getDataLayerValue(path) {
//       if (!window.dataLayer || !Array.isArray(window.dataLayer)) return null;
//       for (var i = window.dataLayer.length - 1; i >= 0; i--) {
//         var obj = window.dataLayer[i];
//         if (!obj || typeof obj !== "object") continue;
//         var current = obj;
//         var found = true;
//         for (var j = 0; j < path.length; j++) {
//           if (current && current[path[j]] !== undefined) {
//             current = current[path[j]];
//           } else {
//             found = false;
//             break;
//           }
//         }
//         if (found && current !== null && current !== undefined) {
//           return current;
//         }
//       }
//       return null;
//     }

//     function parsePrice(value) {
//       if (typeof value === "number") return value;
//       if (!value) return 0;
//       var cleaned = String(value).replace(/[^0-9.]/g, "");
//       var num = parseFloat(cleaned);
//       return Number.isFinite(num) ? num : 0;
//     }

//     // Active User Profile & Identity Resolver for Salesforce MCP
//     function getUserResolver() {
//       var uId = getDataLayerValue(["MCP", "user", "id"]);
//       var storedUser = null;
//       try {
//         storedUser = JSON.parse(localStorage.getItem("dpauls_logged_user") || localStorage.getItem("showoff_user") || sessionStorage.getItem("dpauls_logged_user") || "{}");
//       } catch (e) {}

//       var phone =
//         (storedUser && (storedUser.mobile || storedUser.phone)) ||
//         getDataLayerValue(["MCP", "user", "attributes", "phone"]) ||
//         getDataLayerValue(["user", "phone"]) ||
//         (uId && uId !== "anonymous" ? uId : null);

//       var isLoggedIn =
//         !!(storedUser && (storedUser.email || storedUser.mobile || storedUser.isLoggedIn)) ||
//         getDataLayerValue(["MCP", "user", "attributes", "isLoggedIn"]) === true ||
//         getDataLayerValue(["user", "isLoggedIn"]) === true;

//       if (isLoggedIn && phone) {
//         return {
//           id: phone,
//           attributes: {
//             phone: phone,
//             email: storedUser && storedUser.email ? storedUser.email : undefined,
//             name: storedUser && storedUser.name ? storedUser.name : undefined,
//             isLoggedIn: true
//           }
//         };
//       }

//       return undefined;
//     }

//     // Fallback catalog resolver for PDP
//     function getProductFallback() {
//       var params = new URLSearchParams(window.location.search);
//       var packageId = params.get("id") || "himachal";
//       if (window.PDP_PACKAGES_DB && window.PDP_PACKAGES_DB[packageId]) {
//         return window.PDP_PACKAGES_DB[packageId];
//       }
//       if (window.PRODUCTS_DATA) {
//         if (typeof window.PRODUCTS_DATA.findProductById === "function") {
//           var p = window.PRODUCTS_DATA.findProductById(packageId);
//           if (p) return p;
//         }
//       }
//       return null;
//     }

//     function getCartLineItems() {
//       var items = getDataLayerValue(["MCP", "items"]);
//       var currency = getDataLayerValue(["MCP", "currency"]) || "INR";

//       if (Array.isArray(items) && items.length > 0) {
//         return items.map(function (item) {
//           return {
//             catalogObjectType: "Product",
//             catalogObjectId: item.item_id || item.item_sku || item.id,
//             price: parsePrice(item.price),
//             quantity: parseInt(item.quantity, 10) || 1,
//             attributes: {
//               sku: item.item_sku || item.item_id || item.id,
//               name: item.item_name || item.title || "",
//               currency: currency
//             }
//           };
//         }).filter(function (item) {
//           return !!item.catalogObjectId;
//         });
//       }

//       try {
//         var raw = localStorage.getItem("dpauls_active_booking") || localStorage.getItem("showoff_cart") || "[]";
//         var parsed = JSON.parse(raw);
//         if (Array.isArray(parsed)) {
//           return parsed.map(function (item) {
//             return {
//               catalogObjectType: "Product",
//               catalogObjectId: item.productId || item.cartItemId || item.id || item.title,
//               price: parsePrice(item.priceNum || item.saleNum || item.price || 0),
//               quantity: parseInt(item.quantity, 10) || 1,
//               attributes: {
//                 sku: item.productId || item.cartItemId || item.id || "DP_BOOK",
//                 name: item.title || item.name || "Holiday Package",
//                 currency: currency
//               }
//             };
//           }).filter(function (item) {
//             return !!item.catalogObjectId;
//           });
//         } else if (parsed && parsed.title) {
//           return [{
//             catalogObjectType: "Product",
//             catalogObjectId: parsed.id || parsed.code || "DP_BOOK_1",
//             price: parsePrice(parsed.price),
//             quantity: 1,
//             attributes: {
//               sku: parsed.id || parsed.code || "DP_BOOK_1",
//               name: parsed.title,
//               currency: currency
//             }
//           }];
//         }
//       } catch (e) {}

//       return [];
//     }

//     var sitemapConfig = {
//       global: {
//         user: getUserResolver,
//         contentZones: [
//           { name: "global_header", selector: "header.site-header, nav.topnav" },
//           { name: "global_footer", selector: "footer.site-footer, footer.footer" },
//           { name: "global_exit_intent" },
//           { name: "global_survey_feedback" }
//         ],
//         listeners: [
//           // 1. Capture Login Event when user logs in
//           SalesforceInteractions.listener("click", "#verify-otp-btn, #email-login-submit-btn, #kp-btn-verify-otp", function () {
//             setTimeout(function () {
//               var user = getUserResolver();
//               if (user) {
//                 SalesforceInteractions.sendEvent({
//                   interaction: {
//                     name: "User Logged In"
//                   },
//                   user: user
//                 });
//               }
//             }, 500);
//           }),

//           // 2. Capture Logout Event
//           SalesforceInteractions.listener("click", ".btn-logout-custom, #btn-dropdown-logout", function () {
//             SalesforceInteractions.sendEvent({
//               interaction: {
//                 name: "User Logged Out"
//               },
//               user: {
//                 id: "anonymous",
//                 attributes: {
//                   isLoggedIn: false
//                 }
//               }
//             });
//           })
//         ]
//       },

//       pageTypeDefault: {
//         name: "default",
//         interaction: {
//           name: "Default Page"
//         }
//       },

//       pageTypes: [
//         // 1. HOME PAGE
//         {
//           name: "home",
//           isMatch: function () {
//             var pageType = getDataLayerValue(["MCP", "pageType"]);
//             if (pageType === "Home") return true;
//             var path = (window.location.pathname || "").toLowerCase();
//             return (
//               path === "/" ||
//               path === "" ||
//               path.endsWith("/index.html") ||
//               path.endsWith("/index") ||
//               path === "index.html" ||
//               path === "/index" ||
//               !!document.getElementById("search-tabs-container")
//             );
//           },
//           interaction: {
//             name: "Home Page"
//           },
//           contentZones: [
//             { name: "home_hero_banner", selector: "#hero-slider-viewport, .hero-slider-container" },
//             { name: "home_hot_drops_recommendation", selector: "#hot-drops-grid, .packages-grid-5" },
//             { name: "home_bestsellers_recommendation", selector: "#bestsellers-tiles-grid, .intl-grid" }
//           ]
//         },

//         // 2. CATEGORY (PLP) PAGE
//         {
//           name: "category",
//           isMatch: function () {
//             var pageType = getDataLayerValue(["MCP", "pageType"]);
//             if (pageType === "Category") return true;
//             var path = (window.location.pathname || "").toLowerCase();
//             return (
//               path.indexOf("packages") !== -1 ||
//               path.indexOf("disney") !== -1 ||
//               path.indexOf("flights") !== -1 ||
//               path.indexOf("hotels") !== -1 ||
//               path.indexOf("bus") !== -1 ||
//               path.indexOf("cruise") !== -1 ||
//               path.indexOf("women") !== -1 ||
//               path.indexOf("men") !== -1 ||
//               path.indexOf("curve") !== -1 ||
//               path.indexOf("bestsellers") !== -1 ||
//               (document.body && document.body.hasAttribute("data-page-gender")) ||
//               !!document.getElementById("plp-packages-grid") ||
//               !!document.getElementById("flight-results-list") ||
//               !!document.getElementById("dest-plp-hero-container") ||
//               !!document.getElementById("shop-all-grid")
//             );
//           },
//           interaction: {
//             name: SalesforceInteractions.CatalogObjectInteractionName.ViewCatalogObject,
//             catalogObject: {
//               type: "Category",
//               id: function () {
//                 return (
//                   getDataLayerValue(["MCP", "itemListId"]) ||
//                   (new URLSearchParams(window.location.search).get("dest")) ||
//                   "All Packages"
//                 );
//               },
//               attributes: {
//                 name: function () {
//                   return (
//                     getDataLayerValue(["MCP", "itemListName"]) ||
//                     getDataLayerValue(["MCP", "itemListId"]) ||
//                     "Holiday Packages"
//                   );
//                 },
//                 url: SalesforceInteractions.resolvers.fromHref()
//               }
//             }
//           },
//           contentZones: [
//             { name: "category_hero_banner", selector: ".dest-plp-hero-box, .category-hero-banner, .flight-breadcrumb-bar" },
//             { name: "plp_recommendations", selector: "#plp-packages-grid, #flight-results-list, #shop-all-grid" }
//           ]
//         },

//         // 3. PRODUCT DETAIL PAGE (PDP)
//         {
//           name: "pdp",
//           isMatch: function () {
//             var pageType = getDataLayerValue(["MCP", "pageType"]);
//             if (pageType === "Product") return true;
//             var path = (window.location.pathname || "").toLowerCase();
//             return (
//               path.indexOf("package-detail") !== -1 ||
//               path.indexOf("product") !== -1 ||
//               !!document.getElementById("pdp-hero-title") ||
//               !!document.getElementById("pdp-title")
//             );
//           },
//           interaction: {
//             name: SalesforceInteractions.CatalogObjectInteractionName.ViewCatalogObject,
//             catalogObject: {
//               type: "Product",
//               id: function () {
//                 var mcpId = getDataLayerValue(["MCP", "Item", "id"]);
//                 if (mcpId) return mcpId;
//                 var prod = getProductFallback();
//                 if (prod && (prod.code || prod.id)) return prod.code || prod.id;
//                 var params = new URLSearchParams(window.location.search);
//                 return params.get("id") || "himachal";
//               },
//               attributes: {
//                 sku: function () {
//                   var sku = getDataLayerValue(["MCP", "Item", "sku"]) || getDataLayerValue(["MCP", "Item", "id"]);
//                   if (sku) return sku;
//                   var prod = getProductFallback();
//                   if (prod && (prod.code || prod.id)) return prod.code || prod.id;
//                   var params = new URLSearchParams(window.location.search);
//                   return params.get("id") || "himachal";
//                 },
//                 name: function () {
//                   var mcpName = getDataLayerValue(["MCP", "Item", "name"]);
//                   if (mcpName) return mcpName;
//                   var prod = getProductFallback();
//                   if (prod && (prod.title || prod.name)) return prod.title || prod.name;
//                   var titleEl = document.getElementById("pdp-hero-title") || document.getElementById("pdp-title");
//                   return titleEl ? titleEl.textContent.trim() : "DPauls Tour Package";
//                 },
//                 description: function () {
//                   var desc = getDataLayerValue(["MCP", "Item", "description"]);
//                   if (desc) return desc;
//                   var prod = getProductFallback();
//                   if (prod && prod.overview) return prod.overview;
//                   var descEl = document.getElementById("pdp-overview-text") || document.getElementById("pdp-desc-text");
//                   return descEl ? descEl.textContent.trim() : "";
//                 },
//                 imageUrl: function () {
//                   var img = getDataLayerValue(["MCP", "Item", "imageUrl"]);
//                   if (img) return img;
//                   var prod = getProductFallback();
//                   if (prod && prod.images && prod.images[0]) return prod.images[0];
//                   var mainImg = document.getElementById("pdp-main-gallery-img") || document.getElementById("pdp-main-image");
//                   if (mainImg && mainImg.src) return mainImg.src;
//                   return window.location.origin + "/assets/images/shimla__2_.jpg";
//                 },
//                 url: SalesforceInteractions.resolvers.fromHref(),
//                 currency: function () {
//                   return getDataLayerValue(["MCP", "currency"]) || "INR";
//                 },
//                 price: function () {
//                   var price = getDataLayerValue(["MCP", "Item", "price"]);
//                   if (price !== null && price !== undefined && price !== 0) return parsePrice(price);
//                   var prod = getProductFallback();
//                   if (prod && (prod.price || prod.saleNum || prod.salePrice)) return parsePrice(prod.price || prod.saleNum || prod.salePrice);
//                   var priceEl = document.getElementById("pdp-sidebar-price") || document.getElementById("pdp-sale-price");
//                   return priceEl ? parsePrice(priceEl.textContent) : 0;
//                 },
//                 availability: function () {
//                   return getDataLayerValue(["MCP", "Item", "availability"]) || "in_stock";
//                 }
//               },
//               relatedCatalogObjects: {
//                 Category: function () {
//                   var cat = getDataLayerValue(["MCP", "Item", "category"]);
//                   if (cat) return [cat];
//                   var prod = getProductFallback();
//                   return prod && prod.destination ? [prod.destination] : ["Holiday Packages"];
//                 }
//               }
//             }
//           },
//           contentZones: [
//             { name: "pdp_similar_recommendations", selector: "#pdp-similar-grid, .pdp-hotels-card" }
//           ],
//           listeners: [
//             SalesforceInteractions.listener("click", "#btn-pdp-book-now, .btn-pdp-book-action, #btn-pdp-add-bag", function () {
//               var prod = getProductFallback();
//               var id = getDataLayerValue(["MCP", "Item", "id"]) || (prod && (prod.code || prod.id)) || new URLSearchParams(window.location.search).get("id") || "himachal";
//               var price = parsePrice(getDataLayerValue(["MCP", "Item", "price"])) || (prod && parsePrice(prod.price)) || 8499;
//               var name = getDataLayerValue(["MCP", "Item", "name"]) || (prod && prod.title) || (document.getElementById("pdp-hero-title") ? document.getElementById("pdp-hero-title").textContent.trim() : "DPauls Tour");

//               SalesforceInteractions.sendEvent({
//                 interaction: {
//                   name: SalesforceInteractions.CartInteractionName.AddToCart,
//                   lineItem: {
//                     catalogObjectType: "Product",
//                     catalogObjectId: id,
//                     quantity: 1,
//                     price: price,
//                     attributes: {
//                       name: name,
//                       sku: id
//                     }
//                   }
//                 }
//               });
//             })
//           ]
//         },

//         // 4. CART & CHECKOUT PAGE
//         {
//           name: "cart",
//           isMatch: function () {
//             var pageType = getDataLayerValue(["MCP", "pageType"]);
//             if (pageType === "Cart") return true;
//             var path = (window.location.pathname || "").toLowerCase();
//             return (
//               path.indexOf("booking") !== -1 ||
//               path.indexOf("cart") !== -1 ||
//               path.indexOf("checkout") !== -1 ||
//               !!document.getElementById("booking-main-form") ||
//               !!document.getElementById("full-cart-layout")
//             );
//           },
//           interaction: {
//             name: SalesforceInteractions.CartInteractionName.ReplaceCart,
//             lineItems: getCartLineItems
//           },
//           contentZones: [
//             { name: "cart_recommendations", selector: "#cart-recommendations-grid, .booking-summary-card" }
//           ]
//         },

//         // 5. WISHLIST PAGE
//         {
//           name: "wishlist",
//           isMatch: function () {
//             var pageType = getDataLayerValue(["MCP", "pageType"]);
//             if (pageType === "Wishlist") return true;
//             var path = (window.location.pathname || "").toLowerCase();
//             return path.indexOf("wishlist") !== -1 || !!document.getElementById("page-wishlist-grid");
//           },
//           interaction: {
//             name: "Viewed Wishlist Page"
//           },
//           contentZones: [
//             { name: "wishlist_grid", selector: "#page-wishlist-grid" }
//           ]
//         },

//         // 6. CONTACT US PAGE
//         {
//           name: "contact",
//           isMatch: function () {
//             var pageType = getDataLayerValue(["MCP", "pageType"]);
//             if (pageType === "Contact") return true;
//             var path = (window.location.pathname || "").toLowerCase();
//             return path.indexOf("contact") !== -1 || !!document.getElementById("contact-form");
//           },
//           interaction: {
//             name: "Viewed Contact Us Page"
//           },
//           contentZones: [
//             { name: "contact_us_form", selector: "#contact-form" }
//           ],
//           listeners: [
//             SalesforceInteractions.listener("submit", "#contact-form", function () {
//               SalesforceInteractions.sendEvent({
//                 interaction: {
//                   name: "Contact Form Submitted"
//                 }
//               });
//             })
//           ]
//         },

//         // 7. TRACK ORDER PAGE
//         {
//           name: "track_order",
//           isMatch: function () {
//             var pageType = getDataLayerValue(["MCP", "pageType"]);
//             if (pageType === "TrackOrder") return true;
//             var path = (window.location.pathname || "").toLowerCase();
//             return path.indexOf("track-order") !== -1 || path.indexOf("track") !== -1 || !!document.getElementById("track-form");
//           },
//           interaction: {
//             name: "Viewed Track Order Page"
//           }
//         },

//         // 8. CONTENT & POLICY PAGES
//         {
//           name: "content",
//           isMatch: function () {
//             var pageType = getDataLayerValue(["MCP", "pageType"]);
//             if (pageType === "Content") return true;
//             var path = (window.location.pathname || "").toLowerCase();
//             return (
//               path.indexOf("about") !== -1 ||
//               path.indexOf("returns") !== -1 ||
//               path.indexOf("shipping-policy") !== -1 ||
//               path.indexOf("faqs") !== -1 ||
//               path.indexOf("terms") !== -1 ||
//               path.indexOf("privacy") !== -1 ||
//               path.indexOf("cancellation") !== -1
//             );
//           },
//           interaction: {
//             name: "Viewed Policy/Content Page"
//           }
//         }
//       ]
//     };

//     SalesforceInteractions.initSitemap(sitemapConfig);
//   });
// }
