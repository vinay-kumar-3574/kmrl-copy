import express from "express";
import { z } from "zod";
import { db } from "../firebase.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

const projectSchema = z.object({
	title: z.string().min(1),
	sector: z.string().min(1),
	status: z.enum(["active", "completed", "on_hold"]).default("active"),
	description: z.string().optional(),
});

router.get("/", authenticateUser, async (_req, res, next) => {
	try {
		const snap = await db.collection("projects").limit(200).get();
		const projects = snap.docs.map(d => ({ id: d.id, ...d.data() }));
		res.json({ projects });
	} catch (err) {
		next(err);
	}
});

router.post("/", authenticateUser, async (req, res, next) => {
	try {
		const body = projectSchema.parse(req.body);
		const ref = await db.collection("projects").add({ ...body, createdAt: Date.now() });
		res.status(201).json({ id: ref.id });
	} catch (err) {
		if (err instanceof z.ZodError) return res.status(400).json({ error: { message: "Validation failed", details: err.errors } });
		next(err);
	}
});

export default router;
