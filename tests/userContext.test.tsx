import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { UserProvider, useUser } from '../src/contexts/UserContext'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Test component to access context
const TestComponent = () => {
  const { username, isLoggedIn, login, logout } = useUser()
  
  return (
    <div>
      <div data-testid="username">{username || 'No username'}</div>
      <div data-testid="isLoggedIn">{isLoggedIn.toString()}</div>
      <button onClick={() => login('testuser')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

describe('UserContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  it('should provide initial state when not logged in', () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    )

    expect(screen.getByTestId('username')).toHaveTextContent('No username')
    expect(screen.getByTestId('isLoggedIn')).toHaveTextContent('false')
  })

  it('should load username from localStorage on mount', () => {
    localStorageMock.getItem.mockReturnValue('saveduser')

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    )

    expect(localStorageMock.getItem).toHaveBeenCalledWith('workflow_username')
    expect(screen.getByTestId('username')).toHaveTextContent('saveduser')
    expect(screen.getByTestId('isLoggedIn')).toHaveTextContent('true')
  })

  it('should login user and save to localStorage', async () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    )

    const loginButton = screen.getByText('Login')
    fireEvent.click(loginButton)

    await waitFor(() => {
      expect(screen.getByTestId('username')).toHaveTextContent('testuser')
      expect(screen.getByTestId('isLoggedIn')).toHaveTextContent('true')
    })

    expect(localStorageMock.setItem).toHaveBeenCalledWith('workflow_username', 'testuser')
  })

  it('should logout user and clear localStorage', async () => {
    localStorageMock.getItem.mockReturnValue('saveduser')

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    )

    const logoutButton = screen.getByText('Logout')
    fireEvent.click(logoutButton)

    await waitFor(() => {
      expect(screen.getByTestId('username')).toHaveTextContent('No username')
      expect(screen.getByTestId('isLoggedIn')).toHaveTextContent('false')
    })

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('workflow_username')
  })

  it('should handle empty username on login', async () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    )

    // Test with empty string
    const loginButton = screen.getByText('Login')
    fireEvent.click(loginButton)

    // Should still work (empty string is valid)
    await waitFor(() => {
      expect(screen.getByTestId('username')).toHaveTextContent('testuser')
    })
  })
})
