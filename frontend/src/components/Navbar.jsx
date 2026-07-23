import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Navbar = () => {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }
  
  return (
    <nav className="bg-gray-900 text-white px-4 md:px-6 py-4 shadow-lg">
      <div className="flex justify-between items-center">
        <span className="text-green-400 text-xl font-bold">FinanceTracker</span>

        <div className="hidden md:flex gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-green-400 transition">Dashboard</Link>
          <Link to="/transactions" className="hover:text-green-400 transition">Transactions</Link>
          <Link to="/analytics" className="hover:text-green-400 transition">Analytics</Link>
        </div>

        <div className="hidden md:flex items-center gap-4 text-sm">
          <span className="text-gray-400">{user}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white transition"
          >
            Logout
          </button>
        </div>

        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-3 text-sm font-medium border-t border-gray-800 pt-4">
          <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-green-400 transition">Dashboard</Link>
          <Link to="/transactions" onClick={() => setMenuOpen(false)} className="hover:text-green-400 transition">Transactions</Link>
          <Link to="/analytics" onClick={() => setMenuOpen(false)} className="hover:text-green-400 transition">Analytics</Link>
          <div className="flex justify-between items-center pt-2 border-t border-gray-800">
            <span className="text-gray-400">{user}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white transition"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
