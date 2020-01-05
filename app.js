const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json({ type: 'application/json' }));

const handleError = require('./controllers/errors.js');
const friendlyRandomId = require('./friendlyRandomId');
const db = require('./db')();

// TODO: refactor into controllers and models, maybe with a data store layer.
// For now, this is just to support the front-end for this learning project :)

app.get(['/', '/register'], (request, response) => {
  const user = friendlyRandomId();
  db.serialize(() => {
    db.run(
      'INSERT INTO Users (user, goal, points, visited, activity) VALUES (?, ?, ?, ?, ?)',
      [user, 2000, 0, 'new', 'none']
    );
    db.run(
      'INSERT INTO Meals (user, name, cals, date) VALUES (?, ?, ?, ?)',
      [user, 'Example Burger', 500, Date.now()],
      err => {
        if (err) return handleError(err, response);
        response.redirect(`/dashboard/${user}`);
      }
    );
  });
});

app.get('/dashboard/:user', (request, response) => {
  response.sendFile(__dirname + '/front-end/build/index.html');
});

app.get('/api/meals/get/:user', (request, response) => {
  db.all(
    'SELECT id, user, name, cals, date FROM Meals WHERE user = (?)',
    [request.params.user],
    (err, rows) => {
      if (err) return handleError(err, response);
      response.send(rows);
    }
  );
});

app.post('/api/meals/add/:user', (request, response) => {
  const meal = {
    user: request.params.user,
    name: request.body.name,
    cals: request.body.cals,
    date: request.body.date
  };
  db.run(
    'INSERT INTO Meals (user, name, cals, date) VALUES (?, ?, ?, ?)',
    [meal.user, meal.name, meal.cals, meal.date],
    err => {
      if (err) return handleError(err, response);
      response.send('OK');
    }
  );
});

app.post('/api/meals/edit/:user', (request, response) => {
  const meal = {
    user: request.params.user,
    id: request.body.id,
    name: request.body.name,
    cals: request.body.cals
  };
  db.run(
    'UPDATE Meals SET name = (?), cals = (?) WHERE id = (?) AND user = (?)',
    [meal.name, meal.cals, meal.id, meal.user],
    err => {
      if (err) return handleError(err, response);
      response.send('OK');
    }
  );
});

app.delete('/api/meals/delete/:user', (request, response) => {
  const meal = {
    id: request.body.id,
    user: request.params.user
  };
  db.run(
    'DELETE FROM Meals WHERE id = (?) AND user = (?)',
    [meal.id, meal.user],
    err => {
      if (err) return handleError(err, response);
      response.send('OK');
    }
  );
});

app.get('/api/stats/get/:user', (request, response) => {
  db.all(
    'SELECT goal, points, visited, activity FROM Users WHERE user = (?)',
    [request.params.user],
    (err, rows) => {
      if (err) return handleError(err, response);
      response.send(rows[0]);
    }
  );
});

app.post('/api/points/edit/:user', (request, response) => {
  db.run(
    'UPDATE Users SET points = (?) WHERE user = (?)',
    [request.body.points, request.params.user],
    err => {
      if (err) return handleError(err, response);
      response.send('OK');
    }
  );
});

app.post('/api/visited/edit/:user', (request, response) => {
  db.run(
    'UPDATE Users SET visited = (?) WHERE user = (?)',
    [new Date().toISOString().slice(0, 10), request.params.user],
    err => {
      if (err) return handleError(err, response);
      response.send('OK');
    }
  );
});

app.post('/api/activity/edit/:user', (request, response) => {
  db.run(
    'UPDATE Users SET activity = (?) WHERE user = (?)',
    [new Date().toISOString().slice(0, 10), request.params.user],
    err => {
      if (err) return handleError(err, response);
      response.send('OK');
    }
  );
});

app.post('/api/goal/edit/:user', (request, response) => {
  db.run(
    'UPDATE Users SET goal = (?) WHERE user = (?)',
    [request.body.goal, request.params.user],
    err => {
      if (err) return handleError(err, response);
      response.send('OK');
    }
  );
});

app.use(express.static('front-end/build'));

module.exports = {
  app: app,
  db: db
};
