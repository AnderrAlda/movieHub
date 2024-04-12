import { Request, Response } from "express";
import prisma from "../db/client";

export const getAllMovies = async (req: Request, res: Response) => {
  try {
    const allMovies = await prisma.movies.findMany();
    res.status(201).send(allMovies);
  } catch (error: any) {
    res.status(400).send("Error retrieving movies: " + error.message);
  }
};

export const addGenreToMovie = async (req: Request, res: Response) => {
  const { genreId } = req.body;
  const { movieId } = req.params;

  try {
    const movie = await prisma.movies.findUnique({
      where: {
        id: movieId,
      },
    });
    const genre = await prisma.genre.findUnique({
      where: {
        id: genreId,
      },
    });
    if (!movie) {
      return res.status(400).send("Movie not found");
    }
    if (!genre) {
      return res.status(400).send("Genre not found");
    }

    await prisma.movies.update({
      where: {
        id: movieId,
      },
      data: {
        genres: {
          connect: {
            id: genreId,
          },
        },
      },
    });

    await prisma.genre.update({
      where: {
        id: genreId,
      },
      data: {
        movies: {
          connect: {
            id: movieId,
          },
        },
      },
    });

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
    const movie = await prisma.movies.create({
      data: { name, poster_image, score, user: { connect: { id: userId } } },
    });

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
    const movieUpdated = await prisma.movies.update({
      where: { id: movieId },
      data: { name, poster_image, score },
    });

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
    const deletedMovie = await prisma.movies.delete({
      where: { id: movieId },
    });

    if (!deletedMovie) {
      return res.status(404).send("Movie not found");
    }

    res.status(204).send("Movie deleted successfully");
  } catch (error: any) {
    res.status(400).send("Error deleting movie: " + error.message);
  }
};
