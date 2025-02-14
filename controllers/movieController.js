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

// * Show user favourite movies
router.get('/movies/favourites', validateToken, async (req, res, next) => {
    try {

        const user = await User.findById(req.user._id).populate("favourites")
        console.log(user)

        if(!user) return res.status(404).json({ message: 'User not found' })
        console.log(user.favourites)
        return res.json(user.favourites)
    } catch (error) {
        next(error)
    }
})

// * Show user watchlist
router.get('/movies/watchlist', validateToken, async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).populate("watchlist")

        if(!user) return res.status(404).json({ message: 'User not found' })
        console.log(user.watchlist)
        return res.json(user.watchlist)
    } catch (error) {
        next(error)
    }
})

// * Show single movie route
router.get('/movies/:movieId', async (req, res, next) => {
    try {
        const { movieId } = req.params
        const movie = await Movie.findById(movieId).populate({path:'favouritedBy',select:'_id -favourites',}).populate({path:'watchlistBy',select:'_id -watchlist',})

        if(!movie) return res.status(404).json({ message: 'Movie not found' })

        return res.json(movie)
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
          
        const updatedMovie = await Movie.findById(movieId).populate({path: 'favouritedBy', select: '_id -favourites'})

        return res.json(updatedMovie)
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
        
        const updatedMovie = await Movie.findById(movieId).populate({path: 'watchlistBy', select: '_id -watchlist'})

        return res.json(updatedMovie)
    } catch (error) {
        next(error)
    }
})


export default router