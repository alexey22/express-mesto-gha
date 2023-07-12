module.exports = class ServerError extends Error {
  constructor(err) {
    super(err);
    this.statusCode = 500;
  }
};
