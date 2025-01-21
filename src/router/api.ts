// api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://116.198.207.159:12349/api',
  // baseURL: 'https://auth.altar-echo.top/api',
  
  
  headers: {
    'Content-Type': 'application/json',
    "Authorization": "Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNSwidXNlcm5hbWUiOiJ5dXVraTMiLCJyb2xlIjoidXNlciIsImlzcyI6Im11bmRvLWF1dGgtaHViIiwiZXhwIjoxNzM3NzAyNDY5LCJpYXQiOjE3MzcwOTc2Njl9.6ZyHG8PVl-SimbaZLda-MgV935l_zcx8UDlYmDbBAP4"
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('请求失败:', error.response || error.message || error);
    return Promise.reject(error);
  }
);
// 发送注册请求，发送邮箱验证码
export const registerUser = async (username: string, email: string,callback_url:string,external?: string,) => {
  const response = await api.post('/register/v2', {
     username, 
     email,
     external,
     callback_url
  });
  return response.data; 
};

// 激活用户邮箱
export const verifyEmail = async (email: string, token: string, password: string) => {
  const response = await api.post('/verify/v2', {
    email, 
    token,
    password 
  });
  return response.data; 
};


// 邮箱密码登录函数
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post('/login', {
      email,
      password,
    });
    return response.data; // 返回响应数据
  } catch (error) {
    console.error('登录失败:', error);
    throw error; // 将错误抛出，以便在调用处处理
  }
};

// 获取微信二维码登录地址
export const getWechatLoginQR = async () => {
  try {
    const response = await api.get('/wechat/login');
    return response.data;
  } catch (error) {
    console.error('获取微信二维码失败:', error);
    throw error;
  }
};

// 查询微信扫码登录状态
export const checkWechatLoginCallback = async (ticket: string) => {
  try {
    const response = await api.get('/wechat/login/callback', {
      params: { 
        ticket,
        service: 'mundo' 
      },
    });
    return response.data;
  } catch (error) {
    console.error('查询扫码登录状态失败:', error);
    throw error;
  }
};

// 查询helper登录状态
export const checkHelperLoginCallback = async (state: string,code: string) => {
  try {
    const response = await api.post('/user/third/hduhelp/callback', {
      state,
      code,
      service: 'mundo' 
    });
    return response.data;
  } catch (error) {
    console.error('查询helper登录状态失败:', error);
    throw error;
  }
};
// 绑定邮箱-微信
export const bindWeChatEmail = async (token: string) => {
  try {
    const response = await api.get('/wechat/bind', {
      headers: {
        "Authorization": "Bearer " +token,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('绑定邮箱token失败', error);
    throw error; 
  }
};

// 绑定邮箱-杭助
export const bindHDUEmail = async (token: string,state: string,code: string) => {
  console.log(token,state,code)
  try {
    const response = await api.post('/hduhelp/bind', 
      {
        state,
        code
      },
      {
        headers: {
          "Authorization": "Bearer " +token,
        }
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('绑定HDUtoken失败', error);
    throw error; 
  }
};
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

// 获取文件列表的封装函数
export const getFileList = async (name: string) => {
  try {
    const response = await api_mundo.get(`/api/files`, {
      params: { name },
      headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxOSwidXNlcm5hbWUiOiJra2dvb24iLCJyb2xlIjoidXNlciIsImlzcyI6Im11bmRvLWF1dGgtaHViIiwiZXhwIjoxNzM3OTc3NDk5LCJpYXQiOjE3MzczNzI2OTl9.qGcNJRA1Z8c5sPqQHgRqqoLV0HM-Ke7sVnh3Qcu6Ldw'
      }
    });
    return response.data.data.files; // 返回的数据结构
  } catch (error) {
    console.error("获取文件列表失败", error);
    throw error;
  }
};

// 下载文件的封装函数
export const downloadFile = async (item: { name: string; folder_id: number }) => {
  try {
    const response = await api_mundo.post(
      '/api/cloud_disk/download',
      { data: { name: item.name, folder_id: item.folder_id } },
      {  headers: {Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxOSwidXNlcm5hbWUiOiJra2dvb24iLCJyb2xlIjoidXNlciIsImlzcyI6Im11bmRvLWF1dGgtaHViIiwiZXhwIjoxNzM3OTc3NDk5LCJpYXQiOjE3MzczNzI2OTl9.qGcNJRA1Z8c5sPqQHgRqqoLV0HM-Ke7sVnh3Qcu6Ldw'}}
    );
    return response.data;
  } catch (error) {
    console.error("下载文件失败", error);
    throw error;
  }
};

export const mundo_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo3LCJ1c2VybmFtZSI6IuS5neaAnSIsInJvbGUiOiJhZG1pbiIsImlzcyI6Im11bmRvLWF1dGgtaHViIiwiZXhwIjoxNzM1NDUzNjkwLCJpYXQiOjE3MzQ4NDg4OTB9.53Ng2lGsXYHa0AEAuatsWObFsAGKTHQQQzbnh5jCThQ";//登录以后拿到的token

const api_mundo = axios.create({
  baseURL:'http://116.198.207.159:12349',
  
  params: {
    "service": "mundo"
  },
  headers: {
    "Authorization": "Bearer " + mundo_token,
  },
});

api_mundo.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('请求失败:', error.response || error.message || error);
    return Promise.reject(error);
  }
);

export  const  getQuestions = async () => {
    try {
      const response = await api_mundo.get(`/faq/read`);
      return response.data.data.message.Content;
    } catch (error) {
      alert("问题列表访问失败");
      console.error("Failed to fetch questions", error);
      return [];
  }
};
  

  export const deleteChatHistory = async () => {
    try {
      const response = await api_mundo.delete(`/api/ws/delete`, {
        params: { toUid: 2 }
      });
      return response.data.message;
    } catch (error) {
      alert("删除聊天记录失败");
      console.error("Failed to delete history", error);
      return [];
    }
  };