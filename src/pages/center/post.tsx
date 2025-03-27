import { useState, useEffect } from 'react';
import styles from './post.module.css';
import { useAuth } from '@/context/AuthContext';
import Header from "@/components/ui/Header/Header.tsx";

type FormData = {
  title: string;
  content: string;
  tags: Tag[];
  picture: File[];
};

type Tag = {
  id: number;
  name: string;
  category:string;
  description:string;
};
const Post = () => {
  const {longtoken}=useAuth();
  const [tags, setTags] = useState<Tag[]>([]); // 用 useState 管理 tags
  const [loading, setloading] = useState(false);
  const [formdata, setformdata] = useState<FormData>({
    title: '',
    content: '',
    tags: [],
    picture: [],
  });

  // 初始化 tags
    useEffect(() => {
      const fetchTags = async () => {
        try {
          const response = await fetch("http://116.198.207.159:12349/api/tags?service=mundo",{
            method: "GET",
            headers: {
              Authorization: `Bearer ${longtoken}`,
          }
        });
          if (!response.ok) {
            throw new Error(`HTTP 错误！状态码: ${response.status}`);
          }
          const responseJson = await response.json();
          const data: Tag[] = responseJson.data.tags;
          setTags(data);
        } catch (error) {
          console.error("获取标签失败:", error);
        }
      };
      fetchTags();
    }, [longtoken]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    setformdata((prevData) => ({
      ...prevData,
      [name]: files && files[0] ? [...formdata.picture, files[0]] : value, // 如果是文件，则取文件，否则取值
    }));
    //console.log(formdata);
  };

  const handleSubmit = async () => {
    if (!formdata.picture || formdata.picture.length === 0) {
      alert('请先上传图片');
      return;
    }
    const formDataToSend = new FormData();
    formDataToSend.append('title', formdata.title);
    formDataToSend.append('content', formdata.content);

    const tagNames = formdata.tags.map((tag) => tag.name); // 提取 tag 名称
    tagNames.forEach((name) => {
      formDataToSend.append('tags', name); // 每个值单独添加
    });
    formdata.picture.forEach((file) => {
      formDataToSend.append(`picture`, file);
    });
    setloading(true);
    try {
      const response = await fetch('http://116.198.207.159:12349/api/question/posts?service=mundo', {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${longtoken}`,
        },
        body:formDataToSend,
      });
      const result = await response.json();
      if (response.ok) {
        alert('上传成功');
        //console.log('上传成功：', result.data);
        setformdata({
          title: '',
          content: '',
          tags: [],
          picture: [],
        });
      }
    } catch (error) {
      console.error('上传失败：', error);
      alert('上传失败');
    } finally {
      setloading(false);
      //console.log(formdata);
    }
  };

  function handletag(tagId: number) {
    setformdata((prev) => {
      const isSelected = prev.tags.some((tag) => tag.id === tagId);
      return {
        ...prev,
        tags: isSelected
          ? prev.tags.filter((tag) => tag.id !== tagId) // 如果已选中则取消
          : [...prev.tags, { id: tagId, name: tags[tagId-1].name,category:tags[tagId-1].category,description:tags[tagId-1].description}], // 如果未选中则添加
      };
    });
  }

  return (
    <>
    <Header/>
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
                  formdata.tags.some((t) => t.id === tag.id)
                    ? styles['tag-click']
                    : styles.tag
                }
                onClick={() => handletag(tag.id)}
              >
                {tag.name}
              </span>
            ))}
          </div>
          <h3>问题描述</h3>
          <textarea
            name="content"
            className={styles.textarea1}
            value={formdata.content}
            onChange={handleChange}
          />
          <div>
            <h3>问题图片：</h3>
            <input
              type="file"
              accept="image/*"
              name="picture"
              onChange={handleChange}
              style={{ display: 'none' }}
              id="fileUpload"
            />
            <label htmlFor="fileUpload" style={{ cursor: 'pointer' }}>
              <span className="material-symbols-outlined">add_photo_alternate</span>
            </label>
            <button
              type="button"
              onClick={() =>
                setformdata((prev) => ({ ...prev, picture: [] }))
              }
              className={styles.delete}
            >
              <span className="material-symbols-outlined">delete</span>
            </button>
            {formdata.picture.length > 0 && (
              <div className={styles['image-preview']}>
                <h3>图片预览：</h3>
                {formdata.picture.map((photo, index) => (
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
          {formdata.picture.length === 0 && <p className={styles.p1}>尚未选择图片</p>}
        </div>
      </form>
    </div>
    </>
  );
};

export default Post;
