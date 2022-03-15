# API Authentication
API authentication is done via access and refresh tokens. Here's a basic overview:

1. A user's login details are sent to `/auth/v1/login`. If correct an access token and refresh token are sent back.
2. The access token is short-lived (1 hr) and can be used as a bearer token to authorize API requests.
3. The refresh token is long-lived (7 days) and can be used to retrieve a new access token from `/auth/v1/refresh` when the old one expires. 
   - When a client requests a new access token they also retrieve a new refresh token and their old refresh token is blacklisted. 
4. If a user wishes to log out their refresh and access tokens can be sent to `/auth/v1/revoke` where they will then both be blacklisted.

The revoking of refresh tokens as soon as they're used reduces the risk of having long-lived tokens while still
allowing for a convenient user experience where they don't have to constantly manually re-authenticate.
