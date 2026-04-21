let tasks = [
  { id: 1, title: 'Design the UI wireframe', status: 'todo' },
  { id: 2, title: 'Set up Express server', status: 'done' },
  { id: 3, title: 'Implement REST endpoints', status: 'todo' },
  { id: 4, title: 'Connect React frontend', status: 'done' },
];
let nextId = 5;

const VALID_STATUSES = ['todo', 'done'];

class TaskModel {
  static async findAll() {
    return tasks;
  }

  static async create(title) {
    const task = {
      id: nextId++,
      title: title.trim(),
      status: 'todo',
    };
    tasks.push(task);
    return task;
  }

  static async update(id, status) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return null;

    task.status = status;
    return task;
  }

  static async delete(id) {
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;

    tasks.splice(index, 1);
    return true;
  }

  static isValidStatus(status) {
    return VALID_STATUSES.includes(status);
  }

  static getValidStatuses() {
    return VALID_STATUSES;
  }
}

module.exports = TaskModel;
