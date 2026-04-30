import { createContext } from 'react'

export interface AuthContextType {
  token: string | null
  isAuthenticated: boolean
  signIn: (token: string) => void
  signOut: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)
