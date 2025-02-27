import React, { useEffect, useState } from 'react';
import styles from './Check.module.css'; 
import Post from '../../../components/review/review'; 

interface PostData {
  id: number;
  title: string;
  description: string;
  tags?: { id: number; name: string }[];
  photos?: string[];
}

const getHeaders = () => {
  const myHeaders = new Headers();
  myHeaders.append("User-Agent", "Apifox/1.0.0 (https://apifox.com)");
  myHeaders.append("Authorization", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNiwidXNlcm5hbWUiOiJqdWljZSIsInJvbGUiOiJ1c2VyIiwiaXNzIjoibXVuZG8tYXV0aC1odWIiLCJleHAiOjE3MzUzNjk3NzgsImlhdCI6MTczNDc2NDk3OH0.sttCChl7GPiSJo02X1aEODd_ic8_faPTCd_Wrtf0a5A");
  return myHeaders;
};

const Check: React.FC = () => {
  const [posts, setPosts] = useState<PostData[]>([]); // 初始化为空数组
  const [error, setError] = useState<string | null>(null);

  const fetchPendingPosts = async () => {
    const headers = getHeaders();
    const requestOptions = {
      method: 'GET',
      headers,
      redirect: 'follow'
    };

    try {
      const response = await fetch("http://116.198.207.159:12349/api/audit/question/posts?service=mundo", requestOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      // 确保 result 是一个数组
      if (Array.isArray(result)) {
        // 进一步检查每个元素是否符合 PostData 接口
        const validPosts = result.filter((post): post is PostData => {
          return typeof post.id === 'number' && typeof post.title === 'string' && typeof post.description === 'string';
        });
        setPosts(validPosts);
      } else {
        console.error('服务器返回的数据不是数组:', result);
        setError('服务器返回的数据格式不正确');
      }
    } catch (error) {
      console.log('error', error);
      setError('获取待审核帖子数据时出错');
    }
  };

  const approvePost = async (postId: number) => {
    const headers = getHeaders();
    const formdata = new FormData();
    formdata.append("decision", "approve");
    formdata.append("rejection_reason", "");

    const requestOptions = {
      method: 'POST',
      headers,
      body: formdata,
      redirect: 'follow'
    };

    try {
      const response = await fetch(`http://116.198.207.159:12349/api/audit/question/posts/${postId}/?service=mundo`, requestOptions);
      const result = await response.json();
      console.log(result);
      fetchPendingPosts();
    } catch (error) {
      console.log('error', error);
      setError('批准帖子时出错');
    }
  };

  useEffect(() => {
    fetchPendingPosts();
  }, []);

  return (
    <div className={styles.checkContainer}>
      {error && <div className={styles.errorMessage}>{error}</div>}
      <div className={styles.reviewPageContainer}>
        {posts.map((post) => (
          <div className={styles.postRow} key={post.id}>
            <Post postData={post} onApprove={() => approvePost(post.id)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Check;
