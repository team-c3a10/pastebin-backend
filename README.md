## Install

- clone and open this repo
- `yarn` to install dependencies

## DB Setup

Copy .env.example to .env and set `DATABASE_URL` to your db, e.g. for local database: `DATABASE_URL=postgres://neill@localhost/pastebin`.

Set `PORT` to your liking.

You will need to create your own databases for this project - one locally and one on Heroku. 
Run the SQL query found in [database/create_tables.sql](database/create_tables.sql) to populate the database with the required tables.

## Running locally

`yarn start:dev`

This will set the env var LOCAL to true, which will cause the db connection configuration to NOT use SSL (appropriate for your local db)

## running on heroku

When the project is deployed to heroku, the command in your `Procfile` file will be run.

## Project documentation
- Read the documentation used to develop this site on our [Notion](https://www.notion.so/Team-C3A10-Project-1-df68fea074484e48a3b28f22dd06236d) page.
- See a [live version](https://pastebin-backend-c3a10.herokuapp.com/) of this server hosted on Heroku.
