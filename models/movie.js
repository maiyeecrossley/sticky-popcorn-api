import mongoose, { Mongoose } from "mongoose";

const movieSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    year: {
        type: Number,
        required: true
    },
    
    cast: {
        type: [String],
        required: true
    },

    director: {
        type: String,
        required: true
    },

    genre: {
        type: [String],
        required: true
    },

    runtime: {
        type: String,
        required: true
    },

    certificate: {
        type: String,
        required: true
    },

    poster_url: {
        type: String,
        required: true
    },

}, {
    toJSON:{
        virtuals: true
    }
})

movieSchema.virtual('favouritedBy', {
    foreignField: 'favourites',
    localField: '_id',
    ref: 'User'
})

movieSchema.virtual('watchlistBy', {
    foreignField: 'watchlist',
    localField: '_id',
    ref: 'User'
})

export default mongoose.model("Movie", movieSchema)