import express from "express";
import { db } from "../firebase.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticateUser, async (req, res, next) => {
	try {
		const snap = await db
			.collection("documents")
			.where("ownerUid", "==", req.user.uid)
			.orderBy("createdAt", "desc")
			.limit(10)
			.get();
		const alerts = snap.docs.map(d => ({
			id: d.id,
			type: "upload",
			title: d.data().title || d.data().fileName,
			time: d.data().createdAt,
		}));
		res.json({ alerts });
	} catch (err) {
		next(err);
	}
});

export default router;
