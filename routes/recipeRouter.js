const express = require('express')
const router = express.Router()

const middleware = require('../middleware')

const recipeController = require('../controllers/recipeController.js')

const Recipe = require('../models/Recipe.js')

router.post('/', middleware.isSignedIn, recipeController.createRecipe)
router.get('/', recipeController.getAllRecipes)
router.get('/new', middleware.isSignedIn, (req, res) => {
  res.render('./recipes/new.ejs')
})
router.get('/:id', recipeController.getRecipeById)
router.put('/:id', middleware.isSignedIn, recipeController.updateRecipeById)
router.delete('/:id', middleware.isSignedIn, recipeController.deleteRecipeById)

router.get('/:id/edit', middleware.isSignedIn, async (req, res) => {
  const recipe = await Recipe.findById(req.params.id)
  res.render('./recipes/edit.ejs', { recipe })
})

module.exports = router
