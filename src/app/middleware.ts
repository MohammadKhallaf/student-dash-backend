import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import session from "express-session";
import { corsOrigin, mongoUrl } from "../config";
import MongoStore from "connect-mongo";

const middleware = [
  morgan("dev"),
  cors({
    origin: corsOrigin,
  }),
  cookieParser(),
  express.static("docs"),
  express.json({ limit: "50mb" }),
  urlencoded({ extended: true }),
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl,
      ttl: 14 * 24 * 60 * 60, // 14 days
    }),
    cookie: { secure: process.env.NODE_ENV === "production" },
  }),
];
export default middleware;
