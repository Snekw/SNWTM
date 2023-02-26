# SNW TM

A collection (maybe) of tools for TM.

Used with https://github.com/Snekw/SNWTMMap

## Usage

This API can be used with any chat bot that supports fetching text from an url.

Multiple different texts can be defined by pressing "New" button. Remember to save any changes you make. And it's not a bad idea to store the texts on our own side as well.

The `token` should be kept private as it is used to authenticate changes to the backend.

### Nightbot

Nightbot supports `urlfetch` command that can be used to fetch the latest map info.

`!commands add !map $(urlfetch https://tm.snekw.com/api/map/view/******/***** )`

Substitute the url with the url provided on https://tm.snekw.com/map for the text you want to reply.

## Hosting

Docker image is provided through Docker Hub https://hub.docker.com/r/snekw/snwtm.

Requires a MongDB database to be available.

### Environment variables

Few environment variables are required.

| Variable | Expected value | Purpose |
|----------|----------------|---------|
| MONGO_STR| Mongo DB connection string | Provides database connection information. |
| SNW_TM_HOST | URL | Provides the application the user facing URL of the page to provide full links. |
