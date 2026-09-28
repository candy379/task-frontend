import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Save } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api";

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    completed: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await api.getTask(id);
        const task = data.task || data;

        setForm({
          title: task.title || "",
          description: task.description || "",
          completed:
            task.completed === true ||
            task.completed === 1 ||
            task.status === "completed",
        });
      } catch (err) {
        setError(err.message || "Unable to load this task.");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!form.title.trim()) {
      setError("Please enter a task title.");
      return;
    }

    if (form.title.trim().length < 3) {
      setError("Task title must be at least 3 characters.");
      return;
    }

    if (form.title.trim().length > 100) {
      setError("Task title must be less than 100 characters.");
      return;
    }

    if (form.description.trim().length > 500) {
      setError("Description must be less than 500 characters.");
      return;
    }

    setSaving(true);

    try {
      await api.updateTask(id, {
        title: form.title.trim(),
        description: form.description.trim(),
        completed: form.completed,
      });

      navigate(`/tasks/${id}`);
    } catch (err) {
      setError(err.message || "Unable to update this task.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-task-page">
        <div className="detail-state">
          <div className="spinner"></div>
          <p>Loading task...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-task-page">
      <div className="edit-task-container">
        <Link to={`/tasks/${id}`} className="back-link">
          <ArrowLeft size={18} />
          Back to task
        </Link>

        <div className="edit-task-heading">
          <p className="dashboard-eyebrow">TASK MANAGEMENT</p>
          <h1>Edit task</h1>
          <p>Update your task details and save your changes.</p>
        </div>

        <div className="edit-task-card">
          {error && (
            <div className="form-error edit-task-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="create-form-group">
              <label htmlFor="edit-title">
                Task title <span>*</span>
              </label>

              <input
                id="edit-title"
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                maxLength={100}
              />

              <div className="field-hint">
                {form.title.length}/100 characters
              </div>
            </div>

            <div className="create-form-group">
              <label htmlFor="edit-description">
                Description
              </label>

              <textarea
                id="edit-description"
                name="description"
                value={form.description}
                onChange={handleChange}
                maxLength={500}
                rows={6}
              />

              <div className="field-hint">
                {form.description.length}/500 characters
              </div>
            </div>

            <label className="completion-option">
              <input
                type="checkbox"
                name="completed"
                checked={form.completed}
                onChange={handleChange}
              />

              <span className="custom-checkbox">
                <CheckCircle2 size={17} />
              </span>

              <span>
                <strong>Mark as completed</strong>
                <small>
                  Move this task to your completed tasks.
                </small>
              </span>
            </label>

            <div className="edit-task-actions">
              <Link
                to={`/tasks/${id}`}
                className="cancel-button"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="create-submit-button"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="button-spinner"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={17} />
                    Save changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}