const {Given,When,Then}=require('@wdio/cucumber-framework')
const YoutubePage=require('../pageobjects/Youtube.page')

Given(/^I am on the homepage of Youtube application$/, async() => {
	await YoutubePage.launchURL();
});

Then(/^I validate the page url,title and meta tags$/, async() => {
	await YoutubePage.verifyHomePage();
});

When(/^I enter dynamic query and click search$/, async() => {
	await YoutubePage.enterSearchQuery();
});

Then(/^I should see atleast 10 search results$/, async() => {
	await YoutubePage.validateSearchResults();
});

When(/^I click on a video$/, async() => {
	await YoutubePage.clickOnVideo();
});

Then(/^I should handle potential pre-video popups such as skip Ad$/, async() => {
	await YoutubePage.handlePopUps();
});

Then(/^I should verify the control buttons working as expected$/, async() => {
	await YoutubePage.interactWithVideoControls();
});
