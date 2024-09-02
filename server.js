const express = require('express');
const jsonServer = require('json-server');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'dist/datagaurd/browser')));

const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

app.use('/api', middlewares, router);

// Serve Angular app on all routes except /api
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/datagaurd/browser/index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
