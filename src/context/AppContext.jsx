import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const AppContext = createContext(null)
const API_BASE = 'https://assingment-todo-backend.onrender.com'

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data?.error || 'Request failed')
  }

  return data
}

export function AppProvider({ children }) {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)
  const [authUser, setAuthUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const flash = useCallback((type, text) => {
    if (type === 'error') {
      setError(text)
      setMessage('')
      return
    }

    setMessage(text)
    setError('')
  }, [])

  const clearFlash = useCallback(() => {
    setMessage('')
    setError('')
  }, [])

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true)
      const data = await apiRequest('/getusertodos', { method: 'GET' })
      setTodos(Array.isArray(data.todos) ? data.todos : [])
      setIsAuthenticated(true)
      return data.todos || []
    } catch (err) {
      setTodos([])
      setIsAuthenticated(false)
      if (err.message !== 'No token provided') {
        flash('error', err.message)
      }
      return []
    } finally {
      setLoading(false)
    }
  }, [flash])

  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  const signup = useCallback(async ({ name, email, password }) => {
    setAuthLoading(true)
    clearFlash()
    try {
      await apiRequest('/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      })
      flash('success', 'Account created. You can log in now.')
    } catch (err) {
      flash('error', err.message)
    } finally {
      setAuthLoading(false)
    }
  }, [clearFlash, flash])

  const login = useCallback(async ({ email, password }) => {
    setAuthLoading(true)
    clearFlash()
    try {
      const data = await apiRequest('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      setAuthUser(data.user || { email })
      setIsAuthenticated(true)
      flash('success', 'Welcome back. Your todos are loaded.')
      await fetchTodos()
    } catch (err) {
      flash('error', err.message)
    } finally {
      setAuthLoading(false)
    }
  }, [clearFlash, fetchTodos, flash])

  const logout = useCallback(async () => {
    clearFlash()
    try {
      await apiRequest('/logout', { method: 'POST' })
    } catch {
      // ignore logout errors
    }
    setTodos([])
    setAuthUser(null)
    setIsAuthenticated(false)
    flash('success', 'Logged out successfully.')
  }, [clearFlash, flash])

  const createTodo = useCallback(async (payload) => {
    clearFlash()
    try {
      const data = await apiRequest('/createtodo', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      setTodos((current) => [data.todo, ...current])
      flash('success', 'Todo created successfully.')
      return data.todo
    } catch (err) {
      flash('error', err.message)
      throw err
    }
  }, [clearFlash, flash])

  const updateTodo = useCallback(async (id, payload) => {
    clearFlash()
    try {
      const data = await apiRequest(`/updatetodo/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      })
      setTodos((current) => current.map((todo) => (todo._id === id ? data.todo : todo)))
      flash('success', 'Todo updated.')
      return data.todo
    } catch (err) {
      flash('error', err.message)
      throw err
    }
  }, [clearFlash, flash])

  const deleteTodo = useCallback(async (id) => {
    clearFlash()
    try {
      await apiRequest(`/deletetodo/${id}`, { method: 'DELETE' })
      setTodos((current) => current.filter((todo) => todo._id !== id))
      flash('success', 'Todo deleted.')
    } catch (err) {
      flash('error', err.message)
      throw err
    }
  }, [clearFlash, flash])

  const stats = useMemo(() => {
    const total = todos.length
    const pending = todos.filter((todo) => todo.status === 'pending').length
    const inProgress = todos.filter((todo) => todo.status === 'in progress').length
    const completed = todos.filter((todo) => todo.status === 'completed').length

    return { total, pending, inProgress, completed }
  }, [todos])

  const value = useMemo(() => ({
    todos,
    loading,
    authLoading,
    authUser,
    isAuthenticated,
    message,
    error,
    stats,
    signup,
    login,
    logout,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    clearFlash,
  }), [
    authLoading,
    authUser,
    clearFlash,
    createTodo,
    deleteTodo,
    error,
    fetchTodos,
    isAuthenticated,
    loading,
    login,
    logout,
    message,
    signup,
    stats,
    todos,
    updateTodo,
  ])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('useAppContext must be used inside AppProvider')
  }

  return context
}
