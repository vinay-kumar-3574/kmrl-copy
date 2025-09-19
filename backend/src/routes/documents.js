import express from "express";
import multer from "multer";
import { z } from "zod";
import { db, storage, getFirebaseApp } from "../firebase.js";
import { getStorage as getAdminStorage } from "firebase-admin/storage";
import { authenticateUser } from "../middleware/auth.js";

getFirebaseApp();

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const metadataSchema = z.object({
	title: z.string().min(1),
	sector: z.string().min(1),
	projectId: z.string().optional(),
	tags: z.array(z.string()).optional(),
	documentType: z.string().optional(),
	language: z.string().optional(),
	urgency: z.string().optional(),
	targetDepartment: z.string().optional(),
	description: z.string().optional(),
});

router.get("/", authenticateUser, async (req, res, next) => {
	try {
		const uid = req.user.uid;
		const snapshot = await db
			.collection("documents")
			.where("ownerUid", "==", uid)
			.limit(100)
			.get();
		const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
		res.json({ documents: docs });
	} catch (err) {
		next(err);
	}
});

// Diagnostics: verify router is mounted
router.get("/test", (_req, res) => {
	res.json({ ok: true, route: "/api/documents/test" });
});

// Preflight or accidental GET to /upload shouldn't 404 silently
router.options("/upload", (_req, res) => res.sendStatus(204));
router.get("/upload", (_req, res) => res.status(405).json({ error: { message: "Use POST /api/documents/upload" } }));

router.get("/bucket-check", authenticateUser, async (_req, res, next) => {
	try {
		const bucketName = process.env.FIREBASE_STORAGE_BUCKET || "kmrl-document.firebasestorage.app";
		const tips = [];
		if (!bucketName) return res.status(500).json({ error: { message: "FIREBASE_STORAGE_BUCKET not set" } });
		if (bucketName.startsWith("gs://")) tips.push("Remove gs:// prefix");
		if (bucketName.startsWith("http")) tips.push("Use bucket domain like project-id.appspot.com");
		const bucket = getAdminStorage().bucket(bucketName);
		const [exists] = await bucket.exists();
		res.json({ bucketName, exists, projectId: process.env.FIREBASE_PROJECT_ID, tips });
	} catch (err) {
		next(err);
	}
});

router.get("/list-buckets", authenticateUser, async (_req, res, next) => {
	try {
		const storage = getAdminStorage();
		const [buckets] = await storage.getBuckets();
		const bucketNames = buckets.map(b => b.name);
		res.json({ buckets: bucketNames, projectId: process.env.FIREBASE_PROJECT_ID });
	} catch (err) {
		next(err);
	}
});

router.post("/upload", authenticateUser, upload.single("file"), async (req, res, next) => {
	try {
		const { title, sector, projectId, tags, documentType, language, urgency, targetDepartment, description } = metadataSchema.parse({
			title: req.body.title,
			sector: req.body.sector,
			projectId: req.body.projectId,
			tags: req.body.tags ? JSON.parse(req.body.tags) : undefined,
			documentType: req.body.documentType,
			language: req.body.language,
			urgency: req.body.urgency,
			targetDepartment: req.body.targetDepartment,
			description: req.body.description,
		});
		const file = req.file;
		if (!file) return res.status(400).json({ error: { message: "File is required" } });
		
		const uid = req.user.uid;
		const bucketName = process.env.FIREBASE_STORAGE_BUCKET || "kmrl-document.firebasestorage.app";
		if (!bucketName) return res.status(500).json({ error: { message: "FIREBASE_STORAGE_BUCKET not set" } });
		const bucket = getAdminStorage().bucket(bucketName);
		const objectPath = `documents/${uid}/${Date.now()}_${file.originalname}`;
		const fileRef = bucket.file(objectPath);
		await fileRef.save(file.buffer, { contentType: file.mimetype, resumable: false, public: false });
		const [signedUrl] = await fileRef.getSignedUrl({ action: "read", expires: Date.now() + 7 * 24 * 60 * 60 * 1000 });

		const ref = await db.collection("documents").add({
			title,
			sector,
			projectId: projectId || null,
			tags: tags || [],
			documentType: documentType || null,
			language: language || null,
			urgency: urgency || null,
			targetDepartment: targetDepartment || null,
			description: description || null,
			ownerUid: uid,
			storagePath: objectPath,
			mimeType: file.mimetype,
			fileName: file.originalname,
			fileSize: file.size,
			url: signedUrl,
			createdAt: Date.now(),
		});

		res.status(201).json({ id: ref.id });
	} catch (err) {
		if (err instanceof z.ZodError) {
			return res.status(400).json({ error: { message: "Validation failed", details: err.errors } });
		}
		console.error("Upload failed:", { message: err?.message, code: err?.code, bucket: process.env.FIREBASE_STORAGE_BUCKET, projectId: process.env.FIREBASE_PROJECT_ID });
		return res.status(500).json({ error: { message: err?.message || "Upload failed", code: err?.code, bucket: process.env.FIREBASE_STORAGE_BUCKET } });
	}
});

