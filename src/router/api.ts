// api.ts
import axios from "axios";

const authApi = axios.create({
  // baseURL : "https://auth.altar-echo.top/api",
  baseURL: import.meta.env.VITE_authURL,
  headers: {
    "Content-Type": "application/json",
  },
});
export const longtoken = localStorage.getItem("longtoken");
console.log("Token:", longtoken);
const api = axios.create({
  // baseURL: "http://116.198.207.159:12349/api",
  baseURL: import.meta.env.VITE_baseURL,

  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + longtoken, // 登录所需token
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("请求失败:", error.response || error.message || error);
    return Promise.reject(error);
  }
);

// 发送注册请求，发送邮箱验证码
export const registerUser = async ( 
  username: string,
  email: string,
  callback_url: string,
  external?: string
) => {
  const response = await authApi.post("/register/v2", {
    username,
    email,
    external,
    callback_url,
  });
  return response.data;
};

// 找回密码
export const sendResetEmail = async (email: string, callback_url: string) => {
  const response = await authApi.post("/find/email", {
    email,
    callback_url,
  });
  return response.data;
};

// 激活用户邮箱
export const verifyEmail = async (
  email: string,
  token: string,
  password: string
) => {
  const response = await authApi.post("/verify/v2", {
    email,
    token,
    password,
  });
  return response.data;
};

// 重置用户密码
export const ResetKey = async (
  email: string,
  token: string,
  newPassword: string
) => {
  const response = await authApi.post("/find/verify", {
    email,
    token,
    newPassword,
  });
  return response.data;
};

// 邮箱密码登录函数
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await authApi.post("/login", {
      email,
      password,
    });
    return response.data; // 返回响应数据
  } catch (error) {
    console.error("登录失败:", error);
    throw error; // 将错误抛出，以便在调用处处理
  }
};

// 获取微信二维码登录地址
export const getWechatLoginQR = async () => {
  try {
    const response = await authApi.get("/wechat/login");
    return response.data;
  } catch (error) {
    console.error("获取微信二维码失败:", error);
    throw error;
  }
};

// 查询微信扫码登录状态
export const checkWechatLoginCallback = async (ticket: string) => {
  try {
    const response = await authApi.get("/wechat/login/callback", {
      params: {
        ticket,
        service: "mundo",
      },
    });
    return response.data;
  } catch (error) {
    console.error("查询扫码登录状态失败:", error);
    throw error;
  }
};

