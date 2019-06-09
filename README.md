# Calorie King

A gamified calorie counting app with a mobile-first design. **Deployed [live on Glitch!](https://calorie-king.glitch.me/)**

Tech stack: `Node.js w/ Express`, `React w/ create-react-app`, `Mocha`, `SQLite`.

<br>

[![preview image](https://raw.githubusercontent.com/healeycodes/calorie-king/master/preview.png "Calorie King preview")](https://calorie-king.glitch.me/)

<br>

This app can be deployed to [Glitch](https://glitch.com/) to run in its container system, or hosted anywhere where `Node.js` can run.

Users arrive at the root path (`/`) and are forwarded to a personal dashboard at a private link location.

Their username is generated from random friendly words. E.g. `/dashboard/energetic-minibus-snickerdoodle`.

<br>

### Build

The app is split up into a fully static front-end with a back-end to receive the routes and access the database.

- Front-end

  - `cd ./front-end/`
  - `npm install`
  - `npm run build`
   - `npm run test`

- Back-end

  - `npm install`
  - `npm run test`

<br>

### Run

`npm run start`

Example console output:

```bash
> calorie-king@1.0.0 start C:\Users\Andrew\Documents\GitHub\calorie-king
> node server.js

Database ready to go!
Calorie King listening on port 56037
```

<br>

### Tests

For the back-end, `Mocha w/ supertest` is used to mock routes as well as database calls to confirm that the data is stored/updated/deleted correctly.

The front-end tests are a work-in-progress but `Jest` tests that the `React` app can be mounted succesfully.



