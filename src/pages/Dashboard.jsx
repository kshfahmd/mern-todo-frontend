import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import toast from "react-hot-toast";

import {
  createTodo,
  deleteTodo,
  getTodos,
  toggleTodo,
  updateTodo,
} from "../api/todoApi";
import { getMe } from "../api/userApi";

const priorityLabel = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const priorityStyle = {
  low: "bg-green-500/15 text-green-200 border-green-500/20",
  medium: "bg-yellow-500/15 text-yellow-200 border-yellow-500/20",
  high: "bg-red-500/15 text-red-200 border-red-500/20",
};

function toISODate(dateStr) {
  // "YYYY-MM-DD" -> ISO string at local midnight
  if (!dateStr) return null;
  const d = new Date(dateStr + "T00:00:00");
  return d.toISOString();
}

function toInputDate(iso) {
  // ISO -> "YYYY-MM-DD" (for <input type="date">)
  if (!iso) return "";
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function isOverdue(iso) {
  if (!iso) return false;
  const due = new Date(iso);
  const today = new Date();
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return due.getTime() < today.getTime();
}

// ✅ Human-friendly date display
function formatDueDateSmart(iso) {
  if (!iso) return "None";

  const d = new Date(iso);
  const today = new Date();

  d.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.round((d - today) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters + Search + Sorting
  const [filter, setFilter] = useState("all"); // all | pending | done
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("created"); // created | dueDate | priority

  // Editing
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editPriority, setEditPriority] = useState("medium");
  const editInputRef = useRef(null);

  // For Undo delete
  const undoTimerRef = useRef(null);

  // Stats
  const stats = useMemo(() => {
    const total = todos.length;
    const done = todos.filter((t) => t.completed).length;
    const pending = total - done;
    return { total, done, pending };
  }, [todos]);

  const logout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out");
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
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // Autofocus edit input when entering edit mode
  useEffect(() => {
    if (editingId) {
      setTimeout(() => editInputRef.current?.focus(), 50);
    }
  }, [editingId]);

  // Clean up undo timer
  useEffect(() => {
    return () => {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    };
  }, []);

  // Filter + Search + Sorting (with overdue priority inside due date sort)
  const filteredTodos = useMemo(() => {
    let list = [...todos];

    // tabs
    if (filter === "done") list = list.filter((t) => t.completed);
    if (filter === "pending") list = list.filter((t) => !t.completed);

    // search
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((t) => t.text.toLowerCase().includes(q));
    }

    // sorting
    if (sortBy === "dueDate") {
      list.sort((a, b) => {
        const aOver = !a.completed && isOverdue(a.dueDate);
        const bOver = !b.completed && isOverdue(b.dueDate);

        // overdue first
        if (aOver && !bOver) return -1;
        if (!aOver && bOver) return 1;

        // then by closest due date
        const ad = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const bd = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        return ad - bd;
      });
    } else if (sortBy === "priority") {
      const rank = { high: 1, medium: 2, low: 3 };
      list.sort((a, b) => (rank[a.priority] || 99) - (rank[b.priority] || 99));
    } else {
      // newest first
      list.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return list;
  }, [todos, filter, query, sortBy]);

  const addTodo = async () => {
    const value = text.trim();
    if (!value) return;

    try {
      setError("");
      const res = await createTodo({
        text: value,
        priority: "medium",
        dueDate: null,
      });

      setTodos((prev) => [res.data, ...prev]);
      setText("");
      toast.success("Task added");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        "Failed to add todo";
      setError(msg);
      toast.error(msg);
    }
  };

  const onToggle = async (id) => {
    try {
      setError("");
      const res = await toggleTodo(id);
      setTodos((prev) => prev.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to toggle todo";
      setError(msg);
      toast.error(msg);
    }
  };

  // ✅ Undo delete (Gmail style)
  const onDelete = async (id) => {
    try {
      setError("");

      const deletedTodo = todos.find((t) => t._id === id);
      if (!deletedTodo) return;

      // optimistic remove
      setTodos((prev) => prev.filter((t) => t._id !== id));

      // clear existing undo timer
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);

      // show toast with undo
      const toastId = toast(
        (t) => (
          <div className="flex items-center gap-3">
            <span className="text-sm">Task deleted</span>
            <button
              className="text-sm font-semibold text-blue-300 hover:text-blue-200 cursor-pointer"
              onClick={() => {
                toast.dismiss(t.id);
                setTodos((prev) => [deletedTodo, ...prev]);
                toast.success("Undo successful");
                if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
              }}
            >
              Undo
            </button>
          </div>
        ),
        { duration: 3500 }
      );

      // actually delete after delay
      undoTimerRef.current = setTimeout(async () => {
        try {
          await deleteTodo(id);
          toast.dismiss(toastId);
        } catch (err) {
          // rollback if server fails
          setTodos((prev) => [deletedTodo, ...prev]);
          toast.error("Delete failed, restored task");
        }
      }, 3500);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete todo";
      setError(msg);
      toast.error(msg);
    }
  };

  const startEdit = (todo) => {
    setEditingId(todo._id);
    setEditText(todo.text);
    setEditPriority(todo.priority || "medium");
    setEditDueDate(todo.dueDate ? toInputDate(todo.dueDate) : "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
    setEditPriority("medium");
    setEditDueDate("");
  };

  const saveEdit = async () => {
    if (!editingId) return;

    const value = editText.trim();
    if (value.length < 2) {
      toast.error("Todo text must be at least 2 characters");
      return;
    }

    try {
      const payload = {
        text: value,
        priority: editPriority,
        dueDate: editDueDate ? toISODate(editDueDate) : null,
      };

      const res = await updateTodo(editingId, payload);

      setTodos((prev) => prev.map((t) => (t._id === editingId ? res.data : t)));
      toast.success("Task updated");
      cancelEdit();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        "Failed to update todo";
      setError(msg);
      toast.error(msg);
    }
  };

  // ✅ Clear completed
  const clearCompleted = async () => {
    const completed = todos.filter((t) => t.completed);
    if (completed.length === 0) {
      toast("No completed tasks to clear");
      return;
    }

    const confirmed = confirm(
      `Clear ${completed.length} completed task(s)?`
    );
    if (!confirmed) return;

    // optimistic update
    const remaining = todos.filter((t) => !t.completed);
    setTodos(remaining);

    try {
      // delete all completed (parallel)
      await Promise.all(completed.map((t) => deleteTodo(t._id)));
      toast.success("Completed tasks cleared");
    } catch (err) {
      toast.error("Failed to clear tasks, reloading...");
      loadAll();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") addTodo();
  };

  // ✅ Edit keyboard shortcuts: Enter = save, Esc = cancel
  const handleEditKeyDown = (e) => {
    if (e.key === "Escape") cancelEdit();
    if (e.key === "Enter") saveEdit();
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
          <Link to="/" className="flex items-center gap-2 group cursor-pointer">
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
              Add tasks, set priorities, and never miss deadlines.
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

            <button
              onClick={clearCompleted}
              className="px-3 py-2 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm cursor-pointer active:scale-[0.98]"
            >
              Clear completed
            </button>
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

            {/* Tabs + Sort + Search */}
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

              {/* Sort + Search */}
              <div className="md:ml-auto flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full sm:w-44 px-4 py-2 rounded-2xl bg-black/30 border border-white/10 text-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                >
                  <option value="created">Sort: Newest</option>
                  <option value="dueDate">Sort: Due date</option>
                  <option value="priority">Sort: Priority</option>
                </select>

                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search tasks..."
                  className="w-full md:w-72 px-4 py-2 rounded-2xl bg-black/30 border border-white/10 text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>
            </div>

            <p className="text-xs text-white/40 mt-3">
              Tip: Enter adds tasks. Edit mode supports{" "}
              <span className="text-white/70 font-semibold">Enter</span> to save &{" "}
              <span className="text-white/70 font-semibold">Esc</span> to cancel.
            </p>
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
                    {filteredTodos.map((todo) => {
                      const isEditing = editingId === todo._id;
                      const overdue = !todo.completed && isOverdue(todo.dueDate);

                      return (
                        <motion.div
                          key={todo._id}
                          layout
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.98 }}
                          transition={{ duration: 0.22, ease: "easeOut" }}
                          className="rounded-2xl border border-white/10 bg-black/20 hover:bg-white/5 hover:border-white/20 transition overflow-hidden"
                        >
                          {!isEditing ? (
                            <div className="flex items-start justify-between px-4 py-4 gap-3">
                              <button
                                onClick={() => onToggle(todo._id)}
                                className="flex items-start gap-3 text-left cursor-pointer flex-1"
                              >
                                <motion.div
                                  className={`mt-1 h-5 w-5 rounded-full border grid place-items-center ${
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

                                <div className="flex flex-col">
                                  <p
                                    className={`text-sm ${
                                      todo.completed
                                        ? "text-white/40 line-through"
                                        : "text-white/85"
                                    }`}
                                  >
                                    {todo.text}
                                  </p>

                                  <div className="flex gap-2 mt-2 flex-wrap">
                                    <span
                                      className={`text-xs px-2 py-1 rounded-xl border ${
                                        priorityStyle[todo.priority || "medium"]
                                      }`}
                                    >
                                      {priorityLabel[todo.priority || "medium"]}
                                    </span>

                                    <span className="text-xs px-2 py-1 rounded-xl border border-white/10 bg-white/5 text-white/70">
                                      Due: {formatDueDateSmart(todo.dueDate)}
                                    </span>

                                    {overdue && (
                                      <span className="text-xs px-2 py-1 rounded-xl border border-red-500/20 bg-red-500/10 text-red-200">
                                        Overdue
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </button>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => startEdit(todo)}
                                  className="text-xs px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition cursor-pointer active:scale-[0.98]"
                                >
                                  Edit
                                </button>

                                <button
                                  onClick={() => onDelete(todo._id)}
                                  className="text-xs text-white/50 hover:text-red-300 transition cursor-pointer px-3 py-2 rounded-xl hover:bg-red-500/10 active:scale-[0.98]"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="px-4 py-4 space-y-3">
                              <div className="flex flex-col md:flex-row gap-3">
                                <input
                                  ref={editInputRef}
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  onKeyDown={handleEditKeyDown}
                                  className="flex-1 px-4 py-3 rounded-2xl bg-black/30 border border-white/10 text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                  placeholder="Update todo text"
                                />

                                <select
                                  value={editPriority}
                                  onChange={(e) =>
                                    setEditPriority(e.target.value)
                                  }
                                  className="md:w-40 px-4 py-3 rounded-2xl bg-black/30 border border-white/10 text-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                >
                                  <option value="low">Low</option>
                                  <option value="medium">Medium</option>
                                  <option value="high">High</option>
                                </select>

                                <input
                                  type="date"
                                  value={editDueDate}
                                  onChange={(e) => setEditDueDate(e.target.value)}
                                  className="md:w-48 px-4 py-3 rounded-2xl bg-black/30 border border-white/10 text-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                />
                              </div>

                              <div className="flex gap-2 justify-end">
                                <button
                                  onClick={cancelEdit}
                                  className="px-4 py-2 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition cursor-pointer active:scale-[0.98]"
                                >
                                  Cancel
                                </button>

                                <button
                                  onClick={saveEdit}
                                  className="px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-500 transition font-semibold text-white shadow-lg shadow-blue-600/25 cursor-pointer active:scale-[0.98]"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
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
