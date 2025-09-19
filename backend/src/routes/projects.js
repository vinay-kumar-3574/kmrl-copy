import express from "express";
import { z } from "zod";
import { db } from "../firebase.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

const projectSchema = z.object({
	title: z.string().min(1),
	sector: z.string().min(1),
	status: z.enum(["planning", "in-progress", "review", "completed", "overdue"]).default("planning"),
	description: z.string().optional(),
	assignedBy: z.string().min(1),
	assignedDate: z.string().optional(),
	deadline: z.string().min(1),
	urgency: z.enum(["low", "medium", "high"]).default("medium"),
	progress: z.number().min(0).max(100).default(0),
	category: z.string().min(1),
	documents: z.number().default(0),
	collaborators: z.array(z.string()).default([]),
	tags: z.array(z.string()).default([]),
	estimatedHours: z.number().default(0),
	spentHours: z.number().default(0),
	assignedTo: z.string().optional(), // User ID of the person assigned to this project
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

// Get assigned projects for the current user
router.get("/assigned", authenticateUser, async (req, res, next) => {
	try {
		const userId = req.user.uid;
		const snap = await db.collection("projects")
			.where("assignedTo", "==", userId)
			.get();
		const projects = snap.docs.map(d => ({ id: d.id, ...d.data() }));
		
		// Sort by deadline in the application to avoid Firestore index requirement
		projects.sort((a, b) => {
			const dateA = new Date(a.deadline || 0);
			const dateB = new Date(b.deadline || 0);
			return dateA - dateB;
		});
		
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

// Update project progress and status
router.patch("/:id", authenticateUser, async (req, res, next) => {
	try {
		const { id } = req.params;
		const updateData = req.body;
		
		// Only allow updating specific fields
		const allowedFields = ["status", "progress", "spentHours", "description"];
		const filteredData = Object.keys(updateData)
			.filter(key => allowedFields.includes(key))
			.reduce((obj, key) => {
				obj[key] = updateData[key];
				return obj;
			}, {});
		
		if (Object.keys(filteredData).length === 0) {
			return res.status(400).json({ error: { message: "No valid fields to update" } });
		}
		
		await db.collection("projects").doc(id).update({
			...filteredData,
			updatedAt: Date.now()
		});
		
		res.json({ success: true });
	} catch (err) {
		next(err);
	}
});

// Create sample projects for testing (development only)
router.post("/sample", authenticateUser, async (req, res, next) => {
	try {
		const userId = req.user.uid;
		const sampleProjects = [
			{
				title: "Metro Line 3 Safety Assessment",
				description: "Comprehensive safety evaluation for the new metro line including station safety protocols and emergency procedures.",
				assignedBy: "Arjun Nair",
				assignedDate: "2024-01-15",
				deadline: "2024-11-30",
				urgency: "high",
				status: "in-progress",
				progress: 65,
				category: "Safety & Compliance",
				documents: 12,
				collaborators: ["Priya Menon", "Meera Pillai", "Rajesh Kumar"],
				tags: ["Safety", "Assessment", "Line-3"],
				estimatedHours: 120,
				spentHours: 78,
				assignedTo: userId,
				sector: "Engineering"
			},
			{
				title: "Q2 Budget Analysis Report",
				description: "Detailed financial analysis and budget allocation report for Q2 operations and maintenance costs.",
				assignedBy: "Priya Menon",
				assignedDate: "2024-02-01",
				deadline: "2024-10-15",
				urgency: "medium",
				status: "review",
				progress: 90,
				category: "Financial Analysis",
				documents: 8,
				collaborators: ["Suresh Babu", "Anitha Raj"],
				tags: ["Budget", "Q2", "Analysis"],
				estimatedHours: 80,
				spentHours: 72,
				assignedTo: userId,
				sector: "Finance"
			},
			{
				title: "Vendor Contract Negotiations",
				description: "Negotiate new contracts with maintenance vendors and update procurement policies for better cost efficiency.",
				assignedBy: "Rajesh Kumar",
				assignedDate: "2024-01-20",
				deadline: "2024-12-31",
				urgency: "low",
				status: "planning",
				progress: 25,
				category: "Procurement",
				documents: 15,
				collaborators: ["Anitha Raj", "Suresh Babu", "Meera Pillai"],
				tags: ["Procurement", "Contracts", "Vendors"],
				estimatedHours: 200,
				spentHours: 50,
				assignedTo: userId,
				sector: "Procurement"
			}
		];

		const batch = db.batch();
		const projectRefs = sampleProjects.map(project => {
			const ref = db.collection("projects").doc();
			batch.set(ref, { ...project, createdAt: Date.now() });
			return ref.id;
		});

		await batch.commit();
		res.json({ success: true, projectIds: projectRefs });
	} catch (err) {
		next(err);
	}
});

export default router;
