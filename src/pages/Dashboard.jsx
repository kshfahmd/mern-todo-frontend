import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard</h2>
      <p>You are logged in ✅</p>

      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Dashboard;
