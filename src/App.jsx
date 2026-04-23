import { useMemo, useState } from 'react'
import { useAppContext } from './context/AppContext'

const initialAuth = { name: '', email: '', password: '' }
const initialTodo = { title: '', description: '', status: 'pending' }

function App() {
  const {
    todos,
    loading,
    authLoading,
    isAuthenticated,
    authUser,
    message,
    error,
    stats,
    signup,
    login,
    logout,
    createTodo,
    updateTodo,
    deleteTodo,
    fetchTodos,
  } = useAppContext()

  const [authMode, setAuthMode] = useState('login')
  const [authForm, setAuthForm] = useState(initialAuth)
  const [todoForm, setTodoForm] = useState(initialTodo)
  const [editingId, setEditingId] = useState('')

  const completedPercent = useMemo(() => {
    if (!stats.total) return 0
    return Math.round((stats.completed / stats.total) * 100)
  }, [stats.completed, stats.total])

  const handleAuthSubmit = async (event) => {
    event.preventDefault()

    if (authMode === 'signup') {
      await signup(authForm)
      setAuthMode('login')
      return
    }

    await login(authForm)
  }

  const handleTodoSubmit = async (event) => {
    event.preventDefault()

    if (editingId) {
      await updateTodo(editingId, todoForm)
      setEditingId('')
      setTodoForm(initialTodo)
      return
    }

    await createTodo(todoForm)
    setTodoForm(initialTodo)
  }

  const startEdit = (todo) => {
    setEditingId(todo._id)
    setTodoForm({
      title: todo.title || '',
      description: todo.description || '',
      status: todo.status || 'pending',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelEdit = () => {
    setEditingId('')
    setTodoForm(initialTodo)
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.22),_transparent_35%),linear-gradient(180deg,#070816_0%,#0f172a_50%,#111827_100%)] text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-indigo-200/80">Task Sphere</p>
            <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Todos, but beautifully managed.</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{stats.total} tasks</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{completedPercent}% done</span>
            <button
              type="button"
              onClick={fetchTodos}
              className="rounded-full bg-white/10 px-3 py-1.5 font-medium text-white transition hover:bg-white/15"
            >
              Refresh
            </button>
            {isAuthenticated && (
              <button
                type="button"
                onClick={logout}
                className="rounded-full bg-rose-500/15 px-3 py-1.5 font-medium text-rose-200 transition hover:bg-rose-500/25"
              >
                Logout
              </button>
            )}
          </div>
        </header>

        {(message || error) && (
          <div
            className={`mb-5 rounded-2xl border px-4 py-3 text-sm backdrop-blur ${
              error
                ? 'border-rose-400/30 bg-rose-500/10 text-rose-100'
                : 'border-emerald-400/30 bg-emerald-500/10 text-emerald-100'
            }`}
          >
            {message || error}
          </div>
        )}

        {!isAuthenticated ? (
          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <p className="mb-4 inline-flex rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-indigo-100">
                Sign in to continue
              </p>
              <h2 className="max-w-xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
                A clean workspace for login, todos, and fast updates.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
                Use the same backend, but with a polished React dashboard powered by Context API and Tailwind CSS.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  ['Secure auth', 'Cookie-based sessions with login/logout flow.'],
                  ['Live data', 'Create, update, delete, and refresh your todo list.'],
                  ['Responsive UI', 'Works beautifully on desktop and mobile.'],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                    <h3 className="text-sm font-semibold text-white">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <div className="mb-5 flex rounded-2xl border border-white/10 bg-slate-950/40 p-1 text-sm">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 rounded-xl px-4 py-2 font-medium transition ${
                    authMode === 'login' ? 'bg-indigo-500 text-white' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className={`flex-1 rounded-xl px-4 py-2 font-medium transition ${
                    authMode === 'signup' ? 'bg-indigo-500 text-white' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Signup
                </button>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authMode === 'signup' && (
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400"
                    placeholder="Full name"
                    value={authForm.name}
                    onChange={(e) => setAuthForm((current) => ({ ...current, name: e.target.value }))}
                  />
                )}
                <input
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400"
                  placeholder="Email"
                  type="email"
                  value={authForm.email}
                  onChange={(e) => setAuthForm((current) => ({ ...current, email: e.target.value }))}
                />
                <input
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400"
                  placeholder="Password"
                  type="password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm((current) => ({ ...current, password: e.target.value }))}
                />
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-4 py-3 font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {authLoading ? 'Please wait...' : authMode === 'login' ? 'Login to dashboard' : 'Create account'}
                </button>
              </form>
            </div>
          </section>
        ) : (
          <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <aside className="space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <div className="rounded-3xl bg-gradient-to-br from-indigo-500/25 via-violet-500/15 to-fuchsia-500/10 p-6 ring-1 ring-white/10">
                <p className="text-sm text-indigo-100/90">Signed in as</p>
                <h2 className="mt-2 break-all text-xl font-semibold text-white">{authUser?.email || 'Your session is active'}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  You can create a todo, edit it, and keep everything synced through the Context API.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  ['Total', stats.total],
                  ['Pending', stats.pending],
                  ['In progress', stats.inProgress],
                  ['Completed', stats.completed],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{label}</p>
                    <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <div className="mb-3 flex items-center justify-between text-sm text-slate-300">
                  <span>Completion rate</span>
                  <span>{completedPercent}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 transition-all"
                    style={{ width: `${completedPercent}%` }}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm leading-6 text-slate-300">
                Tip: keep the browser open with the same session cookie and the app will rehydrate your todos on refresh.
              </div>
            </aside>

            <main className="space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-indigo-200/80">Todo command center</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Create, edit, and ship tasks faster.</h2>
                </div>
                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                  >
                    Cancel edit
                  </button>
                )}
              </div>

              <form onSubmit={handleTodoSubmit} className="grid gap-3 rounded-[1.5rem] border border-white/10 bg-slate-950/40 p-4">
                <div className="grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400"
                    placeholder="Task title"
                    value={todoForm.title}
                    onChange={(e) => setTodoForm((current) => ({ ...current, title: e.target.value }))}
                  />
                  <select
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-indigo-400"
                    value={todoForm.status}
                    onChange={(e) => setTodoForm((current) => ({ ...current, status: e.target.value }))}
                  >
                    <option value="pending">Pending</option>
                    <option value="in progress">In progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <textarea
                  className="min-h-[110px] w-full resize-none rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-400"
                  placeholder="Description"
                  value={todoForm.description}
                  onChange={(e) => setTodoForm((current) => ({ ...current, description: e.target.value }))}
                />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-slate-400">
                    {editingId ? 'Update the selected task.' : 'Create a new task and it will sync immediately.'}
                  </p>
                  <button
                    type="submit"
                    className="rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:brightness-110"
                  >
                    {editingId ? 'Save changes' : 'Add task'}
                  </button>
                </div>
              </form>

              <div className="space-y-3">
                {loading ? (
                  <div className="rounded-[1.5rem] border border-dashed border-white/15 bg-slate-950/30 p-10 text-center text-slate-400">
                    Loading your tasks...
                  </div>
                ) : todos.length === 0 ? (
                  <div className="rounded-[1.5rem] border border-dashed border-white/15 bg-slate-950/30 p-10 text-center text-slate-400">
                    No tasks yet. Add your first one above.
                  </div>
                ) : (
                  todos.map((todo) => {
                    const isComplete = todo.status === 'completed'

                    return (
                      <article
                        key={todo._id}
                        className={`rounded-[1.5rem] border bg-slate-950/40 p-4 transition hover:border-white/15 hover:bg-slate-950/50 ${
                          isComplete ? 'border-emerald-400/20' : 'border-white/10'
                        }`}
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className={`text-lg font-semibold ${isComplete ? 'text-slate-400 line-through' : 'text-white'}`}>
                                {todo.title}
                              </h3>
                              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] uppercase tracking-[0.25em] text-slate-300">
                                {todo.status}
                              </span>
                            </div>
                            {todo.description && (
                              <p className={`mt-2 text-sm leading-6 ${isComplete ? 'text-slate-500' : 'text-slate-300'}`}>
                                {todo.description}
                              </p>
                            )}
                            {todo.createdAt && (
                              <p className="mt-3 text-xs uppercase tracking-[0.24em] text-slate-500">
                                {new Date(todo.createdAt).toLocaleDateString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => startEdit(todo)}
                              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteTodo(todo._id)}
                              className="rounded-full border border-rose-400/20 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-100 transition hover:bg-rose-500/20"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </article>
                    )
                  })
                )}
              </div>
            </main>
          </section>
        )}
      </div>
    </div>
  )
}

export default App
