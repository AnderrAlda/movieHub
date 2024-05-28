import { Router } from "express";
import {
  createMovie,
  deleteMovie,
  getAllMovies,
  updateMovie,
  addGenreToMovie,
  getMovieById
} from "../controllers/movie.controllers";

const movieRouter = Router();
movieRouter.post("/:userId", createMovie);
movieRouter.get("/", getAllMovies);
movieRouter.get("/:id", getMovieById);
movieRouter.patch("/:movieId", updateMovie);
movieRouter.delete("/:movieId", deleteMovie);
movieRouter.post("/:movieId/addGenre", addGenreToMovie);

export default movieRouter;
