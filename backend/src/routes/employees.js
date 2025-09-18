import express from "express";
import { z } from "zod";
import { db } from "../firebase.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

const employeeSchema = z.object({
	name: z.string().min(1),
	employeeId: z.string().min(1),
	department: z.string().min(1),
	title: z.string().optional(),
});

router.get("/", authenticateUser, async (_req, res, next) => {
	try {
		const snap = await db.collection("employees").limit(200).get();
		const employees = snap.docs.map(d => ({ id: d.id, ...d.data() }));
		res.json({ employees });
	} catch (err) {
		next(err);
	}
});

router.post("/", authenticateUser, async (req, res, next) => {
	try {
		const body = employeeSchema.parse(req.body);
		const ref = await db.collection("employees").add({ ...body, createdAt: Date.now() });
		res.status(201).json({ id: ref.id });
	} catch (err) {
		if (err instanceof z.ZodError) return res.status(400).json({ error: { message: "Validation failed", details: err.errors } });
		next(err);
	}
});

export default router;
