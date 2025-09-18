'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface UserContextType {
  username: string | null
  isLoggedIn: boolean
  login: (username: string) => void
  logout: () => void
}

// This context can either store an object of type UserContextType or undefined
// The value inside () is the default value of the context if no provider is found
const UserContext = createContext<UserContextType | undefined>(undefined)


export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context 
}

interface UserProviderProps {
  children: ReactNode
}


// UserProvider is a react component that provides the user context to its children
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(null)

  // Load username from localStorage on mount
  useEffect(() => {
    const savedUsername = localStorage.getItem('workflow_username')
    if (savedUsername) {
      setUsername(savedUsername)
    }
  }, [])

  const login = (newUsername: string) => {
    setUsername(newUsername)
    localStorage.setItem('workflow_username', newUsername)
  }

  const logout = () => {
    setUsername(null)
    localStorage.removeItem('workflow_username')
  }

  const value: UserContextType = {
    username,
    isLoggedIn: !!username,
    login,
    logout
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}
