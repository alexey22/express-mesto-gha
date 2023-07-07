const router = require('express').Router();

const {
  getAllCards,
  createCard,
  deleteCard,
  addCardLike,
  deleteCardLike,
} = require('../controllers/cards');

router.get('/', getAllCards);

router.post('/', createCard);

router.delete('/:cardId', deleteCard);

router.put('/:cardId/likes', addCardLike);

router.delete('/:cardId/likes', deleteCardLike);

module.exports = router;
