const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const app = express();

const tourRouter = require('./dev-data/routes/tourRoute');
//MIDDLEWARES
app.use(express.json());
//creating own middleware
app.use(morgan('dev'));

// const data = JSON.parse(
//   fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
// );

const userData = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/users.json`)
);

// const getAllTours = (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     result: data.length,
//     data: {
//       tours: data,
//     },
//   });
// };

const getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    result: data.length,
    data: {
      tours: userData,
    },
  });
};

// const getTours = (req, res) => {
//   id = req.params.id * 1;
//   const tours = data.find((item) => item.id === id);

//   if (!tours) {
//     res.status(404).json({
//       status: 'fail',
//       message: 'ivalid id',
//     });
//   }
//   res.status(200).json({
//     status: 'success',
//     result: data.length,
//     data: {
//       tours,
//     },
//   });
// };

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Missing route',
  });
};

// const createTour = (req, res) => {
//   const newId = data[data.length - 1].id + 1;
//   const newData = Object.assign({ id: newId }, req.body);
//   data.push(newData);

//   fs.writeFile(
//     `${__dirname}/dev-data/data/tours-simple.json`,
//     JSON.stringify(data),
//     (err) => {
//       res.status(201).json({
//         status: 'success',
//         data: {
//           tours: newData,
//         },
//       });
//     }
//   );
// };

const createUser = (req, res) => {
  const newId = userData[userData.length - 1].id + 1;
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

// app.get('/api/v1/tours/', getAllTours);

// app.get('/api/v1/tours/:id', getTours);

// app.post('/api/v1/tours/', createTour);

//user routes
// app.get('/api/v1/tours/', getAllUsers);

// app.get('/api/v1/tours/:id', getUsers);

// app.post('/api/v1/tours/', createUsers);

// app.route('/api/v1/tours/').get(getAllTours).post(createTour);
// app.route('/api/v1/tours/:id').get(getTours);

// app.route('/api/v1/users/').get(getAllUsers).post(createUser);
// app.route('/api/v1/users/:id').get(getUser);

app.use('/api/v1/tours', tourRouter);


module.exports=app