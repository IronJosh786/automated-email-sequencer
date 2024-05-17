import express from "express";

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

import sequenceRouter from "./routes/sequence.route.js";

app.use("/api/sequence", sequenceRouter);

export { app };
