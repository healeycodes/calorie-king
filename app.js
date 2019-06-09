// init project
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json({ type: 'application/json' }));
const friendlyWords = require('friendly-words');

// init sqlite db
const fs = require('fs');
const dbFile =
  process.env.NODE_ENV === 'test' ? './data/test.db' : './.data/sqlite.db';
const exists = fs.existsSync(dbFile);
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(dbFile);

// if ./.data/sqlite.db does not exist, create it, otherwise print records to console
db.serialize(function() {
  if (!exists) {
    db.run(
      'CREATE TABLE Users (user TEXT, goal INTEGER, points, INTEGER, visited TEXT, activity TEXT)'
    );
    console.log('New table Users created!');

    db.run(
      'CREATE TABLE Meals (id INTEGER PRIMARY KEY, user TEXT, name TEXT, cals INTEGER, date INTEGER)'
    );
    console.log('New table Meals created!');
  } else {
    console.log('Database ready to go!');
    if (process.env.NODE_ENV === 'development') {
      db.each('SELECT * from Users', function(err, row) {
        if (row) {
          console.log('record:', row);
        }
      });
      db.each('SELECT * from Meals', function(err, row) {
        if (row) {
          console.log('record:', row);
        }
      });
    }
  }
});

// register user, forward to personal dashboard
app.get(['/', '/register'], function(request, response) {
  // friendly random id
  const rnd = () => {
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];
    return `${pick(friendlyWords.predicates)}-${pick(
      friendlyWords.objects
    )}-${pick(friendlyWords.objects)}`;
  };
  const user = rnd();
  // insert user and example item
  db.serialize(function() {
    db.run(
      'INSERT INTO Users (user, goal, points, visited, activity) VALUES (?, ?, ?, ?, ?)',
      [user, 2000, 0, 'new', 'none']
    );
    db.run(
      'INSERT INTO Meals (user, name, cals, date) VALUES (?, ?, ?, ?)',
      [user, 'Example Burger', 500, Date.now()],
      function(err) {
        if (err) {
          console.error(err);
          response.status(500);
          response.send('Server Error');
        } else {
          response.status(200);
          response.redirect(`/dashboard/${user}`);
        }
      }
    );
  });
});

// main app view, show meal tracking
app.get('/dashboard/:user', function(request, response) {
  response.sendFile(__dirname + '/front-end/build/index.html');
});

/* API */

app.get('/api/meals/get/:user', function(request, response) {
  db.all(
    'SELECT id, user, name, cals, date FROM Meals WHERE user = (?)',
    [request.params.user],
    function(err, rows) {
      if (err) {
        console.error(err);
        response.status(500);
        response.send('Server Error');
      } else {
        response.send(rows);
      }
    }
  );
});

app.post('/api/meals/add/:user', function(request, response) {
  const meal = {
    user: request.params.user,
    name: request.body.name,
    cals: request.body.cals,
    date: request.body.date
  };
  db.run(
    'INSERT INTO Meals (user, name, cals, date) VALUES (?, ?, ?, ?)',
    [meal.user, meal.name, meal.cals, meal.date],
    function(err) {
      if (err) {
        console.error(err);
        response.status(500);
        response.send('Server Error');
      } else {
        response.status(200);
        response.send('OK');
      }
    }
  );
});

app.post('/api/meals/edit/:user', function(request, response) {
  const meal = {
    user: request.params.user,
    id: request.body.id,
    name: request.body.name,
    cals: request.body.cals
  };
  db.run(
    'UPDATE Meals SET name = (?), cals = (?) WHERE id = (?) AND user = (?)',
    [meal.name, meal.cals, meal.id, meal.user],
    function(err) {
      if (err) {
        console.error(err);
        response.status(500);
        response.send('Server Error');
      } else {
        response.status(200);
        response.send('OK');
      }
    }
  );
});

app.delete('/api/meals/delete/:user', function(request, response) {
  const meal = {
    id: request.body.id,
    user: request.params.user
  };
  db.run(
    'DELETE FROM Meals WHERE id = (?) AND user = (?)',
    [meal.id, meal.user],
    function(err) {
      if (err) {
        console.error(err);
        response.status(500);
        response.send('Server Error');
      } else {
        response.status(200);
        response.send('OK');
      }
    }
  );
});

app.get('/api/stats/get/:user', function(request, response) {
  db.all(
    'SELECT goal, points, visited, activity FROM Users WHERE user = (?)',
    [request.params.user],
    function(err, rows) {
      if (err) {
        console.error(err);
        response.status(500);
        response.send('Server Error');
      } else {
        response.send(rows[0]);
      }
    }
  );
});

app.post('/api/points/edit/:user', function(request, response) {
  db.run(
    'UPDATE Users SET points = (?) WHERE user = (?)',
    [request.body.points, request.params.user],
    function(err) {
      if (err) {
        console.error(err);
        response.status(500);
        response.send('Server Error');
      } else {
        response.status(200);
        response.send('OK');
      }
    }
  );
});

app.post('/api/visited/edit/:user', function(request, response) {
  db.run(
    'UPDATE Users SET visited = (?) WHERE user = (?)',
    [new Date().toISOString().slice(0, 10), request.params.user],
    function(err) {
      if (err) {
        console.error(err);
        response.status(500);
        response.send('Server Error');
      } else {
        response.status(200);
        response.send('OK');
      }
    }
  );
});

app.post('/api/activity/edit/:user', function(request, response) {
  db.run(
    'UPDATE Users SET activity = (?) WHERE user = (?)',
    [new Date().toISOString().slice(0, 10), request.params.user],
    function(err) {
      if (err) {
        console.error(err);
        response.status(500);
        response.send('Server Error');
      } else {
        response.status(200);
        response.send('OK');
      }
    }
  );
});

app.post('/api/goal/edit/:user', function(request, response) {
  db.run(
    'UPDATE Users SET goal = (?) WHERE user = (?)',
    [request.body.goal, request.params.user],
    function(err) {
      if (err) {
        console.error(err);
        response.status(500);
        response.send('Server Error');
      } else {
        response.status(200);
        response.send('OK');
      }
    }
  );
});

// set up static after routes so that we catch the root path `/`
app.use(express.static('front-end/build'));

module.exports = {
  app: app,
  db: db
};
