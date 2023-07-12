/* eslint-disable max-classes-per-file */
// class AbstractError extends Error {
//   constructor(err) {
//     super(err);
//     this.message = err.body;
//     this.statusCode = err.statusCode;
//   }
// }

const errorHandler = (err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
  next();
};

module.exports = errorHandler;
