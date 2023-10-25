import express from "express";
import http from "http";
import cors from "cors";
import Session from "express-session";
import mongoose from "mongoose";
import { router as Router } from "./routes/index.js";

import SQLiteStore from "connect-sqlite3";
import session from "express-session";

const SQLiteStoreInstance = SQLiteStore(session);

const DATABSE_URL = "mongodb://45.33.77.191:27017/sniperdex";
const router = express();
const corsConfig = {
  origin: true,
  credentials: true,
};

mongoose
  .connect(DATABSE_URL, {
    retryWrites: true,
    w: "majority",
    user: "chaind",
    pass: "chaindPas21",
    authSource: "admin",
  })
  .then(() => {
    console.log("Connected to Mongoose");
    startServer();
  })
  .catch((e) => {
    console.error(e);
  });

const startServer = async () => {
  router.use(express.urlencoded({ extended: true }));
  router.use(express.json());
  router.use(cors(corsConfig));
  router.options(cors(corsConfig));
  router.use(
    Session({
      name: "sniper-terminal",
      secret: "teddo change me please!!!!!",

      resave: true,
      store: new SQLiteStoreInstance({
        table: "sessions",
        db: "session.db",
        dir: ".",
      }),
      saveUninitialized: false,
      cookie: { secure: false, sameSite: true },
    })
  );
  router.get("/ping", (req, res) => res.status(200).json({ message: "pong" }));
  router.use(Router);
  http
    .createServer(router)
    .listen(3001, "0.0.0.0", () =>
      console.log(`Server is running on port ${3001}.`)
    );
};
