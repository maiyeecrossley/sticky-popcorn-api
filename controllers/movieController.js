import express from 'express'
import validateToken from '../middleware/validateToken.js'
import Movie from '../models/movie.js'

const router = express.Router()

// * Show all movies route
router.get('/movies', async (req, res, next) => {
    try {
        const movies = await Movie.find()
        console.log(`get movies: ${movies}`)

        return res.json(movies)
    } catch (error) {
        next(error)
    }
})

// * Show single movie route
router.get('/movies/:movieId', async (req, res, next) => {
    try {
        const { movieId } = req.params
        const movie = await Movie.findById(movieId)

        if(!movie) return res.status(404).json({ message: 'Movie not found' })

        return res.json(movie)
    } catch (error) {
        next(error)
    }
})

// * Show reviews route
router.get('/movies/:movieId/reviews', async (req, res, next) => {
    try {
        const { movieId } = req.params
        const movie = await movie.findById(movieId).populate('author').populate('review.author')

        if(!movie) return res.status(404).json({ message: 'Movie not found' })

        return res.json(movie)
    } catch (error) {
        next(error)
    }
})

// * Likes route
router.put('/movies/:movieId/likes', validateToken, async (req, res, next) => {
    try {
        const { movieId } = req.params
        const movie = await movie.findById(movieId)

        if(!movie) return res.status(404).json({ message: 'Movie not found' })

        const alreadyLiked = movie.likes.includes(req.user._id)

        const updatedMovie = await Movie.findByIdAndUpdate(movieId, {
            [alreadyLiked ? '$pull' : '$addToSet']: { likes: req.user._id }
          }, { returnDocument: 'after' })
          
          return res.json(updatedMovie)
    } catch (error) {
        next(error)
    }
})

// * Watchlist route
router.put('/movies/:movieId/watchlist', validateToken, async (req, res, next) => {
    try {
        const { movieId } = req.params
        const movie = await movie.findById(movieId)

        if(!movie) return res.status(404).json({ message: 'Movie not found' })

        const alreadyListed = movie.watchlist.includes(req.user._id)

        const updatedMovie = await Movie.findByIdAndUpdate(movieId, {
            [alreadyListed ? '$pull' : '$addToSet']: { likes: req.user._id }
          }, { returnDocument: 'after' })
          
          return res.json(updatedMovie)
    } catch (error) {
        next(error)
    }
})

export default router