import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";

import { createTodo, deleteTodo, getTodos, toggleTodo } from "../api/todoApi";
import { getMe } from "../api/userApi";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ NEW: Filter + Search
  const [filter, setFilter] = useState("all"); // all | pending | done
  const [query, setQuery] = useState("");

  // ---- stats (derived data) ----
  const stats = useMemo(() => {
    const total = todos.length;
    const done = todos.filter((t) => t.completed).length;
    const pending = total - done;
    return { total, done, pending };
  }, [todos]);

  // ✅ NEW: filtered todos
  const filteredTodos = useMemo(() => {
    let list = [...todos];

    if (filter === "done") list = list.filter((t) => t.completed);
    if (filter === "pending") list = list.filter((t) => !t.completed);

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((t) => t.text.toLowerCase().includes(q));
    }

    return list;
  }, [todos, filter, query]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const loadAll = async () => {
    try {
      setError("");
      setLoading(true);

      const [meRes, todoRes] = await Promise.all([getMe(), getTodos()]);
      setUser(meRes.data);
      setTodos(todoRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const addTodo = async () => {
    const value = text.trim();
    if (!value) return;

    try {
      setError("");
      const res = await createTodo({ text: value });
      setTodos((prev) => [res.data, ...prev]);
      setText("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add todo");
    }
  };

  const onToggle = async (id) => {
    try {
      setError("");
      const res = await toggleTodo(id);
      setTodos((prev) => prev.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to toggle todo");
    }
  };

  const onDelete = async (id) => {
    try {
      setError("");
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete todo");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") addTodo();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070A12] text-white grid place-items-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="h-10 w-10 rounded-2xl border border-white/10 bg-white/5 grid place-items-center">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-blue-400" />
          </div>
          <p className="text-white/70">Loading dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070A12] text-white overflow-x-hidden">
      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-blue-600/15 blur-3xl" />
        <div className="absolute top-40 -right-28 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      {/* Navbar */}
      <div className="relative sticky top-0 z-50 backdrop-blur-xl bg-[#070A12]/70 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 group cursor-pointer">
            <div className="h-9 w-9 rounded-xl bg-white/10 border border-white/10 grid place-items-center group-hover:bg-white/15 transition">
              <span className="text-sm font-bold">T</span>
            </div>
            <h1 className="text-lg font-semibold tracking-tight">
              Todo<span className="text-blue-400">Pro</span>
            </h1>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-2xl border border-white/10 bg-white/5">
              <div className="h-7 w-7 rounded-xl bg-white/10 grid place-items-center text-xs font-semibold">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <p className="text-sm text-white/80">{user?.name || "User"}</p>
            </div>

            <button
              onClick={logout}
              className="px-4 py-2 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 transition active:scale-[0.98] cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="relative max-w-6xl mx-auto px-6 py-10">
        {/* Header + Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <p className="text-white/60 text-sm">
              Welcome back{user?.name ? `, ${user.name}` : ""}.
            </p>
            <h2 className="text-3xl font-semibold tracking-tight mt-1">
              Your dashboard
            </h2>
            <p className="text-white/60 mt-2 max-w-xl">
              Add tasks, mark them done, and keep your day simple.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-2 rounded-2xl border border-white/10 bg-white/5 text-sm text-white/80">
              Total: <span className="font-semibold">{stats.total}</span>
            </span>
            <span className="px-3 py-2 rounded-2xl border border-white/10 bg-white/5 text-sm text-white/80">
              Done: <span className="font-semibold">{stats.done}</span>
            </span>
            <span className="px-3 py-2 rounded-2xl border border-white/10 bg-white/5 text-sm text-white/80">
              Pending: <span className="font-semibold">{stats.pending}</span>
            </span>
          </div>
        </motion.div>

        {/* Main Card */}
        <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden">
          {/* Add bar */}
          <div className="p-6 border-b border-white/10">
            {error && (
              <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-200 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What do you need to do?"
                className="flex-1 px-4 py-3 rounded-2xl bg-black/30 border border-white/10 text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />

              <button
                onClick={addTodo}
                className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 transition font-semibold text-white shadow-lg shadow-blue-600/25 active:scale-[0.99] cursor-pointer"
              >
                Add task
              </button>
            </div>

            <p className="text-xs text-white/40 mt-3">
              Tip: press{" "}
              <span className="text-white/70 font-semibold">Enter</span> to add
              quickly.
            </p>

            {/* ✅ Filter + Search */}
            <div className="mt-5 flex flex-col md:flex-row md:items-center gap-3">
              {/* Tabs */}
              <div className="flex items-center gap-2">
                {[
                  { key: "all", label: "All" },
                  { key: "pending", label: "Pending" },
                  { key: "done", label: "Done" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key)}
                    className={`px-4 py-2 rounded-2xl text-sm border transition cursor-pointer active:scale-[0.98] ${
                      filter === tab.key
                        ? "bg-blue-600/90 border-blue-500/30 text-white shadow-lg shadow-blue-600/20"
                        : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="md:ml-auto">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search tasks..."
                  className="w-full md:w-72 px-4 py-2 rounded-2xl bg-black/30 border border-white/10 text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>
            </div>
          </div>

          {/* List */}
          <div className="p-6">
            {filteredTodos.length === 0 ? (
              <div className="text-white/60 text-sm">
                No results found.
                <span className="block mt-1 text-white/40 text-xs">
                  Try switching tabs or searching something else.
                </span>
              </div>
            ) : (
              <LayoutGroup>
                <motion.div layout className="space-y-3">
                  <AnimatePresence initial={false}>
                    {filteredTodos.map((todo) => (
                      <motion.div
                        key={todo._id}
                        layout
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 hover:bg-white/5 hover:border-white/20 transition"
                      >
                        <button
                          onClick={() => onToggle(todo._id)}
                          className="flex items-center gap-3 text-left cursor-pointer"
                        >
                          <motion.div
                            className={`h-5 w-5 rounded-full border grid place-items-center ${
                              todo.completed
                                ? "bg-green-500/80 border-green-400/60"
                                : "border-white/30"
                            }`}
                            whileTap={{ scale: 0.9 }}
                          >
                            <AnimatePresence>
                              {todo.completed && (
                                <motion.span
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0, opacity: 0 }}
                                  transition={{ duration: 0.18 }}
                                  className="h-2 w-2 bg-white rounded-full"
                                />
                              )}
                            </AnimatePresence>
                          </motion.div>

                          <p
                            className={`text-sm ${
                              todo.completed
                                ? "text-white/40 line-through"
                                : "text-white/85"
                            }`}
                          >
                            {todo.text}
                          </p>
                        </button>

                        <button
                          onClick={() => onDelete(todo._id)}
                          className="text-xs text-white/50 hover:text-red-300 transition cursor-pointer px-2 py-1 rounded-lg hover:bg-red-500/10 active:scale-[0.98]"
                        >
                          Delete
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </LayoutGroup>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
