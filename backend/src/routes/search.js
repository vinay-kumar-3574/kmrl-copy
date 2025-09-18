import express from "express";
import { z } from "zod";
import { db } from "../firebase.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

const querySchema = z.object({
	q: z.string().optional(),
	sector: z.string().optional(),
	tag: z.string().optional(),
	limit: z.coerce.number().min(1).max(200).optional(),
});

router.get("/", authenticateUser, async (req, res, next) => {
	try {
		const { q, sector, tag, limit } = querySchema.parse(req.query);
		let ref = db.collection("documents").where("ownerUid", "==", req.user.uid);
		if (sector) ref = ref.where("sector", "==", sector);
		if (tag) ref = ref.where("tags", "array-contains", tag);
		const snap = await ref.orderBy("createdAt", "desc").limit(limit || 100).get();
		let docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
		if (q && q.trim()) {
			const lower = q.toLowerCase();
			docs = docs.filter(d => (d.title || d.fileName || "").toLowerCase().includes(lower));
		}
		res.json({ results: docs });
	} catch (err) {
		if (err instanceof z.ZodError) return res.status(400).json({ error: { message: "Invalid parameters", details: err.errors } });
		next(err);
	}
});

export default router;
