# API Testing
The main type of testing used for the API right now is End to End (E2E) testing, meaning I'm not testing
individual units of the application, instead I'm testing the API functionality itself via HTTP requests & responses.

These tests can be largely described like this:  
`Given the application is in a predefined state, When I make this API request, Then I should get this API response` 

This approach lets me test that the application **functionality itself** works as it should.  
Unit tests can then be used to test code paths that can't be reached with e2e tests easily and also to test isolated feature/services where appropriate.

## Test File Locations
Test files should be called `<name>.e2e.test.ts` or `<name>.unit.test.ts` and should be added by the feature
that they are testing rather than being seperated in the `tests` folder.  
The `tests` folder can then be used for common test functionality designed to be used in actual feature tests.  

## Test Data
Test data is populated in `tests/test-data.ts` and this is used by most tests as the initial state of the application
database.

## Test Guidelines
- Every test should be able to be run separately. This can be achieved by making sure each test suite properly resets
the database before each test.
- 