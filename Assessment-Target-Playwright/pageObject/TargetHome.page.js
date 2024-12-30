const { expect } = require('@playwright/test')
const data = require('../data/target.json')
require('dotenv').config();

module.exports=class TargetHomePage{
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
        this.selectedWatch=this.page.locator('//a[starts-with(@aria-label,"Disney Citizen Eco-Drive Watch")]');
        this.watchTitle=this.page.locator('#pdp-product-title-id');
        this.actualPrice=this.page.locator('//div[@data-module-type="ProductDetailPrice"]//span[text()="$450.00"]');
        this.offerPrice=this.page.locator('//div[@data-module-type="ProductDetailPrice"]//span[text()="$337.50"]');
        this.description=this.page.locator('//h3[text()="Description"]//parent::button//following-sibling::div');
        this.discount=this.page.locator('//span[@data-test="product-savings-amount"]');


    }
    async launchURL(){
        await this.page.goto(process.env.baseURL);
        await expect(this.page).toHaveURL(data.url.home);
        await expect(this.targetLogo).toBeVisible();
        await expect(this.signIn).toBeVisible();
    }

    async searchForWatches(){
        await expect(this.searchBar).toBeVisible();
        await expect(this.searchBar).toBeEditable();
        await this.searchBar.fill(data.input.watches);
        // await this.searchButton.click();
        // await expect(this.searchResults).toContainText(data.input.watches);
        // await expect(this.wristWatches).toBeVisible();

        await this.categories.click();
        await this.clothingAccessories.click();
        await this.accessories.click();
        await this.watches.click();
        await this.page.pause();
    }
    async selectWatch(){
        await expect(this.selectedWatch).toBeVisible();
        await this.selectedWatch.click();
        await expect(this.watchTitle).toContainText(data.watch.title);
        await expect(this.price).toHaveText(data.watch.offerPrice);
        await expect(this.discount).toContain(data.watch.discount);
    }
    async validateDiscount(){
        const actual=await this.actualPrice.textContent();
        const current=await this.offerPrice.textContent();
        console.log("Actual Price : ",actual);
        console.log("Offer Price : ",current);
        const intActual=Number(actual.subString(1));
        const intCurrent=Number(current.subString(1));
        const discountPrice=intActual-intCurrent;
        await expect(this.discount).toEqual(discountPrice);
        
    }
}