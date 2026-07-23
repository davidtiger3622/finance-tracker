import { createContext, useContext, useState, useEffect } from "react"
import api from "../api/axios"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("token"))

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token)
    } else {
      localStorage.removeItem("token")
    }
  }, [token])

  const login = async (username, password) => {
    const formData = new URLSearchParams()
    formData.append("username", username)
    formData.append("password", password)
    const response = await api.post("/auth/login", formData)
    setToken(response.data.access_token)
    localStorage.setItem("refresh_token", response.data.refresh_token)
    setUser(username)
    return response.data
  }

  const register = async (username, email, password) => {
    const response = await api.post("/auth/register", { username, email, password })
    return response.data
  }

  const logout = async () => {
    const refreshToken = localStorage.getItem("refresh_token")
    if (refreshToken) {
      try {
        await api.post("/auth/logout", { refresh_token: refreshToken })
      } catch (err) {
        console.error("Logout request failed:", err)
      }
    }
    localStorage.removeItem("refresh_token")
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
