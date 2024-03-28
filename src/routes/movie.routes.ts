import { Router } from "express";
import { createMovie, getAllMovies } from "../controllers/movie.controllers";

const movieRouter = Router();
movieRouter.post("/:userId", createMovie);
movieRouter.get("/", getAllMovies);

export default movieRouter;
