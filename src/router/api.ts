// api.ts
import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:12349/api',
  baseURL: 'http://116.198.207.159:12349/api',
  headers: {
    'Content-Type': 'application/json',
    "Authorization": "Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6Inl1dWtpMyIsInJvbGUiOiJ1c2VyIiwiaXNzIjoiVGltZXJNZTMiLCJleHAiOjE3MzIzNjIxMDAsImlhdCI6MTczMTc1NzMwMH0.2ZTfC6chnPfEBnl5NEf7l6yvrgkkS4vyvl4ZyR4htCU"
  },
});

export const getTasks = async () => {
  const response = await api.get('/tasks');
  return response.data.data.tasks;
};

export const createTask = async (name: string, totalTime: number) => {
  const response = await api.post('/tasks', { name: name, total_time: totalTime });
  return response.data.data.task;
};

export const updateTask = async (id: number, task: any) => {
  const response = await api.put(`/tasks/${id}`, task);
  return response.data.data.task;

};

export const deleteTask = async (id: number) => {
  await api.delete(`/tasks/${id}`);
};

export const startTask = async (id: number) => {
  const response = await api.put(`/tasks/${id}/start`);
  return response.data.data.task;

};

export const pauseTask = async (id: number) => {
  const response = await api.put(`/tasks/${id}/pause`);
  return response.data.data.task;

};

export const completeTask = async (id: number) => {
  const response = await api.put(`/tasks/${id}/complete`);
  return response.data.data.task;

};

export const resetTask = async (id: number) => {
  // 新增resetTask函数
  const response = await api.put(`/tasks/${id}/reset`);
  return response.data.data.task;
};
