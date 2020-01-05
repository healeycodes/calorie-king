const handle = (err, response) => {
  console.error(err);
  response.status(500);
  return response.send('Server Error');
}

module.exports = handle;
