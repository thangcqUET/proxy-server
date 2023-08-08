const express = require('express');
const axios = require('axios');
const cors = require('cors');
const productsRouter = require('./src/routes/products.router')
const articlesRouter = require('./src/routes/articles.router')
const app = express();
require('dotenv').config()

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.json({'message': 'ok'});
})

/* Router */
app.use('/products', productsRouter)
app.use('/articles', articlesRouter)
app.use("/jaxsta", async (req, res) => {
  let tail = req.originalUrl.replace('/jaxsta','');
  let response = await axios.get(
    `https://api.jaxsta.io/${tail}`
  );
  res.json(response.data);
});
/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({'message': err.message});
  return;
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});