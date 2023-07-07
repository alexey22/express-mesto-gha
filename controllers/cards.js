const Card = require('../models/card');

const getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка сервера' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при создании карточки',
        });
      } else {
        res.status(500).send({ message: 'Произошла ошибка сервера' });
      }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (card) {
        res.status(200).send(card);
      } else {
        res.status(400).send({ message: 'Удаляемая карточка не найдена' });
      }
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const addCardLike = (req, res) => {
  const { cardId } = req.params;
  const { userId } = req.user._id;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.status(200).send(card);
      } else {
        res.status(404).send({ message: 'Карточка с таким id не найдена' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректный id карточки' });
      } else res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const deleteCardLike = (req, res) => {
  const { cardId } = req.params;
  const { userId } = req.user._id;
  Card.findByIdAndRemove(cardId, { $pull: { likes: userId } }, { new: true })
    .then((card) => {
      if (card) {
        res.status(200).send(card);
      } else {
        res.status(404).send({ message: 'Карточка с таким id не найдена' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректный id карточки' });
      } else res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  addCardLike,
  deleteCardLike,
};
