import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import Dashboard from './Dashboard'
import api from '../api/axios'

vi.mock('../api/axios')

describe('Dashboard', () => {
  it('shows a loading state initially', () => {
    api.get.mockReturnValue(new Promise(() => {})) // never resolves
    render(<Dashboard />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders summary data and recent transactions after loading', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/analytics/summary') {
        return Promise.resolve({
          data: { total_income: 2000, total_expenses: 800, balance: 1200, savings_rate: 60 },
        })
      }
      if (url === '/transactions/') {
        return Promise.resolve({
          data: [
            { id: 1, title: 'Salary', category: 'Work', type: 'income', amount: 2000 },
            { id: 2, title: 'Rent', category: 'Housing', type: 'expense', amount: 500 },
          ],
        })
      }
      return Promise.reject(new Error('Unknown endpoint'))
    })

    render(<Dashboard />)

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })

    expect(screen.getByText('$2000')).toBeInTheDocument()
    expect(screen.getByText('$800')).toBeInTheDocument()
    expect(screen.getByText('$1200')).toBeInTheDocument()
    expect(screen.getByText('60%')).toBeInTheDocument()
    expect(screen.getByText('Salary')).toBeInTheDocument()
    expect(screen.getByText('Rent')).toBeInTheDocument()
  })

  it('shows an empty state when there are no transactions', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/analytics/summary') {
        return Promise.resolve({
          data: { total_income: 0, total_expenses: 0, balance: 0, savings_rate: 0 },
        })
      }
      if (url === '/transactions/') {
        return Promise.resolve({ data: [] })
      }
      return Promise.reject(new Error('Unknown endpoint'))
    })

    render(<Dashboard />)

    expect(await screen.findByText('No transactions yet. Add your first one!')).toBeInTheDocument()
  })
})
