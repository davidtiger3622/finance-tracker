import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import Login from './Login'
import { useAuth } from '../context/AuthContext'

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

describe('Login', () => {
  it('renders username and password fields', () => {
    useAuth.mockReturnValue({ login: vi.fn() })
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )
    expect(screen.getByPlaceholderText('Enter your username')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument()
  })

  it('calls login with entered credentials on submit', async () => {
    const mockLogin = vi.fn().mockResolvedValue({})
    useAuth.mockReturnValue({ login: mockLogin })
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )

    await user.type(screen.getByPlaceholderText('Enter your username'), 'testuser')
    await user.type(screen.getByPlaceholderText('Enter your password'), 'testpass')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('testuser', 'testpass')
    })
  })

  it('shows an error message when login fails', async () => {
    const mockLogin = vi.fn().mockRejectedValue(new Error('Invalid credentials'))
    useAuth.mockReturnValue({ login: mockLogin })
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )

    await user.type(screen.getByPlaceholderText('Enter your username'), 'baduser')
    await user.type(screen.getByPlaceholderText('Enter your password'), 'badpass')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText('Invalid username or password')).toBeInTheDocument()
  })
})
