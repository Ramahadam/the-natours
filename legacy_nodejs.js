const http = require('http');
const url = require('url');
const Tour = require('./models/tourModel');
const server = http.createServer((req, res) => {
  const pathName = req.url;

  if (pathName === '/') res.end('Homepage');
  else if (pathName === '/about') res.end('About page');
  else res.end('Page not found');
});

server.listen(3001, (req, res) => {
  console.log('Listening for incomming request');
});

// ______________________________________________________________________________________
