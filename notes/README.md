# Roadmap

- get basic features in web app
  - list all notes
  - add new note
  - edit existing note
  - delete existing note
  - enough styling that it's usable.

- fix monorepo tooling

- look at allowing user to enter encryption key to add (and logout/delete it)
  - save in localstorage by default
  - look into XSS potential and ways to stop this

- add user system and auth to API
  - decide persistent token vs OAuth?

- add user login to web app
  - look at how best to securely store tokens used to interact with the API

- build up some better styling.

- clean up code etc and release an MVP 0.1 version, making the repo public.

## Future Small Features
- add tags to notes
- add filtering options to notes list (pagination and filter by tags)

## Future Big Features
- add caching and offline storage so the web app can be used offline and content can sync when a connection is available.
- add "lists" feature
- add "reminders" feature
  - create reminders from notes, lists and list items.
  - add standalone reminders too.

## Future Massive Features
- create android app (probably react native)
