import { useState, useEffect, useCallback, useRef } from 'react';
import { tasksApi } from './api/tasksApi';
import Column from './components/Column';
import Toast from './components/Toast';

let toastId = 0;

function useToasts() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  return { toasts, addToast };
}

export default function App() {
  const [tasks, setTasks]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [input, setInput]       = useState('');
  const [adding, setAdding]     = useState(false);
  const { toasts, addToast }    = useToasts();
  const inputRef                = useRef(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tasksApi.getAll();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleAdd = async (e) => {
    e.preventDefault();
    const title = input.trim();
    if (!title) return;

    setAdding(true);
    try {
      const task = await tasksApi.create(title);
      setTasks((prev) => [...prev, task]);
      setInput('');
      inputRef.current?.focus();
      addToast('Task added ✓', 'success');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setAdding(false);
    }
  };

  const handleClearCompleted = async () => {
    const doneIds = tasks.filter((t) => t.status === 'done').map((t) => t.id);
    if (doneIds.length === 0) return;

    if (!window.confirm(`Clear all ${doneIds.length} completed tasks?`)) return;

    const snapshot = tasks;
    setTasks((prev) => prev.filter((t) => t.status !== 'done'));

    try {
      await Promise.all(doneIds.map((id) => tasksApi.remove(id)));
      addToast('Completed tasks cleared', 'success');
    } catch (err) {
      setTasks(snapshot);
      addToast('Failed to clear some tasks', 'error');
    }
  };

  const handleToggle = async (task) => {
    const newStatus = task.status === 'todo' ? 'done' : 'todo';
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
    );
    try {
      await tasksApi.updateStatus(task.id, newStatus);
      addToast(
        newStatus === 'done' ? 'Marked as Done ✓' : 'Moved back to To Do',
        'success'
      );
    } catch (err) {
      // Rollback
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: task.status } : t))
      );
      addToast(err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    const snapshot = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await tasksApi.remove(id);
      addToast('Task deleted', 'success');
    } catch (err) {
      setTasks(snapshot);
      addToast(err.message, 'error');
    }
  };

  const todoTasks = tasks.filter((t) => t.status === 'todo');
  const doneTasks = tasks.filter((t) => t.status === 'done');
  const donePercent = tasks.length === 0 ? 0 : Math.round((doneTasks.length / tasks.length) * 100);

  if (loading) {
    return (
      <div className="loading-wrap">
        <div className="spinner" />
        <p>Loading tasks…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-wrap">
        <span className="error-icon">⚠️</span>
        <p>{error}</p>
        <button className="btn-retry" onClick={fetchTasks}>Retry</button>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-badge">⚡ Mini Kanban</div>
        <h1>Task Manager</h1>
        <p>Organise your work. Stay in flow.</p>
      </header>

      {/* Stats */}
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-value total-color">{tasks.length}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-value todo-color">{todoTasks.length}</span>
          <span className="stat-label">To Do</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-value done-color">{doneTasks.length}</span>
          <span className="stat-label">Done</span>
        </div>
      </div>

      <div className="progress-wrap">
        <div className="progress-labels">
          <span>Progress</span>
          <div className="progress-right">
            <span>{donePercent}% complete</span>
            {doneTasks.length > 0 && (
              <button 
                className="btn-clear-done" 
                onClick={handleClearCompleted}
                title="Clear all completed tasks"
              >
                Clear Done
              </button>
            )}
          </div>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${donePercent}%` }} />
        </div>
      </div>

      <form className="add-form" onSubmit={handleAdd} id="add-task-form">
        <input
          ref={inputRef}
          id="task-input"
          type="text"
          placeholder="Add a new task…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={adding}
          autoComplete="off"
          maxLength={120}
        />
        <button
          id="add-task-btn"
          type="submit"
          className="btn-add"
          disabled={adding || !input.trim()}
        >
          {adding ? '…' : '＋ Add Task'}
        </button>
      </form>

      <main className="board">
        <Column
          type="todo"
          tasks={todoTasks}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
        <Column
          type="done"
          tasks={doneTasks}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      </main>

      <Toast toasts={toasts} />
    </div>
  );
}
