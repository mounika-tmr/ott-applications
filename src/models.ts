import mongoose from "mongoose";

const MovieSchema = new mongoose.Schema({
  title: String,
  genre: String,
  rating: Number,
  streamingLink: String,
});

export const Movie = mongoose.model('Movie',MovieSchema);

const UserSchema = new mongoose.Schema({
  email: String,
  name: String,
  role: String,
});

export const User = mongoose.model('User',UserSchema);