Feature: The Testim Application
    Scenario Outline: Navigate to homepage and validate Header Components
        Given I am on the homepage of Testim application
        Then I should be able to see and click all the header components
    Scenario Outline: Navigate to the "Company" Section and validate its subsections
        When I click on Company header Section
        Then I should see a dropdown menu havings its subsections
    Scenario Outline: Navigate to "Customers" Section and store a review
        When I navigate to Customer Section
        Then I should see review and able to store in a json
    Scenario Outline: Cross validate the stored review
        Then I validate the stored review with displayed one
    Scenario Outline: Validate footer components
        When I scroll to the footer
        Then I should see components such as footer sections,icons etc