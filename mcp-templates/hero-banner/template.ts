// template.ts
export class TopViewedCategory implements CampaignTemplateComponent {

    @title("Lookback Window (Days)")
    @subtitle("Number of days in the past to calculate user's top-viewed travel category/destination")
    lookback: number = 30;

    run(context: CampaignComponentContext) {

        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - this.lookback);

        const viewStats = context.user?.itemStatTotalPerItem({
            itemType: "Category",
            statType: "View",
            start: startDate,
            end: endDate
        }) || [];

        if (!viewStats.length) {
            return { viewedItemDetails: [] };
        }

        viewStats.sort((a, b) => b.value - a.value);

        const highestViewCount = viewStats[0].value;
        const topCategories = viewStats.filter(stat => stat.value === highestViewCount);

        let winningCategoryId = topCategories[0].itemId;

        if (topCategories.length > 1) {
            const viewTimeStats = context.user?.itemStatTotalPerItem({
                itemType: "Category",
                statType: "ViewTime",
                start: startDate,
                end: endDate
            }) || [];

            const topCategoriesWithViewTime = topCategories.map(category => {
                const matchingTime = viewTimeStats.find(v => v.itemId === category.itemId);
                return {
                    ...category,
                    viewTime: matchingTime ? matchingTime.value : 0
                };
            });

            topCategoriesWithViewTime.sort((a, b) => b.viewTime - a.viewTime);
            winningCategoryId = topCategoriesWithViewTime[0].itemId;
        }

        const winningCategory = context.services.catalog.findItem("Category", winningCategoryId);

        return {
            viewedItemDetails: winningCategory ? [winningCategory] : []
        };
    }
}
