const { expect } = require('@playwright/test')
const data = require('../data/testim.json')
const helper = require('../utils/helper');
require('dotenv').config();
const fs = require('fs')

exports.TestimPage=class TestimPage{
    constructor(page){
        this.page=page;
        this.logo=page.locator('//img[@alt="Tricentis Testim Logo"]');
        this.title=page.locator('//h3[text()="Testim"]');
        this.navItems=page.locator('.has-drop');
        this.headerSections=(header)=>page.locator(`//header[@id="header"]//a[text()='${header}']`)
        this.login=page.locator('//a[text()="Login"]');
        this.productsSection=page.locator('//a[text()="Products"]');
        this.companySection=page.locator('//a[text()="Company"]');
        this.companyListItems=page.locator('//a[text()="Company"]//following-sibling::div//li');
        this.customersPage=page.locator('//li//span[text()="Customers"]');
        this.reviewHeader=page.locator('//main[@id="main"]//h3[contains(text(),"people")]');
        this.reviewerName=page.locator('(//div[@class="item-info"])[2]//child::div[@class="item-name"]');
        this.reviewTitle=page.locator('(//div[@class="item-info"])[2]//child::div[@class="item-position"]');
        this.reviewContent=page.locator('(//div[@class="item-body"])[2]//child::p');
        this.footerLogo=page.locator('//img[@alt="testim footer logo"]');
        this.footerListItems=page.locator('//div[@class="f-bottom"]//child::div[2]//li');
        this.footerIcons=page.locator('//div[@class="p-footer-frame"]//div[@class="icon"]');
        this.footerSections=page.locator('//div[@class="p-footer-frame"]//h3');
        this.review={};
    }
    async launchURL(){
        await this.page.goto(process.env.testimURL);
    }
    async verifyHomePage(){
        await helper.assertWithAllure("Validating the page to have url",async()=>{
            await expect(this.page).toHaveURL(data.url.home);
        });
        await helper.assertWithAllure("Validating the logo to be visible",async()=>{
            await expect(this.logo).toBeVisible();
        });
        await helper.assertWithAllure("Validating the title to have text",async()=>{
            await expect(this.title).toHaveText(data.title);
        });
        await helper.assertWithAllure("Validating the header sections to be visible and clickable",async()=>{
            const headerCount=await this.navItems.count();
            // await helper.verifyHeaderSections(this.navItems,headerCount);
            for(const header of data.headers){
                const element=await this.headerSections(header);
                const isVisible=await element.isVisible();
                if(isVisible){
                    await this.headerSections(header).click();
                }
            }
        });
        await helper.assertWithAllure("Validating the Login button to be enabled",async()=>{
            await expect(this.login).toBeEnabled();
            await this.login.click();
        });
        await helper.assertWithAllure("Validating the page to have url",async()=>{
            await expect(this.page).toHaveURL(data.url.signIn);
            await this.page.goBack();
        });
    }
    async navigateToCompanySection(){
        await helper.assertWithAllure("Validating the Company subsections to be visible",async()=>{
            await this.companySection.click();
            const count=await this.companyListItems.count();
            helper.verifyListItems(this.companyListItems,count);
        });
    }
    async navigateToCustomersSection(){
        await helper.assertWithAllure("Navigating to Customer section and applying scroll",async()=>{
            await this.customersPage.click();
            await this.page.waitForTimeout(parseInt(process.env.smallTimeout));
            await this.reviewHeader.scrollIntoViewIfNeeded();
        });
        await helper.assertWithAllure("Validating the header to be visible",async()=>{
            await expect(this.reviewHeader).toBeVisible();
        });
        await helper.assertWithAllure("Storing the review content into a json",async()=>{
            const reviewerName=await this.reviewerName.textContent();
            const reviewTitle=await this.reviewTitle.textContent();
            const reviewContent=await this.reviewContent.textContent();
            
            this.review={
                "name": reviewerName,
                "title":reviewTitle,
                "content":reviewContent
            }
        });
        
    }
    async validateStoredReview(){
        await helper.assertWithAllure("Validating the json to contain text",async()=>{
            await expect(this.reviewerName).toContainText(this.review.name);
            await expect(this.reviewTitle).toContainText(this.review.title);
            await expect(this.reviewContent).toContainText(this.review.content);
        });
    }
    async validateFooterComponents(){
        await helper.assertWithAllure("Validating the logo to be visible",async()=>{
            await this.footerLogo.scrollIntoViewIfNeeded();
            await expect(this.footerLogo).toBeVisible();
        });
        await helper.assertWithAllure("Validating the visibility of the footer section elements",async()=>{
            const sectionsCount=await this.footerSections.count();
            helper.verifyListItems(this.footerSections,sectionsCount);
            const iconsCount=await this.footerIcons.count();
            helper.verifyListItems(this.footerIcons,iconsCount);
            const count=await this.footerListItems.count();
            helper.verifyListItems(this.footerListItems,count);
        });
    }

}