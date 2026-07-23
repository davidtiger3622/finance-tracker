import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import Register from './Register'
import { useAuth } from '../context/AuthContext'

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

describe('Register', () => {
  it('renders username, email, and password fields', () => {
    useAuth.mockReturnValue({ register: vi.fn() })
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    )
    expect(screen.getByPlaceholderText('Choose a username')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Choose a password')).toBeInTheDocument()
  })

  it('calls register with entered form values on submit', async () => {
    const mockRegister = vi.fn().mockResolvedValue({})
    useAuth.mockReturnValue({ register: mockRegister })
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    )

    await user.type(screen.getByPlaceholderText('Choose a username'), 'newuser')
    await user.type(screen.getByPlaceholderText('Enter your email'), 'newuser@example.com')
    await user.type(screen.getByPlaceholderText('Choose a password'), 'securepass123')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith('newuser', 'newuser@example.com', 'securepass123')
    })
  })

  it('shows an error message when registration fails', async () => {
    const mockRegister = vi.fn().mockRejectedValue(new Error('Username taken'))
    useAuth.mockReturnValue({ register: mockRegister })
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    )

    await user.type(screen.getByPlaceholderText('Choose a username'), 'existinguser')
    await user.type(screen.getByPlaceholderText('Enter your email'), 'existing@example.com')
    await user.type(screen.getByPlaceholderText('Choose a password'), 'somepass')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(
      await screen.findByText('Registration failed. Username or email may already exist.')
    ).toBeInTheDocument()
  })
})
