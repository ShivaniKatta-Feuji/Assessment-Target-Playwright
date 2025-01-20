const { expect } = require("@playwright/test");
const data = require("../data/youtube.json");
const exp = require("constants");
const helper = require("../utils/helper");
require("dotenv").config();

exports.YoutubePage = class YoutubePage {
    constructor(page) {
        this.page = page;
        this.logo = page.locator('(//yt-icon[@id="logo-icon"])[1]');
        this.metaInfoDescription = page.locator('//meta[@name="description"]');
        this.metaInfoViewport = page.locator('//meta[@name="viewport"]');
        this.searchColumn = page.locator("#center");
        this.searchBar = page.locator('(//div[@id="center"]//input[@name="search_query"])[1]');
        this.searchButton = page.locator('//div[@id="center"]//button[@title="Search"]');
        this.searchResults = page.locator("//h3[@title]");
        this.selectedVideo = page.locator("(//h3[@title])[2]");
        this.clickAVideo = page.locator("(//h3[contains(@class,'title')])[1]");
        this.skipAd = page.locator("//button[contains(@id,'skip')]");
        this.playPauseButton = page.locator("//button[contains(@class,'ytp-play-button')]");
        this.videoProgressBar = page.locator("//div[contains(@class,'progress-bar-container')]");
        this.videoSettings = page.locator("//button[contains(@class,'settings')]");
    }
    
    async launchURL() {
        await this.page.goto(process.env.youtubeURL);
        await this.page.waitForTimeout(parseInt(process.env.smallTimeout));
    }
    async verifyTitleAndURL() {
        await helper.assertWithAllure("Validating the page to have title and url and logo to be visible",async () => {
            await expect(this.logo).toBeVisible();
            await expect(this.page).toHaveTitle(data.title);
            await expect(this.page).toHaveURL(data.url);
        });
        await helper.assertWithAllure("Validating the visibility of meta tags",async () => {
            // await this.page.pause();
            expect(this.metaInfoDescription).toBeVisible;
            expect(this.metaInfoViewport).toBeVisible;
        });
    }
    async dynamicQueryHandling() {
        await helper.assertWithAllure("Validating the visibility and editability of Search Bar",async () => {
            await expect(this.searchColumn).toBeVisible();
            await expect(this.searchBar).toBeEditable();
        });
        await helper.assertWithAllure("Entering query and performing search",async () => {
            await this.searchBar.fill(data.search);
            await this.searchButton.click();
            await this.page.waitForTimeout(parseInt(process.env.smallTimeout));
        });
        await helper.assertWithAllure("Asserting the search results with the expected count",async () => {
            const searchResultsCount = await this.searchResults.count();
            expect(searchResultsCount).toBeGreaterThan(data.expectedCount);
        });
    }
    async clickOnVideo() {
        await helper.assertWithAllure("Selecting a video from the search results",async () => {
            await this.selectedVideo.click();
            await this.page.waitForTimeout(parseInt(process.env.smallTimeout));
            await this.page.waitForSelector("//button[contains(@id,'skip')]");
        });
        await helper.assertWithAllure('Validationg visibility of skip add and then click', async () => {
            const skipVisible = await this.skipAd.isVisible();
            if (skipVisible) 
                await this.skipAd.click();
        });
    }
    async verifyVideoPlayback(){
        await helper.assertWithAllure('Validationg visibility and enability of play/pause button', async () => {
            await expect(this.playPauseButton).toBeVisible();
            await expect(this.playPauseButton).toBeEnabled();
        });
        await helper.assertWithAllure('Validationg visibility of skip add and then click', async () => {
            await expect(this.videoProgressBar).toBeVisible();
        });
        await helper.assertWithAllure('Validationg visibility of  video settings', async () => {
            await expect(this.videoSettings).toBeVisible();
            await expect(this.videoSettings).toBeEnabled();
            await this.videoSettings.click();
        });
    }
    async interactWithVideoControls(){
        await helper.assertWithAllure('Validationg visibility of skip add and then click', async () => {
            let count = 1;
            while (count < 5) {
                await this.playPauseButton.click();
                await this.page.waitForTimeout(parseInt(process.env.miniTimeOut));
                count++;
            }
        });
    }
};
