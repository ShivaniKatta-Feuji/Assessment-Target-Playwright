const { test } = require('@playwright/test')
const indexPage = require('../utils/indexPage')

test.describe("Automation Of Target application",()=>{
    let targetHomePage;
    test.beforeEach("Launch the application",async({page})=>{
        targetHomePage=new indexPage.TargetHomePage(page);
        await targetHomePage.launchURL();
    });
    test("Validate search and select watch",async()=>{
        await targetHomePage.searchForWatches();
        await targetHomePage.selectWatch();
        await targetHomePage.validateDiscount();
    });
    test.only("Discount calculation",()=>{
        const actualPrice="$450";
        const offerPrice="$337";

        const intActualPrice=Number(actualPrice.substring(1));
        const intOfferPrice=Number(offerPrice.substring(1));

        console.log("Discount : ",intActualPrice-intOfferPrice);
    })
})