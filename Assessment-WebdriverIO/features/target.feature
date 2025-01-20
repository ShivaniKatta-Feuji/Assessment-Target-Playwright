Feature: The Target Application

    Scenario Outline: Navigate to the Shopping Site and Search for "Watches"
        Given I am on the homepage of Target Application
        When I search for Watches
        Then I should be able to see the page displaying different watches
    Scenario Outline: Select a watch and check for its details
        When I select any watch with discount details
        Then I should see actual price,offer price and rate of discount
    Scenario Outline: Discount calculation validation
        When I calculate the discount for the given prices
        Then The calculated discount should match with the displayed discount  