import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTodo, deleteTodo, getTodos, toggleTodo } from "../api/todoApi";

function Dashboard() {
  const navigate = useNavigate();

  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const loadTodos = async () => {
    try {
      setLoading(true);
      const res = await getTodos();
      setTodos(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load todos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleAdd = async () => {
    if (text.trim() === "") return;

    try {
      const res = await createTodo({ text });
      setTodos([res.data, ...todos]); // add new todo at top
      setText("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add todo");
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await toggleTodo(id);
      setTodos(todos.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to toggle todo");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter((t) => t._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete todo");
    }
  };

  if (loading) {
    return <p style={{ padding: 20 }}>Loading...</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard</h2>

      <button onClick={logout}>Logout</button>

      <hr />

      <h3>Your Todos</h3>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginBottom: 10 }}>
        <input
          placeholder="Enter todo..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={handleAdd}>Add</button>
      </div>

      {todos.length === 0 ? (
        <p>No todos yet</p>
      ) : (
        <ul style={{ paddingLeft: 18 }}>
          {todos.map((todo) => (
            <li key={todo._id} style={{ marginBottom: 8 }}>
              <span
                onClick={() => handleToggle(todo._id)}
                style={{
                  cursor: "pointer",
                  textDecoration: todo.completed ? "line-through" : "none",
                  marginRight: 10,
                }}
              >
                {todo.text}
              </span>
              <button onClick={() => handleDelete(todo._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
