import mongoose from 'mongoose'
import 'dotenv/config'

import Movie from '../models/movie.js'

import movies from './data/movies.js'

const seedDatabase = async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI)
      console.log('Database connected')
  
      // Clear DB
      await Movie.deleteMany()      
      
      const newMovies = await Movie.create(movies)
      console.log(`${movies.length} posts created`)
  
      await mongoose.connection.close()
      console.log('Database connection closed')
  
    } catch (error) {
      console.log(error)
    }
  }
  seedDatabase()