const express = require('express');
const router = express.Router();

const articlesController = require('../controllers/articles.controller')

router.get('/',articlesController.getAllArticles)

module.exports = router;