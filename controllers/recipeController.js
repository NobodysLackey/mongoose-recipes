const Recipe = require('../models/Recipe.js')

const createRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.create(req.body)
    // The only way this works this simply is if the request body being sent properly matches your model
    res.redirect(`/recipes/${recipe._id}`)
  } catch (error) {
    console.error('⚠️ An error has occurred creating a recipe!', error.message)
    res.render(`./errors/oops.ejs`, { error })
  }
}

const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({})
    // findAll returns an array of every document that matches the criteria. In this case, your options object is empty (so there's no criteria).
    res.render('./recipes/all.ejs', { recipes })
  } catch (error) {
    console.error('⚠️ An error has occurred getting all recipes!', error.message)
    res.render(`./errors/oops.ejs`, { error })
  }
}

const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('author')
    // Goes ahead and populates all of the user information as well (optional)
    res.render('./recipes/show.ejs', { recipe })
  } catch (error) {
    console.error('⚠️ An error has occurred getting a recipe!', error.message)
    res.render(`./errors/oops.ejs`, { error })
  }
}

const updateRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after"
    })
    // req.body overwrites any matching fields with the new values. Only the updated fields are necessary.
    // { returnDocument: "after" } ensures that the updated record is what is returned
    res.redirect(`/recipes/${recipe._id}`)
  } catch (error) {
    console.error('⚠️ An error has occurred updating a recipe!', error.message)
    res.render(`./errors/oops.ejs`, { error })
  }
}

const deleteRecipeById = async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id)
    // No need to store this in a variable since it's being deleted
    res.render('./recipes/confirm.ejs')
  } catch (error) {
    console.error('⚠️ An error has occurred deleting a recipe!', error.message)
    res.render(`./errors/oops.ejs`, { error })
  }
}

module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipeById,
  deleteRecipeById
}
