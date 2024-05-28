import { Request, Response } from "express";
import prisma from "../db/client";


export const addGenreToMovie = async (req: Request, res: Response) => {
  const movieId = parseInt(req.params.movieId);
  const genreId = parseInt(req.params.genreId);

  if (!movieId || !genreId) {
    return res.status(400).send("Missing required movieId or genreId parameter");
  }

  try {
    // Check if the movie exists
    const movie = await prisma.movies.findUnique({
      where: {
        id: movieId,
      },
    });

    if (!movie) {
      return res.status(404).send("Movie not found");
    }

    // Check if the genre exists
    const genre = await prisma.genre.findUnique({
      where: {
        id: genreId,
      },
    });

    if (!genre) {
      return res.status(404).send("Genre not found");
    }

    // Create the MovieGenre record
    const movieGenre = await prisma.movieGenre.create({
      data: {
        movieId: movieId,
        genreId: genreId,
      },
    });

    res.status(201).send({
      msg: "Genre added to movie successfully",
      data: movieGenre,
    });
  } catch (error: any) {
    res.status(400).send("Error adding genre to movie: " + error.message);
  }
};

export const genresByMovieId = async (req: Request, res: Response) => {
  const movieId = parseInt(req.params.movieId);

  if (!movieId) {
    return res.status(400).send("Missing required movieId parameter");
  }

  try {
    // Find the movie with the given ID
    const movie = await prisma.movies.findUnique({
      where: {
        id: movieId,
      },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
      },
    });

    if (!movie) {
      return res.status(404).send("Movie not found");
    }

    // Extract genres with name and id from the movie
    const genres = movie.genres.map((genre) => ({
      id: genre.genreId,
      name: genre.genre.name,
    }));

    res.status(200).send({
      movieId: movieId,
      genres: genres,
    });
  } catch (error: any) {
    res.status(400).send("Error retrieving genres by movieId: " + error.message);
  }
};

export const getAllGenres = async (req: Request, res: Response) => {
  try {
    const allGenres = await prisma.genre.findMany({
      include: {
        movies: {
          include: {
            genre: true,
          },
        },
      },
    });
    res.status(201).send(allGenres);
  } catch (error: any) {
    res.status(400).send("Error retrieving genres: " + error.message);
  }
};

export const createGenre = async (req: Request, res: Response) => {
  const { name } = req.body;
  const movieId = parseInt(req.params.movieId);

  if (!name) {
    return res.status(400).send("Missing required fields");
  }

  if (!movieId) {
    return res.status(400).send("Missing required movieId parameter");
  }

  try {
    // Check if the movie exists
    const existingMovie = await prisma.movies.findUnique({
      where: {
        id: movieId,
      },
    });

    if (!existingMovie) {
      return res.status(404).send("Movie not found");
    }

    // Create the genre
    const genre = await prisma.$transaction(async (prisma) => {
      const newGenre = await prisma.genre.create({
        data: { name },
      });

      // Create the MovieGenre record
      await prisma.movieGenre.create({
        data: {
          movieId: movieId,
          genreId: newGenre.id,
        },
      });

      return prisma.genre.findUnique({
        where: {
          id: newGenre.id,
        },
        include: {
          movies: true,
        },
      });
    });

    res.status(201).send({
      msg: "Genre created successfully",
      data: genre,
    });
  } catch (error: any) {
    res.status(400).send("Error creating genre: " + error.message);
  }
};

export const updateGenre = async (req: Request, res: Response) => {
  const { name } = req.body;
  const genreId = parseInt(req.params.genreId);

  if (!name) {
    return res.status(400).send("Missing required fields");
  }

  try {
    const genreUpdated = await prisma.genre.update({
      where: { id: genreId },
      data: { name },
    });

    if (!genreUpdated) {
      return res.status(404).send("Genre not found");
    }

    res.status(201).send(genreUpdated);
  } catch (error: any) {
    res.status(400).send("Error updating genre: " + error.message);
  }
};

export const deleteGenre = async (req: Request, res: Response) => {
  const genreId = parseInt(req.params.genreId);
  try {
    // Delete associated MovieGenre records first
    await prisma.movieGenre.deleteMany({
      where: { genreId: genreId },
    });

    // Now delete the genre
    const deletedGenre = await prisma.genre.delete({
      where: { id: genreId },
    });

    if (!deletedGenre) {
      return res.status(404).send("Genre not found");
    }

    res.status(204).send("Genre deleted successfully");
  } catch (error: any) {
    res.status(400).send("Error deleting genre: " + error.message);
  }
};
