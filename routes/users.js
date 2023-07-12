const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const isURL = require('validator/lib/isURL');

const BadRequest = require('../errors/badRequest');

const {
  getAllUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
  getUser,
} = require('../controllers/users');

const validUrl = (url) => {
  const validate = isURL(url);
  if (validate) {
    return url;
  }
  throw new BadRequest('Некорректный адрес URL');
};

const validId = (id) => {
  if (/^[0-9a-fA-F]{24}$/.test(id)) {
    return id;
  }
  throw new BadRequest('Передан некорретный id.');
};

router.get('/me', getUser);

router.get('/', getAllUsers);

router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().required().custom(validId),
    }),
  }),
  getUserById,
);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(30).required(),
    }),
  }),
  updateUser,
);

router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().custom(validUrl),
    }),
  }),
  updateUserAvatar,
);

module.exports = router;
