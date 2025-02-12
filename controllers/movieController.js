import express from 'express'
import validateToken from '../middleware/validateToken.js'
import User from '../models/user.js'
import Movie from '../models/movie.js'

const router = express.Router()

// * Show all movies route
router.get('/movies', async (req, res, next) => {
    try {
        const movies = await Movie.find()

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

// * Show user favourite movies
router.get('/movies/:userId/favourites', validateToken, async (req, res, next) => {
    try {
        const { userId } = req.params
        const user = await User.findById(userId).populate("favourites")
        console.log(user)

        if(!User) return res.status(404).json({ message: 'User not found' })

        return res.json(user.favourites)
    } catch (error) {
        next(error)
    }
})

// * Show user watchlist
router.get('/movies/:userId/watchlist', validateToken, async (req, res, next) => {
    try {
        const { userId } = req.params
        const user = await User.findById(userId).populate("watchlist")

        if(!User) return res.status(404).json({ message: 'User not found' })

        return res.json(user.watchlist)
    } catch (error) {
        next(error)
    }
})

// * Add movie to favourites
router.put('/movies/:movieId/favourites', validateToken, async (req, res, next) => {
    try {
        const userId = req.user._id
        const { movieId } = req.params

        const movie = await Movie.findById(movieId)

        if(!movie) return res.status(404).json({ message: 'Movie not found' })
        if(!userId) return res.status(404).json({ message: 'User not found' })

        const alreadyLiked = req.user.favourites.includes(movieId)

        const updatedFavs = await User.findByIdAndUpdate(userId, {
            [alreadyLiked ? '$pull' : '$addToSet']: { favourites: movieId }
        }, { returnDocument: 'after' })
          
        return res.json(updatedFavs)
    } catch (error) {
        next(error)
    }
})

// * Add movie to watchlist
router.put('/movies/:movieId/watchlist', validateToken, async (req, res, next) => {
    try {
        const userId = req.user._id
        const { movieId } = req.params
        
        const movie = await Movie.findById(movieId)

        if(!movie) return res.status(404).json({ message: 'Movie not found' })
        if(!userId) return res.status(404).json({ message: 'User not found' })

        const alreadyAdded = req.user.watchlist.includes(movieId)

        const updatedWatchlist = await User.findByIdAndUpdate(userId, {
            [alreadyAdded ? '$pull' : '$addToSet']: { watchlist: movieId }
        }, { returnDocument: 'after' })
          
        return res.json(updatedWatchlist)
    } catch (error) {
        next(error)
    }
})


export default router