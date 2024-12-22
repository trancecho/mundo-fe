import React from 'react';
import Post from '../../components/review/review'; // Import the Post component
import styles from './review.module.css';

interface PostData {
  id: number;
  title: string;
  description: string;
  tags?: { id: number; name: string }[];
  photos?: string[];
}

const mockPostData: PostData[] = [
  {
    id: 1,
    title: '示例帖子 1',
    description: '这是第一个待审核的帖子内容，展示帖子的详细描述。',
  },
  {
    id: 2,
    title: '示例帖子 2',
    description: '这是第二个待审核的帖子内容，展示帖子的详细描述。',
  },
  {
    id: 3,
    title: '示例帖子 3',
    description: '这是第三个待审核的帖子内容，展示帖子的详细描述。',
  },
];

const ReviewPage: React.FC = () => {
  return (
    <div className={styles.reviewPageContainer}>
      {mockPostData.map((post) => (
        <div className={styles.postRow} key={post.id}>
          <Post postData={post} />
        </div>
      ))}
    </div>
  );
};

export default ReviewPage;


