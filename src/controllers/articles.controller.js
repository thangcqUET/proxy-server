const articlesService = require('../services/articles.service')

async function getAllArticles(req, res, next) {
  res.json(await articlesService.findAll(req, res))
}

module.exports = {
  getAllArticles,
};