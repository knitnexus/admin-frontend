// store/useAuthStore.ts
import { create } from "zustand";
import * as authService from "@/services/auth";

type User = { email: string; role: string };

type AuthState = {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    fetchUser: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    loading: false,
    error: null,

    // Helper for error handling


    login: async (email, password) => {
        if (get().loading) return false; // prevent multiple requests
        set({ loading: true, error: null });

        try {
            await authService.login(email, password); // backend sets HttpOnly cookie
            const user = await authService.getMe();
            set({ user, loading: false, error: null });
            return true
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Login failed";
            set({ error: message, loading: false });
            return false;
        }
    },

    logout: async () => {
        set({ loading: true });
        try {
            await authService.logout();
        } finally {
            set({ user: null, loading: false, error: null });
        }
    },

    fetchUser: async () => {
        try {
            const user = await authService.getMe();
            set({ user, error: null });
        } catch {
            set({ user: null });
        }
    },
}));
