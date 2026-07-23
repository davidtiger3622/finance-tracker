import { renderHook, act, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { AuthProvider, useAuth } from './AuthContext'
import api from '../api/axios'

vi.mock('../api/axios')

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('starts with no token if localStorage is empty', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider })
    expect(result.current.token).toBeNull()
  })

  it('login sets token and persists it to localStorage', async () => {
    api.post.mockResolvedValue({
      data: { access_token: 'fake-token-123', refresh_token: 'fake-refresh-123', token_type: 'bearer' },
    })
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider })

    await act(async () => {
      await result.current.login('testuser', 'testpass')
    })

    expect(result.current.token).toBe('fake-token-123')
    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('fake-token-123')
    })
    expect(localStorage.getItem('refresh_token')).toBe('fake-refresh-123')
    expect(api.post).toHaveBeenCalledWith('/auth/login', expect.any(URLSearchParams))
  })

  it('register calls the register endpoint with correct data', async () => {
    api.post.mockResolvedValue({ data: { id: 1, username: 'newuser' } })
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider })

    await act(async () => {
      await result.current.register('newuser', 'newuser@example.com', 'pass123')
    })

    expect(api.post).toHaveBeenCalledWith('/auth/register', {
      username: 'newuser',
      email: 'newuser@example.com',
      password: 'pass123',
    })
  })

  it('logout clears the token', async () => {
    api.post.mockResolvedValue({
      data: { access_token: 'fake-token', refresh_token: 'fake-refresh-token', token_type: 'bearer' },
    })
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider })

    await act(async () => {
      await result.current.login('testuser', 'testpass')
    })
    expect(result.current.token).toBe('fake-token')

    await act(async () => {
      await result.current.logout()
    })

    expect(result.current.token).toBeNull()
    await waitFor(() => {
      expect(localStorage.getItem('token')).toBeNull()
    })
    expect(localStorage.getItem('refresh_token')).toBeNull()
  })
})
