const app = require('./app');
const port = 3000;

app.listen(port, () => {
  console.log(`listening to server on port:${port}..`);
});
