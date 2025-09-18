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
    uid: z.string().optional(),
    email: z.string().email().optional(),
});

const employeeUpdateSchema = z.object({
    name: z.string().optional(),
    department: z.string().optional(),
    title: z.string().optional(),
});

router.get("/", authenticateUser, async (req, res, next) => {
	try {
        const { uid, department } = req.query;
        let snap;
        if (uid && typeof uid === "string") {
            const doc = await db.collection("employees").doc(uid).get();
            const employees = doc.exists ? [{ id: doc.id, ...doc.data() }] : [];
            return res.json({ employees });
        }
        if (department && typeof department === "string") {
            const deptLower = department.toLowerCase();
            // Prefer normalized field if present
            snap = await db.collection("employees").where("departmentNormalized", "==", deptLower).limit(500).get();
            let employees = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            if (employees.length === 0) {
                // Fallback: fetch and filter client-side for legacy docs
                const all = await db.collection("employees").limit(1000).get();
                employees = all.docs
                    .map(d => ({ id: d.id, ...d.data() }))
                    .filter(e => String(e.department || "").toLowerCase() === deptLower);
            }
            return res.json({ employees });
        }
        snap = await db.collection("employees").limit(500).get();
        const employees = snap.docs.map(d => ({ id: d.id, ...d.data() }));
		res.json({ employees });
	} catch (err) {
		next(err);
	}
});

router.post("/", authenticateUser, async (req, res, next) => {
	try {
        const body = employeeSchema.parse(req.body);
        const deptCap = (body.department || "General").charAt(0).toUpperCase() + (body.department || "General").slice(1);
        const docData = {
            ...body,
            department: deptCap,
            departmentNormalized: deptCap.toLowerCase(),
            createdAt: Date.now(),
        };
        if (body.uid) {
            await db.collection("employees").doc(body.uid).set(docData, { merge: true });
            return res.status(201).json({ id: body.uid });
        }
        const ref = await db.collection("employees").add(docData);
        return res.status(201).json({ id: ref.id });
	} catch (err) {
		if (err instanceof z.ZodError) return res.status(400).json({ error: { message: "Validation failed", details: err.errors } });
		next(err);
	}
});

// Get current user's employee record
router.get("/me", authenticateUser, async (req, res, next) => {
    try {
        const uid = req.user.uid;
        const doc = await db.collection("employees").doc(uid).get();
        const employee = doc.exists ? { id: doc.id, ...doc.data() } : null;
        res.json({ employee });
    } catch (err) { next(err); }
});

// Upsert current user's employee record (prevents duplicates and fixes department)
router.put("/me", authenticateUser, async (req, res, next) => {
    try {
        const uid = req.user.uid;
        const updates = employeeUpdateSchema.parse(req.body || {});
        const deptCap = updates.department ? updates.department.charAt(0).toUpperCase() + updates.department.slice(1) : undefined;
        const payload = {
            ...(updates.name ? { name: updates.name } : {}),
            ...(updates.title ? { title: updates.title } : {}),
            ...(deptCap ? { department: deptCap, departmentNormalized: deptCap.toLowerCase() } : {}),
            uid,
            updatedAt: Date.now(),
        };
        await db.collection("employees").doc(uid).set(payload, { merge: true });
        const snap = await db.collection("employees").doc(uid).get();
        res.json({ employee: { id: uid, ...(snap.data() || {}) } });
    } catch (err) {
        if (err instanceof z.ZodError) return res.status(400).json({ error: { message: "Validation failed", details: err.errors } });
        next(err);
    }
});

export default router;
