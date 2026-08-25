(function () {

    const STORAGE_KEY = "evg_exit_intent_shown";

    function buildBindId(context) {
        return `${context.campaign}:${context.experience}`;
    }

    function sendCampaignStat(context, statType, isControl = false) {
        try {
            if (typeof SalesforceInteractions !== "undefined" && SalesforceInteractions.mcis && SalesforceInteractions.mcis.sendStat) {
                SalesforceInteractions.mcis.sendStat({
                    campaignStats: [{
                        experienceId: context.experience,
                        stat: statType,
                        control: isControl
                    }]
                });
            }
        } catch (e) {
            console.warn("[EVG] sendStat error:", e);
        }
    }

    function copyCouponCode(code) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(code).then(() => true).catch(() => false);
        }
        const el = document.createElement("textarea");
        el.value = code;
        el.style.cssText = "position:fixed;left:-9999px;top:-9999px;opacity:0;";
        document.body.appendChild(el);
        el.focus();
        el.select();
        try {
            document.execCommand("copy");
            document.body.removeChild(el);
            return Promise.resolve(true);
        } catch (e) {
            document.body.removeChild(el);
            return Promise.resolve(false);
        }
    }

    function closePopup(context, statType) {
        if (statType) {
            sendCampaignStat(context, statType, false);
        }
        try {
            sessionStorage.setItem(STORAGE_KEY, "true");
        } catch (e) {}

        const popup = document.getElementById("evg-exit-intent-popup");
        if (popup) {
            popup.style.transition = "opacity 0.22s ease, transform 0.22s ease";
            popup.style.opacity = "0";
            popup.style.pointerEvents = "none";
            setTimeout(function () {
                if (popup && popup.parentNode) {
                    popup.parentNode.removeChild(popup);
                }
            }, 230);
        }

        if (typeof SalesforceInteractions !== "undefined" && SalesforceInteractions.cashDom) {
            try {
                SalesforceInteractions.cashDom("#evg-exit-intent-popup").remove();
            } catch (e) {}
        }
    }

    function setDismissal(context) {
        const dismissSelectors = `
            #evg-exit-intent-popup .evg-overlay,
            #evg-exit-intent-popup .evg-btn-dismissal,
            #evg-exit-intent-popup .evg-dismiss-text,
            #evg-exit-intent-popup [data-evg-dismissal]
        `;

        // 1. Salesforce cashDom binding
        if (typeof SalesforceInteractions !== "undefined" && SalesforceInteractions.cashDom) {
            SalesforceInteractions.cashDom(dismissSelectors).on("click", function (e) {
                if (e && e.preventDefault) e.preventDefault();
                if (e && e.stopPropagation) e.stopPropagation();
                closePopup(context, "Dismissal");
            });
        }

        // 2. Native DOM binding fallback to ensure cross & no-thanks always work
        const popup = document.getElementById("evg-exit-intent-popup");
        if (popup) {
            const dismissElements = popup.querySelectorAll(".evg-overlay, .evg-btn-dismissal, .evg-dismiss-text, [data-evg-dismissal], #evg-close-btn, #evg-dismiss-text-btn");
            dismissElements.forEach(function (el) {
                el.addEventListener("click", function (e) {
                    if (e && e.preventDefault) e.preventDefault();
                    if (e && e.stopPropagation) e.stopPropagation();
                    closePopup(context, "Dismissal");
                });
            });
        }

        // 3. Escape key dismissal
        function onEscKey(e) {
            if (e.key === "Escape" || e.keyCode === 27) {
                closePopup(context, "Dismissal");
                document.removeEventListener("keydown", onEscKey);
            }
        }
        document.addEventListener("keydown", onEscKey);
    }

    function showPopup(context, template) {
        if (document.querySelector("#evg-exit-intent-popup")) return;

        // Fallback default image for DPauls
        if (!context.imageUrl) {
            context.imageUrl = "assets/images/winter-holiday-1.jpg";
        }

        const html = template(context);
        if (typeof SalesforceInteractions !== "undefined" && SalesforceInteractions.cashDom) {
            SalesforceInteractions.cashDom("body").append(html);
        } else {
            const div = document.createElement("div");
            div.innerHTML = html;
            document.body.appendChild(div.firstElementChild || div);
        }

        sendCampaignStat(context, "Impression", false);
        setDismissal(context);

        const couponCode = context.couponCode || "DPAULS2500";

        // Copy button handler with interactive visual feedback
        const copyBtn = document.getElementById("evg-copy-btn");
        if (copyBtn) {
            copyBtn.addEventListener("click", function (e) {
                if (e && e.preventDefault) e.preventDefault();
                copyCouponCode(couponCode).then(function () {
                    const originalHtml = copyBtn.innerHTML;
                    copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Copied!</span>';
                    copyBtn.classList.add("copied");

                    setTimeout(function () {
                        copyBtn.innerHTML = originalHtml;
                        copyBtn.classList.remove("copied");
                    }, 2500);

                    if (typeof SalesforceInteractions !== "undefined" && SalesforceInteractions.sendEvent) {
                        SalesforceInteractions.sendEvent({
                            interaction: {
                                name: "Exit Intent Coupon Code Copied"
                            },
                            user: {
                                attributes: {
                                    lastCopiedCoupon: couponCode
                                }
                            }
                        }).catch(function (err) { console.error("[EVG] copy-btn sendEvent failed:", err); });
                    }
                });
            });
        }

        // Continue / CTA button handler
        const continueBtn = document.getElementById("evg-continue-btn");
        if (continueBtn) {
            continueBtn.addEventListener("click", function (e) {
                if (e && e.preventDefault) e.preventDefault();
                sendCampaignStat(context, "Clickthrough", false);
                if (typeof SalesforceInteractions !== "undefined" && SalesforceInteractions.sendEvent) {
                    SalesforceInteractions.sendEvent({
                        interaction: { name: "Exit Intent Coupon Claimed" },
                        user: { attributes: { returningUser: true } }
                    }).catch(function (err) { console.error("[EVG] sendEvent failed:", err); });
                }
                closePopup(context, null);

                if (context.targetUrl && context.targetUrl.trim() !== "") {
                    window.location.href = context.targetUrl;
                }
            });
        }
    }

    function apply(context, template) {
        if (sessionStorage.getItem(STORAGE_KEY)) return;

        let triggered = false;

        function trigger() {
            if (triggered) return;
            if (document.body.classList.contains("evg-body-lock")) return;
            if (document.querySelector("#evg-welcome-popup")) return;
            if (document.querySelector("#evg-returning-user")) return;
            if (document.querySelector("#evg-reward-template")) return;
            triggered = true;
            showPopup(context, template);
        }

        // Desktop mouseout trigger
        if (window.innerWidth > 768) {
            let leaveTimer = null;
            document.addEventListener("mouseleave", function (e) {
                if (e.clientY <= 0) {
                    leaveTimer = setTimeout(function () { trigger(); }, 300);
                }
            });
            document.addEventListener("mouseenter", function () {
                if (leaveTimer) {
                    clearTimeout(leaveTimer);
                    leaveTimer = null;
                }
            });
        }

        // Mobile scroll depth trigger
        if (window.innerWidth <= 768) {
            const scrollThreshold = (context.scrollPercent || 40) / 100;
            if (SalesforceInteractions.DisplayUtils && SalesforceInteractions.DisplayUtils.pageScroll) {
                SalesforceInteractions.DisplayUtils
                    .pageScroll(scrollThreshold)
                    .then(function () { trigger(); });
            } else {
                window.addEventListener("scroll", function onMobileScroll() {
                    const scrollPos = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
                    if (scrollPos >= scrollThreshold) {
                        trigger();
                        window.removeEventListener("scroll", onMobileScroll);
                    }
                }, { passive: true });
            }
        }
    }

    function reset(context) {
        if (SalesforceInteractions.DisplayUtils && SalesforceInteractions.DisplayUtils.unbind) {
            SalesforceInteractions.DisplayUtils.unbind(buildBindId(context));
        }
        const popup = document.getElementById("evg-exit-intent-popup");
        if (popup && popup.parentNode) {
            popup.parentNode.removeChild(popup);
        }
        if (typeof SalesforceInteractions !== "undefined" && SalesforceInteractions.cashDom) {
            try {
                SalesforceInteractions.cashDom("#evg-exit-intent-popup").remove();
            } catch (e) {}
        }
    }

    function control(context) {
        if (context.contentZone) return true;
    }

    registerTemplate({
        apply: apply,
        reset: reset,
        control: control
    });

})();
