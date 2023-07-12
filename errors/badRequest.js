module.exports = class BadRequest extends Error {
  constructor(err) {
    super(err);
    this.statusCode = 400;
  }
};
