import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

console.log("hello world")

const app = express();

app.use(cors())
app.use(bodyParser.json())

const mongoURL = process.env.MONGO_URL || 'mongodb://localhost/recipes';
mongoose.connect(mongoURL);
mongoose.Promise = Promise;

const Recipe = mongoose.model('Recipe', {
    title: {
        type: String,
        required: true
      },
      ingredients: {
        type: String,
        required: true
      },
      instructions: {
        type: String,
        required: true
      },
      difficulty: {
        type: String,
        required: false
      },
      time: {
        type: Number,
        required: false
      },
      preferences: {
        type: [String],
        required: false
      },
      categories: {
        type: [String],
        required: false
      }
    
})

Recipe.deleteMany().then(() => {
    new Recipe({
        title: 'Pancakes',
        ingredients: 'flour, eggs, milk, sugar, salt',
        instructions: 'mix all ingredients, fry in pan',
        difficulty: 'easy',
        time: 30,
        preferences: ['vegetarian', 'breakfast']
      }).save()
    
    
      new Recipe({
        title: 'Coliflower soup',
        ingredients: 'Coliflower, cream, salt, pepper, water',
        instructions: 'mix all ingredients, boil, mix to a smooth soup',
        difficulty: 'easy',
        time: 30,
        preferences: ['vegetarian', 'lchf'],
        categories: ['soup']
      }).save()
    
    
      new Recipe({
        title: 'Enchiladas',
        ingredients: 'mince, tomato sauce, cheese, tortilla bread, spices',
        instructions: 'mix all ingredients, fry in pan',
        difficulty: 'medium',
        time: 50,
        preferences: ['vegetarian', 'dinner', 'low-carb']
      }).save()})

app.get("/", (req, res) => {
    Recipe.find().then((recipes) => {res.json(recipes)})
}) 

app.get('/:title', (req, res) => {

})

app.listen(3000, () => console.log("App listening to port 3000"))