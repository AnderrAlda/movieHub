import { Schema, model } from "mongoose";

interface IMovieSchema {
  name: string;
  poster_image: string;
  score: number;
  genres: string[];
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
    poster_image: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: false,
    },
    genres: [
      {
        type: Schema.Types.ObjectId,
        ref: "Genre",
      },
    ],
  },
  { timestamps: true }
);

const MovieModel = model<IMovieSchema>("Movie", movieSchema);

export default MovieModel;
