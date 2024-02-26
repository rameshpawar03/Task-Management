import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api/tasks/";

const ApiService = {
  getAllTasks: async () => {
    try {
      const response = await axios.get(BASE_URL);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createTask: async (taskData) => {
    try {
      const response = await axios.post(BASE_URL, taskData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateTask: async (taskId, updatedTaskData) => {
    try {
      const response = await axios.put(
        `${BASE_URL}${taskId}/`,
        updatedTaskData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteTask: async (taskId) => {
    try {
      const response = await axios.delete(`${BASE_URL}${taskId}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default ApiService;
