import jwt from "jsonwebtoken"
import "dotenv/config"

export const generateToken = (user) => {
  return jwt.sign(
      { user: { _id: user._id, username: user.username, favourites: user.favourites, watchlist: user.watchlist }},
      process.env.TOKEN_SECRET,
      { expiresIn: '24h' }
    )
}