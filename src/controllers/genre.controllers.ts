import { Request, Response } from "express";
import prisma from "../db/client";

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
