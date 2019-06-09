const { app } = require('./app');

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  const port = listener.address().port;
  console.log(`Calorie King listening on port ${port}\n\nClick me if you're DEVing: http://localhost:${port}`);
});
