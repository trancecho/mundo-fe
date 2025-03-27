import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/ui/Header/Header';
import styles from './CreatorCenter.module.css';
import { fetchTags,post } from "../../router/api";
type ContentType = 'qanda' | 'article' | 'team' | 'resource';

interface ContentForm {
    title: string;
    content: string;
    type: ContentType;
    tags: Tag[];
    files: File[];
}

type Tag = {
    id: number;
    name: string;
    category: string;
    description: string;
};

const CreatorCenter: React.FC = () => {
    const { longtoken } = useAuth();
    const [activeType, setActiveType] = useState<ContentType>('qanda');
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<ContentForm>({
        title: '',
        content: '',
        type: 'qanda',
        tags: [],
        files: []
    });

    // 内容类型配置
    const contentTypes = [
        { id: 'qanda', name: '问答', icon: '❓' },
        { id: 'article', name: '文章', icon: '📝' },
        { id: 'team', name: '组队', icon: '👥' },
        { id: 'resource', name: '资料', icon: '📚' }
    ];

    // 获取标签
    React.useEffect(() => {
        fetchTags().then((res)=>{
            setTags(res.data.data.tags);
        });
    }, [longtoken]);

    const handleTypeChange = (type: ContentType) => {
        setActiveType(type);
        setFormData(prev => ({ ...prev, type }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFormData(prev => ({
                ...prev,
                files: [...prev.files, ...Array.from(e.target.files!)]
            }));
        }
    };

    const handleTagToggle = (tag: Tag) => {
        setFormData(prev => {
            const isSelected = prev.tags.some(t => t.id === tag.id);
            return {
                ...prev,
                tags: isSelected
                    ? prev.tags.filter(t => t.id !== tag.id)
                    : [...prev.tags, tag]
            };
        });
    };

    const handleSubmit = async () => {
            setLoading(true);
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('content', formData.content);
            formDataToSend.append('type', formData.type);
            formData.tags.forEach(tag => {
                formDataToSend.append('tags', tag.name);
            });
            formData.files.forEach(file => {
                formDataToSend.append('files', file);
            });
            post(formDataToSend).then(res=>{
                if (res.status !== 200) {
                    alert("发布失败");
                    throw new Error("发布失败");
                }
                alert('发布成功！');
                setFormData({
                    title: '',
                    content: '',
                    type: activeType,
                    tags: [],
                    files: []
                });
            })
            .then(() => {
                setLoading(false);
            });
    };

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.creatorCenter}>
                <div className={styles.contentTypeSelector}>
                    {contentTypes.map(type => (
                        <button
                            key={type.id}
                            className={`${styles.typeButton} ${activeType === type.id ? styles.active : ''}`}
                            onClick={() => handleTypeChange(type.id as ContentType)}
                        >
                            <span className={styles.typeIcon}>{type.icon}</span>
                            <span className={styles.typeName}>{type.name}</span>
                        </button>
                    ))}
                </div>

                <div className={styles.editorContainer}>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="输入标题"
                        className={styles.titleInput}
                    />

                    <div className={styles.tagContainer}>
                        {tags.map(tag => (
                            <span
                                key={tag.id}
                                className={`${styles.tag} ${formData.tags.some(t => t.id === tag.id) ? styles.tagActive : ''}`}
                                onClick={() => handleTagToggle(tag)}
                            >
                {tag.name}
              </span>
                        ))}
                    </div>

                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        placeholder="输入内容"
                        className={styles.contentInput}
                    />

                    <div className={styles.fileUpload}>
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className={styles.fileInput}
                            id="fileUpload"
                        />
                        <label htmlFor="fileUpload" className={styles.fileLabel}>
                            <span className={styles.uploadIcon}>📎</span>
                            上传文件
                        </label>
                    </div>

                    {formData.files.length > 0 && (
                        <div className={styles.filePreview}>
                            {formData.files.map((file, index) => (
                                <div key={index} className={styles.fileItem}>
                                    {file.type.startsWith('image/') ? (
                                        <img src={URL.createObjectURL(file)} alt={file.name} />
                                    ) : (
                                        <span className={styles.fileName}>{file.name}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <button
                        className={styles.submitButton}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <div className={styles.loadingSpinner}></div>
                        ) : (
                            '发布内容'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreatorCenter;