import express, { json, urlencoded } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./shared/error-handler.js";
import { notFoundHandler } from "./shared/not-found.js";
import usersRouter from "./routes/users.js";
import documentsRouter from "./routes/documents.js";
import employeesRouter from "./routes/employees.js";
import projectsRouter from "./routes/projects.js";
import searchRouter from "./routes/search.js";
import alertsRouter from "./routes/alerts.js";

dotenv.config();

const app = express();

const corsOptions = { origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : ["http://localhost:5173"], credentials: true };
app.use(cors(corsOptions));

// Simple request logger
app.use((req, _res, next) => {
	console.log(`${req.method} ${req.path}`);
	next();
});

app.use(json({ limit: "5mb" }));
app.use(urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => {
	res.json({ ok: true, ts: Date.now() });
});

app.use("/api/users", usersRouter);
app.use("/api/documents", documentsRouter);
app.use("/api/employees", employeesRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/search", searchRouter);
app.use("/api/alerts", alertsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const port = Number(process.env.PORT || 8080);
app.listen(port, () => {
	console.log(`API listening on http://localhost:${port}`);
});
