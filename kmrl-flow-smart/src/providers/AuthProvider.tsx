import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { apiFetch } from "@/lib/api";

type AuthContextType = { user: User | null; ready: boolean };

const AuthContext = createContext<AuthContextType>({ user: null, ready: false });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [ready, setReady] = useState(false);

	useEffect(() => {
		const unsub = onAuthStateChanged(auth, (u) => {
			setUser(u);
			setReady(true);
			// Ensure user exists in employees collection on login
			(async () => {
				try {
					if (!u) return;
					let sector: string | undefined = undefined;
					try { sector = localStorage.getItem('sector') || undefined; } catch {}
					// Persist sector to users profile if present
					if (sector) {
						try { await apiFetch('/api/users/me', { method: 'PUT', body: JSON.stringify({ sector }) }); } catch {}
					}
					// Upsert the employee using /api/employees/me to avoid duplicates and ensure department
					await apiFetch('/api/employees/me', {
						method: 'PUT',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							name: u.displayName || u.email || 'User',
							title: 'Employee',
							department: sector || 'General',
						}),
					});
				} catch {}
			})();
		});
		return () => unsub();
	}, []);

	return <AuthContext.Provider value={{ user, ready }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
