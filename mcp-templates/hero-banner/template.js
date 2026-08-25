(function () {
  "use strict";

  let hasSentImpression = false;
  let currentContext = null;

  function sendCampaignStatEvent(statType, context, isControl = false) {
    if (statType === "Impression") {
      if (hasSentImpression) return;
      hasSentImpression = true;
    }

    if (typeof SalesforceInteractions !== "undefined" && SalesforceInteractions.mcis && SalesforceInteractions.mcis.sendStat) {
      SalesforceInteractions.mcis.sendStat({
        campaignStats: [
          {
            experienceId: `${context.experience}`,
            stat: statType,
            control: isControl
          }
        ]
      });
    }

    console.log(`[MCP STAT] ${statType} sent | control: ${isControl}`);
  }

  /**
   * DPauls Category & Destination Configs (Mapped with MCP Catalog Categories & Travel Products)
   */
  function getCategoryConfig(categoryId) {
    const origin = (window.location && window.location.origin) || "";
    const normalizedId = String(categoryId || "").toLowerCase().trim();

    const configs = {
      // 1. Himachal Pradesh (Shimla, Manali, Dharamshala, Dalhousie)
      "himachal": {
        url: "packages.html?dest=Himachal",
        title: "Himachal Tour Packages - Shimla & Manali",
        price: "₹ 8,499/-",
        image: "assets/images/shimla__2_.jpg"
      },
      "himachal packages": {
        url: "packages.html?dest=Himachal",
        title: "Himachal Tour Packages - Shimla & Manali",
        price: "₹ 8,499/-",
        image: "assets/images/shimla__2_.jpg"
      },

      // 2. Goa Beach & Resort
      "goa": {
        url: "packages.html?dest=Goa",
        title: "Goa Resort & Beach Getaway",
        price: "₹ 15,999/-",
        image: "assets/images/Goa-15999-package-image.jpg"
      },
      "goa packages": {
        url: "packages.html?dest=Goa",
        title: "Goa Resort & Beach Getaway",
        price: "₹ 15,999/-",
        image: "assets/images/Goa-15999-package-image.jpg"
      },

      // 3. Europe & Switzerland
      "europe": {
        url: "packages.html?dest=Europe",
        title: "Grand Europe 6-Country Tour",
        price: "₹ 1,64,999/-",
        image: "assets/images/Europe-164999.jpg"
      },
      "europe packages": {
        url: "packages.html?dest=Europe",
        title: "Grand Europe 6-Country Tour",
        price: "₹ 1,64,999/-",
        image: "assets/images/Europe-164999.jpg"
      },

      // 4. Dubai & UAE
      "dubai": {
        url: "packages.html?dest=Dubai",
        title: "Dazzling Dubai Desert & Marina",
        price: "₹ 49,999/-",
        image: "assets/images/dubai-mall.jpg"
      },
      "dubai packages": {
        url: "packages.html?dest=Dubai",
        title: "Dazzling Dubai Desert & Marina",
        price: "₹ 49,999/-",
        image: "assets/images/dubai-mall.jpg"
      },

      // 5. Thailand (Bangkok, Pattaya, Phuket, Krabi)
      "thailand": {
        url: "packages.html?dest=Thailand",
        title: "Thailand Holiday Extravaganza",
        price: "₹ 40,999/-",
        image: "assets/images/Thailand-40999.jpg"
      },
      "thailand packages": {
        url: "packages.html?dest=Thailand",
        title: "Thailand Holiday Extravaganza",
        price: "₹ 40,999/-",
        image: "assets/images/Thailand-40999.jpg"
      },

      // 6. Singapore
      "singapore": {
        url: "packages.html?dest=Singapore",
        title: "Spectacular Singapore & Sentosa",
        price: "₹ 63,999/-",
        image: "assets/images/singapore.jpg"
      },
      "singapore packages": {
        url: "packages.html?dest=Singapore",
        title: "Spectacular Singapore & Sentosa",
        price: "₹ 63,999/-",
        image: "assets/images/singapore.jpg"
      },

      // 7. Japan & Korea
      "japan": {
        url: "packages.html?dest=Japan",
        title: "Amazing Japan Vacation",
        price: "₹ 2,18,999/-",
        image: "assets/images/amazing-japan-218999.jpg"
      },
      "japan packages": {
        url: "packages.html?dest=Japan",
        title: "Amazing Japan Vacation",
        price: "₹ 2,18,999/-",
        image: "assets/images/amazing-japan-218999.jpg"
      },
      "korea": {
        url: "packages.html?dest=Korea",
        title: "Korea Tourism Special",
        price: "₹ 1,29,999/-",
        image: "assets/images/korea-web-banner-129999.jpg"
      },

      // 8. Malaysia
      "malaysia": {
        url: "packages.html?dest=Malaysia",
        title: "Malaysia Tourism Spectacular",
        price: "₹ 42,999/-",
        image: "assets/images/MT26-web-banner.jpg"
      },

      // 9. Kashmir (Srinagar, Gulmarg, Pahalgam)
      "kashmir": {
        url: "packages.html?dest=Kashmir",
        title: "Srinagar Dal Lake & Gulmarg Snow Magic",
        price: "₹ 21,999/-",
        image: "assets/images/kashmir-package-srinagar.jpg"
      },

      // 10. Kerala (Munnar, Alleppey, Thekkady)
      "kerala": {
        url: "packages.html?dest=Kerala",
        title: "Munnar Tea Hills & Alleppey Houseboat",
        price: "₹ 19,499/-",
        image: "assets/images/kerala-package-alleppey.jpg"
      },

      // 11. Rajasthan (Jaipur, Udaipur, Jodhpur, Jaisalmer)
      "rajasthan": {
        url: "packages.html?dest=Rajasthan",
        title: "Royal Heritage Jaipur & Udaipur Tour",
        price: "₹ 14,499/-",
        image: "assets/images/rajasthan-jaipur-deal.jpg"
      },

      // 12. Andaman Islands
      "andaman": {
        url: "packages.html?dest=Andaman",
        title: "Andaman Emerald Islands & Radhanagar Beach",
        price: "₹ 45,999/-",
        image: "assets/images/andaman.jpg"
      },

      // 13. South Africa
      "south africa": {
        url: "packages.html?dest=South%20Africa",
        title: "South Africa Safari & Cape Town Escape",
        price: "₹ 2,44,999/-",
        image: "assets/images/south-africa-cape-town.jpg"
      },

      // 14. Bali & Indonesia
      "bali": {
        url: "packages.html?dest=Bali",
        title: "Tropical Bali Beaches & Private Villas",
        price: "₹ 54,999/-",
        image: "assets/images/bali-holiday-package.jpg"
      },

      // 15. Vietnam
      "vietnam": {
        url: "packages.html?dest=Vietnam",
        title: "Scenic Vietnam & Ha Long Bay Cruise",
        price: "₹ 58,999/-",
        image: "assets/images/vietnam-deal-package.jpg"
      },

      // 16. Disney & Theme Parks
      "disney": {
        url: "disney.html",
        title: "Disney Adventure Cruise & Disneyland Tour Packages",
        price: "₹ 78,999/-",
        image: "assets/images/disney-adventure-cruise-web-banner.jpg"
      },
      "disney packages": {
        url: "disney.html",
        title: "Disney Adventure Cruise & Disneyland Tour Packages",
        price: "₹ 78,999/-",
        image: "assets/images/disney-adventure-cruise-web-banner.jpg"
      },

      // 17. Flights
      "flights": {
        url: "flights.html",
        title: "Zero Convenience Fee Flight Booking",
        price: "Save Extra on Flights",
        image: "assets/images/zero-convenience-fee.jpg"
      },

      // 18. Hotels
      "hotels": {
        url: "hotels.html",
        title: "Handpicked Premium Hotels & Luxury Resorts",
        price: "Best Price Guarantee",
        image: "assets/images/winter-holiday-1.jpg"
      },

      // 19. Bus Booking
      "bus": {
        url: "bus.html",
        title: "Volvo AC Multi-Axle & Sleeper Bus Booking",
        price: "Starting ₹799/-",
        image: "assets/images/winter-holiday-1.jpg"
      },
      "bus booking": {
        url: "bus.html",
        title: "Volvo AC Multi-Axle & Sleeper Bus Booking",
        price: "Starting ₹799/-",
        image: "assets/images/winter-holiday-1.jpg"
      },

      // 20. Cruise
      "cruise": {
        url: "cruise.html",
        title: "Disney, Cordelia & Royal Caribbean Cruises",
        price: "Starting ₹29,999/-",
        image: "assets/images/disney-adventure-cruise-web-banner.jpg"
      },
      "cruise packages": {
        url: "cruise.html",
        title: "Disney, Cordelia & Royal Caribbean Cruises",
        price: "Starting ₹29,999/-",
        image: "assets/images/disney-adventure-cruise-web-banner.jpg"
      },

      // 21. Forex (Foreign Exchange)
      "forex": {
        url: "forex.html",
        title: "Best Forex Currency Exchange Rates",
        price: "Best Price Guarantee",
        image: "assets/images/send-money-abroad-banner.jpg"
      },
      "foreign exchange (forex)": {
        url: "forex.html",
        title: "Best Forex Currency Exchange Rates",
        price: "Best Price Guarantee",
        image: "assets/images/send-money-abroad-banner.jpg"
      },

      // 22. International eSIM
      "esim": {
        url: "esim.html",
        title: "Instant High-Speed Global 5G eSIM",
        price: "Starting ₹799/-",
        image: "assets/images/winter-holiday-1.jpg"
      },
      "international esim": {
        url: "esim.html",
        title: "Instant High-Speed Global 5G eSIM",
        price: "Starting ₹799/-",
        image: "assets/images/winter-holiday-1.jpg"
      },

      // 23. Deals & Flash Offers
      "deals": {
        url: "deals.html",
        title: "Exclusive Summer & Festive Travel Deals",
        price: "Up to 40% OFF",
        image: "assets/images/winter-holiday-1.jpg"
      },
      "travel deals": {
        url: "deals.html",
        title: "Exclusive Summer & Festive Travel Deals",
        price: "Up to 40% OFF",
        image: "assets/images/winter-holiday-1.jpg"
      },

      // 24. Dekho My India / Domestic
      "domestic": {
        url: "packages.html?cat=domestic",
        title: "India Tour Packages - Dekho My India",
        price: "₹ 8,499/-",
        image: "assets/images/shimla__2_.jpg"
      },
      "dekho my india (domestic)": {
        url: "packages.html?cat=domestic",
        title: "India Tour Packages - Dekho My India",
        price: "₹ 8,499/-",
        image: "assets/images/shimla__2_.jpg"
      },

      // 25. International Tour Packages
      "international": {
        url: "packages.html?cat=international",
        title: "International Holiday Packages",
        price: "₹ 40,999/-",
        image: "assets/images/Europe-164999.jpg"
      },
      "international tour packages": {
        url: "packages.html?cat=international",
        title: "International Holiday Packages",
        price: "₹ 40,999/-",
        image: "assets/images/Europe-164999.jpg"
      }
    };

    // Find best match
    if (configs[normalizedId]) {
      return configs[normalizedId];
    }

    for (const key of Object.keys(configs)) {
      if (normalizedId.includes(key) || key.includes(normalizedId)) {
        return configs[key];
      }
    }

    // Default DPauls Signature Fallback
    return {
      url: "packages.html",
      title: "Handcrafted Holiday Tour Packages",
      price: "Best Price Guarantee",
      image: "assets/images/Europe-164999.jpg"
    };
  }

  function updateCarouselFirstSlide(context) {
    const items = context.viewedItemDetails || context.items;
    if (!items || items.length === 0) return;

    const category = items[0];
    const categoryId =
      category.id ||
      (category.attributes && category.attributes.name && category.attributes.name.value) ||
      category.name ||
      "Europe";

    const categoryConfig = getCategoryConfig(categoryId);

    // Image resolution
    let imageUrl =
      (category.attributes && category.attributes.Image && category.attributes.Image.value) ||
      (category.attributes && category.attributes.image && category.attributes.image.value) ||
      (category.attributes && category.attributes.imageUrl && category.attributes.imageUrl.value) ||
      (category.attributes && category.attributes.desktopImage && category.attributes.desktopImage.value) ||
      categoryConfig.image;

    if (imageUrl && !imageUrl.startsWith("http") && !imageUrl.startsWith("/") && !imageUrl.startsWith("assets")) {
      imageUrl = "assets/images/" + imageUrl;
    }

    const url =
      (category.attributes && category.attributes.url && category.attributes.url.value) ||
      (category.attributes && category.attributes.URL && category.attributes.URL.value) ||
      categoryConfig.url;

    const title =
      (category.attributes && category.attributes.heading && category.attributes.heading.value) ||
      categoryConfig.title;

    const price = categoryConfig.price;

    // Target the first slide/card in the existing Deals Carousel on the Home Page
    const firstSlide =
      document.querySelector("#deals-carousel-track .carousel-card:first-child") ||
      document.querySelector("#hero-slider-viewport .carousel-card:first-child") ||
      document.querySelector(".carousel-track .carousel-card:first-child");

    if (!firstSlide) {
      console.warn("[MCP HERO] First slide not found in DOM");
      return;
    }

    // Tag with MCP experience tracking attributes
    firstSlide.setAttribute("data-evg-campaign-id", context.campaign || "");
    firstSlide.setAttribute("data-evg-experience-id", context.experience || "");
    firstSlide.setAttribute("data-evg-user-group", context.userGroup || "");

    // Update the existing card using the site's already implemented classes and structure
    firstSlide.innerHTML = `
      <a href="${url}" id="mcp-hero-card-link" onclick="if(window.previewDeal){ window.previewDeal('${title.replace(/'/g, "\\'")}', '${price}'); }">
        <img src="${imageUrl}" alt="${title}">
      </a>
    `;

    console.log(`[MCP HERO] Hero banner personalized on existing class | Category: ${categoryId} | URL: ${url}`);

    // Attach clickthrough tracking
    const primaryBtn = firstSlide.querySelector("#mcp-hero-card-link");
    if (primaryBtn && !primaryBtn.dataset.mcpClickBound) {
      primaryBtn.addEventListener("click", () => {
        sendCampaignStatEvent("Clickthrough", currentContext, false);
      });
      primaryBtn.dataset.mcpClickBound = "true";
    }
  }

  function apply(context) {
    currentContext = context;

    const path = (window.location.pathname || "").toLowerCase();
    const isHomePage =
      path === "/" ||
      path === "" ||
      path.endsWith("/index.html") ||
      path.endsWith("/index") ||
      document.getElementById("deals-carousel-track") !== null ||
      document.getElementById("search-tabs-container") !== null;

    if (!isHomePage) {
      console.log("[MCP HERO] Not homepage, skipping. Path:", window.location.pathname);
      return Promise.resolve();
    }

    const contentZoneSelector =
      (context.contentZone && SalesforceInteractions.mcis && SalesforceInteractions.mcis.getContentZoneSelector(context.contentZone)) ||
      "#hero-slider-viewport";

    return SalesforceInteractions.DisplayUtils.pageElementLoaded(contentZoneSelector)
      .then(() => {
        if (context.viewedItemDetails && context.viewedItemDetails.length > 0) {
          updateCarouselFirstSlide(context);
        } else {
          console.warn("[MCP HERO] No viewedItemDetails in context");
        }

        sendCampaignStatEvent("Impression", context, false);
      })
      .catch((err) => {
        console.error("[MCP HERO] Failed to load hero banner:", err);
        return Promise.resolve();
      });
  }

  function reset() {
    hasSentImpression = false;
    currentContext = null;
  }

  function control(context) {
    const contentZoneSelector =
      (context.contentZone && SalesforceInteractions.mcis && SalesforceInteractions.mcis.getContentZoneSelector(context.contentZone)) ||
      "#hero-slider-viewport";

    return SalesforceInteractions.DisplayUtils.bind(`${context.campaign}:${context.experience}`)
      .pageElementLoaded(contentZoneSelector)
      .then((element) => {
        sendCampaignStatEvent("Impression", context, true);

        SalesforceInteractions.cashDom(element).attr({
          "data-evg-campaign-id": context.campaign,
          "data-evg-experience-id": context.experience,
          "data-evg-user-group": context.userGroup
        });
      });
  }

  registerTemplate({
    apply,
    reset,
    control
  });
})();
