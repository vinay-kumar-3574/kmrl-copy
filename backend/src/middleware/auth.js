import { getAuth } from "firebase-admin/auth";
import { getFirebaseApp } from "../firebase.js";

getFirebaseApp();

export async function authenticateUser(req, res, next) {
	try {
		const authHeader = req.headers.authorization || "";
		const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
		if (!token) return res.status(401).json({ error: { message: "Missing Bearer token" } });
		const decoded = await getAuth().verifyIdToken(token);
		req.user = decoded;
		next();
	} catch (err) {
		return res.status(401).json({ error: { message: "Invalid or expired token" } });
	}
}
