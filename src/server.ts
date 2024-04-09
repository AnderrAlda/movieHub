import express from "express";
import userRouter from "./routes/user.routes";
import movieRouter from "./routes/movie.routes";
import genreRouter from "./routes/genre.routes";

const app = express();

//the middleware express.json() is responsible for parsing JSON data from incoming requests and making it available in req.body. Use is used for middlewares.
app.use(express.json());

//in the route user use the middleware userRouter
app.use("/user", userRouter);

app.use("/movie", movieRouter);

app.use("/genre", genreRouter);

export default app;
