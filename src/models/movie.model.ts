import { Schema, model } from "mongoose";

interface IMovieSchema {
  name: string;
  image: string;
  score: number;
  createAt?: Date;
  updateAt?: Date;
}

const movieSchema = new Schema<IMovieSchema>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
);

const MovieModel = model<IMovieSchema>("Movie", movieSchema);

export default MovieModel;
