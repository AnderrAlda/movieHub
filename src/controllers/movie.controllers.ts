import { Request, Response } from "express";
import prisma from "../db/client";

export const getAllMovies = async (req: Request, res: Response) => {
  try {
    const allMovies = await prisma.movies.findMany({
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
      },
    });
    res.status(201).send(allMovies);
  } catch (error: any) {
    res.status(400).send("Error retrieving movies: " + error.message);
  }
};

export const addGenreToMovie = async (req: Request, res: Response) => {
  const { genreId } = req.body;
  const movieId = parseInt(req.params.movieId);

  if (!genreId || !movieId) {
    return res.status(400).send("Invalid genreId or movieId");
  }

  try {
    // Check if the movie and genre exist
    const movie = await prisma.movies.findUnique({
      where: { id: movieId },
    });

    const genre = await prisma.genre.findUnique({
      where: { id: genreId },
    });

    if (!movie) {
      return res.status(404).send("Movie not found");
    }

    if (!genre) {
      return res.status(404).send("Genre not found");
    }

    // Add the genre to the movie
    await prisma.movieGenre.create({
      data: {
        movieId: movieId,
        genreId: genreId,
      },
    });

    res.status(200).send("Genre added to movie successfully");
  } catch (error: any) {
    res.status(400).send("Error adding genre to movie: " + error.message);
  }
};

export const createMovie = async (req: Request, res: Response) => {
  const { name, poster_image, score, genres } = req.body;

  const userId = parseInt(req.params.userId);

  if (!name || !poster_image || !score) {
    return res.status(400).send("Missing required fields");
  }

  if (!userId) {
    return res.status(400).send("Missing required userId parameter");
  }

  try {
    const movie = await prisma.$transaction(async (prisma) => {
      //create movie
      const newMovie = await prisma.movies.create({
        data: { name, poster_image, score, user: { connect: { id: userId } } },
      });

      //create genres of the movie
      if (genres && genres.length) {
        const createGenres = genres.map((genreId: number) => ({
          movieId: newMovie.id,
          genreId: genreId,
        }));

        await prisma.movieGenre.createMany({
          data: createGenres,
        });
      }

      //return the created movie
      return prisma.movies.findUnique({
        where: {
          id: newMovie.id,
        },
        include: {
          genres: true,
        },
      });
    });

    res.status(201).send({
      msg: "Movie created successfully",
      data: movie,
    });
  } catch (error: any) {
    res.status(400).send("Error creating movie: " + error.message);
  }
};

export const updateMovie = async (req: Request, res: Response) => {
  const { name, poster_image, score } = req.body;

  const movieId = parseInt(req.params.movieId);

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
  const movieId = parseInt(req.params.movieId);

  try {
    // Delete associated MovieGenre records first
    await prisma.movieGenre.deleteMany({
      where: { movieId: movieId },
    });

    // Now delete the movie
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
