import React, { createContext, useContext } from "react";
import { User } from "firebase/auth";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signOutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  user,
  loading,
  signOutUser,
  children,
}: {
  user: User | null;
  loading: boolean;
  signOutUser: () => Promise<void>;
  children: React.ReactNode;
}) {
  return (
    <AuthContext.Provider value={{ user, loading, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}