import { Schema, model } from "mongoose";

interface IGenreSchema {
  name: String;
  movies: string[];
}

const genreSchema = new Schema<IGenreSchema>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    movies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Movie",
      },
    ],
  },
  { timestamps: true }
);

const GenreModel = model<IGenreSchema>("Genre", genreSchema);

export default GenreModel;
