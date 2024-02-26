import React, { useEffect, useState } from "react";
import ApiService from "../ApiService";
import "./styles.css";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [editedTask, setEditedTask] = useState(null);
  const [editingRowId, setEditingRowId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch tasks from the API when component mounts
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const fetchedTasks = await ApiService.getAllTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      setError("Error fetching tasks. Please try again later.");
      console.error("Error fetching tasks:", error);
    }
  };

  const openEditPopup = (task) => {
    setEditedTask(task);
    setShowPopup(true);
  };

  const closeEditPopup = () => {
    setEditedTask(null);
    setShowPopup(false);
  };

  const handleEdit = (id) => {
    setEditingRowId(id);
  };

  const handleSaveInlineEdit = async (id) => {
    try {
      setEditingRowId(null);
      const taskToUpdate = tasks.find((task) => task.id === id);
      await ApiService.updateTask(id, taskToUpdate);
      fetchTasks(); // Refresh tasks after update
    } catch (error) {
      setError("Error updating task. Please try again later.");
      console.error("Error updating task:", error);
    }
  };

  const handleInlineEdit = (id, field, value) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, [field]: value } : task
    );
    setTasks(updatedTasks);
  };

  const handleMarkAsDone = async (id) => {
    try {
      const taskToUpdate = tasks.find((task) => task.id === id);
      taskToUpdate.status = "Done";
      await ApiService.updateTask(id, taskToUpdate);
      fetchTasks(); // Refresh tasks after update
    } catch (error) {
      setError("Error marking task as done. Please try again later.");
      console.error("Error marking task as done:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await ApiService.deleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      setError("Error deleting task. Please try again later.");
      console.error("Error deleting task:", error);
    }
  };

  const handleSave = async (editedTask) => {
    try {
      let updatedTasks = [];
      if (editedTask.id) {
        await ApiService.updateTask(editedTask.id, editedTask);
        updatedTasks = tasks.map((task) =>
          task.id === editedTask.id ? editedTask : task
        );
      } else {
        const createdTask = await ApiService.createTask(editedTask);
        updatedTasks = [...tasks, createdTask];
      }
      setTasks(updatedTasks);
      closeEditPopup();
    } catch (error) {
      setError("Error saving task. Please try again later.");
      console.error("Error saving task:", error);
    }
  };

  const handleAdd = () => {
    openEditPopup(null);
  };

  return (
    <div className="container">
      <h2>Task Management System</h2>
      <button className="add-button" onClick={handleAdd}>
        Add Task
      </button>
      {error && <div className="error">{error}</div>}
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>
                {editingRowId === task.id ? (
                  <input
                    type="text"
                    value={task.title}
                    onChange={(e) =>
                      handleInlineEdit(task.id, "title", e.target.value)
                    }
                  />
                ) : (
                  task.title
                )}
              </td>
              <td>
                {editingRowId === task.id ? (
                  <input
                    type="text"
                    value={task.description}
                    onChange={(e) =>
                      handleInlineEdit(task.id, "description", e.target.value)
                    }
                  />
                ) : (
                  task.description
                )}
              </td>
              <td>
                {editingRowId === task.id ? (
                  <select
                    value={task.status}
                    onChange={(e) =>
                      handleInlineEdit(task.id, "status", e.target.value)
                    }
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                ) : (
                  task.status
                )}
              </td>
              <td>
                {editingRowId === task.id ? (
                  <input
                    type="text"
                    value={task.due_date}
                    onChange={(e) =>
                      handleInlineEdit(task.id, "due_date", e.target.value)
                    }
                  />
                ) : (
                  task.due_date
                )}
              </td>
              <td>
                {task.status !== "Done" && (
                  <>
                    {editingRowId === task.id ? (
                      <button
                        className="save-button"
                        onClick={() => handleSaveInlineEdit(task.id)}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(task.id)}
                      >
                        Edit
                      </button>
                    )}
                    <button
                      className="mark-as-done-button"
                      onClick={() => handleMarkAsDone(task.id)}
                    >
                      Mark as Done
                    </button>
                  </>
                )}
                <button
                  className="delete-button"
                  onClick={() => handleDelete(task.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showPopup && (
        <EditPopup
          task={editedTask}
          onSave={handleSave}
          onClose={closeEditPopup}
        />
      )}
    </div>
  );
};

const EditPopup = ({ task, onSave, onClose }) => {
  const [editedTask, setEditedTask] = useState(
    task || { title: "", description: "", status: "To Do", due_date: "" }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
  };

  const handleSave = () => {
    onSave(editedTask);
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h3>{task ? "Edit Task" : "Add Task"}</h3>
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={editedTask.title}
          onChange={handleChange}
        />
        <label>Description:</label>
        <input
          type="text"
          name="description"
          value={editedTask.description}
          onChange={handleChange}
        />
        <label>Status:</label>
        <select name="status" value={editedTask.status} onChange={handleChange}>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        <label>Due Date:</label>
        <input
          type="text"
          name="due_date"
          value={editedTask.due_date}
          placeholder="Enter date in yyyy-MM-dd format"
          onChange={handleChange}
        />
        <button className="save-button" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default TaskList;
