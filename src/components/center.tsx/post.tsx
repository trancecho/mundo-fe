import { useState, useEffect } from 'react';
import styles from './post.module.css'; // 模块化 CSS

type FormData = {
  title: string;
  describtion: string;
  tag: Tag[];
  photo: File[];
};

type Tag = {
  id: number;
  name: string;
};

const Post = () => {
  const [tags, setTags] = useState<Tag[]>([]); // 用 useState 管理 tags
  const [loading, setloading] = useState(false);
  const [formdata, setformdata] = useState<FormData>({
    title: '',
    describtion: '',
    tag: [],
    photo: [],
  });

  // 正确使用 useEffect，初始化 tags
  useEffect(() => {
    const fetchedTags: Tag[] = [
      { id: 1, name: '高数' },
      { id: 2, name: '线代' },
      { id: 3, name: '概率论' },
    ];
    setTags(fetchedTags);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    setformdata((prevData) => ({
      ...prevData,
      [name]: files && files[0] ? [...formdata.photo, files[0]] : value, // 如果是文件，则取文件，否则取值
    }));
  };

  const handleSubmit = async () => {
    if (!formdata.photo || formdata.title.length === 0) {
      alert('请先输入标题');
      return;
    }

    const submissionData = new FormData();
    submissionData.append('title', formdata.title);
    submissionData.append('describtion', formdata.describtion);
    formdata.tag.forEach((photo, index) => {
      submissionData.append(
        `tag_${index}`,
        JSON.stringify({ name: photo.name, id: photo.id })
      );
    });
    formdata.photo.forEach((photo, index) => {
      submissionData.append(`photo_${index}`, photo, photo.name);
    });
    setloading(true);
    try {
      const response = await fetch('https://your-api-endpoint.com/upload', {
        method: 'POST',
        body: submissionData,
      });
      const result = await response.json();
      alert('上传成功');
      console.log('上传成功：', result);
    } catch (error) {
      console.error('上传失败：', error);
      alert('上传失败');
    } finally {
      setloading(false);
    }
  };

  function handletag(tagId: number, tagName: string) {
    setformdata((prev) => {
      const isSelected = prev.tag.some((tag) => tag.id === tagId);
      return {
        ...prev,
        tag: isSelected
          ? prev.tag.filter((tag) => tag.id !== tagId) // 如果已选中则取消
          : [...prev.tag, { id: tagId, name: tagName }], // 如果未选中则添加
      };
    });
  }

  return (
    <div className={styles.body} style={{all: 'initial'}}>
      <form className={styles.form}>
        <div className={styles.head}>
          <h2 className={styles.h21}>新建问题</h2>
        </div>
        <div className={styles.command}>
          <button
            className={styles.submit}
            type="button"
            onClick={handleSubmit}
          >
            {loading ? (
              <div className={styles.box}>
                <div className={styles.spinner}></div>
              </div>
            ) : (
              <span className={styles.span}>发布帖子</span>
            )}
          </button>
        </div>
        <div className={styles['markdown-app']}>
          <h3>问题标题</h3>
          <input
            type="text"
            name="title"
            className={styles.title1}
            value={formdata.title}
            onChange={handleChange}
          />
          <div>
            <h3 className={styles.h3}>问题标签：</h3>
            {tags.map((tag) => (
              <span
                key={tag.id}
                className={
                  formdata.tag.some((t) => t.id === tag.id)
                    ? styles['tag-click']
                    : styles.tag
                }
                onClick={() => handletag(tag.id, tag.name)}
              >
                {tag.name}
              </span>
            ))}
          </div>
          <h3>问题描述</h3>
          <textarea
            name="describtion"
            className={styles.textarea1}
            value={formdata.describtion}
            onChange={handleChange}
          />
          <div>
            <h3>问题图片：</h3>
            <input
              type="file"
              accept="image/*"
              name="photo"
              onChange={handleChange}
              style={{ display: 'none' }}
              id="fileUpload"
            />
            <label htmlFor="fileUpload" style={{ cursor: 'pointer' }}>
              <span className="material-symbols-outlined">add_circle</span>
            </label>
            <button
              type="button"
              onClick={() =>
                setformdata((prev) => ({ ...prev, photo: [] }))
              }
              className={styles.delete}
            >
              <span className="material-symbols-outlined">delete</span>
            </button>
            {formdata.photo.length > 0 && (
              <div className={styles['image-preview']}>
                <h3>图片预览：</h3>
                {formdata.photo.map((photo, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(photo)}
                    alt={`图片预览 ${index + 1}`}
                    style={{ width: 200, marginTop: '10px' }}
                  />
                ))}
              </div>
            )}
          </div>
          {formdata.photo.length === 0 && <p className={styles.p1}>尚未选择图片</p>}
        </div>
      </form>
    </div>
  );
};

export default Post;
