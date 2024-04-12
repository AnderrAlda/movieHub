import { Request, Response } from "express";
import GenreModel from "../models/genre.model";
import MovieModel from "../models/movie.model";

export const getAllGenres = async (req: Request, res: Response) => {
  try {
    const allGenres = await GenreModel.find().populate("movies");
    res.status(201).send(allGenres);
  } catch (error: any) {
    res.status(400).send("Error retrieving genres: " + error.message);
  }
};

export const createGenre = async (req: Request, res: Response) => {
  const { name } = req.body;
  const { movieId } = req.params;

  if (!name) {
    return res.status(400).send("Missing required fields");
  }

  try {
    const genre = await GenreModel.create({ name, movies: [movieId] });
    const movieUpdateResult = await MovieModel.findByIdAndUpdate(
      { _id: movieId },
      {
        $push: {
          genres: genre._id,
        },
      }
    );

    // Check if the movie update operation was successful
    if (!movieUpdateResult) {
      // If the movie does not exist or the update failed for some reason
      // Rollback genre creation by deleting the genre
      await GenreModel.findByIdAndDelete(genre._id);
      return res.status(404).send("Movie not found or update failed");
    }

    res.status(201).send(genre);
  } catch (error: any) {
    res.status(400).send("Error creating genre: " + error.message);
  }
};

export const updateGenre = async (req: Request, res: Response) => {
  const { name } = req.body;
  const { genreId } = req.params;

  if (!name) {
    return res.status(400).send("Missing required fields");
  }

  try {
    const genreUpdated = await GenreModel.findByIdAndUpdate(
      { _id: genreId },
      {
        name,
      },
      { new: true }
    );

    if (!genreUpdated) {
      return res.status(404).send("Genre not found");
    }

    res.status(201).send(genreUpdated);
  } catch (error: any) {
    res.status(400).send("Error updating genre: " + error.message);
  }
};

export const deleteGenre = async (req: Request, res: Response) => {
  const { genreId } = req.params;

  try {
    // Find the genre to be deleted
    const deletedGenre = await GenreModel.findByIdAndDelete({ _id: genreId });
    if (!deletedGenre) {
      return res.status(404).send("Genre not found");
    }

    // Remove the genre's ID from the movies that reference it
    await MovieModel.updateMany(
      { genres: genreId },
      { $pull: { genres: genreId } }
    );

    res.status(204).send("Genre deleted successfully");
  } catch (error: any) {
    res.status(400).send("Error deleting genre: " + error.message);
  }
};
