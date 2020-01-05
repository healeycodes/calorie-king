const request = require('supertest');
const assert = require('assert');
const { app, db } = require('../app.js');

describe('app', () => {
  describe('testing register path', () => {
    it('should forward with code 302', async () => {
      // Register for a random username
      const user = await request(app)
        .get('/')
        .expect(302)
        .then(res => res.header.location.split('/').pop());

      // Is the returned username present in our database?
      db.all('SELECT user FROM Users WHERE user = (?)', [user], (
        err,
        rows
      ) => {
        if (err) {
          throw err;
        } else {
          assert.equal(rows.length, 1);
        }
      });
    });
  });

  describe('testing meal CRUD functions', () => {
    it('should allow meals to be created, read, updated, and deleted', async () => {
      const user = await request(app)
        .get('/register')
        .expect(302)
        .then(res => res.header.location.split('/').pop());

      // Create an item
      const originalMealName = 'Test Burger';
      await request(app)
        .post(`/api/meals/add/${user}`)
        .send({ name: originalMealName, cals: 500, date: 1 })
        .expect(200);

      // Read that item back from the API
      let mealId = null;
      await request(app)
        .get(`/api/meals/get/${user}`)
        .expect(200)
        .then(res => {
          assert.strictEqual(
            true,
            res.body.some(meal => {
              mealId = meal.id;
              return meal.name === originalMealName;
            })
          );
        });

      // Update the item to have a different name
      const newMealName = 'Different Burger';
      await request(app)
        .post(`/api/meals/edit/${user}`)
        .send({ id: mealId, name: newMealName, cals: 500, date: 1 })
        .expect(200);

      // Was the update actually run? Check the db to be sure
      await db.all(
        'SELECT id FROM Meals WHERE user = (?) AND name = (?)',
        [user, newMealName],
        (err, rows) => {
          if (err) {
            throw err;
          } else {
            assert.equal(rows.length, 1);
          }
        }
      );

      // Delete this item
      await request(app)
        .delete(`/api/meals/delete/${user}`)
        .send({ id: mealId })
        .expect(200);

      // Was it actually deleted from the db?
      await db.all('SELECT id FROM Meals WHERE id = (?)', [mealId], (
        err,
        rows
      ) => {
        if (err) {
          throw err;
        } else {
          assert.equal(rows.length, 0);
        }
      });
    });
  });
});
