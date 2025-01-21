const { expect } = require('@playwright/test')
const data = require('../data/target.json')
const helper = require('../utils/helper')
const fs = require('fs')
const outputDir='output/Target.txt'
require('dotenv').config();
let actualValue,offerValue,displayedDiscount,calculatedDiscount;

exports.TargetPage=class TargetPage{
    constructor(page){
        this.page=page;
        this.signIn=this.page.locator('//span[text()="Sign in"]');
        this.targetLogo=this.page.locator('(//div[@id="headerPrimary"]//child::a)[1]');
        this.categories=this.page.locator('//a[text()="Categories"]');
        this.clothingAccessories=this.page.locator('//span[text()="Clothing, Shoes & Accessories"]');
        this.accessories=this.page.locator('//span[text()="Accessories"]');
        this.watches=this.page.locator('//span[text()="Watches"]');
        this.searchBar=this.page.locator('#search');
        this.searchButton= this.page.locator('//button[text()="search"]');
        this.searchResults=this.page.locator("//span[text()='for “watches”']");
        this.wristWatches=this.page.locator('//span[text()="Wristwatches"]');
        this.selectedWatch=this.page.locator('(//div[@data-test="comparison-price"])[1]//parent::div//parent::div//parent::div//following-sibling::div//child::a[@data-test="product-title"]');
        this.watchTitle=this.page.locator('(//a[@data-test="product-title"])[2]//child::div');
        this.selectedWatchTitle=this.page.locator('#pdp-product-title-id');
        this.actualPrice=this.page.locator('//div[@data-test="@web/Price/PriceFull"]//child::span[@data-test="product-regular-price"]//child::span');
        this.offerPrice=this.page.locator('//div[@data-test="@web/Price/PriceFull"]//child::span[@data-test="product-price"]');
        this.details=this.page.locator('//div[@id="product-detail-tabs"]//child::button//h3[text()="Details"]');
        this.description=this.page.locator('//h3[text()="Description"]//parent::button//following-sibling::div');
        this.discount=this.page.locator('//span[@data-test="product-savings-amount"]');
    }
    async launchURL(){
        await this.page.goto(process.env.targetURL);
        await helper.assertWithAllure("Validating the page to have url",async()=>{
            await expect(this.page).toHaveURL(data.url.home);
        });
        await helper.assertWithAllure("Validating the logo and SignIn button to be visible",async()=>{
            await expect(this.targetLogo).toBeVisible();
            await expect(this.signIn).toBeVisible();
        });
    }

    async searchForWatches(){
        await helper.assertWithAllure("Validating the visibility of Search Bar",async()=>{
            await expect(this.searchBar).toBeVisible();
            await expect(this.searchBar).toBeEditable();
        });
        await helper.assertWithAllure("Navigating to watches from categories dropdown",async()=>{
            await this.categories.click();
            await this.clothingAccessories.click();
            await this.accessories.click();
            await this.watches.click();
        });
    }
    async selectWatch(){
        await helper.assertWithAllure("Validating the discount watch to be displayed",async()=>{
            const isVisible=await this.selectedWatch.isVisible();
            if(isVisible){
                await this.selectedWatch.click();
            }else{
                console.error("No Products found with discount offers");
                return;
            }
        });
        await helper.assertWithAllure("Validating the offer details to be displayed",async()=>{
            await expect(this.actualPrice).toBeVisible();
            await expect(this.offerPrice).toBeVisible();
            await expect(this.discount).toBeVisible();
        });
    }
    async validateDiscount(){
        await helper.assertWithAllure("Getting the values from the displayed discount details",async()=>{
            fs.writeFileSync(outputDir,"Target\n")
            const actual=await this.actualPrice.textContent();
            helper.logToFile(outputDir,`Actual Price : ${actual}`)
            actualValue=(helper.getValueFromString(actual)).price;
            const current=await this.offerPrice.textContent();
            helper.logToFile(outputDir,`Offer price : ${current}`);
            offerValue=(helper.getValueFromString(current)).price;
            const discount=await this.discount.textContent();
            displayedDiscount=helper.getValueFromString(discount);
            helper.logToFile(outputDir,`Displayed Discount Price: ${displayedDiscount.price}`);
            helper.logToFile(outputDir,`Displayed Discount Percentage: ${displayedDiscount.percentage}`);
        });
        await helper.assertWithAllure("Calculating the discount price and percentage",async()=>{
            calculatedDiscount=helper.calculateDiscount(actualValue,offerValue);
            helper.logToFile(outputDir,`Calculated Discount Price : ${calculatedDiscount.price}`);
            helper.logToFile(outputDir,`Calculated Discount Percentage : ${calculatedDiscount.percentage}`);
        });
        await helper.assertWithAllure("Asserting the displayed values with the calculated values",async()=>{
            try{
                expect(calculatedDiscount.price).toBeLessThanOrEqual(displayedDiscount.price);
                expect(calculatedDiscount.percentage).toBeCloseTo(displayedDiscount.percentage,0.5);

            }
            catch{
                console.error(data.message.discountError);
            }
        });
    }
}