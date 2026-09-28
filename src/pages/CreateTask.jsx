import { useState } from "react";
import { ArrowLeft, CheckCircle2, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";

export default function CreateTask() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

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

    setLoading(true);

    try {
      await api.createTask({
        title: form.title.trim(),
        description: form.description.trim(),
      });

      navigate("/tasks");
    } catch (err) {
      setError(err.message || "Unable to create task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-task-page">
      <div className="create-task-container">
        {/* Header */}
        <div className="create-task-header">
          <Link to="/tasks" className="back-link">
            <ArrowLeft size={18} />
            Back to tasks
          </Link>

          <div className="create-task-title">
            <div className="create-task-icon">
              <Plus size={22} />
            </div>

            <div>
              <p className="dashboard-eyebrow">TASK MANAGEMENT</p>
              <h1>Create a new task</h1>
              <p>
                Add a task to your workspace and keep your work organized.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="create-task-card">
          {error && (
            <div className="form-error create-task-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="create-form-group">
              <label htmlFor="title">
                Task title <span>*</span>
              </label>

              <input
                id="title"
                type="text"
                name="title"
                placeholder="e.g. Complete React frontend"
                value={form.title}
                onChange={handleChange}
                maxLength={100}
              />

              <div className="field-hint">
                {form.title.length}/100 characters
              </div>
            </div>

            <div className="create-form-group">
              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                placeholder="Add some details about this task..."
                value={form.description}
                onChange={handleChange}
                maxLength={500}
                rows={6}
              />

              <div className="field-hint">
                {form.description.length}/500 characters
              </div>
            </div>

            <div className="create-task-info">
              <CheckCircle2 size={18} />

              <span>
                Your task will be saved to your TaskFlow workspace.
              </span>
            </div>

            <div className="create-task-actions">
              <Link to="/tasks" className="cancel-button">
                Cancel
              </Link>

              <button
                type="submit"
                className="create-submit-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="button-spinner"></span>
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Create task
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