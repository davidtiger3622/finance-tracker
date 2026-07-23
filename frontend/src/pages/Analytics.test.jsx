import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import Analytics from './Analytics'
import api from '../api/axios'

vi.mock('../api/axios')

const mockApiResponses = ({ summary, category, monthly, insights }) => {
  api.get.mockImplementation((url) => {
    if (url === '/analytics/summary') return Promise.resolve({ data: summary })
    if (url === '/analytics/category-breakdown') return Promise.resolve({ data: category })
    if (url === '/analytics/monthly-trends') return Promise.resolve({ data: monthly })
    if (url === '/analytics/spending-insights') return Promise.resolve({ data: insights })
    return Promise.reject(new Error('Unknown endpoint'))
  })
}

describe('Analytics', () => {
  it('shows a loading state initially', () => {
    api.get.mockReturnValue(new Promise(() => {}))
    render(<Analytics />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders summary and insights data after loading', async () => {
    mockApiResponses({
      summary: { total_income: 2000, total_expenses: 800, balance: 1200, savings_rate: 60 },
      category: [{ category: 'Food', total: 300 }],
      monthly: [{ month: '2026-01', income: 2000, expenses: 800 }],
      insights: { this_month_expenses: 950, last_month_expenses: 600, month_over_month_change: 33.3, trend: 'up' },
    })

    render(<Analytics />)

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })

    expect(screen.getByText('$2000')).toBeInTheDocument()
    expect(screen.getByText('$800')).toBeInTheDocument()
    expect(screen.getByText('$1200')).toBeInTheDocument()
    expect(screen.getByText('60%')).toBeInTheDocument()
    expect(screen.getByText('$950')).toBeInTheDocument()
    expect(screen.getByText('$600')).toBeInTheDocument()
    expect(screen.getByText(/33\.3% ↑/)).toBeInTheDocument()
  })

  it('shows empty states for charts when there is no data', async () => {
    mockApiResponses({
      summary: { total_income: 0, total_expenses: 0, balance: 0, savings_rate: 0 },
      category: [],
      monthly: [],
      insights: { this_month_expenses: 0, last_month_expenses: 0, month_over_month_change: 0, trend: 'stable' },
    })

    render(<Analytics />)

    expect(await screen.findByText('No data yet.')).toBeInTheDocument()
    expect(screen.getByText('No expense data yet.')).toBeInTheDocument()
  })
})
