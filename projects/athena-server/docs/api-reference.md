# API Reference

- `/` [GET]
- `/v1` [GET]
  - `/users` [POST]
    - `/users/:userId` [GET, PATCH, DELETE]
  - `/auth`
    - `/auth/login` [POST]
    - `/auth/refresh` [POST]
    - `/auth/logout` [POST]
    - `/auth/check` [POST]
  - `/vaults` [GET, POST]
    - `/vaults/:vaultId` [GET, PATCH, DELETE]
      - `/vaults/:vaultId/notes` [GET, POST]
        - `/vaults/:vaultId/notes/:noteId` [GET, PATCH, DELETE]
      - `/vaults/:vaultId/tags` [GET, POST]
        - `/vaults/:vaultId/tags/:tagId` [GET, PATCH, DELETE]

## Tag
Content tags are managed via `/tags`.  
To add tags to content you can pass the `tags` field to POST or PATCH requests with a list of tag IDs.  
Passing the `tags` field will overwrite existing tags on that content entity.
