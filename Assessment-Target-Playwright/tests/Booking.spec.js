const { test } = require('@playwright/test')
const indexPage  = require('../utils/index.page') 

test.describe("Booking Application Automation",()=>{
    let bookingPage;
    test.beforeEach("Launch the URL",async({page})=>{
        bookingPage=new indexPage.BookingPage(page);
        await bookingPage.launchURL();
    })
    test("Validating search input and filtering search results",async()=>{
        await bookingPage.verifyTitleAndURL();
        await bookingPage.searchForHotels();
        await bookingPage.filterSeachResults();
        await bookingPage.selectAnAccommodation();
    })
})