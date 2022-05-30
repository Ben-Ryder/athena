# API Testing Strategy
The main type of testing used for the API right now is End to End (E2E) testing, meaning I'm not testing
individual units of the application, instead I'm testing the API functionality itself via HTTP requests & responses.  

This means that the tests are running against the "real" database with a "real" user. This approach lets me test 
that the application functionality itself works as it should, which by proxy tests the database, services etc.

## Test Guideline Ideas
Here are some ideas for how tests should behave and be structured:
- All test must be able to run independently and not assume any prior database content (besides an available user?).
