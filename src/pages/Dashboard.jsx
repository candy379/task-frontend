import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Circle,
  ClipboardList,
  LogOut,
  Plus,
  RefreshCw,
  Search,
  User,
} from "lucide-react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchTasks = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await api.getTasks();

      // Supports APIs that return either an array
      // or an object containing a tasks array.
      const taskList = Array.isArray(data)
        ? data
        : Array.isArray(data.tasks)
        ? data.tasks
        : [];

      setTasks(taskList);
    } catch (err) {
      setError(
        err.message || "Unable to load tasks. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const title = task.title || "";
      const description = task.description || "";

      const matchesSearch =
        title.toLowerCase().includes(search.toLowerCase()) ||
        description.toLowerCase().includes(search.toLowerCase());

      const isCompleted =
        task.completed === true ||
        task.completed === 1 ||
        task.status === "completed";

      const matchesFilter =
        filter === "all" ||
        (filter === "completed" && isCompleted) ||
        (filter === "pending" && !isCompleted);

      return matchesSearch && matchesFilter;
    });
  }, [tasks, search, filter]);

  const completedCount = tasks.filter(
    (task) =>
      task.completed === true ||
      task.completed === 1 ||
      task.status === "completed"
  ).length;

  const pendingCount = tasks.length - completedCount;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-page">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">
          <div className="brand-mark">✓</div>
          <span>TaskFlow</span>
        </div>

        <nav className="dashboard-nav">
          <div className="nav-item active">
            <ClipboardList size={19} />
            <span>My Tasks</span>
          </div>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="user-avatar">
              <User size={18} />
            </div>

            <div>
              <strong>{user?.name || "User"}</strong>
              <span>{user?.email || ""}</span>
            </div>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">YOUR WORKSPACE</p>
            <h1>My Tasks</h1>
            <p className="dashboard-subtitle">
              Stay organized and keep your progress moving.
            </p>
          </div>

          <Link to="/tasks/new" className="dashboard-add-button">
            <Plus size={19} />
            New Task
          </Link>
        </header>

        {/* Statistics */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <ClipboardList size={20} />
            </div>

            <div>
              <span>Total tasks</span>
              <strong>{tasks.length}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <CheckCircle2 size={20} />
            </div>

            <div>
              <span>Completed</span>
              <strong>{completedCount}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Circle size={20} />
            </div>

            <div>
              <span>Pending</span>
              <strong>{pendingCount}</strong>
            </div>
          </div>
        </section>

        {/* Task controls */}
        <section className="tasks-section">
          <div className="tasks-toolbar">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="task-filters">
              <button
                className={filter === "all" ? "filter-active" : ""}
                onClick={() => setFilter("all")}
              >
                All
              </button>

              <button
                className={filter === "pending" ? "filter-active" : ""}
                onClick={() => setFilter("pending")}
              >
                Pending
              </button>

              <button
                className={filter === "completed" ? "filter-active" : ""}
                onClick={() => setFilter("completed")}
              >
                Completed
              </button>

              <button
                className="refresh-button"
                onClick={fetchTasks}
                title="Refresh tasks"
              >
                <RefreshCw size={17} />
              </button>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="dashboard-state">
              <div className="spinner"></div>
              <p>Loading your tasks...</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="dashboard-error">
              <div>
                <strong>Couldn't load your tasks</strong>
                <p>{error}</p>
              </div>

              <button onClick={fetchTasks}>
                Try again
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && filteredTasks.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">
                <ClipboardList size={28} />
              </div>

              <h3>
                {tasks.length === 0
                  ? "No tasks yet"
                  : "No matching tasks"}
              </h3>

              <p>
                {tasks.length === 0
                  ? "Create your first task to get started."
                  : "Try changing your search or filter."}
              </p>

              {tasks.length === 0 && (
                <Link
                  to="/tasks/new"
                  className="dashboard-add-button"
                >
                  <Plus size={18} />
                  Create your first task
                </Link>
              )}
            </div>
          )}

          {/* Tasks */}
          {!loading && !error && filteredTasks.length > 0 && (
            <div className="task-list">
              {filteredTasks.map((task) => {
                const completed =
                  task.completed === true ||
                  task.completed === 1 ||
                  task.status === "completed";

                return (
                  <article className="task-card" key={task.id}>
                    <div
                      className={`task-status ${
                        completed ? "completed" : ""
                      }`}
                    >
                      {completed ? (
                        <CheckCircle2 size={21} />
                      ) : (
                        <Circle size={21} />
                      )}
                    </div>

                    <div className="task-content">
                      <h3>{task.title}</h3>

                      {task.description && (
                        <p>{task.description}</p>
                      )}

                      <span
                        className={`task-badge ${
                          completed ? "badge-completed" : "badge-pending"
                        }`}
                      >
                        {completed ? "Completed" : "Pending"}
                      </span>
                    </div>

                    <Link
                      to={`/tasks/${task.id}`}
                      className="view-task-button"
                    >
                      View
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}