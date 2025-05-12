const User = require('../models/User.js')
const Recipe = require('../models/Recipe.js')

const createRecipe = async (req, res) => {
  try {
    const user = await User.findById(req.body.author)
    // Returns the full user object
    const recipe = await Recipe.create(req.body)
    // The only way this works this simply is if the request body being sent properly matches your model
    user.recipes.push(recipe._id)
    // The MongoDB ObjectID is what needs to be in this array for the reference to work
    user.save()
    res.redirect(`/recipes/${recipe._id}`)
  } catch (error) {
    console.error('An error has occurred creating a recipe!', error.message)
  }
}

const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({})
    // findAll returns an array of every document that matches the criteria. In this case, our options object is empty (so there's no criteria).
    res.render('./recipes/all.ejs', { recipes })
  } catch (error) {
    console.error('An error has occurred getting all recipes!', error.message)
  }
}

const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('author')
    res.render('./recipes/show.ejs', { user: req.session.user, recipe })
  } catch (error) {
    console.error('An error has occurred getting a recipe!', error.message)
  }
}

const updateRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    })
    // req.body overwrites any matching fields with the new values. Only the updated fields are necessary.
    // { new: true } ensures that the updated record is what is returned
    res.redirect(`/recipes/${recipe._id}`)
  } catch (error) {
    console.error('An error has occurred updating a recipe!', error.message)
  }
}

const deleteRecipeById = async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id)
    // No need to store this in a variable since it's being deleted
    res.render('./recipes/confirm.ejs')
  } catch (error) {
    console.error('An error has occurred deleting a recipe!', error.message)
  }
}

module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipeById,
  deleteRecipeById
}
