Feature: TIME_SERIES_INTRADAY Endpoint

  Scenario: Fetch 5min intraday data for a valid symbol
    Given I have a valid API key
    When I request intraday data for symbol "IBM" with interval "5min"
    Then the response status should be 200
    And the response should include intraday time series for interval "5min"


  Scenario: Missing interval should return error
    Given I have a valid API key
    When I request intraday data for symbol "IBM" without an interval
    Then the response should include an error message
