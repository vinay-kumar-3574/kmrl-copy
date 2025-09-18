import dotenv from "dotenv";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

dotenv.config();

let app;

function getServiceAccount() {
	const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
	if (json) {
		try {
			return JSON.parse(json);
		} catch (error) {
			console.error("Invalid FIREBASE_SERVICE_ACCOUNT_JSON", error);
		}
	}
	const projectId = process.env.FIREBASE_PROJECT_ID;
	const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
	const privateKey = process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");
	if (projectId && clientEmail && privateKey) {
		return { projectId, clientEmail, privateKey };
	}
	return undefined;
}

export function getFirebaseApp() {
	if (!getApps().length) {
		const serviceAccount = getServiceAccount();
		app = serviceAccount
			? initializeApp({ credential: cert(serviceAccount), storageBucket: process.env.FIREBASE_STORAGE_BUCKET })
			: initializeApp();
	}
	return app;
}

export const db = getFirestore(getFirebaseApp());
export const storage = getStorage(getFirebaseApp());
