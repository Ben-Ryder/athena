# Athena
A place for encrypted notes, lists and reminders.

## About
**This project is very early in development and is not complete, stable or in an MVP release state yet.**  
As I planned to open source this at MVP release anyway I thought I may as well just do it now.

For initial minimum viable product (MVP) release, Athena will be a basic notes app with client side encryption.  
Users will be able to create accounts and view/edit/manage notes.
This will consist of a Node server backend to manage content and a React frontend for users to interact with.

I have many possible directions and extra features I want to explore after initial release including:
- Adding some form of lists and reminder functionality.
- Creating a React Native mobile client.
- Creating an Electron based desktop client.
- and more...

## Project Structure
This is a monorepo containing all projects related to Athena:
- `athena-server` - The backend Node server and API responsible for managing and storing content.
- `athena-web` - A React web app for users.
- `athena-js-lib` - A general JavaScript SDK library containing an API client and encryption library.

## Contributions
This project is currently open source, not open contribution.  
While I welcome bug reports and similar I'm not interested in external code contributions or feature requests right now.

## License
All projects that are part of Athena are released under the [GNU AGPLv3](https://choosealicense.com/licenses/agpl-3.0/) license.
