const express = require('express');

const users_router = require('./routers/users')

const app = express();
app.listen(3000)
app.use(express.json());
app.use('/users', users_router);
