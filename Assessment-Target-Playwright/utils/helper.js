const { expect } = require('@playwright/test')
const { allure } = require('allure-playwright')
const fs = require('fs')

function getValueFromString(string){
    const priceRegex = /\$(\d+\.\d{2})/;
    const percentageRegex = /(\d+)%/;

    const priceMatch = string.match(priceRegex);
    const percentageMatch = string.match(percentageRegex);
    const price = priceMatch ? priceMatch[1] : null;
    const percentage = percentageMatch ? percentageMatch[1] : null;
    return {price:parseInt(price),percentage:parseInt(percentage)}
}
function calculateDiscount(actualPrice,OfferPrice){
    const price= actualPrice-OfferPrice;
    const percentage=price/actualPrice*100;
    return { price,percentage};
}

function verifyListItems(locator,count){
        for(let i=0;i<count;i++){
            const listItem=locator.nth(i);
            expect(listItem).toBeVisible();
        }
}
async function verifyHeaderSections(locator,headerCount){
    for(let i=0;i<headerCount;i++){
        const listItem=locator.nth(i);
        await expect(listItem).not.toBeHidden();
        await listItem.click();
    }
}
function getCurrentDate() {
    const now = new Date();
    const day = now.getUTCDate();
    const month = now.toLocaleString("en-US", { month: "long", timeZone: "UTC" });
    const year = now.getUTCFullYear();
    return `${day} ${month} ${year}`;
}
function getCheckoutDate(days) {
    const now = new Date();
    now.setUTCDate(now.getUTCDate() + days);
    const day = now.getUTCDate();
    const month = now.toLocaleString("en-US", { month: "long", timeZone: "UTC" });
    const year = now.getUTCFullYear();
    return `${day} ${month} ${year}`;
}
function logToFile(outputDir,content){
    fs.appendFileSync(outputDir,content+'\n');
}
async function assertWithAllure(stepName,fn){
    await allure.step(stepName,async()=>{
        await fn();
    })
}

module.exports={
    getValueFromString,
    calculateDiscount,
    verifyListItems,
    verifyHeaderSections,
    getCurrentDate,
    getCheckoutDate,
    logToFile,
    assertWithAllure
}