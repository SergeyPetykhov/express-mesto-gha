const NOT_FOUND_ERROR_CODE = 404;

const express = require('express');
const mongoose = require('mongoose');
const { userRouter } = require('./routes/users');
const { cardRouter } = require('./routes/cards');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());

// HARDCODE USER_ID
app.use((req, res, next) => {
  req.user = {
    _id: '64425a3174e66fb4415e48b9', // 64425a3174e66fb4415e48b9 - HARDCODE USER_ID
  };

  next();
});

app.use(userRouter);
app.use(cardRouter);
app.use('*', (req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Неправильно укзана запрос' });
});

app.listen(PORT, () => {
  console.log(`Сервер открыт на порту: ${PORT}`);
});
