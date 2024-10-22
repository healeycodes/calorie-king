# 👑 Calorie King [![Build Status](https://travis-ci.org/healeycodes/calorie-king.svg?branch=master)](https://travis-ci.org/healeycodes/calorie-king)

A gamified calorie counting app with a mobile-first design.

I built this to help me better understand React!

Tech stack: `Node.js, Express`, `React`, `Mocha`, `SQLite`.

<br>

[![preview image](https://raw.githubusercontent.com/healeycodes/calorie-king/master/preview.png "Calorie King preview")](https://calorie-king.glitch.me/)

<br>

This app can be deployed to [Glitch](https://glitch.com/) to run in its container system, or hosted anywhere where `Node.js` can run.

Users arrive at the root path (`/`) and are forwarded to a personal dashboard at a private link location.

Their username is generated from random friendly words. E.g. `/dashboard/energetic-minibus-snickerdoodle`.

All data is stored locally in an SQLite database in `./data/sqlite.db`.

<br>

### Build

The app is split up into a fully static front-end with a back-end to receive the routes and access the database.

- Front-end

  - `cd ./front-end/`
  - `npm install`
  - `npm run build`

- Back-end

  - `npm install`

<br>

### Run

`npm run start`

<br>

### Tests

`npm run test`
 
<br>

For the back-end, `Mocha w/ supertest` is used to mock routes as well as database calls to confirm that the data is stored/updated/deleted correctly. It uses an end-to-end flow of a user signing up.

TODO: Unit tests.

The front-end tests are a work-in-progress but `Jest` tests that the `React` app can be mounted succesfully.

<br>

MIT license (c) healeycodes
