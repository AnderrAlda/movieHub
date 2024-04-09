import { Router } from "express";
import {
  createMovie,
  deleteMovie,
  getAllMovies,
  updateMovie,
} from "../controllers/movie.controllers";

const movieRouter = Router();
movieRouter.post("/:userId", createMovie);
movieRouter.get("/", getAllMovies);
movieRouter.patch("/:movieId", updateMovie);
movieRouter.delete("/:movieId", deleteMovie);

export default movieRouter;
