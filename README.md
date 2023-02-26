# SNW TM

A collection (maybe) of tools for TM.

Used with https://github.com/Snekw/SNWTMMap

## Usage

This API can be used with any chat bot that supports fetching text from an url.

Multiple different texts can be defined by pressing "New" button. Remember to save any changes you make. And it's not a bad idea to store the texts on our own side as well.

The `token` should be kept private as it is used to authenticate changes to the backend.

### ChatBots

Most chat bots support some sort of fetching of data from URL. This method is used to output the chat command output.

* Nightbot:
    * `!commands add !map $(urlfetch https://tm.snekw.com/api/map/view/****/**** )`
        * Replace the url with the url found on tm.snekw.com/map under "Texts" section.
* StreamElements:
    * `!command add map ${urlfetch https://tm.snekw.com/api/map/view/****/****}`
        * Replace the url with the url found on tm.snekw.com/map under "Texts" section.
* Moobot:
    * Create a new custom command
        * Select "Response" as "URL fetch - Full (plain) response"
        * Paste the url to "URL to fetch"
        * Leave all other URL fetch parameters as default
* Other bots:
    * Most bots have some form of custom API support
        * Most commonly it's named `URL-fetch`, `customapi` or `readapi`
        * Follow the instructions for your own bots version of this and it should work

## Hosting

Docker image is provided through Docker Hub https://hub.docker.com/r/snekw/snwtm.

Requires a MongDB database to be available.

### Environment variables

Few environment variables are required.

| Variable | Expected value | Purpose |
|----------|----------------|---------|
| MONGO_STR| Mongo DB connection string | Provides database connection information. |
| SNW_TM_HOST | URL | Provides the application the user facing URL of the page to provide full links. |
