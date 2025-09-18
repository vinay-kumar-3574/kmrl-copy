import express from "express";
import { z } from "zod";
import { db } from "../firebase.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

const updateProfileSchema = z.object({
	name: z.string().min(1).optional(),
	title: z.string().optional(),
	department: z.string().optional(),
	phone: z.string().optional(),
	avatar: z.string().url().optional(),
	bio: z.string().optional(),
	skills: z.array(z.string()).optional(),
});

router.get("/me", authenticateUser, async (req, res, next) => {
	try {
		const uid = req.user.uid;
		const snap = await db.collection("users").doc(uid).get();
		res.json({ user: { uid, ...(snap.exists ? snap.data() : {}) } });
	} catch (err) {
		next(err);
	}
});

router.put("/me", authenticateUser, async (req, res, next) => {
	try {
		const body = updateProfileSchema.parse(req.body);
		const uid = req.user.uid;
		await db.collection("users").doc(uid).set({ ...body, updatedAt: Date.now() }, { merge: true });
		const snap = await db.collection("users").doc(uid).get();
		res.json({ user: { uid, ...(snap.data() || {}) } });
	} catch (err) {
		if (err instanceof z.ZodError) {
			return res.status(400).json({ error: { message: "Validation failed", details: err.errors } });
		}
		next(err);
	}
});

export default router;
