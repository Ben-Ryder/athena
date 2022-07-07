# API Authentication
API authentication is done via access and refresh tokens. Here's a basic overview:

1. A user's login details are sent to `/auth/login`. If correct an access token and refresh token are sent back.
2. The access token is short-lived (1 hr) and can be used as a bearer token to authorize API requests.
3. The refresh token is long-lived (7 days) and can be used to retrieve a new access token from `/auth/refresh` when the old one expires. 
   - When a client requests a new access token they also retrieve a new refresh token and their old refresh token is blacklisted. 
4. If a user wishes to log out their refresh and access tokens can be sent to `/auth/revoke` and they will both be blacklisted immediately.

The blacklisting of refresh tokens as soon as they're used reduces the risk of having long-lived tokens while still
allowing for a convenient user experience where they don't have to constantly manually re-authenticate.


## Possible Issues and Improvements
- Is blacklisting every refresh token when refreshing access tokens a good idea? This will mean a persistent storage is needed for lots of blacklisted
refresh tokens as technically they'll still be valid tokens for 7 days.