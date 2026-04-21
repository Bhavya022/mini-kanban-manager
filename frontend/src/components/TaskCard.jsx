export default function TaskCard({ task, onToggle, onDelete }) {
  const isDone = task.status === 'done';

  return (
    <div className={`task-card ${isDone ? 'is-done' : ''}`} id={`task-${task.id}`}>
      <label className="task-label">
        <input
          id={`task-check-${task.id}`}
          type="checkbox"
          className="task-checkbox"
          checked={isDone}
          onChange={() => onToggle(task)}
          aria-label={isDone ? 'Mark as incomplete' : 'Mark as complete'}
        />
        <span className={`task-title${isDone ? ' done-text' : ''}`}>
          {task.title}
        </span>
      </label>
      <button
        id={`task-delete-${task.id}`}
        className="btn-delete"
        onClick={() => onDelete(task.id)}
        aria-label={`Delete task: ${task.title}`}
        title="Delete task"
      >
        ✕
      </button>
    </div>
  );
}
