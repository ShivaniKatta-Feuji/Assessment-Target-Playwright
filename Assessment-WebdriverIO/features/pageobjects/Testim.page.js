const { $, browser } = require("@wdio/globals");
const data = require("../../data/testim.json");
const { expect } = require("chai");
const helper = require('../../utils/helper');
let review={};

require("dotenv").config();

class TestimPage  {

    get logo(){
        return $('//img[@alt="Tricentis Testim Logo"]');
    }
    get title(){
        return $('//h3[text()="Testim"]');
    }
    get login(){
        return $('//a[text()="Login"]');
    }
    get headerSections(){
        return (header)=>
            $(`//header[@id="header"]//a[text()='${header}']`);
    }
    get companySection(){
        return $('//a[text()="Company"]');
    }
    get companyListItems(){
        return $$('//a[text()="Company"]//following-sibling::div//li');
    }
    get customersPage(){
        return $('//li//span[text()="Customers"]');
    }
    get reviewHeader(){
        return $('//main[@id="main"]//h3[contains(text(),"people")]');
    }
    get reviewerName(){
        return $('(//div[@class="item-info"])[2]//child::div[@class="item-name"]');
    }
    get reviewTitle(){
        return $('(//div[@class="item-info"])[2]//child::div[@class="item-position"]');
    }
    get reviewContent(){
        return $('(//div[@class="item-body"])[2]//child::p');
    }
    get footerLogo(){
        return $('//img[@alt="testim footer logo"]');
    }
    get footerListItems(){
        return $$('//div[@class="f-bottom"]//child::div[2]//li');
    }
    get footerIcons(){
        return $$('//div[@class="p-footer-frame"]//div[@class="icon"]');
    }
    get footerSections(){
        return $$('//div[@class="p-footer-frame"]//h3');
    }

    async launchURL(){
        await browser.url(process.env.testimURL);
    }
    async validateHeaderComponents(){
        await helper.assertWithAllure("Validating the page to have title and url",async()=>{
            const url=await browser.getUrl(); 
            expect(url).to.contain(data.url.home);
            expect(await this.logo.isDisplayed()).to.be.true;
            expect(await this.title.getTitle()).to.equal(data.title);
        });
        await helper.assertWithAllure("Validating the visibility of header section elements",async()=>{
            for(let header of data.headers){
                const element=await this.headerSections(header);
                const isVisible=await element.isDisplayed();
                if(isVisible)
                    await element.click();
            }
        });
        await helper.assertWithAllure("Verifying the navigation to login",async()=>{ 
            expect(await this.login.isEnabled()).to.be.true;
            await this.login.click();
            await browser.pause(parseInt(process.env.smallTimeout));
            expect(await browser.getUrl()).to.equal(data.url.signIn);
            await browser.back();
        });
    }
    async clickOnCompany(){
        await this.companySection.click();
    }
    async validateSubSections(){
        await helper.assertWithAllure("Validating the visibility of sub sections of Company",async()=>{
            const subsections=await this.companyListItems;
            const count=subsections.length;
            helper.verifyListItems(this.companyListItems,count);
        });
    }
    async navigateToCustomers(){
        await helper.assertWithAllure("Navigating to customer page and performing scroll",async()=>{
            await this.customersPage.click();
            await browser.pause(parseInt(process.env.smallTimeout));
            await this.reviewHeader.scrollIntoView();
        });
        await helper.assertWithAllure("Validating the review to be displayed",async()=>{
            expect(await this.reviewHeader.isDisplayed()).to.be.true;
        });
    }
    async storeReview(){
        await helper.assertWithAllure("Retrieving the content from review and strong into json",async()=>{
            const reviewerName=await this.reviewerName.getText();
            const reviewTitle=await this.reviewTitle.getText();
            const reviewContent=await this.reviewContent.getText();
            
            review={
                "name": reviewerName,
                "title":reviewTitle,
                "content":reviewContent
            }
        });
    }
    async validateStoredReview(){
        await helper.assertWithAllure("Validating the review content to match with stored json",async()=>{
            expect(await this.reviewerName.getText()).to.be.equal(review.name);
            expect(await this.reviewTitle.getText()).to.be.equal(review.title);
            expect(await this.reviewContent.getText()).to.be.equal(review.content);
        });
    }
    async scrollToFooter(){
        await helper.assertWithAllure("Scroll to footer and verify logo visibility",async()=>{
            await this.footerLogo.scrollIntoView();
            expect(await this.footerLogo.isDisplayed()).to.be.true;
        });
    }
    async validateFooterComponents(){
        await helper.assertWithAllure("Validating the visibility of footer section elements",async()=>{
            const footers=await this.footerSections;
            const sectionsCount=footers.length;
            helper.verifyListItems(this.footerSections,sectionsCount);
        });
        await helper.assertWithAllure("Validating the visibility of footer icons",async()=>{
            const iconsCount=await this.footerIcons.length;
            helper.verifyListItems(this.footerIcons,iconsCount);
        });
        await helper.assertWithAllure("Validating the visibility of footer articles",async()=>{
            const count=await this.footerListItems.length;
            helper.verifyListItems(this.footerListItems,count);
        });
    }

}
module.exports= new TestimPage();