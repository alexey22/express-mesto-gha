require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const isURL = require('validator/lib/isURL');
const isEmail = require('validator/lib/isEmail');

const { createUser, login } = require('./controllers/users');
const errorHandler = require('./middlewares/error');
const BadRequest = require('./errors/badRequest');

const { PORT = 3000, BASE_PATH } = process.env;
const app = express();

const router = require('./routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  family: 4,
});

const validEmail = (email) => {
  const validate = isEmail(email);
  if (validate) {
    return email;
  }
  throw new BadRequest('Некорректный email');
};

const validUrl = (url) => {
  const validate = isURL(url);
  if (validate) {
    return url;
  }
  throw new BadRequest('Некорректный URL');
};

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().custom(validUrl),
      email: Joi.string().required().email().custom(validEmail),
      password: Joi.string().min(8).required(),
    }),
  }),
  createUser,
);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email().custom(validEmail),
      password: Joi.string().required(),
    }),
  }),
  login,
);

app.use(router);

app.use(errors()); // обработчик ошибок celebrate

app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Ссылка на сервер');
  // eslint-disable-next-line no-console
  console.log(BASE_PATH);
});
