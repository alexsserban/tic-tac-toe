import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const main = async () => {
  if (!process.env.PORT) return console.error("PORT not available");

  const port = process.env.PORT;
  const app: Express = express();

  app.get("/", (req: Request, res: Response) => {
    res.send("Tic Tac Toe");
  });

  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
  });
};

main();
