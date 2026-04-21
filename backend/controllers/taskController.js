const TaskModel = require('../models/taskModel');

const getAllTasks = async (req, res) => {
  try {
    const tasks = await TaskModel.findAll();
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const createTask = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ success: false, message: 'Title must not be empty.' });
    }

    const task = await TaskModel.create(title);
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const updateTask = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;

    if (!TaskModel.isValidStatus(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${TaskModel.getValidStatuses().join(', ')}.`,
      });
    }

    const task = await TaskModel.update(id, status);
    if (!task) {
      return res.status(404).json({ success: false, message: `Task with id ${id} not found.` });
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const success = await TaskModel.delete(id);

    if (!success) {
      return res.status(404).json({ success: false, message: `Task with id ${id} not found.` });
    }

    res.status(200).json({ success: true, message: `Task ${id} deleted successfully.` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
};
