module.exports = class NotFound extends Error {
  constructor(err) {
    super(err);
    this.statusCode = 404;
  }
};
