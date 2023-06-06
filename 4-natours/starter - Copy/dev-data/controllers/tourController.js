const fs = require('fs');

const data = JSON.parse(
  fs.readFileSync(`${__dirname}/../../dev-data/data/tours-simple.json`)
);
//creating own middleware
exports.CheckId = (req, res, next, val) => {
  console.log(val);
  if (req.params.id * 1 > data.length) {
    return res.status(400).json({
      status: 'failed',
      message: 'invalid request ',
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    result: data.length,
    data: {
      tours: data,
    },
  });
};

exports.getTours = (req, res) => {
  id = req.params.id * 1;
  const tours = data.find((item) => item.id === id);

  if (!tours) {
    res.status(404).json({
      status: 'fail',
      message: 'ivalid id',
    });
  }
  res.status(200).json({
    status: 'success',
    result: data.length,
    data: {
      tours,
    },
  });
};

exports.createTour = (req, res) => {
  const newId = data[data.length - 1].id + 1;
  const newData = Object.assign({ id: newId }, req.body);
  data.push(newData);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(data),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tours: newData,
        },
      });
    }
  );
};
