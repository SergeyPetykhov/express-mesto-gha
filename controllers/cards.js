const {
  CREATED_CODE,
  BAD_REQUEST_ERROR_CODE,
  UNAUTHORIZED_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require('../constants/constants');

const AuthorizationError = require('../errors/AuthorizationError');

const Card = require('../models/cards');

const getCards = (req, res, next) => {
  Card.find()
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(next);
    // .catch(() => {
    //   res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла неизвестная ошибка на сервере' });
    // });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  Card.create({ name, link, owner: ownerId })
    .then((newCard) => {
      res.status(CREATED_CODE).send({ data: newCard });
    })
    .catch(next);
    // .catch((err) => {
    //   if (err.name === 'ValidationError') {
    //     res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании карточки' });
    //   } else {
    //     res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла неизвестная ошибка на сервере' });
    //   }
    // });
};

const deleteСard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findById(cardId)
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => {
      const ownerId = card.owner._id.toString();

      if (userId === ownerId) {
        Card.findByIdAndRemove(cardId)
          .orFail()
          .then(() => {
            res.send({ message: 'Карточка удалена' });
          })
          .catch(next);
          // .catch((err) => {
          //   if (err.name === 'DocumentNotFoundError') {
          //     res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Передан несуществующий _id карточки' });
          //     return;
          //   }
          //   if (err.name === 'CastError') {
          //     res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Передан некорректный _id карточки' });
          //     return;
          //   }
          //   res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла неизвестная ошибка на сервере' });
          // });
      } else {
       // res.status(UNAUTHORIZED_ERROR_CODE).send({ message: 'Нет прав для удаления этой карточки' });
       return next(new AuthorizationError('Нет прав для удаления этой карточки'));
      }
    })
    .catch(next);
    // .catch((err) => {
    //   if (err.name === 'DocumentNotFoundError') {
    //     res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Передан несуществующий _id карточки' });
    //     return;
    //   }
    //   if (err.name === 'CastError') {
    //     res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Передан некорректный _id карточки' });
    //     return;
    //   }
    //   res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла неизвестная ошибка на сервере' });
    // });
};

const likeCard = (req, res, next) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })
    .orFail()
    .then((card) => {
      res.send({ data: card });
    })
    .catch(next);
    // .catch((err) => {
    //   if (err.name === 'DocumentNotFoundError') {
    //     res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Передан несуществующий _id карточки' });
    //     return;
    //   }
    //   if (err.name === 'CastError') {
    //     res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Передан некорректный _id карточки' });
    //     return;
    //   }
    //   if (err.name === 'ValidationError') {
    //     res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки лайка' });
    //     return;
    //   }
    //   res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла неизвестная ошибка на сервере' });
    // });
};

const dislikeCard = (req, res, next) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .orFail()
    .then((card) => {
      res.send({ data: card });
    })
    .catch(next);
    // .catch((err) => {
    //   if (err.name === 'DocumentNotFoundError') {
    //     res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Передан несуществующий _id карточки' });
    //     return;
    //   }
    //   if (err.name === 'CastError') {
    //     res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Передан некорректный _id карточки' });
    //     return;
    //   }
    //   if (err.name === 'ValidationError') {
    //     res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы некорректные данные для снятия лайка' });
    //     return;
    //   }
    //   res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла неизвестная ошибка на сервере' });
    // });
};

module.exports = {
  getCards,
  createCard,
  deleteСard,
  likeCard,
  dislikeCard,
};
