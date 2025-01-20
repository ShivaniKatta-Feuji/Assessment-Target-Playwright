Feature: The Booking Application

  Scenario: Verify the Page Title and URL
    Given I am on the homepage of Booking application
    Then I should handle the popups if appeared
    Then I should see page title and url as expected
    
  Scenario: Search for Hotels or Accommodations
    When I enter the location and select dates and occupancy
    And I click on search button
    Then I should see the search results for that particular location 

  Scenario: Apply filter and verify the search results
    When I select any filter checkbox 
    Then I should see the corresponding search results
    
  Scenario: Select an accomodation from the results
    When Any accommodation is selected from the results
    Then The hotel name should be same as appeared in results