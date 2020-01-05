const fs = require('fs');

const setup = () => {
  const dbFile =
    process.env.NODE_ENV === 'test' ? './data/test.db' : './.data/sqlite.db';
  const exists = fs.existsSync(dbFile);
  const sqlite3 = require('sqlite3').verbose();
  const db = new sqlite3.Database(dbFile);

  db.serialize(() => {
    if (!exists) {
      db.run(
        'CREATE TABLE Users (user TEXT, goal INTEGER, points, INTEGER, visited TEXT, activity TEXT)'
      );
      console.log('New table Users created!');

      db.run(
        'CREATE TABLE Meals (id INTEGER PRIMARY KEY, user TEXT, name TEXT, cals INTEGER, date INTEGER)'
      );
      console.log('New table Meals created!');
    }
  });
  return db;
};

module.exports = setup;
