import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import Transactions from './Transactions'
import api from '../api/axios'

vi.mock('../api/axios')

describe('Transactions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows an empty state when there are no transactions', async () => {
    api.get.mockResolvedValue({ data: [] })
    render(<Transactions />)
    expect(await screen.findByText('No transactions yet.')).toBeInTheDocument()
  })

  it('renders a list of transactions', async () => {
    api.get.mockResolvedValue({
      data: [
        { id: 1, title: 'Groceries', category: 'food', type: 'expense', amount: 45, date: '2026-01-15' },
        { id: 2, title: 'Salary', category: 'salary', type: 'income', amount: 3000, date: '2026-01-01' },
      ],
    })
    render(<Transactions />)

    expect(await screen.findByText('Groceries')).toBeInTheDocument()
    expect(screen.getByText('Salary')).toBeInTheDocument()
  })

  it('toggles the add transaction form', async () => {
    api.get.mockResolvedValue({ data: [] })
    const user = userEvent.setup()
    render(<Transactions />)

    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument())

    await user.click(screen.getByText('+ Add Transaction'))
    expect(screen.getByText('New Transaction')).toBeInTheDocument()

    await user.click(screen.getByText('Cancel'))
    expect(screen.queryByText('New Transaction')).not.toBeInTheDocument()
  })

  it('submits a new transaction and refetches the list', async () => {
    api.get
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({
        data: [{ id: 1, title: 'Coffee', category: 'food', type: 'expense', amount: 5, date: '2026-01-20' }],
      })
    api.post.mockResolvedValue({ data: {} })

    const user = userEvent.setup()
    render(<Transactions />)
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument())

    await user.click(screen.getByText('+ Add Transaction'))
    await user.type(screen.getByPlaceholderText('e.g. Grocery shopping'), 'Coffee')
    await user.type(screen.getByPlaceholderText('0.00'), '5')
    await user.click(screen.getByText('Save Transaction'))

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/transactions/', {
        title: 'Coffee',
        amount: 5,
        type: 'expense',
        category: 'food',
      })
    })
    expect(await screen.findByText('Coffee')).toBeInTheDocument()
  })

  it('deletes a transaction and refetches the list', async () => {
    api.get
      .mockResolvedValueOnce({
        data: [{ id: 1, title: 'Coffee', category: 'food', type: 'expense', amount: 5, date: '2026-01-20' }],
      })
      .mockResolvedValueOnce({ data: [] })
    api.delete.mockResolvedValue({ data: { message: 'Transaction deleted' } })

    const user = userEvent.setup()
    render(<Transactions />)

    expect(await screen.findByText('Coffee')).toBeInTheDocument()
    await user.click(screen.getByText('Delete'))

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith('/transactions/1')
    })
    await waitFor(() => {
      expect(screen.queryByText('Coffee')).not.toBeInTheDocument()
    })
  })
})
