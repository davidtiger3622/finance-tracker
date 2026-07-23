import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import Navbar from './Navbar'
import { useAuth } from '../context/AuthContext'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

describe('Navbar', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  it('renders navigation links and the current user', () => {
    useAuth.mockReturnValue({ user: 'testuser', logout: vi.fn() })
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )
    expect(screen.getByText('FinanceTracker')).toBeInTheDocument()
    expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Transactions').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Analytics').length).toBeGreaterThan(0)
    expect(screen.getAllByText('testuser').length).toBeGreaterThan(0)
  })

  it('calls logout and navigates to /login when Logout is clicked', async () => {
    const mockLogout = vi.fn()
    useAuth.mockReturnValue({ user: 'testuser', logout: mockLogout })
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )

    const logoutButtons = screen.getAllByText('Logout')
    await user.click(logoutButtons[0])

    expect(mockLogout).toHaveBeenCalled()
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  it('toggles the mobile menu when the Menu button is clicked', async () => {
    useAuth.mockReturnValue({ user: 'testuser', logout: vi.fn() })
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )

    const menuButton = screen.getByText('Menu')
    await user.click(menuButton)
    expect(screen.getByText('Close')).toBeInTheDocument()
  })
})
