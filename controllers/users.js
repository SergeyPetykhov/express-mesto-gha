const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const {
  CREATED_CODE,
  BAD_REQUEST_ERROR_CODE,
  UNAUTHORIZED_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  CONFLICT_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require('../constants/constants');

const AuthorizationError = require('../errors/AuthorizationError');

const User = require('../models/users');

const getUsers = (req, res, next) => {
  User.find()
    .then((users) => {
      res.send({ data: users });
    })
    .catch(next);
    // .catch(() => {
    //   res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла неизвестная ошибка на сервере' });
    // });
};

const getUserMe = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
    // .catch((err) => {
    //   if (err.name === 'CastError') {
    //     res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Передан некорректный _id пользователя' });
    //     return;
    //   }
    //   if (err.name === 'DocumentNotFoundError') {
    //     res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь с указанным _id не найден' });
    //     return;
    //   }
    //   res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла неизвестная ошибка на сервере' });
    // });
};

const getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
    // .catch((err) => {
    //   if (err.name === 'CastError') {
    //     res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Передан некорректный _id пользователя' });
    //     return;
    //   }
    //   if (err.name === 'DocumentNotFoundError') {
    //     res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь с указанным _id не найден' });
    //     return;
    //   }
    //   res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла неизвестная ошибка на сервере' });
    // });
};

const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        email,
        password: hash,
        name,
        about,
        avatar,
      })
        .then((newUser) => {
          const data = newUser.toObject();
          delete data.password;
          res.status(CREATED_CODE).send(data);
        })
        .catch(next);
        // .catch((err) => {
        //   if (err.name === 'ValidationError') {
        //     res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' });
        //     return;
        //   }
        //   if (err.code === 11000) {
        //     res.status(CONFLICT_ERROR_CODE).send({ message: 'Пользователь с таким E-mail уже существует' });
        //     return;
        //   }
        //   res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла неизвестная ошибка на сервере' });
        // });
    })
    .catch(next);
    // .catch(() => {
    //   res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла неизвестная ошибка на сервере' });
    // });
};

const updateUserData = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
    // .catch((err) => {
    //   if (err.name === 'CastError') {
    //     res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Передан некорректный _id пользователя' });
    //     return;
    //   }
    //   if (err.name === 'DocumentNotFoundError') {
    //     res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь с указанным _id не найден' });
    //     return;
    //   }
    //   if (err.name === 'ValidationError') {
    //     res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля' });
    //     return;
    //   }
    //   res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла неизвестная ошибка на сервере' });
    // });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
    // .catch((err) => {
    //   if (err.name === 'CastError') {
    //     res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Передан некорректный _id пользователя' });
    //     return;
    //   }
    //   if (err.name === 'DocumentNotFoundError') {
    //     res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь с указанным _id не найден' });
    //     return;
    //   }
    //   if (err.name === 'ValidationError') {
    //     res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении аватара' });
    //     return;
    //   }
    //   res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла неизвестная ошибка на сервере' });
    // });
};

const login = (req, res, next) => {
  const {
    email,
    password,
  } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        // res.status(UNAUTHORIZED_ERROR_CODE).send({ message: 'Неправильные почта или пароль' });
        // return;
        return next(new AuthorizationError('Неправильные почта или пароль'));
      }

      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            // res.status(UNAUTHORIZED_ERROR_CODE).send({ message: 'Неправильные почта или пароль' });
            // return;
            return next(new AuthorizationError('Неправильные почта или пароль'));
          }

          const token = jwt.sign({ _id: user._id }, 'SECRET_KEY', { expiresIn: '7d' }); // HARDCODE SECRET_KEY
          // eslint-disable-next-line consistent-return
          return res.send({ JWT: token });
        });
    })
    .catch(next);
    // .catch(() => {
    //   res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла неизвестная ошибка на сервере' });
    // });
};

module.exports = {
  getUsers,
  getUser,
  getUserMe,
  updateUserData,
  updateUserAvatar,
  createUser,
  login,
};
