module.exports = class BadRequest extends Error {
  constructor(err) {
    super(err);
    if (err === 'Пользователь с таким email уже существует') {
      this.statusCode = 409;
    } else this.statusCode = 400;
  }
};
