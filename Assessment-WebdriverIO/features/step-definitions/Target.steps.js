const { Given, When, Then } = require("@wdio/cucumber-framework");
const TargetPage = require("../pageobjects/Target.page");

Given(/^I am on the homepage of Target Application$/, async () => {
  await TargetPage.launchTheApplication();
});

When(/^I search for Watches$/, async () => {
  await TargetPage.performSearch();
});

Then(/^I should be able to see the page displaying different watches$/, async () => {
    await TargetPage.verifySearchForWatches();
});

When(/^I select any watch with discount details$/, async() => {
	await TargetPage.selectAnyWatch();
});

Then(/^I should see actual price,offer price and rate of discount$/, async() => {
	await TargetPage.checkForDetails();
});

When(/^I calculate the discount for the given prices$/, async() => {
	await TargetPage.calculateDiscount();
});

Then(/^The calculated discount should match with the displayed discount$/, async() => {
	await TargetPage.validateDiscount();
});
