const { test } = require('@playwright/test')
const indexPage = require('../utils/index.page')

test.describe("Automation Of Testim application",()=>{
    let testimHomePage;
    test.beforeEach("Launch the application",async({page})=>{
        testimHomePage=new indexPage.TestimPage(page);
        await testimHomePage.launchURL();
    });
    test("Validate the elements",async()=>{
        await testimHomePage.verifyHomePage();
        await testimHomePage.navigateToCompanySection();
        await testimHomePage.navigateToCustomersSection();
        await testimHomePage.validateStoredReview();
        await testimHomePage.validateFooterComponents();
    })
  
    
})