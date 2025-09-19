import { auth } from "./firebase";

export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

async function getIdToken(): Promise<string | null> {
	const user = auth.currentUser;
	if (!user) return null;
	return await user.getIdToken();
}

async function parseJsonOrThrow(res: Response) {
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  const text = await res.text();
  const snippet = text.slice(0, 120).replace(/\n/g, " ");
  throw new Error(`Non-JSON response from ${res.url} (${res.status}). First bytes: ${snippet}`);
}

export async function apiFetch(path: string, options: RequestInit = {}) {
	const token = await getIdToken();
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		...(options.headers as any),
	};
	if (token) headers["Authorization"] = `Bearer ${token}`;
	const url = `${API_BASE}${path}`;
	const res = await fetch(url, { ...options, headers });
	if (!res.ok) {
		try {
			const err = await parseJsonOrThrow(res);
			throw new Error(err?.error?.message || `Request failed (${res.status})`);
		} catch (e: any) {
			throw new Error(e?.message || `Request failed (${res.status})`);
		}
	}
	return parseJsonOrThrow(res);
}

export async function apiUpload(path: string, form: FormData) {
	const token = await getIdToken();
	const url = `${API_BASE}${path}`;
	const res = await fetch(url, {
		method: "POST",
		headers: token ? { Authorization: `Bearer ${token}` } : undefined,
		body: form,
	});
	if (!res.ok) {
		try {
			const err = await parseJsonOrThrow(res);
			throw new Error(err?.error?.message || `Upload failed (${res.status})`);
		} catch (e: any) {
			throw new Error(e?.message || `Upload failed (${res.status})`);
		}
	}
	return parseJsonOrThrow(res);
}

// Project API functions
export interface Project {
	id: string;
	title: string;
	description?: string;
	assignedBy: string;
	assignedDate?: string;
	deadline: string;
	urgency: "low" | "medium" | "high";
	status: "planning" | "in-progress" | "review" | "completed" | "overdue";
	progress: number;
	category: string;
	documents: number;
	collaborators: string[];
	tags: string[];
	estimatedHours: number;
	spentHours: number;
	assignedTo?: string;
	createdAt?: number;
	updatedAt?: number;
}

export async function getAssignedProjects(): Promise<Project[]> {
	const response = await apiFetch("/api/projects/assigned");
	return response.projects || [];
}

export async function getAllProjects(): Promise<Project[]> {
	const response = await apiFetch("/api/projects");
	return response.projects || [];
}

export async function createProject(project: Omit<Project, "id" | "createdAt" | "updatedAt">): Promise<{ id: string }> {
	return await apiFetch("/api/projects", {
		method: "POST",
		body: JSON.stringify(project),
	});
}

export async function updateProject(id: string, updates: Partial<Pick<Project, "status" | "progress" | "spentHours" | "description">>): Promise<{ success: boolean }> {
	return await apiFetch(`/api/projects/${id}`, {
		method: "PATCH",
		body: JSON.stringify(updates),
	});
}

export async function createSampleProjects(): Promise<{ success: boolean; projectIds: string[] }> {
	return await apiFetch("/api/projects/sample", {
		method: "POST",
	});
}