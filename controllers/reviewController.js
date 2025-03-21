import express from "express"
import validateToken from "../middleware/validateToken.js"
import Review from "../models/review.js"
import Movie from "../models/movie.js"

const router = express.Router()

//* ALL REVIEWS FOR GIVEN MOVIE
router.get("/movies/:movieId/reviews", async (req, res, next) => {
    try {
        const { movieId } = req.params
        const movie = await Movie.findById(movieId)
        
        if(!movie) {
            return res.status(404).json ({ message: "Movie not found" })
        }
        const reviews = await Review.find({ movieId: movieId }).populate("author")
            return res.json(reviews)
    } catch (error) {
        next(error)
    }
})


//* SINGLE REVIEW
router.get("/movies/:movieId/reviews/:reviewId", async (req, res, next) => {
    try {

        const { movieId } = req.params
        const movie = await Movie.findById(movieId)

        if(!movie)
            return res.status(404).json({ message: "Movie not found" })

        const { reviewId } = req.params
        const review = await Review.findOne({ _id: reviewId, movieId: movieId }).populate("author")

        if(!review) 
            return res.status(404).json({ message: "Review not found for this movie" })

            return res.json(review)
    } catch (error) {
        next(error)
    }
})


//* CREATE REVIEW
router.post("/movies/:movieId/reviews", validateToken, async (req, res, next) => {
    try {
        req.user
        req.body.author = req.user._id
        req.body.movieId = req.params.movieId
        const postReview = await Review.create(req.body)
            
        return res.json(postReview)
    } catch (error) {
        next(error)
    }
})


//* DELETE REVIEW
router.delete("/movies/:movieId/reviews/:reviewId", validateToken, async (req, res, next) => {
    try {
        const { reviewId } = req.params
        const review = await Review.findById(reviewId)

        if(!review) 
            return res.status(404).json({ message: "Review not found" })
        
        if(!req.user._id.equals(review.author))
            return res.status(403).json({ message: "You do not have permission to remove this review" })

        await Review.findByIdAndDelete(reviewId)
            return res.sendStatus(204)
    } catch (error) {
        next(error)
    }
})


//* UPDATE REVIEW
router.put("/movies/:movieId/reviews/:reviewId", validateToken, async (req, res, next) => {
    try {
        const { reviewId } = req.params
        const review = await Review.findById(reviewId)

        if(!review)
            return res.status(404).json({ message: "Review not found" })

        if(!req.user._id.equals(review.author))
            return res.status(403).json({ message: "You do not have permission to change this review" })

            const updatedReview = await Review.findByIdAndUpdate(reviewId, req.body, { new: true })
                return res.json(updatedReview)
    } catch (error) {
        next(error)
    }
})

export default router