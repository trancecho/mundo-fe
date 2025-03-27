import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/ui/Header/Header';
import { Input } from '@/components/ui/input';
import styles from './forum.module.css';

interface CreatePostProps {}

const CreatePost: React.FC<CreatePostProps> = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);

  const availableTags = ['学习', '竞赛', '项目', '求助', '讨论'];

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert('请填写标题和内容');
      return;
    }

    // 模拟发布帖子
    //console.log('发布帖子:', {
      title,
      content,
      tags: selectedTags,
      images
    });

    // 发布成功后跳转到论坛首页
    navigate('/forum');
  };

  return (
    <div className={styles.body}>
      <Header />
      <div className={styles.container}>
        <div className={styles.createPostForm}>
          <h2 className={styles.formTitle}>发布新帖子</h2>

          <div className={styles.formGroup}>
            <label className={styles.label}>标题</label>
            <Input
              type="text"
              placeholder="请输入标题"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>内容</label>
            <textarea
              placeholder="请输入内容"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={styles.textarea}
              rows={6}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>标签</label>
            <div className={styles.tagContainer}>
              {availableTags.map(tag => (
                <button
                  key={tag}
                  className={`${styles.tagButton} ${selectedTags.includes(tag) ? styles.tagActive : ''}`}
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>图片</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className={styles.fileInput}
            />
            <div className={styles.imagePreview}>
              {images.map((image, index) => (
                <div key={index} className={styles.previewItem}>
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`预览 ${index + 1}`}
                    className={styles.previewImage}
                  />
                  <button
                    className={styles.removeImage}
                    onClick={() => setImages(prev => prev.filter((_, i) => i !== index))}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              className={styles.cancelButton}
              onClick={() => navigate('/forum')}
            >
              取消
            </button>
            <button
              className={styles.submitButton}
              onClick={handleSubmit}
              disabled={!title.trim() || !content.trim()}
            >
              发布
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;