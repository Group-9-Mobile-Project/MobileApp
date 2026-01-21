import React, { createContext, useContext } from 'react'

type AuthContextValue = {
    onLogin: (profile: any) => Promise<void> | void;
    onLogout: () => Promise<void> | void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
    onLogin,
    onLogout,
    children,
}: {
    onLogin: (profile: any) => Promise<void> | void;
    onLogout: () => Promise<void> | void;
    children: React.ReactNode;
}) {
    return (
        <AuthContext.Provider value={{ onLogin, onLogout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}