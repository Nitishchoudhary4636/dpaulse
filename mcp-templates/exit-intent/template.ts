// template.ts
export class ExitIntentPopupTemplate implements CampaignTemplateComponent {

    @title("Background Image URL")
    @subtitle("Hero travel destination image for popup banner (e.g. assets/images/winter-holiday-1.jpg)")
    imageUrl: string = "assets/images/winter-holiday-1.jpg";

    @richText(true)
    header: string = "Wait! Don't Miss Out!";

    @subtitle("Optional rich text subheading")
    @richText(true)
    subheader: string = "Get instant ₹2,500 OFF on your next holiday tour package or flight booking.";

    @title("CTA Button Text")
    ctaText: string = "CLAIM ₹2,500 DISCOUNT";

    @title("CTA Dismissal Text")
    ctaDismissialText: string = "No thanks, I'll pay full price";

    @title("Coupon Code")
    @subtitle("Special promo code shown in highlighted box with one-click copy button")
    couponCode: string = "DPAULS2500";

    @title("Destination Target URL (Optional)")
    targetUrl: string = "packages.html";

    @title("Scroll Depth (%) — Mobile only")
    scrollPercent: number = 40;

    run(context: CampaignComponentContext) {
        return {
            imageUrl:          this.imageUrl,
            header:            this.header,
            subheader:         this.subheader,
            ctaText:           this.ctaText,
            ctaDismissialText: this.ctaDismissialText,
            couponCode:        this.couponCode,
            targetUrl:         this.targetUrl,
            scrollPercent:     this.scrollPercent
        };
    }
}
