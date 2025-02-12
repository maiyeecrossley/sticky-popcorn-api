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
      
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    
    watchlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],

    rating: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }]

    // reviews: [reviewSchema]
})

export default mongoose.model("Movie", movieSchema)