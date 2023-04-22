const CREATED_CODE = 201;
const BAD_REQUEST_ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;
const INTERNAL_SERVER_ERROR_CODE = 500;

const User = require('../models/users');

const getUsers = (req, res) => {
  User.find()
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => {
      res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: `Произошла неизвестная ошибка ${err.name}: ${err.message}` });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: `Произошла неизвестная ошибка ${err.name}: ${err.message}` });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((newUser) => {
      res.status(CREATED_CODE).send({ data: newUser });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: `Произошла неизвестная ошибка ${err.name}: ${err.message}` });
      }
    });
};

const updateUserData = (req, res) => {
  const newUserData = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, newUserData, { new: true, runValidators: true })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: `Произошла неизвестная ошибка ${err.name}: ${err.message}` });
    });
};

const updateUserAvatar = (req, res) => {
  const newUserAvatar = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, newUserAvatar, { new: true, runValidators: true })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении аватара' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: `Произошла неизвестная ошибка ${err.name}: ${err.message}` });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUserData,
  updateUserAvatar,
};
