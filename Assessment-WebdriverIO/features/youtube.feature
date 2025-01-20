Feature: The Youtube Application
    Scenario Outline: Launch the application and verify the Page Title, URL, and Meta Tags
        Given I am on the homepage of Youtube application
        Then I validate the page url,title and meta tags
    Scenario Outline: Search for a Video with Dynamic Query Handling
        When I enter dynamic query and click search
        Then I should see atleast 10 search results
    Scenario Outline: Click on a Video
        When I click on a video
        Then I should handle potential pre-video popups such as skip Ad
        Then I should verify the control buttons working as expected