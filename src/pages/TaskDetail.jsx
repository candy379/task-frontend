import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Circle, Edit3, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api";

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const fetchTask = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await api.getTask(id);

      // Supports APIs returning either the task directly
      // or an object containing a task property.
      const taskData = data.task || data;

      setTask(taskData);
    } catch (err) {
      setError(err.message || "Unable to load this task.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  const isCompleted =
    task?.completed === true ||
    task?.completed === 1 ||
    task?.status === "completed";

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      await api.deleteTask(id);
      navigate("/tasks");
    } catch (err) {
      setError(err.message || "Unable to delete this task.");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="task-detail-page">
        <div className="detail-state">
          <div className="spinner"></div>
          <p>Loading task...</p>
        </div>
      </div>
    );
  }

  if (error && !task) {
    return (
      <div className="task-detail-page">
        <div className="task-detail-container">
          <Link to="/tasks" className="back-link">
            <ArrowLeft size={18} />
            Back to tasks
          </Link>

          <div className="detail-error">
            <h2>Couldn't load this task</h2>
            <p>{error}</p>

            <button onClick={fetchTask}>
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return null;
  }

  return (
    <div className="task-detail-page">
      <div className="task-detail-container">
        {/* Back */}
        <Link to="/tasks" className="back-link">
          <ArrowLeft size={18} />
          Back to tasks
        </Link>

        {/* Main card */}
        <div className="task-detail-card">
          <div className="task-detail-top">
            <div
              className={`large-task-status ${
                isCompleted ? "completed" : ""
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 size={27} />
              ) : (
                <Circle size={27} />
              )}
            </div>

            <span
              className={`detail-status-badge ${
                isCompleted
                  ? "detail-completed"
                  : "detail-pending"
              }`}
            >
              {isCompleted ? "Completed" : "Pending"}
            </span>
          </div>

          <div className="task-detail-content">
            <p className="dashboard-eyebrow">TASK DETAILS</p>

            <h1>{task.title}</h1>

            <div className="detail-divider"></div>

            <div className="detail-description">
              <h3>Description</h3>

              {task.description ? (
                <p>{task.description}</p>
              ) : (
                <p className="no-description">
                  No description was added for this task.
                </p>
              )}
            </div>

            {error && (
              <div className="form-error detail-form-error">
                {error}
              </div>
            )}

            <div className="task-detail-actions">
              <Link
                to={`/tasks/${task.id}/edit`}
                className="edit-task-button"
              >
                <Edit3 size={17} />
                Edit task
              </Link>

              <button
                className="delete-task-button"
                onClick={handleDelete}
                disabled={deleting}
              >
                <Trash2 size={17} />
                {deleting ? "Deleting..." : "Delete task"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}