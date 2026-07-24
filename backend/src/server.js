import "dotenv/config";
import cors from "cors";
import express from "express";
import routes from "./routes.js";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json({ limit: "100kb" }));

app.get("/", (_req, res) => {
  res.status(200).json({ message: "AQUA SUN Backend funcionando" });
});

app.use(routes);

app.use((err, _req, res, _next) => {
  console.error("Error no controlado:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(port, () => {
  console.log(`AQUA SUN Backend escuchando en el puerto ${port}`);
});
