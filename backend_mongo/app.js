//iniotialising variables.
const express = require('express');
const app = express();
require('dotenv/config');
const port = process.env.PORT || 3000;
const productRouter = require('./routes/products');
const categoryRouter = require('./routes/categories');
const userRouter = require('./routes/users');
const orderRouter = require('./routes/orders');
const morgan = require('morgan');
const api = process.env.API_URI;
const { connectDB } = require('./config');
const Protect = require('./authMiddleware/jwt');
const { errorHandler } = require('./authMiddleware/errorHandler');
connectDB();
//middlewares

app.use(morgan('tiny'));
app.use(express.json());
app.use('/public/uploads/', express.static(__dirname + '/public/uploads/'));
app.use(Protect());
app.use(errorHandler);

// routes
app.use(`${api}/products`, productRouter);
app.use(`${api}/categories`, categoryRouter);
app.use(`${api}/users`, userRouter);
app.use(`${api}/orders`, orderRouter);

app.listen(port, () => {
  console.log(`server is running now on ${port}`);
});
