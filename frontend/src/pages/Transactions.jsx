import { useEffect, useState } from "react"
import api from "../api/axios"

const CATEGORIES = ["food", "rent", "transport", "entertainment", "health", "salary", "freelance", "other"]

const Transactions = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: "", amount: "", type: "expense", category: "food" })
  const [submitting, setSubmitting] = useState(false)

  const fetchTransactions = async () => {
    try {
      const res = await api.get("/transactions/")
      setTransactions(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTransactions() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post("/transactions/", { ...form, amount: parseFloat(form.amount) })
      setForm({ title: "", amount: "", type: "expense", category: "food" })
      setShowForm(false)
      fetchTransactions()
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/transactions/${id}`)
      fetchTransactions()
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-sm font-semibold transition"
        >
          {showForm ? "Cancel" : "+ Add Transaction"}
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-900 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">New Transaction</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g. Grocery shopping"
                required
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm">Amount</label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-sm">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg font-semibold transition"
              >
                {submitting ? "Saving..." : "Save Transaction"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-gray-900 rounded-xl p-5">
        {transactions.length === 0 ? (
          <p className="text-gray-400">No transactions yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-gray-800">
                <th className="text-left py-2">Title</th>
                <th className="text-left py-2">Category</th>
                <th className="text-left py-2">Type</th>
                <th className="text-left py-2">Date</th>
                <th className="text-right py-2">Amount</th>
                <th className="text-right py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-b border-gray-800">
                  <td className="py-3">{t.title}</td>
                  <td className="py-3 text-gray-400">{t.category}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded text-xs ${t.type === "income" ? "bg-green-900 text-green-400" : "bg-red-900 text-red-400"}`}>
                      {t.type}
                    </span>
                  </td>
                  <td className="py-3 text-gray-400">{new Date(t.date).toLocaleDateString()}</td>
                  <td className={`py-3 text-right font-semibold ${t.type === "income" ? "text-green-400" : "text-red-400"}`}>
                    {t.type === "income" ? "+" : "-"}${t.amount}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="text-red-400 hover:text-red-300 text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Transactions
