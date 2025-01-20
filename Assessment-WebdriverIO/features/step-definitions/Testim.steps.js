const { Given, When, Then } = require('@wdio/cucumber-framework')
const  TestimPage  = require('../pageobjects/Testim.page')

Given(/^I am on the homepage of Testim application$/, async() => {
	await TestimPage.launchURL();
});

Then(/^I should be able to see and click all the header components$/, async() => {
	await TestimPage.validateHeaderComponents();
});

When(/^I click on Company header Section$/, async() => {
	await TestimPage.clickOnCompany();
});

Then(/^I should see a dropdown menu havings its subsections$/, async() => {
	await TestimPage.validateSubSections();
});

When(/^I navigate to Customer Section$/, async() => {
	await TestimPage.navigateToCustomers();
});

Then(/^I should see review and able to store in a json$/, async() => {
	await TestimPage.storeReview();
});

Then(/^I validate the stored review with displayed one$/, async() => {
	await TestimPage.validateStoredReview();
});

When(/^I scroll to the footer$/, async() => {
	await TestimPage.scrollToFooter();
});

Then(/^I should see components such as footer sections,icons etc$/, async() => {
	await TestimPage.validateFooterComponents();
});
