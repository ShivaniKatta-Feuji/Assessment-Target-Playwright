const { $, browser } = require("@wdio/globals");
const data = require("../../data/youtube.json");
const { expect } = require("chai");
const helper = require('../../utils/helper');
require('dotenv').config();
const fs = require('fs')
const outputDir='output/Youtube.txt';

class YoutubePage{
    get logo(){
        return $('(//yt-icon[@id="logo-icon"])[1]');
    }
    get metaInfoDescription(){
        return $('//meta[@name="description"]');
    }
    get metaInfoViewport(){
        return $('//meta[@name="viewport"]');
    }
    get searchColumn(){
        return $('#center');
    }
    get searchBar(){
        return $('(//div[@id="center"]//input[@name="search_query"])[1]');
    }
    get searchButton(){
        return $('//div[@id="center"]//button[@title="Search"]');
    }
    get searchResults(){
        return $$('//h3[@title]');
    }
    get selectedVideo(){
        return $('(//h3[@title])[2]');
    }
    get skipAd(){
        return $('//button[contains(@id,"skip")]');
    }
    get playPauseButton(){
        return $('//button[contains(@class,"ytp-play-button")]');
    }
    get videoProgressBar(){
        return $('//div[contains(@class,"progress-bar-container")]');
    }
    get videoSettings(){
        return $('//button[contains(@class,"settings")]');
    }
    
    async launchURL(){
        await browser.url(process.env.youtubeURL);
        await browser.pause(parseInt(process.env.smallTimeout));
    }
    async verifyHomePage(){
        await helper.assertWithAllure("Verifying the page title and url",async()=>{
            fs.writeFileSync(outputDir,"Youtube");
            expect(await this.logo.isDisplayed()).to.be.true;
            expect(await browser.getTitle()).to.contain(data.title);
            expect(await browser.getUrl()).to.be.equal(data.url);
        });
    }
    async enterSearchQuery(){
       await helper.assertWithAllure("Validating the visibility and enability of the search bar",async()=>{
            expect(await this.searchColumn.isDisplayed()).to.be.true;
            expect(await this.searchBar.isEnabled()).to.be.true;
        });
       await helper.assertWithAllure("Entering the search query and clicking search button",async()=>{
            await this.searchBar.setValue(data.search);
            await this.searchButton.click();
            await browser.pause(parseInt(process.env.smallTimeout));
        });
    }
    async validateSearchResults(){
      await  helper.assertWithAllure("Validating the search results to be greater than expected",async()=>{
            const searchResultsCount=await this.searchResults.length;
            helper.logToFile(outputDir,`Search Results Count : ${searchResultsCount}`);
            expect(searchResultsCount).to.be.greaterThan(data.expectedCount);
        });
    }
    async clickOnVideo(){
       await helper.assertWithAllure("Selecting any video from the search results",async()=>{
            await this.selectedVideo.click();
            await browser.pause(parseInt(process.env.smallTimeout));
        });
    }
    async handlePopUps(){
       await helper.assertWithAllure("Validating the popups visibility and handling them",async()=>{
            await this.skipAd.waitForDisplayed();
            const isVisible=await this.skipAd.isDisplayed();
            if(isVisible)
                await this.skipAd.click();
        });
    }
    async interactWithVideoControls(){
       await helper.assertWithAllure("Validating the visibility and enability of the play/pause button",async()=>{
            expect(await this.playPauseButton.isDisplayed()).to.be.true;
            expect(await this.playPauseButton.isEnabled()).to.be.true;
        });
       await helper.assertWithAllure("Clicking play/pause button multiple times",async()=>{
            let count = 1;
            while (count < 5) {
                await this.playPauseButton.click();
                await browser.pause(parseInt(process.env.miniTimeout));
                count++;
            }
        });
       await helper.assertWithAllure("Clicking the video setting button",async()=>{
            await this.videoSettings.click();
        });
    }
}
module.exports=new YoutubePage();