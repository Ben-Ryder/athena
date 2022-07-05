# MVP

The MVP application is a multi-user notes app with vaults and tags:
- You can log in with multiple users at the same time and switch between them.
- Users can create "vaults" which then contain notes & tags.
- Notes consist of a title, body, timestamps and tags.
- Notes and vaults should be client side encryption.
- Notes should be:
  - filterable by tag
  - paginate
  - sortable by created or updated timestamp, asc or desc
- There should be a way to 

The MPV **WILL NOT** contain:
- search functionality in API THIS MUST BE CLIENT SIDE ANYWAY DUE TO ENCRYPTION
- any other notes functionality such as folders, saved filters etc
- 2FA on user account login
- Accounts email verification to use accounts
- Note auto-saving
- Offline support or any caching
- Special API protections such as rate limiting