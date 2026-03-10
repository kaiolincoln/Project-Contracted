import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { router } from "./routes";

const app = express();

app.use(cors({
  origin: "http://localhost:5173", 
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use("/uploads", express.static(path.resolve(__dirname, "tmp", "uploads")));
app.use(router);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof Error) {
    return res.status(400).json({ message: err.message });
  }
  return res.status(500).json({ message: "Erro interno do servidor" });
});

export { app };