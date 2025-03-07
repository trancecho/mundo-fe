import React, { useEffect, useState } from 'react';
import styles from './Check.module.css'; 
import Post from '../../../components/review/review'; 
import axios, { AxiosError } from 'axios';

interface PostData {
  id: number;
  title: string;
  description: string;
  tags?: { id: number; name: string }[];
  photos?: string[];
}

// 获取 longtoken 的函数，每次调用都会从 localStorage 中获取最新值
const getLongToken = () => {
  return localStorage.getItem("longtoken");
};

// 创建 axios 实例
const api_register = axios.create({
  baseURL: "http://116.198.207.159:12349/api",
  headers: {
    "Content-Type": "application/json"
  }
});

// 请求拦截器，在每次请求前动态添加 Authorization 头
api_register.interceptors.request.use(config => {
  const longtoken = getLongToken();
  if (longtoken) {
    config.headers.Authorization = `Bearer ${longtoken}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// 封装通用的请求函数
const makeRequest = async (url: string, method: string, body?: any) => {
  try {
    const response = await api_register({
      url,
      method,
      data: body
    });
    return response.data;
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
};

// 类型守卫函数
function isAxiosError(error: unknown): error is AxiosError {
  return axios.isAxiosError(error);
}

// 获取待审核帖子的函数
const fetchPendingPosts = async () => {
  const url = "/audit/question/posts?service=mundo";
  try {
    const result = await makeRequest(url, 'GET');
    return result;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response) {
        // 服务器返回了响应，但状态码不是 2xx
        console.error('服务器返回错误:', error.response.data);
      } else if (error.request) {
        // 请求发送了，但没有收到响应
        console.error('没有收到服务器响应:', error.request);
      } else {
        // 其他错误
        console.error('请求出错:', error.message);
      }
    } else {
      console.error('非 Axios 错误:', error);
    }
    alert("待审核帖子列表访问失败");
    console.error("Failed to fetch pending posts", error);
    return [];
  }
};

// 批准帖子的函数
const approvePost = async (postId: number) => {
  const url = `/audit/question/posts/${postId}/?service=mundo`;
  const formdata = new FormData();
  formdata.append("decision", "approve");
  formdata.append("rejection_reason", "");
  try {
    const result = await makeRequest(url, 'POST', formdata);
    return result;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response) {
        console.error('批准帖子时服务器返回错误:', error.response.data);
      } else if (error.request) {
        console.error('批准帖子时没有收到服务器响应:', error.request);
      } else {
        console.error('批准帖子时请求出错:', error.message);
      }
    } else {
      console.error('批准帖子时非 Axios 错误:', error);
    }
    alert("帖子批准操作失败");
    console.error("Failed to approve post", error);
    return null;
  }
};

const Check: React.FC = () => {
  // 用于存储帖子数据
  const [posts, setPosts] = useState<PostData[]>([]);
  // 用于存储加载状态
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // 用于存储错误信息
  const [error, setError] = useState<string | null>(null);

 // 封装获取待审核帖子的逻辑
const fetchPosts = async () => {
  setIsLoading(true);
  setError(null);
  console.log('开始获取待审核帖子...');
  try {
    const result = await fetchPendingPosts();
    console.log('获取待审核帖子结果:', result);
    // 检查返回结果是否包含 data 数组
    if (result && Array.isArray(result.data)) {
      const validPosts = result.data.filter((post): post is PostData => {
        return typeof post.id === 'number' && typeof post.title === 'string' && typeof post.content === 'string';
      });
      setPosts(validPosts);
    } else {
      console.error('服务器返回的数据格式不正确:', result);
      setError('服务器返回的数据格式不正确');
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : '未知错误';
    console.error('获取待审核帖子时出错:', errorMessage);
    setError('获取待审核帖子数据时出错');
  } finally {
    setIsLoading(false);
  }
};

  // 封装批准帖子的逻辑
  const handleApprovePost = async (postId: number) => {
    console.log(`开始批准帖子，帖子 ID: ${postId}`);
    try {
      await approvePost(postId);
      console.log(`帖子 ID ${postId} 批准成功，重新获取帖子数据...`);
      // 批准成功后重新获取帖子数据
      await fetchPosts();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误';
      console.error(`批准帖子 ID ${postId} 时出错:`, errorMessage);
      setError('批准帖子时出错');
    }
  };

  // 组件挂载时获取待审核帖子
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className={styles.checkContainer}>
      {isLoading && <div className={styles.loadingMessage}>正在加载...</div>}
      {error && <div className={styles.errorMessage}>{error}</div>}
      <div className={styles.reviewPageContainer}>
        {posts.map((post) => (
          <div className={styles.postRow} key={post.id}>
            {/* 使用类型断言绕过类型检查 */}
            <Post 
              postData={post} 
              onApprove={() => handleApprovePost(post.id)} 
              // @ts-ignore
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Check;
