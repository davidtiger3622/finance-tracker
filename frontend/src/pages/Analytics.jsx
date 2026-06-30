import { useEffect, useState } from "react"
import api from "../api/axios"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

const COLORS = ["#10b981", "#ef4444", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899"]

const Analytics = () => {
  const [summary, setSummary] = useState(null)
  const [categoryData, setCategoryData] = useState([])
  const [monthlyData, setMonthlyData] = useState([])
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, categoryRes, monthlyRes, insightsRes] = await Promise.all([
          api.get("/analytics/summary"),
          api.get("/analytics/category-breakdown"),
          api.get("/analytics/monthly-trends"),
          api.get("/analytics/spending-insights")
        ])
        setSummary(summaryRes.data)
        setCategoryData(categoryRes.data)
        setMonthlyData(monthlyRes.data)
        setInsights(insightsRes.data)
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
      <h1 className="text-xl md:text-2xl font-bold mb-6">Analytics</h1>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-900 rounded-xl p-4 md:p-5 min-w-0">
          <h2 className="text-base md:text-lg font-semibold mb-4">Monthly Trends</h2>
          {monthlyData.length === 0 ? (
            <p className="text-gray-400 text-sm">No data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData} margin={{ left: -20, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none", color: "#fff" }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="income" fill="#10b981" name="Income" />
                <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-gray-900 rounded-xl p-4 md:p-5 min-w-0">
          <h2 className="text-base md:text-lg font-semibold mb-4">Spending by Category</h2>
          {categoryData.length === 0 ? (
            <p className="text-gray-400 text-sm">No expense data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="total"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {categoryData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none", color: "#fff" }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl p-4 md:p-5">
        <h2 className="text-base md:text-lg font-semibold mb-4">Spending Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-gray-400 text-xs md:text-sm">This Month</p>
            <p className="text-red-400 text-lg md:text-xl font-bold mt-1">${insights?.this_month_expenses}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs md:text-sm">Last Month</p>
            <p className="text-gray-300 text-lg md:text-xl font-bold mt-1">${insights?.last_month_expenses}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs md:text-sm">Month over Month</p>
            <p className={`text-lg md:text-xl font-bold mt-1 ${insights?.trend === "up" ? "text-red-400" : insights?.trend === "down" ? "text-green-400" : "text-gray-300"}`}>
              {insights?.month_over_month_change}% {insights?.trend === "up" ? "↑" : insights?.trend === "down" ? "↓" : "→"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
