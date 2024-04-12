import { Request, Response } from "express";
import prisma from "../db/client";
export const getAllGenres = async (req: Request, res: Response) => {
  try {
    const allGenres = await prisma.genre.findMany();
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
    const genre = await prisma.genre.create({
      data: { name, movies: { connect: { id: movieId } } },
    });

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
  const { genreId } = req.params;
  try {
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
