const { $, browser } = require("@wdio/globals");
const data = require('../../data/booking.json');
const { expect } = require('chai')
const helper = require('../../utils/helper')
require('dotenv').config();
const fs = require('fs')
const outputDir='output/Booking.txt'
let searchResults,selectedHotelName,hotelName;

class BookingPage {
    get closeButton1(){
        return $('//div[@id="onetrust-consent-sdk"]//following-sibling::div//child::button');
    }
    get closeButton2(){
        return $('iframe[title="Sign in with Google Dialogue"]').contentFrame().getByLabel('Close');
    }
    get bookingLogo(){
        return $('//a[@data-testid="header-booking-logo"]');
    }
    get navBarItems(){
        return $('//nav[@data-testid="header-xpb"]//li');
    }
    get searchBar(){
        return $('//input[@id=":rh:"]');
    }
    get selectLocation(){
        return $('(//div[@data-testid="autocomplete-results-options"]//div[contains(text(),"Paris")])[1]');
    }
    get searchButton(){
        return $('//span[contains(text(),"Search")]//parent::button');
    }
    get selectDate(){
        return $('//button[@data-testid="searchbox-dates-container"]');
    }
    get bookingDates(){
        return (date)=>$(`//span[@aria-label='${date}']`); 
    }
    get occupancy(){
        return $('//span[@data-testid="searchbox-form-button-icon"]');
    }
    get adults(){
        return $('//input[@id="group_adults"]//parent::div//button[2]');
    }
    get children(){
        return $('//input[@id="group_children"]//parent::div//button[2]');
    }
    get age(){
        return $('//select[@name="age"]');
    }
    get rooms(){
        return $('//input[@id="no_rooms"]');
    }
    get searchButton(){
        return $('//span[contains(text(),"Search")]//parent::button');
    }
    get searchResultsHeader(){
        return $('//div[@id="basiclayout"]//parent::div//h1');
    }
    get searchResults(){
        return $('//div[@data-testid="property-card-container"]');
    }
    get sortingButton(){
        return $('//button[@data-testid="sorters-dropdown-trigger"]');
    }
    get filterSideBar(){
        return $('(//div[@data-testid="filters-sidebar"])[1]');
    }
    get filter1(){
        return $('//input[@id=":rq:"]');
    }
    get filter1ExpectedCount(){
        return $('(//input[@id=":rq:"]//parent::div//span)[5]');
    }
    get filter2(){
        return $('//input[@id=":r16:"]');
    }
    get filter2ExpectedCount(){
        return $('(//input[@id=":r16:"]//parent::div//span)[5]');
    }
    get filter3(){
        return $('//input[@id=":r1h:"]');
    }
    get filter3ExpectedCount(){
        return $('(//input[@id=":r1h:"]//parent::div//span)[5]');
    }
    get searchResultHotel(){
         return $('(//div[@data-testid="title"])[1]');
    }
    get selectedHotel(){
       return '//div[@id="hp_hotel_name"]//h2'
    }

    async launchURL(){
        await browser.url(process.env.bookingURL);
    }
    async handlePopups(){
        helper.assertWithAllure("Handlind popups",async()=>{
            await this.closeButton1.waitForDisplayed();
            const isDisplayed=await this.closeButton1.isDisplayed();
            if(isDisplayed){
                await this.closeButton1.click();
            }
        });
    }
    async verifyTitleAndUrl(){
        await helper.assertWithAllure("Validating the page to have url and title",async()=>{
            const url=await browser.getUrl();
            expect(url).to.equal(data.url.home);
            const title=await browser.getTitle()
            expect(title).to.contain(data.title);
            fs.writeFileSync(outputDir,title)
        });
    }
    async fillTheInputs(){
        await helper.assertWithAllure("Validating the searchbar not to hidden and editable",async()=>{
            const isDisplayed=await this.searchBar.isDisplayed();
            expect(isDisplayed).to.be.true;
            const isEnabled=await this.searchBar.isEnabled();
            expect(isEnabled).to.be.true;
        });
        await helper.assertWithAllure("Filling the location input into the search bar",async()=>{
            await this.searchBar.setValue(data.search.location);
            await this.selectLocation.click();
        });
        await helper.assertWithAllure("Picking the checkin and checkout dates",async()=>{
            let formattedCurrentDate = helper.getCurrentDate();
            let formattedCheckOutDate = helper.getCheckoutDate(data.search.numberOfDays);
            helper.logToFile(outputDir,`Checkin date : ${formattedCurrentDate}`);
            helper.logToFile(outputDir,`Checkout date : ${formattedCheckOutDate}`)
            const currentDate=await this.bookingDates(formattedCurrentDate);
            await currentDate.click();
            const checkOutDate=await this.bookingDates(formattedCheckOutDate);
            await checkOutDate.click();
        });
        await helper.assertWithAllure("Setting the adults and children count",async()=>{
            await this.occupancy.click();
            await this.adults.click();
            await this.children.click();
            await this.age.selectByAttribute('value',data.search.childAge);
            await this.searchButton.click();
        });
        
    }
    async clickSearch(){
        await this.searchButton.isEnabled();
        await this.searchButton.click();
    }
    async verifySearchResults(){
        helper.assertWithAllure("Validating the visibility of the header and asserting to contain Location name",async()=>{
            await this.searchResultsHeader.isDisplayed();
            searchResults=await this.searchResultsHeader.getText();
            expect(searchResults).to.contain(data.search.location);
            await this.sortingButton.isClickable();
        });
        
    }
    async selectFilter(filter){
        await helper.assertWithAllure("Applying any filter by clicking the checkbox",async()=>{
            await this.filterSideBar.isDisplayed();
            await filter.click();
        });
    }
    async verifyResultCount(expectedCount){
        await helper.assertWithAllure("Extracting the expected count",async()=>{
            await browser.pause(parseInt(process.env.smallTimeout));
            const filterCount=await expectedCount.getText();
            helper.logToFile(outputDir,`Expected count : ${filterCount}`);
        });
        await helper.assertWithAllure("Extracting the search results from the header",async()=>{
            searchResults=await this.searchResultsHeader.getText();
            searchResults=searchResults.replace(",","");
            helper.logToFile(outputDir,`Search results : ${searchResults}`);
        });
        await helper.assertWithAllure("Validating the search results to match the filter count",async()=>{
            expect(searchResults).to.contain(filterCount);
        });
    }
    async applyFilter(){
            await this.selectFilter(this.filter1); 
    }

    async verifySearchResultsCount(){
        await this.verifyResultCount(this.filter1ExpectedCount);
        await this.selectFilter(this.filter2);
        await this.verifyResultCount(this.filter2ExpectedCount);
    }
    async selectAccommodation(){
        await helper.assertWithAllure("Selecting a hotel from the search results and extracting hotel name",async()=>{
            hotelName=await this.searchResultHotel.getText();
            await this.searchResultHotel.click();
        });
    }
    async verifyHotelName(){
        await helper.assertWithAllure("Verifying the hotel name from selected",async()=>{
            const windowHandles=await browser.getWindowHandles();
            const newTab=windowHandles[1];
            await browser.switchToWindow(newTab);
            selectedHotelName=await browser.$('//div[@id="hp_hotel_name"]//h2').getText();
            helper.logToFile(outputDir,`Hotel name from search results :${hotelName}`);
            helper.logToFile(outputDir,`Selected Hotel name :${selectedHotelName}`);
            expect(hotelName).to.be.equal(selectedHotelName);
        });
    }

}
module.exports = new BookingPage();
