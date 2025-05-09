const express = require('express');
const fs = require('fs');
const app = express();

// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'Request from the server', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.status(200).send('You can post to this URL');
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours.json`, 'utf-8')
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

const port = 3000;

app.listen(port, () => {
  console.log(`App is runnning on port ${port}`);
});
