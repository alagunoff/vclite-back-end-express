const express = require('express');
const db = require('./configs/db')

const users_router = require('./routers/users')

const app = express();

app.use(express.json());
app.use('/users', users_router);

db
  .sync({ alter: true })
  .then(result => {
    console.log("Database connected");
    app.listen(3000);
  })
  .catch(err => console.log(err));