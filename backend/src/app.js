import cors from "cors";
import express from "express";
import sequenceRouter from "./routes/sequence.route.js";

const app = express();

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

app.set("trust proxy", 1);

app.use(express.json({ limit: "16kb" }));

app.use("/api/sequence", sequenceRouter);

export { app };
