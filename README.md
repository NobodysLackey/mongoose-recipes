# Mongoose Recipes

![Michael & Patch Cook Dinner](./images/hero.png)


## Description

In this codealong, you will build a full stack MEN (Mongoose Express Node) application with full CRUD operations and user authentication.  The goal will be to build an app where user's can sign up, sign in, sign out, change their password, and create, read, update, and delete recipes.

You can go [here](https://mongoose-recipes.fly.dev/) and see a deployed version of what you plan to build.


## Getting Started

- **Fork** and **Clone** this repository
- `cd` into the newly cloned directory
- `code .` to open in VS Code

As you go through this codealong, feel free to push your changes up to GitHub after each step!

```sh
git add .
git commit -m "some descriptive message"
git push origin main
```


## 📖 Table of Contents

- [Setting Up Your Node Environment](#setting-up-your-node-environment)
- [Installing Necessary Packages](#installing-necessary-packages)
- [Ensuring Git Ignores Certain Files/Folders](#ensuring-git-ignores-certain-filesfolders)
- [Setting Up Your Express Server](#setting-up-your-express-server)
- [Connecting Your MongoDB Database](#connecting-your-mongodb-database)
- [Creating Models with the Mongoose Schema Class](#creating-models-with-the-mongoose-schema-class)
- [Setting Up CRUD Operations](#setting-up-crud-operations)
- [Auth CRUD Functionality](#auth-crud-functionality)
- [User CRUD Functionality](#user-crud-functionality)
- [Recipe CRUD Functionality](#recipe-crud-functionality)
- [Reflecting on the Server Build](#reflecting-on-the-server-build)
- [Creating Your EJS Views](#creating-your-ejs-views)
- [Styling (optional)](#styling-optional)
- [Recap & Resources](#recap)

![Req/Res Cycle](./images/req-res-cycle.png)


## Setting Up Your Node Environment

First off, you will need to initialize your Node environment so that you can run your server and install and utilize various libraries and packages. In order to do this, you'll run the following command in your terminal:

```sh
npm init -y
```

The `-y` ensures that `yes` is answered to all of the default setup questions.

When this completes, you will see a `package.json` file generated in your project directory. This is the "instructions" for your application. It contains important info, and eventually will contain a list of packages that are necessary for your app to run.

[📖 Back to Top](#-table-of-contents)

---


## Installing Necessary Packages

Let's install a few things you're going to need. In your terminal:

```sh
npm install express morgan dotenv mongoose ejs method-override express-session bcrypt
```

Let's break each of these down:

- `express` - a library that will give you tools to run back-end server software
- `morgan` - a library that gives you useful "logging" in your terminal when the request/response cycle occurs
- `dotenv` - a library that allows your JavaScript files to extract environment variables from a `.env` file
- `mongoose` - a library that enables you to set up Schema structures and provides methods for performing CRUD operations on your MongoDB database
- `ejs` - the templating engine that allows you to send HTML (ejs) snippets to your browser from the server side
- `method-override` - allow you to perform PUT/DELETE functionality from an HTML form
- `express-session` - is required for authentication and allows your Express server to access the `session` object
- `bcrypt` - used to *hash* and *compare* your user's password when setting up your session authentication

Once these installs complete, you should see them listed alongside their version numbers in the `"dependencies"` key of your `package.json` file.  A `node_modules` folder and a `package-lock.json` file will also be generated. 

[📖 Back to Top](#-table-of-contents)

---


## Ensuring Git Ignores Certain Files/Folders

Next, you'll need to make sure that things like your `node_modules` folder do not get tracked by git as you work on your project. In your terminal:

```sh
touch .gitignore
```

This file should reside in the root of your project - same level as your `package.json`. 

Anything you put in this file will not be tracked by git.

For now, put:

```txt
/node_modules
package-lock.json
```

***ALWAYS put `/node_modules` in your gitignore. It is bad practice to push up these files. Putting your `package-lock.json` is an optional step since it contains install information for your specific operating system.***

[📖 Back to Top](#-table-of-contents)

---


## Setting Up Your Express Server

You need a file to set up your Express server in. By convention, you'll create a `server.js` file in the root of your repository.

```sh
touch server.js
```

In this file, you'll require the Express library.

```js
const express = require('express')
```

You also will want to require and set up Morgan for logging.

```js
const logger = require('morgan')
```

Next, you'll require Method Override. You'll need this later when you set up your forms.

```js
const methodOverride = require('method-override')
```

This app will have authentication, so you will also need to set up Express Session.

```js
const session = require('express-session')
```

Require `dotenv` and immediately invoke the `.config()` method so you can access your `.env` file.

```js
require('dotenv').config()
```

Now that you've required these libraries, you need to put them to use. Below your requires:

```js
const app = express()

app.use(logger('dev'))

app.use(methodOverride('_method'))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
```

Note that the `session` method takes in an object with three key/value pairs:

1.  Your app secret that you will set up in your `.env` later
2.  An option called **"resave"** set to `false` to ensure that the session object is only restored if modified
3.  An option called **"saveUninitialized"** set to `true` to ensure that a session object is saved even if it contains no data

You also need to to use two middleware functions from `express`:
- `express.json()` - Parses incoming requests with JSON payloads and makes the data available on `req.body`
- `express.urlencoded()` - Parses URL-encoded data (from forms) and makes it available on `req.body`

Below your logger...

```js
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
```

`{ extended: false }` is the option (default) for basic form parsing and will work for most forms. Setting to `true` is for complex forms with arrays and objects as form data.

Let's also set up a base route with a simple response for now.

```js
app.get('/', (req, res) => {
  res.send('Your app is connected . . . ')
})
```

Just under your requires, set up your `PORT` variable following real-world best practices...

```js
const PORT = process.env.PORT ? process.env.PORT : 3000
```

Finally, at the bottom of the file, let's listen on this `PORT` for your server to receive requests.

```js
app.listen(PORT, () => {
  console.log(`Running Server on Port ${PORT} . . . `)
})
```

· · · · · · · · · · · · · · · · · · · ·

<details>
<summary>💡 Your <b>server.js</b> file should look like this so far . . . </summary>

<br>

```js
const express = require('express')
const logger = require('morgan')
const methodOverride = require('method-override')
const session = require('express-session')
require('dotenv').config()

const PORT = process.env.PORT ? process.env.PORT : 3000

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
)

app.get('/', (req, res) => {
  res.send('Your app is connected . . . ')
})

app.listen(PORT, () => {
  console.log(`Running Server on Port ${PORT} . . . `)
})
```

</details>

· · · · · · · · · · · · · · · · · · · ·

[📖 Back to Top](#-table-of-contents)

---


### Running and Testing Your Server

Now that your basic Express server is set up to run, you need to test it out.

In your `package.json` file, let's add a script to run your server. There are two options for this:

· · · · · · · · · · · · · · · · · · · ·

<details>
<summary> 🪛 <b>nodemon</b></summary>

<br>

The npm package [nodemon](https://www.npmjs.com/package/nodemon) is a dev tool that automatically restarts your server when it detects changes in your files. To use `nodemon`, it's best to install it globally on your system (if you have not already):

```sh
npm install -g nodemon
```

Then, add this `start` script to your `package.json`:

```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "start": "nodemon server.js"
},
```

If you choose to use `nodemon`, you don't even technically have to use this "start" script. You can simply run `nodemon` in your terminal and it will automatically run your server file!  

In your `package.json`, simply change `"main": "index.js"` to `"main": "server.js"` and `nodemon` will automatically know what file to run.

```json
{
  "name": "mongoose-recipes",
  "version": "1.0.0",
  "main": "server.js",
}
```

</details>

· · · · · · · · · · · · · · · · · · · ·

<details>
<summary>🪛 <b>node --watch</b></summary>

<br>

`node --watch` is a built-in Node flag (as of version 18) that restarts your app when watched files change — similar to `nodemon`, but without having to install an extra dependency.

To use, just add this `start` script to your `package.json`:

```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "start": "node --watch server.js"
},
```
</details>

· · · · · · · · · · · · · · · · · · · ·

Whichever you choose is up to you.

After your script is set up, you can run your server. In your terminal:

```sh
npm start
```

You should see:

```txt
Running Server on Port 3000 . . . 
```

Now let's make a request to `'http://localhost:3000/'` with [Insomnia](https://insomnia.rest/) or [Postman](https://www.postman.com/downloads/) to test your base route.

The response you get should be `Your app is connected . . . `. You will eventually replace this with your rendered EJS home page. This is just a test to make sure your server is set up properly.

For now, let's stop your server by pressing <kbd>Ctrl</kbd> + <kbd>C</kbd>.

[📖 Back to Top](#-table-of-contents)

---


## Connecting Your MongoDB Database


### Environment Variables

First, let's set up a file where you can hide secure information - a `.env` file.

In terminal:

```sh
touch .env
```

This file should reside in the root of your project - same level as your `package.json`.

You definitely don't want to push this file to GitHub, so let's immediately add it to the bottom of your `.gitignore` file.

```txt
/node_modules
package-lock.json
.env
```

Leave the `.env` file empty for now.

[📖 Back to Top](#-table-of-contents)

---


### Getting Your Connection String

You need to allow your server to access your database on [MongoDB Atlas](https://www.mongodb.com/atlas). To do this, you will always need your secure connection string. 

To access this, [sign in](https://account.mongodb.com/account/login) to Atlas.

Once you arrive on the "Overview" page, click the "CONNECT" button as shown below:

![connect](./images/connect.png)

Select the only option under the "Connect to your application" header - "Drivers":

![drivers](./images/drivers.png)

Skip past steps 1 & 2. On Step 3, click the copy button to add the connection string to your clipboard. You do not need to do anything else on this page. Just click "Close".

![string](./images/string.png)

[📖 Back to Top](#-table-of-contents)

---


### Setting Up the .env File

You will take this string and paste it into your `.env` file under the variable name `MONGODB_URI`, by convention. Like this:

```txt
MONGODB_URI=mongodb+srv://<your_username>:<db_password>@<cluster_name>.qscuy.azure.mongodb.net/<database-name>?retryWrites=true&w=majority&appName=cluster_name
```

Yours may look completely different than the example above due to the host and region you selected on setup, and that is fine. After pasting your connection string, you need to replace `<db_password>` with *your* database password. Replace the `< >` as well.

There are a few query parameters at the end of the connection string. Each serves a unique purpose. 

· · · · · · · · · · · · · · · · · · · ·

<details>
<summary> 🪛 A breakdown of each <b>query parameter</b> . . . </summary>

<br>

```txt
retryWrites=true
```

This first query parameter tells MongoDB to automatically retry write operations (like insert, update, delete) *once* if they fail due to an error like a dropped connection.

This is recommended to **keep**.

```txt
w=majority
```

When MongoDB saves our data, it does so on multiple servers to ensure data is not lost. `w=majority` tells MongoDB not to return a *success code* until a **majority** of these servers have successfully received this data.

This is best to **keep** for production code.

```txt
appName=cluster_name
```

This is just a label for your connection in logs/monitoring tools.

You can **keep** it and name it whatever you want or **remove** it.

</details>

· · · · · · · · · · · · · · · · · · · ·

Now, you need to name your new database. In the connection string, right after `mongodb.net/` but before the `?`, write the name of the database you are building.

For this app, you'll say `mongoose-recipes`. 

If you do not specify the database, MongoDB will use `test` by default. You don't want that.

Next, since you're already in your `.env`, you need to go ahead and set your `SESSION_SECRET` for later.

```txt
SESSION_SECRET=areallyrandomandlongstring
```

This can be any string. Unpredictable and random is best. It's the fact that only *you* have it that makes it secure.

Save your `.env` file. If you left your server running, you'll need to restart it now. 

***Your server always needs to restart after changes to a `.env` file.***

[📖 Back to Top](#-table-of-contents)

---


### Connecting to the Database

In your terminal, let's create a `db` directory.

```sh
mkdir db
```

In this directory, you'll need an `index.js` file.

```sh
touch ./db/index.js
```

You'll use this file to establish a connection to your database with `mongoose`.

```js
const mongoose = require("mongoose")

mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on("connected", () => {
  console.log(`Successfully connected to MongoDB database . . .`)
})

module.exports = mongoose
```

In order for this to occur when you run your server, you just need to require this file at the top of your `server.js`. This will run the file, and automatically execute your mongoose connection.

In `server.js`, just below your other requires...

```js
const db = require('./db')
```

Now, you run your server and watch your database connection occur!

```sh
npm start
```

You should now see:

```txt
Running Server on Port 3000 . . . 
Successfully connected to MongoDB database . . .
```

[📖 Back to Top](#-table-of-contents)

---

![Michael & Patch Choose a Recipe](./images/recipe.png)


## Creating Models with the Mongoose Schema Class

One of the things that Mongoose allows you to do is to set up templates or *schemas* for your MongoDB documents to follow. This ensures that each document is inserted in the database in a designated way, preventing errors. This takes a non-relational / noSQL database, and gives it many of the advantages of a relational / SQL database. It's the best of both worlds!


---

### Mapping Your Application with an ERD

ERD stands for **E**ntity **R**elationship **D**iagram. We use this as a way of planning your database structure and devising your models. In this app, you want to have Users that can sign up, sign in, and add many Recipes. So you'll need two models - **User** and **Recipe**. When making an ERD, think of the fields and datatypes you will need, as well as the relationships between your models. In this case, you'll establish a ***One to Many*** relationship. Here is the ERD you will need for this app:

![ERD](./images/erd.png)

There are many different tools you can use for creating an ERD. This one was made with [Canva](http://www.canva.com), but you could use anything. I've listed a few options in the [Resources Section](#-resources).

Now that you have your plan in place, let's start setting up your model files.

[📖 Back to Top](#-table-of-contents)

---


### Creating Your User Model

Let's start off by making a `models` directory.

```sh
mkdir models
```

In this folder, you'll create a file for the particular resource you want a schema for. For this app, since you will have authentication, you will need a `User` model. By convention, when you name this file, the resource is **singular** and **PascalCased** since it represents the template you will follow for a *single* document. Name the file `User.js`.

```sh
touch ./models/User.js
```

In this file, you'll need access to the `mongoose` object, so let's require that.

```js
const mongoose = require('mongoose')
```

Now, you'll need a new instance of the *Schema class* from Mongoose. In JavaScript, classes can be used to create reusable objects that all share similar properties and methods (built-in functions).  Mongoose uses this to create a new model for you. By convention, the name of this variable will be your resource + Schema to clearly designate it.

```js
const userSchema = new mongoose.Schema({

})
```

The *new* keyword says to JavaScript that you want a brand new object generated from the `mongoose.Schema` class. When this happens, the object you get back has all the properties and methods available to Schemas in Mongoose. 

Inside of this, you simply need to pass in a few options to set up your model. You want to tell it the different key/value pairs you want and the datatypes that you expect them to be.

For your User model, let's reference your [ERD](#mapping-your-application-with-an-erd) (**e**ntity **r**elationship **d**iagram) to take note of the fields you'll need. Notice that the datatype options are capitalized.

You'll *require* `first`, `last`, `email`, and `password`.

`{ timestamps: true }` as a secondary argument to `Schema` ensures that you receive `createdAt` and `updatedAt` fields when the document is created/updated in MongoDB.

```js
const userSchema = new mongoose.Schema(
  {
    first: { type: String, required: true },
    last: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    picture: { type: String }
  },
  { timestamps: true }
)
```

Then, you need to use Mongoose's `.model()` method to turn your regular schema into a true model, giving it much more abilities! You do that with this line:

```js
const User = mongoose.model('User', userSchema)
```

By convention, the first argument to this method will be a *PascalCased* string of your collection name - in this case, `"User"`. The second argument is the `userSchema` variable from above.

Now you export it so that you can utilize it elsewhere in your app.

```js
module.exports = User
```

Your model is now ready to be used to perform CRUD operations on your database!

· · · · · · · · · · · · · · · · · · · ·

<details>
<summary>💡 Final <b>User</b> Model file . . . </summary>

<br>

```js
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    first: { type: String, required: true },
    last: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    picture: { type: String }
  },
  { timestamps: true }
)

const User = mongoose.model('User', userSchema)

module.exports = User
```

</details>

· · · · · · · · · · · · · · · · · · · ·

[📖 Back to Top](#-table-of-contents)

---


### Creating Your Recipe Model

You'll follow the same pattern for setting up your Recipe model. First, you need your file...

```sh
touch ./models/Recipe.js
```

In this file, you'll need access to the `mongoose` object, so let's require that again.

```js
const mongoose = require('mongoose')
```

Now, you'll need a new instance of the *Schema class* from Mongoose. By convention, the name of this variable will be your resource + Schema to clearly designate it.

```js
const recipeSchema = new mongoose.Schema({

})
```

For your Recipe model, let's reference your [ERD](#mapping-your-application-with-an-erd) (**e**ntity **r**elationship **d**iagram) again to take note of the fields you'll need.

You'll *require* `title`, `description`, and `author`. You'll also make sure to set up your *relationship* to the `User` model by making `author` an ObjectID.

You'll want `{ timestamps: true }` on these documents as well.

```js
const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
)
```

Then, you need to use Mongoose's `.model()` method again to turn your regular schema into a true model. You do that with this line:

```js
const Recipe = mongoose.model('Recipe', recipeSchema)
```

Now you export it so that you can utilize it elsewhere in your app.

```js
module.exports = Recipe
```

Your model is now ready to be used to perform CRUD operations on your database!

· · · · · · · · · · · · · · · · · · · ·

<details>
<summary>💡 Final <b>Recipe</b> Model file . . . </summary>

<br>

```js
const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
)

const Recipe = mongoose.model('Recipe', recipeSchema)

module.exports = Recipe
```

</details>

· · · · · · · · · · · · · · · · · · · ·

[📖 Back to Top](#-table-of-contents)

---


## Setting Up CRUD Operations


### Folder Structure

In order to keep your application organized and set up for future expansion and growth in functionality and scope, you will arrange your file structure in a certain way. 

Let's create two new folders...

```sh
mkdir routes controllers
```

In each of these folders, you'll have a file for each resource.  It's also a good idea to have a separate one for *auth* actions. Let's create these:

```sh
touch ./routes/userRouter.js ./routes/recipeRouter.js ./routes/authRouter.js
```

and...

```sh
touch ./controllers/userController.js ./controllers/recipeController.js ./controllers/authController.js
```

This creates a separate route and controller file for **User**, **Recipe**, and all of your **Auth** concerns.

- The *route files* will have assigned URL endpoints and references to their associated controller functions.

- The *controller files* will have all of the functions and their logic. This is where the actual querying of the database will occur.

[📖 Back to Top](#-table-of-contents)

---


### Following a Repeatable Pattern for Creating Each CRUD Operation

In this section, you'll follow the same pattern over and over as you set up each CRUD operation for each resource.

The pattern is:

1.  Define the route
2.  Set up the controller function
3.  Test in Insomnia/Postman

![Pattern](./images/pattern.png)

Creating and testing the EJS views should be done *after* you know all of your server functionality is working. In a real world application *or* your project, this same workflow should be followed. Planning, back-end, testing, *then* front-end, and more testing.

[📖 Back to Top](#-table-of-contents)

---


![Michael & Patch Do Some Prep](./images/ingredients.png)


## Auth CRUD Functionality

Following the pattern, you'll first set up the route.

These are the full routes you will be setting up in this section:

| HTTP Method | Route |
| :---: | :---: |
| [POST](#registering-a-user) | [http://localhost:3000/auth/sign-up](#registering-a-user) |
| [POST](#signing-in-a-user) | [http://localhost:3000/auth/sign-in](#signing-in-a-user) |
| [GET](#signing-out-a-user) | [http://localhost:3000/auth/sign-out](#signing-out-a-user) |

Let's head over to `server.js` and set up your base route (`'/auth'`) and link up your Router file.

At the top, just below your package requires, you need to require your router from `authRouter.js`:

```js
const authRouter = require('./routes/authRouter.js')
```

*Underneath* the middleware stack, but *above* your app entry point (`'/'`):

```js
app.use('/auth', authRouter)
```

This tells your application that any endpoint that starts with `'http://localhost:3000/auth'` needs to go to your `authRouter` for further routing.

[📖 Back to Top](#-table-of-contents)

---


### Registering a User

Now, over in `authRouter.js`, let's set everything up. First, require `express` and set up the `router` object.

```js
const express = require('express')
const router = express.Router()
```

Now, you'll set up the method (`POST`) with the `router` object and point to the controller function you intend to use for it.

```js
router.post('/sign-up', )
```

The second argument to `.post` will be your required controller (which you have not made yet). You'll call it `registerUser`.

Let's pause here with it half-complete and go set that up.

In `authController.js`, you'll set up a bunch of functions for various functionality and export them.

First, you need to require `bcrypt` since you will be using it to *hash* and later *compare* your user's passwords.

```js
const bcrypt = require('bcrypt')
```

You will also need access to your `User` model since you will be creating a new User document on sign-up.

```js
const User = require('../models/User.js')
```

Now, let's start making your *async* `registerUser` function. Best practice is to always use a try/catch block to best handle errors.

```js
const registerUser = async (req, res) => {
  try {

  } catch (error) {

  }
}
```

Following what you learned about Session Auth, you'll follow these steps:
1. Check if a user exists with the provided email
2. Make sure the user's passwords match
3. Hash the user's password with `bcrypt`
4. Create the user in the database with your model
5. Send the user a response

First, you'll check the database for the user:

```js
const userInDatabase = await User.exists({ email: req.body.email })
if (userInDatabase) {
  return res.send('Username already taken!')
  // This can be an EJS page later...
}
```

Now, to check the passwords:

```js
if (req.body.password !== req.body.confirmPassword) {
  return res.send('Password and Confirm Password must match')
  // This can also be an EJS page...
}
```

Hashing the password with `bcrypt`:

```js
const hashedPassword = bcrypt.hashSync(req.body.password, 12)
```

Now, creating the user:

```js
await User.create({
  email: req.body.email,
  password: hashedPassword,
  first: req.body.first,
  last: req.body.last,
  picture: req.body.picture
})
```

Finally, sending a response:

```js
res.send(`Thanks for signing up!`)
// This can be an EJS page later...
```

Don't forget to handle your errors:

```js
} catch (error) {
  console.error('An error has occurred registering a user!', error.message)
}
```

At the bottom of your file, you'll create a `module.exports` that will export all of the functions you make.

```js
module.exports = {
  registerUser
}
```

· · · · · · · · · · · · · · · · · · · ·

<details>
<summary>💡 Your <b>authController</b> file so far . . . </summary>

<br>

```js
const bcrypt = require('bcrypt')

const User = require('../models/User.js')

const registerUser = async (req, res) => {
  try {
    const userInDatabase = await User.exists({ email: req.body.email })
    if (userInDatabase) {
      return res.send('Username already taken!')
      // This can be an EJS page later...
    }
    if (req.body.password !== req.body.confirmPassword) {
      return res.send('Password and Confirm Password must match')
      // This can also be an EJS page...
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, 12)
    await User.create({
      email: req.body.email,
      password: hashedPassword,
      first: req.body.first,
      last: req.body.last,
      picture: req.body.picture
    })
    res.send(`Thanks for signing up!`)
    // This can be an EJS page later...
  } catch (error) {
    console.error('An error has occurred registering a user!', error.message)
  }
}

module.exports = {
  registerUser
}
```

</details>

· · · · · · · · · · · · · · · · · · · ·

Now, head back to your `authRouter.js` file and you will hook everything up.

At the top, require your controller.

```js
const authController = require('../controllers/authController.js')
```

In the route you left hanging earlier, you'll simply reference the function you want to use!

```js
router.post('/sign-up', authController.registerUser)
```

Below this, you need to export `router`.

```js
module.exports = router
```

· · · · · · · · · · · · · · · · · · · ·

<details>
<summary>💡 Your <b>authRouter</b> file so far . . . </summary>

<br>

```js
const express = require('express')
const router = express.Router()

const authController = require('../controllers/authController.js')

router.post('/sign-up', authController.registerUser)

module.exports = router
```

</details>

· · · · · · · · · · · · · · · · · · · ·

Run your server...

```sh
npm start
```

You'll see:

```txt
Running Server on Port 3000 . . . 
Successfully connected to MongoDB database . . .
```

Now, you test with Insomnia or Postman - a `POST` request to `'http://localhost:3000/auth/sign-up'` with something like the following as the request body:

```json
{
  "first": "Michael",
  "last": "Lackey",
  "email": "michael@email.com",
  "password": "1234",
  "confirmPassword": "1234",
  "picture": "https://i.imgur.com/GS4i9HG.png"
}
```

Later, this will be coming from your Form fields in your EJS.

![Sign Up Response](./images/sign-up-response.png)

You've completed the process from *route* to *controller* to *testing*! Now, on to the next bit of functionality.

[📖 Back to Top](#-table-of-contents)

---


### Signing In A User

Now, back in `authRouter.js`, let's work on a new route.

Again, you'll set up the method (`POST`) with the `router` object and point to the controller function you intend to use for it. Below your sign-up route...

```js
router.post('/sign-in', )
```

The second argument to `.post` will be your imported controller (which you have not made yet). You'll call it `signInUser`.

Let's pause here with it half-complete and go set that up.

In `authController.js`, below `registerUser`, let's start making your *async* `signInUser` function.

```js
const signInUser = async (req, res) => {
  try {

  } catch (error) {

  }
}
```

Following what you learned in the Session Auth lesson, you'll follow these steps:
1. Check if a user exists with the provided email
2. Compare the user's password with `bcrypt`
3. Create the session object
4. Send the user a response

First, you'll check the database for the user:

```js
const user = await User.findOne({ email: req.body.email })
if (!user) {
  return res.send('No user has been registered with that email. Please sign up!')
  // This can be an EJS page later...
}
```

Comparing the password with `bcrypt`:

```js
const validPassword = bcrypt.compareSync(
  req.body.password,
  user.password
)
if (!validPassword) {
  return res.send('Incorrect password! Please try again.')
}
```

`bcrypt.compareSync()` will return a `boolean` value.

Now, creating the `session` object:

```js
req.session.user = {
  email: user.email,
  _id: user._id
}
```

Finally, sending a response:

```js
res.send(`Thanks for signing in, ${user.first}!`)
// This can be an EJS page or redirect later...
```

Don't forget to handle your errors:

```js
} catch (error) {
  console.error('An error has occurred signing in a user!', error.message)
}
```

At the bottom of your file, add the function to the export...

```js
module.exports = {
  registerUser,
  signInUser
}
```

· · · · · · · · · · · · · · · · · · · ·

<details>
<summary>💡 Final <b>signInUser</b> function . . . </summary>

<br>

```js
const signInUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      return res.send(
        'No user has been registered with that email. Please sign up!'
      )
      // This can be an EJS page later...
    }
    const validPassword = bcrypt.compareSync(
      req.body.password,
      user.password
    )
    if (!validPassword) {
      return res.send('Incorrect password! Please try again.')
      // This can also be an EJS page...
    }
    req.session.user = {
      email: user.email,
      _id: user._id
    }
    res.send(`Thanks for signing in, ${user.first}!`)
    // This can be an EJS page or redirect later...
  } catch (error) {
    console.error('An error has occurred signing in a user!', error.message)
  }
}
```

</details>

· · · · · · · · · · · · · · · · · · · ·

Now, head back to your `authRouter.js` file and you will hook everything up.

In the route you left unfinished, reference the controller.

```js
router.post('/sign-in', authController.signInUser)
```

· · · · · · · · · · · · · · · · · · · ·

<details>
<summary>💡 Your <b>authRouter</b> file so far . . . </summary>

<br>

```js
const express = require('express')
const router = express.Router()

const authController = require('../controllers/authController.js')

router.post('/sign-up', authController.registerUser)
router.post('/sign-in', authController.signInUser)

module.exports = router
```

</details>

· · · · · · · · · · · · · · · · · · · ·

Run your server...

```sh
npm start
```

You'll see:

```txt
Running Server on Port 3000 . . . 
Successfully connected to MongoDB database . . .
```

Now, you test with Insomnia or Postman - a `POST` request to `'http://localhost:3000/auth/sign-in'` with something like the following as the request body:

```json
{
  "email": "michael@email.com",
  "password": "1234"
}
```

Later, this will be coming from your Form fields in your EJS.

![Sign In Response](./images/sign-in-response.png)

You've completed the process again from *route* to *controller* to *testing*! Now, you go again!

[📖 Back to Top](#-table-of-contents)

---


### Signing Out A User

You can quickly set up your route and controller for signing out. Same pattern.

In `authRouter.js`, you set up the route.

Below your sign-in route. Note that you are making a `GET` request...

```js
router.get('/sign-out', )
```

The second argument to `.get` will be your imported controller (which you have not made yet). You'll call it `signOutUser`.

Let's pause here with it half-complete and go set that up.

In `authController.js`, below `signInUser`, let's start making your `signOutUser` function.

```js
const signOutUser = (req, res) => {
  try {

  } catch (error) {

  }
}
```

Following what you learned in the Session Auth lesson, you'll follow these steps:
1. Destroy the session object
2. Redirect the user to another page

You'll use the `session` object's built in `.destroy()` method:

```js
req.session.destroy()
```

Then, send the user back to the home page (which you'll build in EJS later):

```js
res.redirect('/')
```

Don't forget to handle your errors:

```js
} catch (error) {
  console.error('An error has occurred signing out a user!', error.message)
}
```

At the bottom of your file, add the function to the export...

```js
module.exports = {
  registerUser,
  signInUser,
  signOutUser
}
```

· · · · · · · · · · · · · · · · · · · ·

<details>
<summary>💡 Final <b>signOutUser</b> function . . . </summary>

<br>

```js
const signOutUser = (req, res) => {
  try {
    req.session.destroy()
    res.redirect('/')
  } catch (error) {
    console.error('An error has occurred signing out a user!', error.message)
  }
}
```

</details>

· · · · · · · · · · · · · · · · · · · ·

Now, head back to your `authRouter.js` file and hook it up.

In the route you left unfinished, reference the controller.

```js
router.get('/sign-out', authController.signOutUser)
```

· · · · · · · · · · · · · · · · · · · ·

<details>
<summary>💡 Your <b>authRouter</b> file so far . . . </summary>

<br>

```js
const express = require('express')
const router = express.Router()

const authController = require('../controllers/authController.js')

router.post('/sign-up', authController.registerUser)
router.post('/sign-in', authController.signInUser)
router.get('/sign-out', authController.signOutUser)

module.exports = router
```

</details>

· · · · · · · · · · · · · · · · · · · ·

Run your server...

```sh
npm start
```

You'll see:

```txt
Running Server on Port 3000 . . . 
Successfully connected to MongoDB database . . .
```

Now, you test with Insomnia or Postman - a `GET` request to `'http://localhost:3000/auth/sign-out'`. No request body needed.

![Sign Out Response](./images/sign-out-response.png)

You've completed the process again from *route* to *controller* to *testing*! Don't stop now!

[📖 Back to Top](#-table-of-contents)

---


![Michael & Patch Call the Fire Department](./images/fire.png)


## User CRUD Functionality

As you proceed to this next section, it's important to reflect on the website you *want* to make. What functionality do you want your user to have? What page views are you thinking you'll show? 

You've set up a couple routes that have to do with the user, sorted separately in Auth because they had to do with registering, signing in, and signing out. But what if you wanted a page that showed a user's profile? You need to consider what data your back-end server needs to send to the page, and how to get it.

These are the full routes you will be setting up in this section:

| HTTP Method | Route |
| :---: | :---: |
| [GET](#getting-a-users-profile) | [http://localhost:3000/users/:id](#getting-a-users-profile) |
| [PUT](#updating-a-users-password) | [http://localhost:3000/auth/:id](#updating-a-users-password) |

Let's head over to `server.js` and set up your base route (`'/users'`) and link up your Router file.

At the top, just below your `authRouter` import, you need to import your router from `userRouter.js`:

```js
const userRouter = require('./routes/userRouter.js')
```

*Underneath* the Auth Router, but *above* your app entry point (`"/"`):

```js
app.use('/users', userRouter)
```

This tells your application that any endpoint that starts with `'http://localhost:3000/users'` needs to go to your `userRouter` for further routing.

[📖 Back to Top](#-table-of-contents)

---


### Getting a User's Profile

In order to set this up, you'll follow the exact same pattern. Route - Controller - Testing.

Now, over in `userRouter.js`, let's set it up. First, import `express` and set up the `router` object. You need this at the top of *all* your Router files.

```js
const express = require('express')
const router = express.Router()
```

Now, you'll set up the method (`GET`) with the `router` object and point to the controller function you intend to use for it.

```js
router.get('/:id', )
```

The second argument to `.get` will be your imported controller (which you have not made yet). You'll call it `getUserById`.

Let's pause here with it half-complete and go set that up.

In `userController.js`, you'll set up this function.

You will need access to your `User` model since you will be using it's `findById` method to query the database.

```js
const User = require('../models/User.js')
```

Now, let's start making your *async* `getUserById` function. Best practice is to always use a try/catch block to best handle errors.

```js
const getUserById = async (req, res) => {
  try {

  } catch (error) {

  }
}
```

This one is pretty straight forward:
1. You need to extract the user's ID from the URL params
2. Use that ID to query the database
3. Curate your response to ensure it does not contain sensitive user information

First, you'll use `findById` to query the database with the `id` from `params`:

```js
const user = await User.findById(req.params.id)
// Returns the full user object, including their hashed password. Never send this to anyone other than the user it belongs to.
```

Next, you'll import your `Recipe` model so that you can find all recipes your user has made.

```js
const Recipe = require('../models/Recipe.js')
```

Now, you'll query that collection for all documents where the user's `_id` matches the `author` field on Recipe.

```js
const recipes = await Recipe.find({ author: user._id })
// Returns all recipes where the author field is the same as the user object ID from above.
```

Now, to create a *new* object that only contains the data you want to send to the page:

```js
const data = {
  _id: user._id,
  first: user.first,
  last: user.last,
  picture: user.picture,
  recipes: recipes
}
// Notice you have left out sensitive info like the user's email and hashed password.
// You have also added the recipes to the response.
```

Now, to send it back as a response:

```js
res.send(data)
// This can be an EJS page later...
```

Don't forget to handle your errors:

```js
} catch (error) {
  console.error('An error has occurred finding a user!', error.message)
}
```

At the bottom of your file, you'll create a module.exports that will export all of the functions you make.

```js
module.exports = {
  getUserById
}
```

· · · · · · · · · · · · · · · · · · · ·

<details>
<summary>💡 Your <b>userController</b> file so far . . . </summary>

<br>

```js
const User = require('../models/User.js')

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    // Returns the full user object, including their hashed password. Never send this to anyone other than the user it belongs to.
    const recipes = await Recipe.find({ author: user._id })
    // Returns all recipes where the author field is the same as the user object ID from above.
    const data = {
      _id: user._id,
      first: user.first,
      last: user.last,
      picture: user.picture,
      recipes: recipes
    }
    // Notice you have left out sensitive info like the user's email and hashed password.
    // You have also added the recipes to the response.
    res.send(data)
    // This can be an EJS page later...
  } catch (error) {
    console.error('An error has occurred finding a user!', error.message)
  }
}

module.exports = {
  getUserById
}
```

</details>

· · · · · · · · · · · · · · · · · · · ·

Now, head back to your `userRouter.js` file and you will hook it up.

At the top, import your controller.

```js
const userController = require('../controllers/userController.js')
```

In the route you left hanging earlier, you'll simply reference the function you want to use!

```js
router.get('/:id', userController.getUserById)
```

Below this, you need to export `router`.

```js
module.exports = router
```

· · · · · · · · · · · · · · · · · · · ·

<details>
<summary>💡 Your <b>userRouter</b> file so far . . . </summary>

<br>

```js
const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController.js')

router.get('/:id', userController.getUserById)

module.exports = router
```

</details>

· · · · · · · · · · · · · · · · · · · ·

Run your server...

```sh
npm start
```

You'll see:

```txt
Running Server on Port 3000 . . . 
Successfully connected to MongoDB database . . .
```

Now, you test with Insomnia or Postman - a `GET` request to `"http://localhost:3000/users/<some-users-id>"` with a *real ObjectID* of a user you've made in your database:

Later, this will be coming from your route that you direct a user to when they click on another user's profile.

![Get User Response](./images/get-user-response.png)

Again - *route* to *controller* to *testing*!

[📖 Back to Top](#-table-of-contents)

---


### Updating a User's Password

You want your user to be able to update and change their password. It's important to have this separate from any other updates they might make to their profile like a change of email or profile picture. Now, where you do this is up to you. For this application, in order to keep these things separate, you're going to store the update password functionality in Auth and use `"/auth"` routes to do it.

In `authRouter.js`, you'll set up the method (`PUT`) with the `router` object and point to the controller function you intend to use for it.

```js
router.put('/:id', )
```

The second argument to `.put` will be your imported controller (which you have not made yet). You'll call it `updatePassword`.

Let's pause here with it half-complete.

In `authController.js`, you need `bcrypt` since you will be using it to *compare* the old password and to *hash* the new password, and you already have it imported from earlier.

You will also need access to your `User` model to perform the update, and it's already imported also.

Now, let's start making your *async* `updatePassword` function. You'll use try/catch as usual.

```js
const updatePassword = async (req, res) => {
  try {

  } catch (error) {

  }
}
```

Following what you learned in the Session Auth lesson, you'll apply them to this functionality as well and follow these steps:
1. Check if a user exists with the provided ID
2. Make sure the user's old password is legitimate with `bcrypt`
3. Make sure the user's new passwords match
4. Hash the user's new password with `bcrypt`
5. Update the user in the database
6. Send the user a response

First, you'll check the database for the user:

```js
const user = await User.findById(req.params.id)
if (!user) {
  return res.send('No user with that ID exists!')
  // This can be an EJS page later...
}
```

Next, you need to confirm they know their current password, especially before changing to a new one. This is similar to signing in, but you *don't* need to reset the `session` object since they're already signed in:

```js
const validPassword = bcrypt.compareSync(
  req.body.oldPassword,
  user.password
)
if (!validPassword) {
  return res.send('Your old password was not correct! Please try again.')
  // This can also be an EJS page...
}
```

Now, to check the user's new password:

```js
if (req.body.newPassword !== req.body.confirmPassword) {
  return res.send('Password and Confirm Password must match')
  // This can also be an EJS page...
}
```

Hashing the new password with `bcrypt`:

```js
const hashedPassword = bcrypt.hashSync(req.body.newPassword, 12)
```

Now, updating the user. You already have the user's record from your `findById`, so there's no need to do a new `findByIdAndUpdate`. You'll just update the `password` field and `.save()`:

```js
user.password = hashedPassword
// It's critical that this field is updated with the password you hashed with bcrypt, and never the plain text password in req.body.password
await user.save()
```

Finally, sending a response:

```js
res.send(`Your password has been updated, ${user.first}!`)
// This can be an EJS page later...
```

Don't forget to handle your errors:

```js
} catch (error) {
  console.error("An error has occurred updating a user's password!", error.message)
}
```

At the bottom of your file, add the function to the module.exports.

```js
module.exports = {
  registerUser,
  signInUser,
  signOutUser,
  updatePassword
}
```

· · · · · · · · · · · · · · · · · · · ·

<details>
<summary>💡 Final <b>updatePassword</b> function . . . </summary>

<br>

```js
const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.send('No user with that ID exists!')
      // This can be an EJS page later...
    }
    const validPassword = bcrypt.compareSync(
      req.body.oldPassword,
      user.password
    )
    if (!validPassword) {
      return res.send('Your old password was not correct! Please try again.')
      // This can also be an EJS page...
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
      return res.send('Password and Confirm Password must match')
      // This can also be an EJS page...
    }
    const hashedPassword = bcrypt.hashSync(req.body.newPassword, 12)
    user.password = hashedPassword
    // It's critical that this field is updated with the password you hashed with bcrypt, and never the plain text password in req.body.password
    await user.save()
    res.send(`Your password has been updated, ${user.first}!`)
    // This can be an EJS page later...
  } catch (error) {
    console.error(
      "An error has occurred updating a user's password!",
      error.message
    )
  }
}
```

</details>

· · · · · · · · · · · · · · · · · · · ·

Now, head back to your `authRouter.js` file and you will hook it up.

In the route you left earlier, you'll reference the function!

```js
router.put('/:id', authController.updatePassword)
```

· · · · · · · · · · · · · · · · · · · ·

<details>
<summary>💡 Your <b>authRouter</b> file so far . . . </summary>

<br>

```js
const express = require('express')
const router = express.Router()

const authController = require('../controllers/authController.js')

router.post('/sign-up', authController.registerUser)
router.post('/sign-in', authController.signInUser)
router.post('/sign-out', authController.signOutUser)
router.put('/:id', authController.updatePassword)

module.exports = router
```

</details>

· · · · · · · · · · · · · · · · · · · ·

Run your server...

```sh
npm start
```

You'll see:

```txt
Running Server on Port 3000 . . . 
Successfully connected to MongoDB database . . .
```

Now, you test with Insomnia or Postman - a `PUT` request to `'http://localhost:3000/auth/<some-users-id>'` with something like the following as the request body:

```json
{
  "oldPassword": "1234",
  "newPassword": "4321",
  "confirmPassword": "4321"
}
```

Later, this will be coming from your Form fields in your EJS.

![Update Password Response](./images/update-pw-response.png)

Another round with the pattern - complete!

[📖 Back to Top](#-table-of-contents)

---


![Michael & Patch Put It in the Oven](./images/oven.png)


## Recipe CRUD Functionality

Let's think again about the website you *want* to make. What functionality do you want your user to have? What page views are you thinking you'll show? 

You want your user to be able to create new recipes. You want to show a list of a bunch of recipes. You want to be able to go deeper and see details about a single recipe. You want a user to be able to update and delete their own recipes.

These are the full routes you will be setting up in this section:

| HTTP Method | Route |
| :---: | :---: |
| [POST](#creating-a-recipe) | [http://localhost:3000/recipes/](#creating-a-recipe) |
| [GET](#getting-all-recipes) | [http://localhost:3000/recipes/](#getting-all-recipes) |
| [GET](#get-a-single-recipe) | [http://localhost:3000/recipes/:id](#get-a-single-recipe) |
| [PUT](#update-a-recipe) | [http://localhost:3000/recipes/:id](#update-a-recipe) |
| [DELETE](#delete-a-recipe) | [http://localhost:3000/recipes/:id](#delete-a-recipe) |

Let's head over to `server.js` and set up your base route (`'/recipes'`) and link up your Router file.

At the top, just below your `userRouter` import, you need to import your router from `recipeRouter.js`:

```js
const recipeRouter = require('./routes/recipeRouter.js')
```

*Underneath* the User Router, but *above* your app entry point (`'/'`):

```js
app.use('/recipes', recipeRouter)
```

This tells your application that any endpoint that starts with `'http://localhost:3000/recipes'` needs to go to your `recipeRouter` for further routing.

[📖 Back to Top](#-table-of-contents)

---


### Creating a Recipe

In order to set this up, you'll follow the pattern again. Route - Controller - Testing.

In `recipeRouter.js`, import `express` and set up the `router` object. You need this at the top of *all* of your Router files.

```js
const express = require('express')
const router = express.Router()
```

Now, you'll set up the method (`POST`) with the `router` object and point to the controller function you intend to use for it.

```js
router.post('/', )
```

The second argument to `.post` will be your imported controller (which you have not made yet). You'll call it `createRecipe`.

Let's pause here.

In `recipeController.js`, you'll set up this function.

You will need access to your `Recipe` model since you will be using it's `create` method to add a recipe document to your database. 

But you also need access to your `User` model since you need to add the new recipe to your user's array of recipes.

```js
const User = require('../models/User.js')
const Recipe = require('../models/Recipe.js')
```

Now, let's start making your *async* `createRecipe` function. Best practice is to always use a try/catch.

```js
const createRecipe = async (req, res) => {
  try {

  } catch (error) {

  }
}
```

A few steps involved with this one:
1. Find the user that is associated with this recipe (you are expecting it in the `req.body`)
2. Create your recipe with the `Recipe` model
3. Update your user in the database by adding your new recipe's ObjectID to their array
4. Send a response

First, you'll use `findById` to query the database with the user's `id` from the request body labeled as `author`:

```js
const user = await User.findById(req.body.author)
// Returns the full user object
```

Now, to create your recipe:

```js
const recipe = await Recipe.create(req.body)
// The only way this works this simply is if the request body being sent properly matches your model
```

Now that you have your new recipe back, let's add it to your user object. Then you update that document with the `.save()` method:

```js
user.recipes.push(recipe._id)
// The MongoDB ObjectID is what needs to be in this array for the reference to work
user.save()
```

Finally, you send a response:

```js
res.send(recipe)
// This can be an EJS page later...
```

Don't forget to handle your errors:

```js
} catch (error) {
  console.error('An error has occurred creating a recipe!', error.message)
}
```

At the bottom of your file, you'll create a module.exports that will export all of the functions you make.

```js
module.exports = {
  createRecipe
}
```

· · · · · · · · · · · · · · · · · · · ·

<details>
<summary>💡 Your <b>recipeController</b> file so far . . . </summary>

<br>

```js
const User = require('../models/User.js')
const Recipe = require('../models/Recipe.js')

const createRecipe = async (req, res) => {
  try {
    const user = await User.findById(req.body.author)
    // Returns the full user object
    const recipe = await Recipe.create(req.body)
    // The only way this works this simply is if the request body being sent properly matches your model
    user.recipes.push(recipe._id)
    user.save()
    res.send(recipe)
    // This can be an EJS page later...
  } catch (error) {
    console.error('An error has occurred creating a recipe!', error.message)
  }
}

module.exports = {
  createRecipe
}
```

</details>

· · · · · · · · · · · · · · · · · · · ·

Now, head back to your `recipeRouter.js` file and you will hook it up.

At the top, import your controller.

```js
const recipeController = require('../controllers/recipeController.js')
```

In the route you left hanging earlier, you'll simply reference the function you want to use!

```js
router.post('/', recipeController.createRecipe)
```

Below this, you need to export `router`.

```js
module.exports = router
```

· · · · · · · · · · · · · · · · · · · ·

<details>
<summary>💡 Your <b>recipeRouter</b> file so far . . . </summary>

<br>

```js
const express = require('express')
const router = express.Router()

const recipeController = require('../controllers/recipeController.js')

router.post('/', recipeController.createRecipe)

module.exports = router
```

</details>

· · · · · · · · · · · · · · · · · · · ·

Run your server...

```sh
npm start
```

You'll see:

```txt
Running Server on Port 3000 . . . 
Successfully connected to MongoDB database . . .
```

Now, you test with Insomnia or Postman - a `POST` request to `'http://localhost:3000/recipes'` with something like the following as the request body. Take note, the ObjectID in `author` needs to be *your* user:

```json
{
  "title": "Chicken Parmigiana",
  "description": "Chicken Parmigiana is a beloved Italian-American dish made from breaded chicken cutlets topped with marinara sauce and melted mozzarella and Parmesan cheese. It's typically served over a bed of spaghetti or with a side of garlic bread, delivering a savory, crispy, and comforting bite every time.",
  "image": "https://i.imgur.com/LPzYS9q.png",
  "author": "682197313293e5ff1069431e"
}
```

Later, this will be coming from your Form fields in your EJS.

![Create Recipe Response](./images/create-recipe-response.png)

The pattern always works. Every time.

[📖 Back to Top](#-table-of-contents)

---


### Getting All Recipes

Route - Controller - Testing. You know.

In `recipeRouter`, You'll set up the method (`GET`) with the `router` object and point to the controller function you intend to use for it. Just under your `createRecipe`:

```js
router.get('/', )
```

The second argument to `.get` will be your imported controller (which you have not made yet). You'll call it `getAllRecipes`.

Let's pause here.

In `recipeController.js`, you'll set up this function.

Your models are already imported.

Now, let's start making your *async* `getAllRecipes` function.

```js
const getAllRecipes = async (req, res) => {
  try {

  } catch (error) {

  }
}
```

This one is very simple:
1. Use the `.find` method to query your `Recipe` collection
2. Send a response

Query the database:

```js
const recipes = await Recipe.find({})
// findAll returns an array of every document that matches the criteria. In this case, your options object is empty (so there's no criteria).
```

Now, you send a response:

```js
res.send(recipes)
// This can be an EJS page later...
```

Don't forget to handle your errors:

```js
} catch (error) {
  console.error('An error has occurred getting all recipes!', error.message)
}
```

At the bottom of your file, you'll add your new function to the export.

```js
module.exports = {
  createRecipe,
  getAllRecipes
}
```

· · · · · · · · · · · · · · · · · · · ·

<details>
<summary>💡 Your <b>getAllRecipes</b> function . . . </summary>

<br>

```js
const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({})
    // findAll returns an array of every document that matches the criteria. In this case, your options object is empty (so there's no criteria).
    res.send(recipes)
    // This can be an EJS page later...
  } catch (error) {
    console.error('An error has occurred getting all recipes!', error.message)
  }
}
```

</details>

· · · · · · · · · · · · · · · · · · · ·

Now, head back to your `recipeRouter.js` file and you will hook it up.

In the route from earlier, you reference the function:

```js
router.get('/', recipeController.getAllRecipes)
```

· · · · · · · · · · · · · · · · · · · ·

<details>
<summary>💡 Your <b>recipeRouter</b> file so far . . . </summary>

<br>

```js
const express = require('express')
const router = express.Router()

const recipeController = require('../controllers/recipeController.js')

router.post('/', recipeController.createRecipe)
router.get('/', recipeController.getAllRecipes)

module.exports = router
```

</details>

· · · · · · · · · · · · · · · · · · · ·

Run your server...

```sh
npm start
```

You'll see:

```txt
Running Server on Port 3000 . . . 
Successfully connected to MongoDB database . . .
```

Now, you test with Insomnia or Postman - a `GET` request to `'http://localhost:3000/recipes'`. No need for a request body.

![Get Recipes Response](./images/get-recipes-response.png)

Follow. The. Pattern.

[📖 Back to Top](#-table-of-contents)

---


### Get a Single Recipe

Route - Controller - Testing.

In `recipeRouter`, You'll set up the method (`GET`) with the `router` object and point to the controller function you intend to use for it. Just under your `getAllRecipes`:

```js
router.get('/:id', )
```

The second argument to `.get` will be your imported controller (which you have not made yet). You'll call it `getRecipeById`.

Let's pause.

In `recipeController.js`, you'll set up this function.

Your models are already imported.

Now, let's start making your *async* `getRecipeById` function.

```js
const getRecipeById = async (req, res) => {
  try {

  } catch (error) {

  }
}
```

This one is also very simple:
1. Use the `.findById` method to query your `Recipe` collection
2. Send a response

Query the database:

```js
const recipe = await Recipe.findById(req.params.id)
```

Now, you send a response:

```js
res.send(recipe)
// This can be an EJS page later...
```

Don't forget to handle your errors:

```js
} catch (error) {
  console.error('An error has occurred getting a recipe!', error.message)
}
```

At the bottom of your file, you'll add your new function to the export.

```js
module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipeById
}
```

· · · · · · · · · · · · · · · · · · · ·

<details>
<summary>💡 Your <b>getRecipeById</b> function . . . </summary>

<br>

```js
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
    res.send(recipe)
    // This can be an EJS page later...
  } catch (error) {
    console.error('An error has occurred getting a recipe!', error.message)
  }
}
```

</details>

· · · · · · · · · · · · · · · · · · · ·

Now, head back to your `recipeRouter.js` file and you will hook it up.

In the route from earlier, you reference the function:

```js
router.get('/', recipeController.getRecipeById)
```

· · · · · · · · · · · · · · · · · · · ·

<details>
<summary>💡 Your <b>recipeRouter</b> file so far . . . </summary>

<br>

```js
const express = require('express')
const router = express.Router()

const recipeController = require('../controllers/recipeController.js')

router.post('/', recipeController.createRecipe)
router.get('/', recipeController.getAllRecipes)
router.get('/:id', recipeController.getRecipeById)

module.exports = router
```

</details>

· · · · · · · · · · · · · · · · · · · ·

Run your server...

```sh
npm start
```

You'll see:

```txt
Running Server on Port 3000 . . . 
Successfully connected to MongoDB database . . .
```

Now, you test with Insomnia or Postman - a `GET` request to `'http://localhost:3000/recipes/<some-recipe-id>'`. The `id` needs to be an ObjectID from *your* database.

![Get Recipe Response](./images/get-recipe-response.png)

The pattern is a formula that will give you consistent success.

[📖 Back to Top](#-table-of-contents)

---


### Update a Recipe

1. Route
2. Controller
3. Testing

In `recipeRouter`, You'll set up the method (`PUT`) with the `router` object and point to the controller function you intend to use for it. Just under your `getRecipeById`:

```js
router.put('/:id', )
```

The second argument to `.put` will be your imported controller (which you have not made yet). You'll call it `updateRecipeById`.

Pause.

In `recipeController.js`, you'll set up this function.

Your models are already imported.

Now, let's start making your *async* `updateRecipeById` function.

```js
const updateRecipeById = async (req, res) => {
  try {

  } catch (error) {

  }
}
```

For this, you'll follow these steps:
1. Find and Update the recipe using the id from the params
2. Passing in the updated fields
3. Send a response

Find the recipe:

```js
const recipe = await Recipe.findByIdAndUpdate(req.params.id, )
```

The second argument to `findByIdAndUpdate` is an object with the updated fields - `req.body`. 

The third argument is an optional object with various options in it. The option you want is `new: true`. This ensures that the updated record is returned from the database:

```js
const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true })
// req.body overwrites any matching fields with the new values. Only the updated fields are necessary.
// { new: true } ensures that the updated record is what is returned
```

Now, you send a response:

```js
res.send(recipe)
// This can be an EJS page later...
```

Don't forget to handle your errors:

```js
} catch (error) {
  console.error('An error has occurred updating a recipe!', error.message)
}
```

At the bottom of your file, you'll add your new function to the export.

```js
module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipeById
}
```

· · · · · · · · · · · · · · · · · · · ·

<details>
<summary>💡 Your <b>updateRecipeById</b> function . . . </summary>

<br>

```js
const updateRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true })
    // req.body overwrites any matching fields with the new values. Only the updated fields are necessary.
    res.send(recipe)
    // This can be an EJS page later...
  } catch (error) {
    console.error('An error has occurred updating a recipe!', error.message)
  }
}
```

</details>

· · · · · · · · · · · · · · · · · · · ·

Now, head back to your `recipeRouter.js` file and you will hook it up.

In the route from earlier, you reference the function:

```js
router.put('/:id', recipeController.updateRecipeById)
```

· · · · · · · · · · · · · · · · · · · ·

<details>
<summary>💡 Your <b>recipeRouter</b> file so far . . . </summary>

<br>

```js
const express = require('express')
const router = express.Router()

const recipeController = require('../controllers/recipeController.js')

router.post('/', recipeController.createRecipe)
router.get('/', recipeController.getAllRecipes)
router.get('/:id', recipeController.getRecipeById)
router.put('/:id', recipeController.updateRecipeById)

module.exports = router
```

</details>

· · · · · · · · · · · · · · · · · · · ·

Run your server...

```sh
npm start
```

You'll see:

```txt
Running Server on Port 3000 . . . 
Successfully connected to MongoDB database . . .
```

Now, you test with Insomnia or Postman - a `PUT` request to `'http://localhost:3000/recipes/<some-recipe-id>'`. The `id` needs to be an ObjectID from *your* database. The request body might look something like this:

```json
{
  "title": "Patch's Famous Chicken Parmigiana"
}
```

![Update Recipe Response](./images/update-recipe-response.png)

What's for dinner? Patch's Famous Pattern.

[📖 Back to Top](#-table-of-contents)

---


### Delete a Recipe

New day. Same pattern.

In `recipeRouter`, You'll set up the method (`DELETE`) with the `router` object and point to the controller function you intend to use for it. Just under your `updateRecipeById`:

```js
router.delete('/:id', )
```

The second argument to `.delete` will be your imported controller (which you have not made yet). You'll call it `deleteRecipeById`.

Leave this for now.

In `recipeController.js`, you'll set up this function.

Your models are already imported.

Now, let's start making your *async* `deleteRecipeById` function.

```js
const deleteRecipeById = async (req, res) => {
  try {

  } catch (error) {

  }
}
```

For this, you'll follow these steps:
1. Find and Delete the recipe using the id from the params
2. Send a response

Find and delete the recipe:

```js
await Recipe.findByIdAndDelete(req.params.id)
// No need to store this in a variable since it's being deleted
```

Send a response:

```js
res.send(`Recipe with ID ${req.params.id} has been deleted successfully!`)
// This can be an EJS page later...
```

Handle errors:

```js
} catch (error) {
  console.error('An error has occurred deleting a recipe!', error.message)
}
```

At the bottom of your file, you'll add your new function to the export.

```js
module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipeById
}
```

· · · · · · · · · · · · · · · · · · · ·

<details>
<summary>💡 Your <b>deleteRecipeById</b> function . . . </summary>

<br>

```js
const deleteRecipeById = async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id)
    // No need to store this in a variable since it's being deleted
    res.send(`Recipe with ID ${req.params.id} has been deleted successfully!`)
    // This can be an EJS page later...
  } catch (error) {
    console.error('An error has occurred deleting a recipe!', error.message)
  }
}
```

</details>

· · · · · · · · · · · · · · · · · · · ·

Now, head back to your `recipeRouter.js` file and you will hook it up.

In the route from earlier, you reference the function:

```js
router.delete('/:id', recipeController.deleteRecipeById)
```

· · · · · · · · · · · · · · · · · · · ·

<details>
<summary>💡 Your <b>recipeRouter</b> file so far . . . </summary>

<br>

```js
const express = require('express')
const router = express.Router()

const recipeController = require('../controllers/recipeController.js')

router.post('/', recipeController.createRecipe)
router.get('/', recipeController.getAllRecipes)
router.get('/:id', recipeController.getRecipeById)
router.put('/:id', recipeController.updateRecipeById)
router.delete('/:id', recipeController.deleteRecipeById)

module.exports = router
```

</details>

· · · · · · · · · · · · · · · · · · · ·

Run your server...

```sh
npm start
```

You'll see:

```txt
Running Server on Port 3000 . . . 
Successfully connected to MongoDB database . . .
```

Now, you test with Insomnia or Postman - a `DELETE` request to `'http://localhost:3000/recipes/<some-recipe-id>'`. The `id` needs to be an ObjectID from *your* database. No request body.

![Delete Recipe Response](./images/delete-recipe-response.png)

The pattern once again shows it's quality.

[📖 Back to Top](#-table-of-contents)

---

![Michael & Patch Plate the Meal](./images/plating.png)


## Reflecting on the Server Build

With this final operation, you have finished creating and testing your entire back-end server.  You have all the functionality you want for your website and the ability to interact with the database how you need.

Now, as you move forward and create and test your "front-end" views, you will know that your server is complete. This allows you to more appropriately troubleshoot issues. By knowing that the issue must be coming from your EJS/HTML structure and/or your browser, you can more effectively track them down and solve the errors.

This same mindset should be used in real world websites *and* your projects.

[📖 Back to Top](#-table-of-contents)

---


![Michael & Patch Sit Down for Family Meal](./images/family.png)


## Creating Your EJS Views

In this section, you will transition to the "front-end" / client-facing part of your website. You'll largely be copying/pasting EJS templates that will be given to you. As you do, you'll discuss and review each page and it's purpose. Then, you'll be setting up routes and controllers for each to ensure your pages are rendered/redirected appropriately.


---

### Home Page & Partials

Let's create a landing page for your website. Then, you'll set up your base route (`'/'`) to render the EJS file.

First off, you need a `views` directory.

```sh
mkdir views
```

And create your `index.ejs` file.

```sh
touch ./views/index.ejs
```

Before you get to work in this file, you know you'll also need a few partials. One of these will be all of your head HTML and another will be the footer of every page. So let's create that directory and two files as well.

```sh
mkdir ./views/partials
```

```sh
touch ./views/partials/header.ejs ./views/partials/footer.ejs
```

In the following sections, you can copy/paste the EJS from these snippets to their respective files. Or, feel free to create your own!

· · · · · · · · · · · · · · · · · · · ·

<details>
<summary>💡 <b>index.ejs</b></summary>

<br>

```html
<%- include('./partials/header.ejs') %>

<h1>Welcome to Mongoose Recipes!</h1>
<p>Sign in or sign up to get started.</p>

<%- include('./partials/footer.ejs') %>
```

</details>

· · · · · · · · · · · · · · · · · · · ·

<details>
<summary>💡 <b>header.ejs</b></summary>

<br>

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mongoose Recipes</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <nav>
      <a href="/">Home</a>

      <% if (!user) { %>

      <a href="/auth/sign-up">Sign Up</a>
      <a href="/auth/sign-in">Sign In</a>

      <% } else { %>

      <a href="/recipes">All Recipes</a>
      <a href="/recipes/new">New Recipe</a>
      <a href="/users/<%= user._id %>">My Profile</a>
      <a href="/auth/sign-out">Sign Out</a>

      <% } %>

    </nav>
    <main>
```

</details>

· · · · · · · · · · · · · · · · · · · ·

For your header to be able to use the `session` object to conditionally render the nav, you need to set up a middleware in your `server.js`. Just under your middleware stack:

```js
app.use((req, res, next) => {
  res.locals.user = req.session.user
  next()
})
```

· · · · · · · · · · · · · · · · · · · ·

<details>
<summary>💡 <b>footer.ejs</b></summary>

<br>

```html
    </main>
    <footer>
      <p>&copy; <%= new Date().getFullYear() %> Mongoose Recipes</p>
    </footer>
  </body>
</html>
```

</details>

· · · · · · · · · · · · · · · · · · · ·

Now, you'll set up your base route in `server.js` to render your `index.js`. This replaces your old `res.send`.

```js
app.get('/', (req, res) => {
  res.render('index.ejs')
})
```

When you open `'http://localhost:3000/'` in your browser you should see your home page.

[📖 Back to Top](#-table-of-contents)

---


### Sign Up Page

Let's allow users to sign up and create an account.

In terminal:

```sh
mkdir ./views/auth
```

Then:

```sh
touch ./views/auth/sign-up.ejs
```

· · · · · · · · · · · · · · · · · · · ·

<details>
<summary>💡 <b>sign-up.ejs</b></summary>

<br>

```html
<%- include('../partials/header.ejs') %>

<h2>Sign Up</h2>
<form action="/auth/sign-up" method="POST">
  <input type="text" name="first" placeholder="First Name" required />
  <input type="text" name="last" placeholder="Last Name" required />
  <input type="email" name="email" placeholder="Email" required />
  <input type="text" name="picture" placeholder="Profile Picture URL" />
  <input type="password" name="password" placeholder="Password" required />
  <input type="password" name="confirmPassword" placeholder="Confirm Password" required />
  <button type="submit">Register</button>
</form>

<%- include('../partials/footer.ejs') %>
```

</details>

· · · · · · · · · · · · · · · · · · · ·

Now, let's create a route to render this view.

In `authRouter.js`:

```js
router.get('/sign-up', (req, res) => {
  res.render('./auth/sign-up.ejs')
})
```

No separate controller is needed in this case since it's a simple render route.

[📖 Back to Top](#-table-of-contents)

---


### Thank You Page

Let's also make a page that thanks them for signing up:

```sh
touch ./views/auth/thanks.ejs
```

· · · · · · · · · · · · · · · · · · · ·

<details>
<summary>💡 <b>thanks.ejs</b></summary>

<br>

```html
<%- include('../partials/header.ejs') %>

<h2>Thanks for signing up!</h2>

<h2>Sign in <a href="/auth/sign-in">here</a>.</h2>

<%- include('../partials/footer.ejs') %>

```

</details>

· · · · · · · · · · · · · · · · · · · ·

In `authController.js`, you'll render this EJS page after the user registers.

In `registerUser`, replace your `res.send` with this:

```js
res.render('./auth/thanks.ejs')
```

[📖 Back to Top](#-table-of-contents)

---


### Sign In Page

You also need a view to allow existing users to sign in.

```sh
touch ./views/auth/sign-in.ejs
```

· · · · · · · · · · · · · · · · · · · ·

<details>
<summary>💡 <b>sign-in.ejs</b></summary>

<br>

```html
<%- include('../partials/header.ejs') %>

<h2>Sign In</h2>
<form action="/auth/sign-in" method="POST">
  <input type="email" name="email" placeholder="Email" required />
  <input type="password" name="password" placeholder="Password" required />
  <button type="submit">Sign In</button>
</form>

<%- include('../partials/footer.ejs') %>
```

</details>

· · · · · · · · · · · · · · · · · · · ·

Then in `authRouter.js`, add:

```js
router.get('/sign-in', (req, res) => {
  res.render('./auth/sign-in.ejs')
})
```

No separate controller is needed in this case since it's a simple render route.

After your user signs in, let's redirect them to their profile page which you'll set up later.

In `authController.js`, in your `signInUser` controller, replace the `res.send` with this:

```js
res.redirect(`/users/${user._id}`)
```

This won't work yet, but you'll set it up soon.

[📖 Back to Top](#-table-of-contents)

---


### User Profile Page

This page displays a user's profile info and their recipes.

```sh
mkdir ./views/users
```

Then, create the file:

```sh
touch ./views/users/profile.ejs
```

· · · · · · · · · · · · · · · · · · · ·

<details>
<summary>💡 <b>profile.ejs</b></summary>

<br>

```html
<%- include('../partials/header.ejs') %>

<h2><%= user.first %> <%= user.last %>'s Profile</h2>
<img src="<%= user.picture %>" alt="Profile Picture" width="150" />

<div>
  <a href=<%= `/auth/${user._id}/update-password` %>>Update Password</a>
</div>

<h3>Recipes:</h3>
<ul>
  <% user.recipes.forEach(recipe => { %>
    <li><a href="/recipes/<%= recipe._id %>"><%= recipe.title %></a></li>
  <% }) %>
</ul>

<%- include('../partials/footer.ejs') %>
```

</details>

· · · · · · · · · · · · · · · · · · · ·

Back in your `userController.js`, you need to make sure you populate the recipes field when you get your user from the database.

Add `.populate('recipes')` to the end of the query:

```js
const user = await User.findById(req.params.id).populate('recipes')
```

Then, replace the `res.send` with the following:

```js
res.render('./users/profile.ejs', { user })
```

[📖 Back to Top](#-table-of-contents)

---


### Update Password Page

This page allows the user to update their password.

```sh
touch ./views/auth/update-password.ejs
```

· · · · · · · · · · · · · · · · · · · ·

<details>
<summary>💡 <b>update-password.ejs</b></summary>

<br>

```html
<%- include('../partials/header.ejs') %>

<h2>Update Password</h2>
<form action="/auth/<%= user._id %>?_method=PUT" method="POST">
  <input type="password" name="oldPassword" placeholder="Old Password" required />
  <input type="password" name="newPassword" placeholder="New Password" required />
  <input type="password" name="confirmPassword" placeholder="Confirm New Password" required />
  <button type="submit">Update</button>
</form>

<%- include('../partials/footer.ejs') %>
```

</details>

· · · · · · · · · · · · · · · · · · · ·

In `authRouter.js`, render the route using your session object to grab the user info:

```js
router.get('/:id/update-password', (req, res) => {
  res.render('./auth/update-password.ejs')
})
```

[📖 Back to Top](#-table-of-contents)

---


### Confirmed Page

You also need a page that confirms the password has been updated. You'll render it after you update the password in the database.

```sh
touch ./views/auth/confirm.ejs
```

· · · · · · · · · · · · · · · · · · · ·

<details>
<summary>💡 <b>confirm.ejs</b></summary>

<br>

```html
<%- include('../partials/header.ejs') %>

<h2>Your password has been updated, <%= user.first %>!</h2>

<%- include('../partials/footer.ejs') %>
```

</details>

· · · · · · · · · · · · · · · · · · · ·

In your `authController.js` file, you need to replace the `res.send` in your `updatePassword` controller with:

```js
res.render('./auth/confirm.ejs', { user })
```

[📖 Back to Top](#-table-of-contents)

---

### All Recipes Page

A list of all recipes in the app.

```sh
touch ./views/recipes/all.ejs
```

· · · · · · · · · · · · · · · · · · · ·

<details>
<summary>💡 <b>all.ejs</b></summary>

<br>

```html
<%- include('../partials/header.ejs') %>

<h2>All Recipes</h2>
<ul>
  <% recipes.forEach(recipe => { %>
    <li>
      <a href="/recipes/<%= recipe._id %>"><%= recipe.title %></a>
    </li>
  <% }) %>
</ul>

<%- include('../partials/footer.ejs') %>
```

</details>

· · · · · · · · · · · · · · · · · · · ·

Over in your `recipeController.js`, you need to replace the `res.send` in `getAllRecipes` with a render of your new page:

```js
res.render('./recipes/all.ejs', { recipes })
```

[📖 Back to Top](#-table-of-contents)

---


### Show Recipe Page

A detailed view of a single recipe.

```sh
touch ./views/recipes/show.ejs
```

· · · · · · · · · · · · · · · · · · · ·

<details>
<summary>💡 <b>show.ejs</b></summary>

<br>

```html
<%- include('../partials/header.ejs') %>

<% console.log(recipe.author._id) %>

<% console.log(user._id) %>

<h2><%= recipe.title %></h2>
<img src="<%= recipe.image %>" alt="<%= recipe.title %>" width="300" />
<p><%= recipe.description %></p>

<% if (user._id === recipe.author._id.toString()) { %>
  
<form action="/recipes/<%= recipe._id %>/edit">
  <button>Edit</button>
</form>

<form action="/recipes/<%= recipe._id %>?_method=DELETE" method="POST">
  <button type="submit">Delete</button>
</form>

<% } %>

<%- include('../partials/footer.ejs') %>
```

</details>

· · · · · · · · · · · · · · · · · · · ·

In `recipeController.js`, update the `res.send` in `getRecipeById` with:

```js
res.render('./recipes/show.ejs', { user: req.session.user, recipe })
```

You've got a conditional statement in the show page that ensures only the user who made the recipe can edit or delete it. In order for that to work, you have to pass the `session` object to compare the `_id` fields.

[📖 Back to Top](#-table-of-contents)

---


### New Recipe Page

You need a form where users can create new recipes.

```sh
touch ./views/recipes/new.ejs
```

· · · · · · · · · · · · · · · · · · · ·

<details>
<summary>💡 <b>new.ejs</b></summary>

<br>

```html
<%- include('../partials/header.ejs') %>

<h2>New Recipe</h2>
<form action="/recipes" method="POST">
  <input type="text" name="title" placeholder="Title" required />
  <textarea name="description" placeholder="Description" required></textarea>
  <input type="text" name="image" placeholder="Image URL" />
  <input type="hidden" name="author" value="<%= user._id %>" />
  <button type="submit">Create</button>
</form>

<%- include('../partials/footer.ejs') %>
```

</details>

· · · · · · · · · · · · · · · · · · · ·

Route to render the form in `recipeRouter.js`. This needs to go above any `'/:id'` routes:

```js
router.get('/new', (req, res) => {
  res.render('./recipes/new.ejs')
})
```

After you create a new recipe, you need to redirect to the recipe details page. In your `recipeController.js` file, in `createRecipe`, replace the `res.send` with:

```js
res.redirect(`/recipes/${recipe._id}`)
```

[📖 Back to Top](#-table-of-contents)

---


### Edit Recipe Page

A form to edit an existing recipe.

```sh
touch ./views/recipes/edit.ejs
```

· · · · · · · · · · · · · · · · · · · ·

<details>
<summary>💡 <b>edit.ejs</b></summary>

<br>

```html
<%- include('../partials/header.ejs') %>

<h2>Edit Recipe</h2>
<form action="/recipes/<%= recipe._id %>?_method=PUT" method="POST">
  <input type="text" name="title" value="<%= recipe.title %>" required />
  <textarea name="description" required><%= recipe.description %></textarea>
  <input type="text" name="image" value="<%= recipe.image %>" />
  <button type="submit">Update</button>
</form>

<%- include('../partials/footer.ejs') %>
```

</details>

· · · · · · · · · · · · · · · · · · · ·

In `recipeRouter.js`, you need to import your `Recipe` model because you'll need the recipe details when you edit:

```js
const Recipe = require('../models/Recipe.js')
```

```js
router.get('/:id/edit', async (req, res) => {
  const recipe = await Recipe.findById(req.params.id)
  res.render('./recipes/edit.ejs', { recipe })
})
```

After you update the recipe, you need to redirect to the recipe details page. In your `recipeController.js` file, in `updateRecipeById`, replace the `res.send` with:

```js
res.redirect(`/recipes/${recipe._id}`)
```

[📖 Back to Top](#-table-of-contents)

---


### Delete Recipe Confirm Page

A page that confirms to the user that the recipe has been deleted.

```sh
touch ./views/recipes/confirm.ejs
```

· · · · · · · · · · · · · · · · · · · ·

<details>
<summary>💡 <b>confirm.ejs</b></summary>

<br>

```html
<%- include('../partials/header.ejs') %>

<h2>Your recipe has been deleted!</h2>

<%- include('../partials/footer.ejs') %>
```

</details>

· · · · · · · · · · · · · · · · · · · ·

After you delete the recipe, you need to render the confirm page. In your `recipeController.js` file, in `deleteRecipeById`, replace the `res.send` with:

```js
res.render('./recipes/confirm.ejs')
```

[📖 Back to Top](#-table-of-contents)

---


## Styling (optional)

Here is some styling that will work with the EJS pages you've done so far, but feel free to make your own!

Let's make a folder to hold your CSS.

```sh
mkdir public
```

Then, create your stylesheet:

```sh
touch ./public/style.css
```

In order to host a *static* file in your Node environment, you need a line of code in your `server.js`. Just underneath your `const app = express()`, add:

```js
app.use(express.static('public'))
```

Now your project will be able to find and use your `style.css` file.

· · · · · · · · · · · · · · · · · · · ·

<details>
<summary>💡 <b>style.css</b></summary>

<br>

```css
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600&display=swap');

html,
body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

body {
  display: flex;
  flex-direction: column;
  font-family: 'Quicksand', sans-serif;
  background-color: #f9f4ef;
  color: #4b3f2f;
  line-height: 1.6;
}

nav {
  background-color: #d8b99c;
  padding: 15px;
  text-align: center;
}

nav a {
  margin: 0 10px;
  color: #4b3f2f;
  font-weight: 600;
  text-decoration: none;
}

nav a:hover {
  text-decoration: underline;
}

main {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 400px 20px;
  box-sizing: border-box;
}

h1,
h2,
h3 {
  color: #5b4636;
  margin-top: 0;
  text-align: center;
}

form {
  background: #fff8f0;
  border: 1px solid #d3c0ae;
  padding: 20px;
  margin: 20px 0;
  border-radius: 6px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
  max-width: 500px;
  width: 100%;
  text-align: left;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

form input,
form textarea,
form button {
  display: block;
  width: 90%;
  padding: 10px;
  margin: 10px 0;
  font-family: inherit;
  border: 1px solid #bca98e;
  border-radius: 4px;
}

form textarea {
  height: 150px;
}

button {
  background-color: #b98962;
  color: white;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease-in-out;
}

button:hover {
  background-color: #a36d4a;
}

ul {
  list-style-type: none;
  padding: 0;
}

ul li {
  margin: 10px 0;
  text-align: center;
}

footer {
  background-color: #d8b99c;
  text-align: center;
  padding: 10px;
  color: #4b3f2f;
}
```

</details>

· · · · · · · · · · · · · · · · · · · ·

[📖 Back to Top](#-table-of-contents)

---


![Michael & Patch are Satisfied](./images/end.png)


## Recap

In this lesson, you learned how to set up a Node/Express server from scratch, how to create new models using the Mongoose Schema class, and how to write simple functions to perform CRUD operations on your database.  As your Node/Express applications grow in scale and get more complex in structure, these core principles will remain the same.

This is a BIG lesson, with lots of opportunities to make a mistake. So there is a provided [solution branch](https://github.com/NobodysLackey/mongoose-recipes/tree/solution) to this repository that you can clone down to see the final version.

You can also view the deployed version [here](https://mongoose-recipes.fly.dev/).


## 📚 Resources

Deployed Version:
- [mongoose-recipes.fly.dev](https://mongoose-recipes.fly.dev/)
- [Deploy Your Own!](https://expressdeployment.fly.dev/)

Documentation:
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [Node Docs](https://nodejs.org/docs/latest/api/)
- [Express Docs](https://expressjs.com/)
- [Mongoose Docs](https://mongoosejs.com/docs/guide.html)
- [morgan](https://www.npmjs.com/package/morgan)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [method-override](https://www.npmjs.com/package/method-override)
- [express-session](https://www.npmjs.com/package/express-session)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [nodemon](https://www.npmjs.com/package/nodemon)

ERD Tools:
- [Canva](http://www.canva.com)
- [Figma](https://www.figma.com)
- [draw.io](https://app.diagrams.net/)
- [LucidChart](https://www.lucidchart.com/)

Testing:
- [Insomnia](https://insomnia.rest/)
- [Postman](https://www.postman.com/downloads/)

![Michael & Patch Enjoy the Credits](./images/credits.gif)

[📖 Back to Top](#-table-of-contents)

---

![Michael & Patch Enjoying Some Time Off](./images/jet-skiing.png)
