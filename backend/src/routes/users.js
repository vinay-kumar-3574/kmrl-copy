import express from "express";
import { z } from "zod";
import { db } from "../firebase.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

const updateProfileSchema = z.object({
	name: z.string().min(1).optional(),
	title: z.string().optional(),
	department: z.string().optional(),
	sector: z.string().optional(),
	phone: z.string().optional(),
	avatar: z.string().url().optional(),
	bio: z.string().optional(),
	skills: z.array(z.string()).optional(),
});

const activitySchema = z.object({
    type: z.string().default("document"),
    title: z.string().min(1),
    status: z.string().optional(),
    createdAt: z.number().optional(),
});

const projectSchema = z.object({
    name: z.string().min(1),
    progress: z.number().min(0).max(100).default(0),
    status: z.string().optional(),
    deadline: z.string().optional(),
});

const achievementSchema = z.object({
    title: z.string().min(1),
    date: z.union([z.string(), z.number()]).optional(),
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

router.get("/me/activity", authenticateUser, async (req, res, next) => {
    try {
        const uid = req.user.uid;
        let q = db.collection("activities").where("uid", "==", uid).orderBy("createdAt", "desc").limit(50);
        const snap = await q.get();
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        res.json({ activity: items });
    } catch (err) {
        next(err);
    }
});

router.get("/me/projects", authenticateUser, async (req, res, next) => {
    try {
        const uid = req.user.uid;
        let q = db.collection("projects").where("memberUids", "array-contains", uid).limit(50);
        const snap = await q.get();
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        res.json({ projects: items });
    } catch (err) {
        next(err);
    }
});

router.get("/me/achievements", authenticateUser, async (req, res, next) => {
    try {
        const uid = req.user.uid;
        let q = db.collection("achievements").where("uid", "==", uid).orderBy("date", "desc").limit(50);
        const snap = await q.get();
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        res.json({ achievements: items });
    } catch (err) {
        next(err);
    }
});

router.post("/me/activity", authenticateUser, async (req, res, next) => {
    try {
        const uid = req.user.uid;
        const body = activitySchema.parse(req.body || {});
        const doc = {
            uid,
            type: body.type,
            title: body.title,
            status: body.status || "completed",
            createdAt: body.createdAt || Date.now(),
        };
        const ref = await db.collection("activities").add(doc);
        res.status(201).json({ id: ref.id });
    } catch (err) {
        if (err instanceof z.ZodError) return res.status(400).json({ error: { message: "Validation failed", details: err.errors } });
        next(err);
    }
});

router.post("/me/projects", authenticateUser, async (req, res, next) => {
    try {
        const uid = req.user.uid;
        const body = projectSchema.parse(req.body || {});
        const doc = {
            name: body.name,
            progress: body.progress,
            status: body.status || "On Track",
            deadline: body.deadline || null,
            memberUids: [uid],
            createdAt: Date.now(),
        };
        const ref = await db.collection("projects").add(doc);
        res.status(201).json({ id: ref.id });
    } catch (err) {
        if (err instanceof z.ZodError) return res.status(400).json({ error: { message: "Validation failed", details: err.errors } });
        next(err);
    }
});

router.post("/me/achievements", authenticateUser, async (req, res, next) => {
    try {
        const uid = req.user.uid;
        const body = achievementSchema.parse(req.body || {});
        const doc = {
            uid,
            title: body.title,
            date: body.date || Date.now(),
        };
        const ref = await db.collection("achievements").add(doc);
        res.status(201).json({ id: ref.id });
    } catch (err) {
        if (err instanceof z.ZodError) return res.status(400).json({ error: { message: "Validation failed", details: err.errors } });
        next(err);
    }
});

export default router;