// Share document with department and create assigned projects
router.post("/:id/share", authenticateUser, async (req, res, next) => {
	try {
		const { id } = req.params;
		const { department, employeeIds, message } = req.body;
		
		if (!department || !employeeIds || !Array.isArray(employeeIds) || employeeIds.length === 0) {
			return res.status(400).json({ error: { message: "Department and employee IDs are required" } });
		}

		// Get document details
		const docRef = db.collection("documents").doc(id);
		const docSnap = await docRef.get();
		if (!docSnap.exists) return res.status(404).json({ error: { message: "Document not found" } });
		const docData = docSnap.data();
		
		// Verify ownership
		if (docData.ownerUid !== req.user.uid) {
			return res.status(403).json({ error: { message: "Forbidden" } });
		}

		// Get employee details
		const employeePromises = employeeIds.map(empId => 
			db.collection("employees").doc(empId).get()
		);
		const employeeSnaps = await Promise.all(employeePromises);
		const employees = employeeSnaps
			.filter(snap => snap.exists)
			.map(snap => ({ id: snap.id, ...snap.data() }));

		if (employees.length === 0) {
			return res.status(400).json({ error: { message: "No valid employees found" } });
		}

		// Create assigned projects for each employee
		const batch = db.batch();
		const projectIds = [];

		for (const employee of employees) {
			const projectRef = db.collection("projects").doc();
			const projectData = {
				title: `Review Document: ${docData.title}`,
				description: message || `Please review the document "${docData.title}" shared by ${req.user.email || 'Unknown'}. ${docData.description || ''}`,
				assignedBy: req.user.email || 'Unknown',
				assignedDate: new Date().toISOString().split('T')[0],
				deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
				urgency: docData.urgency || "medium",
				status: "planning",
				progress: 0,
				category: "Document Review",
				documents: 1,
				collaborators: [req.user.email || 'Unknown'],
				tags: ["Document Review", department, ...(docData.tags || [])],
				estimatedHours: 4,
				spentHours: 0,
				assignedTo: employee.id,
				sector: department,
				relatedDocumentId: id,
				createdAt: Date.now()
			};
			
			batch.set(projectRef, projectData);
			projectIds.push(projectRef.id);
		}

		// Update document with sharing information
		const shareData = {
			sharedWith: employeeIds,
			sharedDepartment: department,
			sharedAt: Date.now(),
			sharedBy: req.user.uid
		};
		batch.update(docRef, shareData);

		await batch.commit();

		res.json({ 
			success: true, 
			projectIds,
			sharedWith: employees.map(emp => ({ id: emp.id, name: emp.name, department: emp.department }))
		});
	} catch (err) {
		next(err);
	}
});

router.delete("/:id", authenticateUser, async (req, res, next) => {
	try {
		const id = req.params.id;
		const docRef = db.collection("documents").doc(id);
		const snap = await docRef.get();
		if (!snap.exists) return res.status(404).json({ error: { message: "Document not found" } });
		const data = snap.data();
		if (data.ownerUid !== req.user.uid) return res.status(403).json({ error: { message: "Forbidden" } });
		if (data.storagePath) {
			const bucket = getAdminStorage().bucket();
			await bucket.file(data.storagePath).delete({ ignoreNotFound: true });
		}
		await docRef.delete();
		res.json({ ok: true });
	} catch (err) {
		next(err);
	}
});

export default router;
