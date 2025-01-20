const fs = require('fs')
const { allure } = require('allure-playwright')

function calculateDiscount(actualPrice,OfferPrice){
    const price= actualPrice-OfferPrice;
    const percentage=price/actualPrice*100;
    return { price,percentage};
}

function getValueFromString(string){
    const priceRegex = /\$(\d+\.\d{2})/;
    const percentageRegex = /(\d+)%/;

    const priceMatch = string.match(priceRegex);
    const percentageMatch = string.match(percentageRegex);
    const price = priceMatch ? priceMatch[1] : null;
    const percentage = percentageMatch ? percentageMatch[1] : null;
    return {price:parseInt(price),percentage:parseInt(percentage)}
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
function verifyListItems(locator,count){
        for(let i=0;i<count;i++){
            const listItem=locator[i];
            listItem.isDisplayed();
        }
}
async function assertWithAllure(stepName,fn){
    await allure.step(stepName,async()=>{
        await fn();
    })
}
function logToFile(outputDir,message){
    fs.appendFileSync(outputDir,message+"\n");
}

module.exports={
    calculateDiscount,
    getValueFromString,
    getCurrentDate,
    getCheckoutDate,
    verifyListItems,
    logToFile,
    assertWithAllure
}