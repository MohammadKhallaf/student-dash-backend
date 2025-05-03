import express, { type Application } from "express";
import path from "node:path";
import middleware from "./middleware";
import routes from "./routes";

import { errorHandler } from "./errors";
import { notFoundHandler } from "../errors/notFoundError";
const app: Application = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));

app.use(express.json());
app.use(middleware);
app.use("/api/v1", routes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
