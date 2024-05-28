import { Router } from "express";
import {
  createGenre,
  deleteGenre,
  getAllGenres,
  updateGenre,genresByMovieId,addGenreToMovie
} from "../controllers/genre.controllers";

const genreRouter = Router();

genreRouter.get("/", getAllGenres);
genreRouter.post("/:movieId", createGenre);
genreRouter.patch("/:genreId", updateGenre);
genreRouter.delete("/:genreId", deleteGenre);
genreRouter.get("/:movieId", genresByMovieId);
genreRouter.post("/genremovie/:movieId/:genreId", addGenreToMovie);

export default genreRouter;
