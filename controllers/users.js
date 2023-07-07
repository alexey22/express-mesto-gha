const User = require('../models/user');

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (user) res.status(200).send(user);
      else {
        res.status(404).send({ message: 'Пользователь с данным id не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректный id не найден' });
      } else res.status(500).send({ message: 'Произошла ошибка сервера', err });
    });
};

const getAllUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка сервера' }));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
      } else {
        res.status(500).send({ message: 'Произошла ошибка сервера' });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about, avatar } = req.body;
  const owner = req.user._id;
  User.findByIdAndUpdate(
    owner,
    { name, about, avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      } else {
        res
          .status(404)
          .send({ message: 'Пользователь по указанному id не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при обновлении пользователя',
        });
      } else {
        res.status(500).send({ message: 'Произошла ошибка сервера' });
      }
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const owner = req.user._id;
  User.findByIdAndUpdate(owner, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      } else {
        res
          .status(404)
          .send({ message: 'Пользователь по указанному id не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при обновлении пользователя',
        });
      } else {
        res.status(500).send({ message: 'Произошла ошибка сервера' });
      }
    });
};

module.exports = {
  getUserById,
  getAllUsers,
  createUser,
  updateUser,
  updateUserAvatar,
};
