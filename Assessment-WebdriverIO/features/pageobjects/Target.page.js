const { $, browser } = require("@wdio/globals");
const data = require("../../data/target.json");
const { expect } = require("chai");
const fs = require('fs');
const helper = require("../../utils/helper");
const outputDir='output/Target.txt'
let calculatedPrice, calculatedPercentage, displayedPrice, displayedPercentage;

require("dotenv").config();

class TargetPage {
    get signIn() {
        return $('//span[text()="Sign in"]');
    }
    get targetLogo() {
        return $('(//div[@id="headerPrimary"]//child::a)[1]');
    }
    get searchBar() {
        return $("#search");
    }
    get searchButton() {
        return $('//button[text()="search"]');
    }
    get searchResults() {
        return $("//span[text()='for “watches”']");
    }
    get wristWatches() {
        return $('//span[text()="Wristwatches"]');
    }
    get selectedWatch() {
        return $('(//div[@data-test="comparison-price"])[1]//parent::div//parent::div//parent::div//following-sibling::div//child::a[@data-test="product-title"]');
    }
    get watchTitle() {
        return $('(//a[@data-test="product-title"])[2]//child::div');
    }
    get selectedWatchTitle() {
        return $("#pdp-product-title-id");
    }
    get actualPrice() {
        return $('//div[@data-test="@web/Price/PriceFull"]//child::span[@data-test="product-regular-price"]//child::span');
    }
    get offerPrice() {
        return $('//div[@data-test="@web/Price/PriceFull"]//child::span[@data-test="product-price"]');
    }
    get details() {
        return $('//div[@id="product-detail-tabs"]//child::button//h3[text()="Details"]');
    }
    get description() {
        return $('//h3[text()="Description"]//parent::button//following-sibling::div');
    }
    get discount() {
        return $('//span[@data-test="product-savings-amount"]');
    }
    async launchTheApplication() {
        await browser.url(process.env.targetURL);
        const url = await browser.getUrl();
        expect(url).to.equal(data.url.home);
        await this.targetLogo.isDisplayed();
        await this.signIn.isEnabled();
    }
    async performSearch() {
        helper.assertWithAllure("Entering watches in the search bar and clicking search",async()=>{
        await this.searchBar.isEnabled();
        await this.searchBar.setValue(data.input.watches);
        await this.searchButton.click();
      });
    }
    async verifySearchForWatches() {
        helper.assertWithAllure("Asserting the search resulted products to contain watches",async()=>{
            fs.writeFileSync("Target");
            const results = await this.searchResults.getText();
            expect(results).to.contain(data.input.watches);
            await this.wristWatches.isDisplayed();
        });
    }
    async selectAnyWatch() {
        helper.assertWithAllure("Checking for the visibility of any discount products",async()=>{
            const isDisplayed = await this.selectedWatch.isDisplayed();
            if (isDisplayed) {
              const watchTitle = await this.selectedWatch.getAttribute("aria-label");
              await this.selectedWatch.click();
              const titleAfterSelection = await this.selectedWatchTitle.getText();
              expect(watchTitle).to.equal(titleAfterSelection);

            } else {
              console.error("No products found with discount sale");
            }
        });
    }
    async checkForDetails() {
        helper.assertWithAllure("Validating the visibility of the discount details",async()=>{
            await this.actualPrice.isDisplayed();
            await this.offerPrice.isDisplayed();
            await this.discount.isDisplayed();
        });
    }
    async calculateDiscount() {
        helper.assertWithAllure("Retrieving the Original price,Discount price and discount rate",async()=>{
            const actual = await this.actualPrice.getText();
            const actualValue=(helper.getValueFromString(actual)).price;
            helper.logToFile(outputDir,`Original Price : ${actualValue}`);
            
            const current = await this.offerPrice.getText();
            const offerValue=(helper.getValueFromString(current)).price;
            helper.logToFile(outputDir,`Offer Price : ${offerValue}`);

            const discount = await this.discount.getText();
            const expectedDiscount = helper.getValueFromString(discount);
            displayedPrice = expectedDiscount.price;
            displayedPercentage = expectedDiscount.percentage;
            helper.logToFile(outputDir,`Displayed Discount Price : ${actualValue}`);
            helper.logToFile(outputDir,`Displayed Discount Percentage : ${actualValue}`);
        });
        helper.assertWithAllure("Calculating the discount price and percentage",async()=>{
            const calculatedDiscount = helper.calculateDiscount(actualValue, offerValue);
            calculatedPrice = calculatedDiscount.price;
            calculatedPercentage = calculatedDiscount.percentage;
            helper.logToFile(outputDir,`Calculated Discount Price : ${actualValue}`);
            helper.logToFile(outputDir,`Calculated Discount Percentage : ${actualValue}`);
        });
      
    }
    async validateDiscount() {
        helper.assertWithAllure("Asserting the displayed discount price and percentage with calculated price and percentage",async()=>{
            try {
              expect(calculatedPrice).to.be.closeTo(displayedPrice, 0.05);
              expect(calculatedPercentage).to.be.closeTo(displayedPercentage, 0.5);
            } catch {
              console.error(data.message.discountError);
            }
        });
    }
}
module.exports = new TargetPage();
