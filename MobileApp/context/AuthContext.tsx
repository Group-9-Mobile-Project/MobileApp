import { View, Text } from 'react-native'
import React, { createContext, useContext } from 'react'

type AuthContextValue = {
    onLogout: () => Promise<void> | void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
    onLogout,
    children,
}: {
    onLogout: () => Promise<void> | void;
    children: React.ReactNode;
}) {
    return (
        <AuthContext.Provider value={{ onLogout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}