const productsService = require('../services/products.service')

async function getAllProducts(req, res, next) {
  res.json(await productsService.findAll(req, res))
}

module.exports = {
  getAllProducts,
};