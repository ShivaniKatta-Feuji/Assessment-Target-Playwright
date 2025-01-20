const { Given, When, Then } = require('@wdio/cucumber-framework');

const  BookingPage= require('../pageobjects/Booking.page');


Given(/^I am on the homepage of Booking application$/, async() => {
	await BookingPage.launchURL();
});

Then(/^I should handle the popups if appeared$/, async() => {
	await BookingPage.handlePopups();
});

Then(/^I should see page title and url as expected$/, async() => {
	await BookingPage.verifyTitleAndUrl();
});

When(/^I enter the location and select dates and occupancy$/, async() => {
	await BookingPage.fillTheInputs();
});

When(/^I click on search button$/, async() => {
	await BookingPage.clickSearch();
});

Then(/^I should see the search results for that particular location$/, async() => {
	await BookingPage.verifySearchResults();
});

When(/^I select any filter checkbox$/, async() => {
	await BookingPage.applyFilter();
});

Then(/^I should see the corresponding search results$/, async() => {
	await BookingPage.verifySearchResultsCount();
});

When(/^Any accommodation is selected from the results$/, async() => {
	await BookingPage.selectAccommodation();
});

Then(/^The hotel name should be same as appeared in results$/, async() => {
	await BookingPage.verifyHotelName();
});

