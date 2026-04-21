import TaskCard from './TaskCard';

export default function Column({ type, tasks, onToggle, onDelete }) {
  const isTodo = type === 'todo';
  const label  = isTodo ? 'To Do' : 'Done';
  const dotCls = isTodo ? 'todo' : 'done';

  return (
    <section className="column" aria-label={`${label} column`}>
      <div className="column-header">
        <div className="column-title-wrap">
          <span className={`column-dot ${dotCls}`} />
          <h2 className="column-title">{label}</h2>
        </div>
        <span className="column-count">{tasks.length}</span>
      </div>

      <div className="column-body">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">{isTodo ? '📋' : '🎉'}</span>
            <p>{isTodo ? 'No pending tasks' : 'Nothing done yet'}</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </section>
  );
}
