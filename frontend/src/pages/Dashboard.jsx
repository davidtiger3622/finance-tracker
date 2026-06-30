import { useEffect, useState } from "react"
import api from "../api/axios"

const Dashboard = () => {
  const [summary, setSummary] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, transactionsRes] = await Promise.all([
          api.get("/analytics/summary"),
          api.get("/transactions/")
        ])
        setSummary(summaryRes.data)
        setTransactions(transactionsRes.data.slice(0, 5))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
        <div className="bg-gray-900 rounded-xl p-4 md:p-5">
          <p className="text-gray-400 text-xs md:text-sm">Total Income</p>
          <p className="text-green-400 text-lg md:text-2xl font-bold mt-1">${summary?.total_income}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 md:p-5">
          <p className="text-gray-400 text-xs md:text-sm">Total Expenses</p>
          <p className="text-red-400 text-lg md:text-2xl font-bold mt-1">${summary?.total_expenses}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 md:p-5">
          <p className="text-gray-400 text-xs md:text-sm">Balance</p>
          <p className="text-white text-lg md:text-2xl font-bold mt-1">${summary?.balance}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 md:p-5">
          <p className="text-gray-400 text-xs md:text-sm">Savings Rate</p>
          <p className="text-blue-400 text-lg md:text-2xl font-bold mt-1">{summary?.savings_rate}%</p>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl p-4 md:p-5">
        <h2 className="text-base md:text-lg font-semibold mb-4">Recent Transactions</h2>
        {transactions.length === 0 ? (
          <p className="text-gray-400 text-sm">No transactions yet. Add your first one!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm min-w-[500px]">
              <thead>
                <tr className="text-gray-400 border-b border-gray-800">
                  <th className="text-left py-2">Title</th>
                  <th className="text-left py-2">Category</th>
                  <th className="text-left py-2">Type</th>
                  <th className="text-right py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} className="border-b border-gray-800">
                    <td className="py-2">{t.title}</td>
                    <td className="py-2 text-gray-400">{t.category}</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded text-xs ${t.type === "income" ? "bg-green-900 text-green-400" : "bg-red-900 text-red-400"}`}>
                        {t.type}
                      </span>
                    </td>
                    <td className={`py-2 text-right font-semibold ${t.type === "income" ? "text-green-400" : "text-red-400"}`}>
                      {t.type === "income" ? "+" : "-"}${t.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
