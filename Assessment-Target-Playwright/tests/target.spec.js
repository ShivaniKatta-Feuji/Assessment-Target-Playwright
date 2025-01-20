const { test } = require('@playwright/test')
const indexPage = require('../utils/index.page')

test.describe("Automation Of Target application",()=>{
    let targetHomePage;
    test.beforeEach("Launch the application",async({page})=>{
        targetHomePage=new indexPage.TargetPage(page);
        await targetHomePage.launchURL();
    });
    test("Validate search and select watch",async()=>{
        await targetHomePage.searchForWatches();
        await targetHomePage.selectWatch();
        await targetHomePage.validateDiscount();
    });
    
})