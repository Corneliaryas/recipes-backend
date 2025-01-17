import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import expressListEndpoints from "express-list-endpoints";

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: "Service unavailable" });
  }
});

const mongoURL = process.env.MONGO_URL || "mongodb://localhost/recipes";
mongoose.connect(mongoURL);
mongoose.Promise = Promise;

const Recipe = mongoose.model("Recipe", {
  title: {
    type: String,
    required: true,
  },
  ingredients: {
    type: [String],
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: false,
  },
  time: {
    type: Number,
    required: false,
  },
  preferences: {
    type: [String],
    required: false,
  },
  categories: {
    type: [String],
    required: false,
  },
});

Recipe.deleteMany().then(() => {
  new Recipe({
    title: "Pancakes",
    ingredients: ["flour", "eggs", "milk", "sugar", "salt"],
    instructions: "mix all ingredients, fry in pan",
    difficulty: "easy",
    time: 30,
    preferences: ["vegetarian", "breakfast"],
  }).save();
  new Recipe({
    title: "Coliflower soup",
    ingredients: ["Coliflower", "cream", "salt", "pepper", "water"],
    instructions: "mix all ingredients, boil, mix to a smooth soup",
    difficulty: "easy",
    time: 30,
    preferences: ["vegetarian", "lchf"],
    categories: ["soup"],
  }).save();
  new Recipe({
    title: "Enchiladas",
    ingredients: [
      "mince",
      "tomato",
      "sauce",
      "cheese",
      "tortilla bread",
      "spices",
    ],
    instructions:
      "fry the mince, place a scope of fried mince in each tortilla bread, role them up, pour over tomato sauce and grated cheese, heat in owen for app 20 minutes.",
    difficulty: "medium",
    time: 50,
    preferences: ["vegetarian", "dinner", "low-carb"],
  }).save();
});

app.get("/", (req, res) => {
  res.send(endpoints);
});

app.get("/recipes", async (req, res) => {
  try {
    let recipes = await Recipe.find();
    const ingredientRecipes = recipes.filter((recipe) =>
      recipe.ingredients.includes(req.query.ingredient)
    );
    if (recipes.length > 0) {
      if (ingredientRecipes.length > 0) {
        recipes = ingredientRecipes;
      }
      res.json(recipes);
    } else {
      res.status(404).json({ error: "No recipes found" });
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid request" });
  }
});

app.get("/recipes/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (recipe) {
      res.json(recipe);
    } else {
      res.status(404).json({ error: "Could not find recipe" });
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid recipe id" });
  }
});
app.post("/recipes", async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    await recipe.save();
    res.json(recipe);
  } catch (error) {
    res.status(400).json({ error: "Invalid recipe" });
  }
});

const endpoints = expressListEndpoints(app);

app.listen(port, () => console.log(`App listening to port ${port}`));
