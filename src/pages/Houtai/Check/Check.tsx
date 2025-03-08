import React, { useEffect, useState } from'react';
import styles from './Check.module.css'; 
import Post from '../../../components/review/review'; 
import axios, { AxiosError } from 'axios';

// 更新 PostData 接口以匹配新的数据类型
interface PostData {
  id: number;
  title: string;
  content: string;
  answer_count: number;
  collection: number;
  exam: boolean;
  is_completed: boolean;
  officials: boolean;
  // picture: string[] | null; // 注释掉图片相关属性
  status: string;
  tags: string[] | null;
  uid: number;
  view: number;
  rejectionReason: string; // 添加拒绝理由属性
}

//获取 longtoken 的函数，每次调用都会从 localStorage 中获取最新值
const getLongToken = () => {
  return localStorage.getItem("longtoken");
};

//创建 axios 实例用于 API 请求
const api_register = axios.create({
  baseURL: "/api", // 假设代理前缀为 /api
  //去掉默认的 Content-Type，让浏览器自动处理 FormData 的 Content-Type
  headers: {} 
});

//请求拦截器，在每次 API 请求前动态添加 Authorization 头
api_register.interceptors.request.use(config => {
  const longtoken = getLongToken();
  if (longtoken) {
    config.headers.Authorization = `Bearer ${longtoken}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

//封装通用的 API 请求函数
const makeRequest = async (url: string, method: string, body?: any): Promise<any> => {
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

//类型守卫函数
function isAxiosError(error: unknown): error is AxiosError {
  return axios.isAxiosError(error);
}

//获取待审核帖子的函数
const fetchPendingPosts = async (): Promise<any> => {
  const url = "/audit/question/posts?service=mundo";
  const maxRetries = 3; // 最大重试次数
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const result = await makeRequest(url, 'GET');
      return result;
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response) {
          // 服务器返回了响应，但状态码不是 2xx
          console.error('服务器返回错误:', error.response.status, error.response.statusText, error.response.data);
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
      retries++;
      if (retries < maxRetries) {
        console.log(`请求失败，正在进行第 ${retries + 1} 次重试...`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // 等待 1 秒后重试
      }
    }
  }

  console.error("Failed to fetch pending posts");
  return [];
};

//批准帖子的函数
const approvePost = async (postId: number): Promise<any> => {
  const url = `/audit/question/posts/${postId}/?service=mundo`; // 去掉手动添加的 /api 前缀
  const formdata = new FormData();
  formdata.append("decision", "approve");
  formdata.append("rejection_reason", ""); // 对于批准操作，这里的拒绝理由可以为空，但为了统一格式保留
  try {
    const result = await makeRequest(url, 'POST', formdata);
    return result;
  } catch (error) {
    handleError(error, '批准帖子时');
    throw error; // 抛出错误，让上层函数处理
  }
};

//拒绝帖子的函数
const rejectPost = async (postId: number, rejectionReason: string): Promise<any> => {
  const url = `/audit/question/posts/${postId}/?service=mundo`; // 去掉手动添加的 /api 前缀
  const formdata = new FormData();
  formdata.append("decision", "reject");
  formdata.append("rejection_reason", rejectionReason);
  try {
    const result = await makeRequest(url, 'POST', formdata);
    return result;
  } catch (error) {
    handleError(error, '拒绝帖子时');
    throw error; // 抛出错误，让上层函数处理
  }
};

// 统一的错误处理函数
const handleError = (error: unknown, operation: string) => {
  if (isAxiosError(error)) {
    if (error.response) {
      console.error(`${operation}服务器返回错误:`, error.response.status, error.response.statusText, error.response.data);
    } else if (error.request) {
      console.error(`${operation}没有收到服务器响应:`, error.request);
    } else {
      console.error(`${operation}请求出错:`, error.message);
    }
  } else {
    console.error(`${operation}非 Axios 错误:`, error);
  }
};

const Check: React.FC = () => {
  //用于存储帖子数据
  const [posts, setPosts] = useState<PostData[]>([]);
  //用于存储加载状态
  const [isLoading, setIsLoading] = useState<boolean>(true);
  //用于存储错误信息
  const [error, setError] = useState<string | null>(null);

  //封装获取待审核帖子的逻辑
  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    console.log('开始获取待审核帖子...');
    try {
      const result = await fetchPendingPosts();
      console.log('获取待审核帖子结果:', result);
      //检查返回结果是否包含 data 数组
      if (result && Array.isArray(result.data)) {
        const validPosts = result.data.map((post) => ({
          ...post,
           rejectionReason: '' // 初始化每个帖子的拒绝理由为空字符串
        })).filter((post): post is PostData => {
          return typeof post.id === 'number' && typeof post.title === 'string' && typeof post.content === 'string';
        });
        setPosts(validPosts);
      } else {
        console.error('服务器返回的数据格式不正确:', result);
        setError('服务器返回的数据格式不正确');
      }
    } catch (err) {
      const errorMessage = err instanceof Error? err.message : '未知错误';
      console.error('获取待审核帖子时出错:', errorMessage);
      setError('获取待审核帖子数据时出错');
    } finally {
      setIsLoading(false);
    }
  };

  //封装批准帖子的逻辑
  const handleApprovePost = async (postId: number) => {
    console.log(`开始批准帖子，帖子 ID: ${postId}`);
    try {
      await approvePost(postId);
      console.log(`帖子 ID ${postId} 批准成功，重新获取帖子数据...`);
      //批准成功后重新获取帖子数据
      await fetchPosts();
    } catch (err) {
      const errorMessage = err instanceof Error? err.message : '未知错误';
      setError('批准帖子时出错');
    }
  };

  //封装拒绝帖子的逻辑
  const handleRejectPost = async (postId: number, index: number) => {
    console.log(`开始拒绝帖子，帖子 ID: ${postId}`);
    const post = posts[index];
    const rejectionReason = post.rejectionReason;
    if (!rejectionReason.trim()) {
      console.error('拒绝理由不能为空');
      return;
    }
    try {
      await rejectPost(postId, rejectionReason);
      console.log(`帖子 ID ${postId} 拒绝成功，重新获取帖子数据...`);
      //拒绝成功后重新获取帖子数据
      await fetchPosts();
    } catch (err) {
      const errorMessage = err instanceof Error? err.message : '未知错误';
      setError('拒绝帖子时出错');
    }
  };

  //组件挂载时获取待审核帖子
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className={styles.checkContainer}>
      {isLoading && <div className={styles.loadingMessage}>正在加载...</div>}
      {error && <div className={styles.errorMessage}>{error}</div>}
      <div className={styles.reviewPageContainer}>
        {posts.map((post, index) => (
          <div className={styles.postRow} key={post.id}>
            <div className={styles.postInfo}>
              <div className={styles.postTitle}>{post.title}</div>
              <div className={styles.postContent}>{post.content}</div>
              <div className={styles.postMeta}>
                <span>回答数: {post.answer_count}</span>
                <span>收藏数: {post.collection}</span>
                <span>是否考试: {post.exam? '是' : '否'}</span>
                <span>是否完成: {post.is_completed? '是' : '否'}</span>
                <span>是否官方: {post.officials? '是' : '否'}</span>
                <span>状态: {post.status}</span>
                <span>浏览量: {post.view}</span>
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className={styles.postTags}>
                  {post.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {/* 假设图片相关功能恢复，优化图片布局 */}
              {post.picture && post.picture.length > 0 && (
                <div className={styles.postPictures}>
                  {post.picture.map((pic, picIndex) => (
                    <img key={picIndex} src={pic} alt={`Post Image ${picIndex}`} className={styles.postPicture} />
                  ))}
                </div>
              )}
            </div>
            <div className={styles.reviewActions}>
              <div className={styles.buttonGroup}>
                <button className={styles.approveButton} onClick={() => handleApprovePost(post.id)}>
                  批准
                </button>
                <button className={styles.rejectButton} onClick={() => handleRejectPost(post.id, index)}>
                  拒绝
                </button>
              </div>
              <div className={styles.rejectionReasonWrapper}>
                <label htmlFor={`rejectionReason-${post.id}`} className={styles.rejectionReasonLabel}>
                  拒绝理由:
                </label>
                <input
                  type="text"
                  id={`rejectionReason-${post.id}`}
                  placeholder="请输入拒绝理由"
                  value={post.rejectionReason}
                  onChange={(e) => {
                    const newPosts = [...posts];
                    newPosts[index].rejectionReason = e.target.value;
                    setPosts(newPosts);
                  }}
                  className={styles.rejectionReasonInput}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Check;
