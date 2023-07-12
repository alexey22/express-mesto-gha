const BadRequest = require('../errors/badRequest');
const Forbidden = require('../errors/forbidden');
const NotFound = require('../errors/notFound');
const ServerError = require('../errors/serverError');
const Card = require('../models/card');

const getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(() => {
      // res.status(500).send({ message: 'Произошла ошибка сервера' });
      next(new ServerError('Произошла ошибка сервера'));
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // res.status(400).send({
        //   message: 'Переданы некорректные данные при создании карточки',
        // });
        next(
          new BadRequest('Переданы некорректные данные при создании карточки'),
        );
      } else {
        // res.status(500).send({ message: 'Произошла ошибка сервера' });
        next(new ServerError('Произошла ошибка сервера'));
      }
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  const userId = req.user._id;

  Card.findById(cardId).then((card) => {
    if (!card) {
      next(new NotFound('Удаляемая карточка с таким id не найдена'));
    } else if (!card.owner.equals(req.user._id)) {
      next(
        new Forbidden(
          'Пользователь не может удалять карточки других пользователей',
        ),
      );
    } else {
      Card.findByIdAndRemove(cardId, { new: true })
        .then((findedCard) => {
          if (findedCard) {
            res.status(200).send(findedCard);
          } else {
            // res
            //   .status(404)
            //   .send({ message: 'Удаляемая карточка с таким id не найдена' });
            next(new NotFound('Удаляемая карточка с таким id не найдена'));
          }
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            // res.status(400).send({ message: 'Некорректный id карточки' });
            next(new BadRequest('Некорректный id карточки'));
          } else {
            // res.status(500).send({ message: 'Произошла ошибка' });
            next(new ServerError('Произошла ошибка сервера'));
          }
        });
    }
  });
};

const addCardLike = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.status(200).send(card);
      } else {
        // res.status(404).send({ message: 'Карточка с таким id не найдена' });
        next(new NotFound('Карточка с таким id не найдена'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // res.status(400).send({ message: 'Некорректный id карточки' });
        next(new BadRequest('Некорректный id карточки'));
      } else {
        // res.status(500).send({ message: 'Произошла ошибка' });
        next(new ServerError('Произошла ошибка сервера'));
      }
    });
};

const deleteCardLike = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .then((card) => {
      if (card) {
        res.status(200).send(card);
      } else {
        // res.status(404).send({ message: 'Карточка с таким id не найдена' });
        next(new NotFound('Карточка с таким id не найдена'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // res.status(400).send({ message: 'Некорректный id карточки' });
        next(new BadRequest('Некорректный id карточки'));
      } else {
        // res.status(500).send({ message: 'Произошла ошибка' });
        next(new ServerError('Произошла ошибка сервера'));
      }
    });
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  addCardLike,
  deleteCardLike,
};
