import { Request, Response } from "express";
import MovieModel from "../models/movie.model";
import UserModel from "../models/user.model";
import GenreModel from "../models/genre.model";

export const getAllMovies = async (req: Request, res: Response) => {
  try {
    const allMovies = await MovieModel.find().populate("genres");
    res.status(201).send(allMovies);
  } catch (error: any) {
    res.status(400).send("Error retrieving movies: " + error.message);
  }
};

export const addGenreToMovie = async (req: Request, res: Response) => {
  const { genreId } = req.body;
  const { movieId } = req.params;

  try {
    const movie = await MovieModel.findById(movieId);
    const genre = await GenreModel.findById(genreId);
    if (!movie) {
      return res.status(400).send("Movie not found");
    }
    if (!genre) {
      return res.status(400).send("Genre not found");
    }

    movie.genres.push(genreId);
    await movie.save();

    genre.movies.push(movieId);
    await genre.save();

    res.status(200).send(movie);
  } catch (error: any) {
    res.status(400).send("Error adding genre to movie: " + error.message);
  }
};

export const createMovie = async (req: Request, res: Response) => {
  const { name, poster_image, score } = req.body;
  const { userId } = req.params;

  if (!name || !poster_image || !score) {
    return res.status(400).send("Missing required fields");
  }

  try {
    const movie = await MovieModel.create({ name, poster_image, score });

    const userUpdateResult = await UserModel.findByIdAndUpdate(
      { _id: userId },
      {
        $push: {
          movies: movie._id,
        },
      }
    );

    // Check if the user update operation was successful
    if (!userUpdateResult) {
      // If the user does not exist or the update failed for some reason
      // Rollback movie creation by deleting the movie
      await MovieModel.findByIdAndDelete(movie._id);
      return res.status(404).send("User not found or update failed");
    }

    res.status(201).send(movie);
  } catch (error: any) {
    res.status(400).send("Error creating movie: " + error.message);
  }
};

export const updateMovie = async (req: Request, res: Response) => {
  const { name, poster_image, score } = req.body;
  const { movieId } = req.params;

  if (!name || !poster_image || !score) {
    return res.status(400).send("Missing required fields");
  }

  try {
    const movieUpdated = await MovieModel.findByIdAndUpdate(
      { _id: movieId },
      { name, poster_image, score },
      { new: true }
    );

    if (!movieUpdated) {
      return res.status(404).send("Movie not found");
    }

    res.status(201).send(movieUpdated);
  } catch (error: any) {
    res.status(400).send("Error updating movie: " + error.message);
  }
};

export const deleteMovie = async (req: Request, res: Response) => {
  const { movieId } = req.params;

  try {
    // Find the movie to be deleted
    const deletedMovie = await MovieModel.findByIdAndDelete({ _id: movieId });
    if (!deletedMovie) {
      return res.status(404).send("Movie not found");
    }

    // Remove the movie's ID from the genres that reference it
    await GenreModel.updateMany(
      { movies: movieId },
      { $pull: { movies: movieId } }
    );

    res.status(204).send("Movie deleted successfully");
  } catch (error: any) {
    res.status(400).send("Error deleting movie: " + error.message);
  }
};
