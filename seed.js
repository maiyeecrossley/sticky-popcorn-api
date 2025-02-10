import mongoose from 'mongoose'
import 'dotenv/config'

import Movie from './models/movie.js'
import Review from "./models/review.js"
import User from "./models/user.js"

import movies from './data/movies.js'
import reviewData from "./data/reviews.js"
import userData from "./data/users.js"

const seedDatabase = async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI)
      console.log('Database connected')
  
      // Clear DB
      await Movie.deleteMany()
      await Review.deleteMany()
      await User.deleteMany()      
      
      const newMovies = await Movie.create(movies)
      console.log(`${movies.length} posts created`)

      const users = await User.create(userData)
      console.log(`${users.length} users created`)

      const movieMap = {}
      movies.forEach(movie => {
        movieMap[movie.title] = movie._id
      })

      const reviews = await Review.create(reviewData.map(review => ({
        content: review.content,
        author: users[Math.floor(Math.random() * users.length)]._id,
        movie: movieMap
      })))

      console.log(`${reviews.length} reviews added`)

  
      await mongoose.connection.close()
      console.log('Database connection closed')
  
    } catch (error) {
      console.log(error)
    }
  }
  seedDatabase()