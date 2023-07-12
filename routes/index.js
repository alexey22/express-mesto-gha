const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const isURL = require('validator/lib/isURL');
const isEmail = require('validator/lib/isEmail');
const BadRequest = require('../errors/badRequest');

const auth = require('../middlewares/auth');
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const notFoundRoute = require('./notFound');

const { createUser, login } = require('../controllers/users');

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

router.post(
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

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email().custom(validEmail),
      password: Joi.string().required(),
    }),
  }),
  login,
);

router.use(auth);

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use('*', notFoundRoute);

module.exports = router;
