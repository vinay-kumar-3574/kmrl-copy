import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

type AuthContextType = { user: User | null; ready: boolean };

const AuthContext = createContext<AuthContextType>({ user: null, ready: false });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [ready, setReady] = useState(false);

	useEffect(() => {
		const unsub = onAuthStateChanged(auth, (u) => {
			setUser(u);
			setReady(true);
		});
		return () => unsub();
	}, []);

	return <AuthContext.Provider value={{ user, ready }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
