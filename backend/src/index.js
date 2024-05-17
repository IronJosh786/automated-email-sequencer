import dotenv from "dotenv";
import { app } from "./app.js";
import connectToDB from "./db/index.js";

dotenv.config({ path: "./.env" });

connectToDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error while talking with database: ", error);
    });
    app.listen(process.env.PORT, "0.0.0.0", () => {
      console.log("Server is listening on port: ", process.env.PORT);
    });
  })
  .catch((error) => console.log("Connection to MongoDB failed: ", error));
