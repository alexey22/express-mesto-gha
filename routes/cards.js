const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const isURL = require('validator/lib/isURL');

const BadRequest = require('../errors/badRequest');

const {
  getAllCards,
  createCard,
  deleteCard,
  addCardLike,
  deleteCardLike,
} = require('../controllers/cards');

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

router.get('/', getAllCards);

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      link: Joi.string().required().custom(validUrl),
    }),
  }),
  createCard,
);

router.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().custom(validId),
    }),
  }),
  addCardLike,
);

router.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().custom(validId),
    }),
  }),
  deleteCardLike,
);

router.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().custom(validId),
    }),
  }),
  deleteCard,
);

module.exports = router;
