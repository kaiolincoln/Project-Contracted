// Arquivo para iniciar backend -- ass: lincoln

// ARQUITETURA EM CAMADAS:


import cors from "cors";
import "dotenv/config";
import express, { Request, Response } from "express";
import { router } from "./routes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(router);

app.use((error: Error, _: Request, res: Response) => {
  if (error instanceof Error) {
    return res.status(400).json({
      error: error.message,
    });
  }

  return res.status(500).json({
    error: "Internal server error!",
  });
});

const PORT = process.env.PORT! || 3333;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
