const { expect } = require('@playwright/test')
const data= require('../data/booking.json');
const helper = require('../utils/helper')
const fs = require('fs')
require('dotenv').config();
let searchResults,filterCount,hotelName,selectedHotelName;
const outputDir='output/Booking.txt';

exports.BookingPage=class Booking{
    constructor(page){
        this.page=page;
        this.closeButton1=page.locator('//div[@id="onetrust-consent-sdk"]//following-sibling::div//child::button');
        this.closeButton2=page.locator('iframe[title="Sign in with Google Dialogue"]').contentFrame().getByLabel('Close');
        this.bookingLogo=page.locator('//a[@data-testid="header-booking-logo"]');
        this.navBarItems=page.locator('//nav[@data-testid="header-xpb"]//li');
        this.searchBar=page.locator('//input[@id=":rh:"]');
        this.selectLocation=page.getByRole('button', { name: 'Paris Ile de France, France' });
        this.searchButton=page.locator('//span[contains(text(),"Search")]//parent::button');
        this.selectDate=page.locator('//button[@data-testid="searchbox-dates-container"]');
        this.getCheckInDate = (date) => page.locator(`//span[@aria-label='${date}']`);       
        this.getCheckOutDate = (formattedDate) => page.locator(`//span[@aria-label='${formattedDate}']`);
        this.occupancy=page.locator('//span[@data-testid="searchbox-form-button-icon"]');
        this.adults=page.locator('//input[@id="group_adults"]//parent::div//button[2]');
        this.children=page.locator('//input[@id="group_children"]//parent::div//button[2]');
        this.age='//select[@name="age"]';
        this.rooms=page.locator('//input[@id="no_rooms"]');
        this.searchButton=page.locator('//span[contains(text(),"Search")]//parent::button');
        this.searchResultsHeader=page.locator('//div[@id="basiclayout"]//parent::div//h1'); 
        this.searchResults=page.locator('//div[@data-testid="property-card-container"]'); 
        this.sortingButton=page.locator('//button[@data-testid="sorters-dropdown-trigger"]');
        this.filterSideBar=page.locator('(//div[@data-testid="filters-sidebar"])[1]');
        this.filter1=page.locator('//input[@id=":rq:"]');
        this.filter1ExpectedCount=page.locator('(//input[@id=":rq:"]//parent::div//span)[5]');
        this.filter2=page.locator('//input[@id=":r16:"]');
        this.filter2ExpectedCount=page.locator('(//input[@id=":r16:"]//parent::div//span)[5]');
        this.filter3=page.locator('//input[@id=":r1h:"]');
        this.filter3ExpectedCount=page.locator('(//input[@id=":r1h:"]//parent::div//span)[5]');
        this.searchResultHotel=page.locator('(//div[@data-testid="title"])[1]');
        this.selectedHotel='//div[@id="hp_hotel_name"]//h2';
    
    }
    async launchURL(){
        await this.page.goto(process.env.bookingURL);
        await this.closeButton1.waitFor({state:'visible',timeout:5000})
        const isVisible=await this.closeButton1.isVisible();
        if(isVisible){
            await this.closeButton1.click();
        }
    }
    async verifyTitleAndURL(){
        await helper.assertWithAllure("Validating the page to have url and title",async()=>{
            await expect(this.page).toHaveURL(data.url.home);
            await expect(this.page).toHaveTitle(data.title);
        });
        await helper.assertWithAllure("Validating the logo to be visible",async()=>{
            await expect(this.bookingLogo).toBeVisible();
        });
    }
    async searchForHotels(){
        await helper.assertWithAllure("Validating the searchbar not to hidden and editable",async()=>{
            await expect(this.searchBar).not.toBeHidden();
            await expect(this.searchBar).toBeEditable();
        });
        await helper.assertWithAllure("Filling the location input into the search bar",async()=>{
            await this.searchBar.fill(data.search.location);
            await this.selectLocation.click();
        });
        await helper.assertWithAllure("Picking the checkin and checkout dates",async()=>{
            let formattedCurrentDate = helper.getCurrentDate();
            let formattedCheckOutDate = helper.getCheckoutDate(data.search.numberOfDays);
            const currentDate=await this.getCheckInDate(formattedCurrentDate)
            await currentDate.click();
            const checkOutDate=await this.getCheckOutDate(formattedCheckOutDate)
            await checkOutDate.click();
        });
        await helper.assertWithAllure("Setting the adults and children count",async()=>{
            await this.occupancy.click();
            await this.adults.click();
            await this.children.click();
            await this.page.selectOption(this.age,{value:data.search.age});
            await this.searchButton.click();
        });
    }
    async applyFilter(filter,expectedCount){
        await helper.assertWithAllure("Apply filter and extract the count",async()=>{
            await filter.click();
            filterCount=await expectedCount.textContent();
            helper.logToFile(outputDir,`Expected count : ${filterCount}`);
        });
        await helper.assertWithAllure("Validating the visibility of the header and extract the search results",async()=>{
            await expect(this.searchResultsHeader).not.toBeHidden();
            searchResults=await this.searchResultsHeader.textContent();
            searchResults=searchResults.replace(",","");
            helper.logToFile(outputDir,`Search results : ${searchResults}`);
        });
        await helper.assertWithAllure("Validating the search results to match the filter count",async()=>{
            expect(searchResults).toContain(filterCount);
        });
    }
    async filterSeachResults(){
        await helper.assertWithAllure("Retrieving text from the header",async()=>{
            fs.writeFileSync(outputDir,"Booking \n");
            searchResults=await this.searchResultsHeader.textContent();
            helper.logToFile(outputDir,`Total search results on this location : ${searchResults}`);
        });
        await helper.assertWithAllure("Validating the header to contain location name",async()=>{
            await expect(this.searchResultsHeader).toContainText(data.search.location);
        });
        await helper.assertWithAllure("Validating the visibility of the filter bar",async()=>{
            await expect(this.filterSideBar).toBeVisible();
        });
        await helper.assertWithAllure("Applying different filters and verifying",async()=>{
            await this.applyFilter(this.filter1,this.filter1ExpectedCount);
            await this.applyFilter(this.filter2,this.filter2ExpectedCount);
        });
    }
    async selectAnAccommodation(){
        await helper.assertWithAllure("Selecting a hotel from the search results and extracting hotel name",async()=>{
            hotelName=await this.searchResultHotel.textContent();
            helper.logToFile(outputDir,`Hotel name from search results :${hotelName}`);
            await this.searchResultHotel.click();
            
        });
        await helper.assertWithAllure("Verifying the hotel name from selected",async()=>{
            const [tabPromise]=await Promise.all([
                this.page.waitForEvent('popup')
            ]);
            const newTab=await tabPromise;
            selectedHotelName=await newTab.locator(this.selectedHotel).textContent();
            helper.logToFile(outputDir,`Selected Hotel name :${selectedHotelName}`);
            expect(hotelName).toEqual(selectedHotelName);
        });
    }

}