// 查询helper登录状态
export const checkHelperLoginCallback = async (state: string, code: string) => {
  try {
    const response = await authApi.post("/user/third/hduhelp/callback", {
      state,
      code,
      service: "mundo",
    });
    return response.data;
  } catch (error) {
    console.error("查询helper登录状态失败:", error);
    throw error;
  }
};
// 绑定邮箱-微信
export const bindWeChatEmail = async (token: string) => {
  try {
    const response = await authApi.get("/wechat/bind", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    //console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("绑定邮箱token失败", error);
    throw error;
  }
};

// 绑定邮箱-杭助
export const bindHDUEmail = async (
  token: string,
  state: string,
  code: string
) => {
  //console.log(token, state, code);
  try {
    const response = await authApi.post(
      "/hduhelp/bind",
      {
        state,
        code,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    //console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("绑定HDUtoken失败", error);
    throw error;
  }
};

// 获取好友列表
export const getFriendsList = async (token: string) => {
  try {
    const response = await api.get("/friends", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return response.data;
  } catch (error) {
    console.error("获取好友列表失败：", error);
    throw error;
  }
};


// 获取个人信息
export const getProfile = async (token: string) => {
  try {
    const response = await authApi.get(
      "/profile",
      {
        headers: {
          Authorization: "Bearer " + token,
        }
      });
    return response.data;
  } catch (error) {
    console.error("获取个人队伍信息失败：", error);
    throw error;
  }
}
// 查看头像
export const getAvatar = async (token: string): Promise<Blob | null> => {
  try {
    const response = await authApi.get("/avatar", {
      headers: {
        Authorization: "Bearer " + token,
      },
      responseType: "blob",
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 500) {
      console.error("用户没有头像，使用默认头像");
      return null;
    }
    console.error("获取头像失败：", error);
    throw error;
  }
};


//生成头像
export const generateAvatar = async (token: string) => {
  try {
    const response = await authApi.get(
      "/avatar/generate",
      {
        headers: {
          Authorization: "Bearer " + token,
        }
      });
    return response.data;
  } catch (error) {
    console.error("获取头像失败：", error);
    throw error;
  }
}

// 更新头像
export const updateAvatar = async (token: string, avatar: File) => {
  try {
    const formData = new FormData();
    formData.append("avatar", avatar);
    const response = await authApi.post(
      "/avatar/upload?service=mundo",
      formData,
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "multipart/form-data",
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("更新头像失败：", error);
  }
};

// 更新个人信息
export const updatePerson = async (token: string, name: string) => {
  try {
    const response = await authApi.put(
      "/profile",
      { name },
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json", // 改为 JSON 格式
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("更新个人信息出错：", error);
    throw error;
  }
};

// 创建队伍
export const addTeam = async (token: string, name: string, now_number:number,number: number, introduction: string, require: string, contact: string) => {
  try {
    const response = await api.post(
      "/myteam",
      {
        name,
        number,
        introduction,
        require,
        contact,
        now_number
      },
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("创建队伍出错：", error);
  }
}

// 更新队伍
export const updateTeam = async (token: string, id:number ,name: string, now_number:number,number: number, introduction: string, require: string, contact: string) => {
  try {
    const response = await api.put(
      "/myteam",
      {
        id,
        name,
        number,
        introduction,
        require,
        contact,
        now_number
      },
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("创建队伍出错：", error);
  }
}
//获取我的队伍
export const getMyTeam = async (token: string) => {
  try {
    const response = await api.get(
      "/myteam",
      {
        headers: {
          Authorization: "Bearer " + token,
        }
      });
    return response.data?.data?.message1?.Content;
  } catch (error) {
    console.error("获取个人队伍信息失败：", error);
    throw error;
  }
}

export const getTasks = async () => {
  const response = await api.get("/tasks");
  return response.data.data.tasks;
};

export const createTask = async (name: string, totalTime: number) => {
  const response = await api.post("/tasks", {
    name: name,
    total_time: totalTime,
  });
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

// const api = axios.create({
//   baseURL: "http://116.198.207.159:12349/api",

//   headers: {
//     "Content-Type": "application/json",
//     Authorization: "Bearer " + longtoken, // localstroage中的token
//   },
// });

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error("请求失败:", error.response || error.message || error);
//     return Promise.reject(error);
//   }
// );

//获取答疑首页所有帖子
export const getAllPost = async () => {
  try {
    const response = await api.get("/question/post", {
      headers: {
        Authorization: "Bearer " + longtoken,
      },
    });
    return response.data;
  } catch (error) {
    console.error("获取帖子列表失败:", error);
    throw error;
  }
};

//获取文件列表
export const getFileList = async (name: string) => {
  try {
    const response = await api.get(`/files`, {
      params: { name },
      headers: {
        Authorization: "Bearer " + longtoken,
      },
    });
    return response.data.data.files; // 返回的数据结构
  } catch (error) {
    console.error("获取文件列表失败", error);
    throw error;
  }
};

// 下载文件的封装函数
export const downloadFile = async (item: {
  name: string;
  folder_id: number;
}) => {
  try {
    const response = await api.post(
      "/cloud_disk/download",
      { name: item.name, folder_id: item.folder_id },
      { headers: { Authorization: `Bearer ${longtoken}` } }
    );
    return response.data;
  } catch (error) {
    console.error("下载文件失败", error);
    throw error;
  }
};

export const deleteChatHistory = async () => {
  try {
    const response = await api.delete(`/ws/delete`, {
      params: { toUid: 2 },
    });
    return response.data.message;
  } catch (error) {
    alert("删除聊天记录失败");
    console.error("Failed to delete history", error);
    return [];
  }
};

//读取常见问题。后端说是url有问题，所以这里单独配置接口
export const getQuestions = async () => {
  try {
    const response = await axios.get("http://116.198.207.159:12349/faq/read", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + longtoken,
      },
    });
    return response.data.data.message.Content;
  } catch (error) {
    alert("问题列表访问失败");
    console.error("Failed to fetch questions", error);
    return [];
  }
};

// 创建常见问题
export const createQuestion = async (question: string, answer: string) => {
  try {
    const response = await api.post("/faq/create", {
      question,
      answer,
    });
    alert("创建成功");
    return response.data.data;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || "创建问题失败";
    alert(errorMessage);
    console.error("创建失败", error);
    return [];
  }
};

// 更新常见问题
export const updateQuestion = async (
  question: string,
  newQuestion: string,
  newAnswer: string
) => {
  try {
    const response = await api.post("/faq/update", {
      question,
      newQuestion,
      newAnswer,
    });
    alert("更新成功");
    return response.data.data;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || "更新问题失败";
    alert(errorMessage);
    console.error("更新失败", error);
    return [];
  }
};

// 删除常见问题
export const deleteQuestion = async (question: string) => {
  try {
    const response = await api.delete("/faq/delete", {
      data: { question },
    });
    alert("删除成功");
    return response.data.data;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || "删除问题失败";
    alert(errorMessage);
    console.error("删除失败", error);
    return [];
  }
};

// 创建文件夹
export const createFolder = async (name: string, parentFolderId: number) => {
  await api.post("/cloud_disk/folder", {
    name: name,
    parent_folder_id: parentFolderId, // 必需的父文件夹 ID
  });
};

// 获取当前文件夹下文件夹
export const getFolder = async (id: string) => {
  const response = await api.get("/cloud_disk/folder", {
    params: {
      id: id,
    },
  });
  return response.data.data.folders;
};

//修改文件夹名字
export const updateFolder = async (name: string, id: number) => {
  await api.put("/cloud_disk/folder", {
    id: id,
    name: name,
  });
};

// 删除文件夹
export const deleteFolder = async (id: number) => {
  await api.delete("/cloud_disk/folder", {
    data: { id: id },
  });
};

// 搜索文件夹
export const searchFolder = async (name: string, parentFolderId: string) => {
  const response = await api.post("/cloud_disk/folder", {
    name: name,
    parent_folder_id: parentFolderId,
  });
  return response.data.data.folders;
};

// 删除文件
export const deleteFile = async (id: number) => {
  await api.delete(`/cloud_disk/file`, {
    data: { id: id },
  }); // 删除文件
};

// 上传文件到指定文件夹
export const uploadFile = async (
  file: File,
  name: string,
  folderId: string
) => {
  const formData = new FormData();
  formData.append("file", file); // 添加文件
  formData.append("name", name); // 添加文件名
  formData.append("folder_id", folderId); // 添加文件夹ID

  // 发送 POST 请求
  await api.post("/cloud_disk/file", formData, {
    headers: {
      "Content-Type": "multipart/form-data", // 明确设置为 multipart/form-data
    },
  });
};

// 修改文件名称
export const updateFile = async (id: number, name: string) => {
  await api.put(`/cloud_disk/file`, {
    name: name,
    id: id,
  });
};

export const getFiles = async (id: string) => {
  const response = await api.get("/cloud_disk/file", {
    params: {
      id: id,
    },
  });
  return response.data.data.files;
};

export const getFileUrl = async (
  folderId: number,
  names: string
): Promise<any> => {
  // 构建请求体
  const response = await api.post("/cloud_disk/download", {
    folder_id: folderId,
    names: names,
  });
  return response.data.data.urls;
};

export const getparentFolderId = async (id: string) => {
  const response = await api.get("/cloud_disk/folder", {
    params: {
      id: id,
    },
  });
  return response.data.data.parent_folder_id;
};


// 获取消息列表
export const getMessages = async (
  filter: string,
  page: number,
  pageSize: number,
  category?: string
) => {
  try {
    const response = await api.get("/question/post", {
      params: {
        filter,
        page,
        page_size: pageSize,
        category,
      },
    });
    return response.data;
  } catch (error) {
    console.error("获取消息列表失败:", error);
    throw error;
  }

};

export const getteamup = async ()=>{
  const response = await api.get("/allteam?service=mundo", {
    headers: {
      'Authorization': `Bearer ${longtoken}`
    }
  });
  console.log(response)
  return response;
}

export const apply = async (id:number) => {
  const response = await api.post(
    '/allteam?ID=1&service=mundo',
    { id: id },
    {
      headers: {
        Authorization: `Bearer ${longtoken}`,
      }
    }
  );
  alert(response.data.message)
  return response;
}

export const fetchTags = async () => {
      const response = await api.get('/tags?service=mundo', {
          headers: {
              Authorization: `Bearer ${longtoken}`
          }
      });
      console.log(response);
      return response;
};

export const post = (formDataToSend: FormData): Promise<AxiosResponse> => {
  return new Promise((resolve, reject) => {
      api.post(
          '/question/posts?service=mundo',
          formDataToSend,
          {
              headers: {
                  Authorization: `Bearer ${longtoken}`,
                  'Content-Type': 'multipart/form-data',
              }
          }
      )
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
};

export const getDetail = async (id:number) => {
  const response = await api.get(`/question/posts/${id}?service=mundo`, {
      headers: {
          Authorization: `Bearer ${longtoken}`
      }
  });
  return response;
};

export const sendAnswer =async (id:number,formDataToSend:FormData) => {
  const response = await api.post(`/question/posts/${id}/answers?service=mundo`,formDataToSend,{
    headers: {
        "Authorization": `Bearer ${longtoken}`,
        "Content-Type":"multipart/form-data"
    },
});
 return response;
}