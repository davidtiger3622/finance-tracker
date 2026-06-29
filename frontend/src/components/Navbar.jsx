import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Navbar = () => {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-lg">
      <div className="flex items-center gap-2">
        <span className="text-green-400 text-xl font-bold">💰 FinanceTracker</span>
      </div>
      <div className="flex gap-6 text-sm font-medium">
        <Link to="/" className="hover:text-green-400 transition">Dashboard</Link>
        <Link to="/transactions" className="hover:text-green-400 transition">Transactions</Link>
        <Link to="/analytics" className="hover:text-green-400 transition">Analytics</Link>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <span className="text-gray-400">👤 {user}</span>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white transition"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar
