const { test } = require("@playwright/test");
const indexPage  = require('../utils/index.page') 

        
test.describe("Automation Of Youtube application",()=>{
    let youtubePage;
    test.beforeEach("Launch the YouTube application",async({page})=>{
        youtubePage=new indexPage.YoutubePage(page);
        await youtubePage.launchURL();
    });
    test("verify and validating the search results count",async()=>{
        await youtubePage.verifyTitleAndURL();
        await youtubePage.dynamicQueryHandling();
        await youtubePage.clickOnVideo();
        await youtubePage.interactWithVideoControls();
    });
    
})