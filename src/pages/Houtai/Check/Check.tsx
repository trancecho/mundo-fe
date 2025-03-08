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
    picture: string[] | null;
    status: string;
    tags: string[] | null;
    uid: number;
    view: number;
    rejectionReason: string;
}

// 定义更新请求数据类型
interface UpdateRequestData {
    id: number;
    [key: string]: any;
}

// 定义回答数据类型
interface AnswerData {
    id: number;
    [key: string]: any;
}

const deleteUnnecessaryCookies = () => {
    const unnecessaryCookies = ['exampleCookie', 'otherUnnecessaryCookie']; // 列出所有不必要的 Cookie 名称
    unnecessaryCookies.forEach(cookieName => {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    });
};

const getLongToken = () => {
    return localStorage.getItem("longtoken");
};

const api_register = axios.create({
    baseURL: "/api",
    headers: {}
});

api_register.interceptors.request.use(config => {
    const longtoken = getLongToken();
    if (longtoken &&!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${longtoken}`;
    }
    delete config.headers['unnecessary-header'];

    // 添加调试信息，打印请求头大小
    const headerSize = JSON.stringify(config.headers).length;
    console.log(`Request header size: ${headerSize}`);
    return config;
}, error => {
    return Promise.reject(error);
});

// 类型守卫函数
function isAxiosError(error: unknown): error is AxiosError {
    return axios.isAxiosError(error);
}

// 获取待审核帖子及图片的函数
const fetchPendingPosts = async () => {
    try {
        const response = await api_register.get("http://116.198.207.159:12349/api/audit/question/posts");
        const data = response.data;
        console.log('获取到的待审核帖子内容:', data); // 打印获取到的帖子内容
        return data;
    } catch (error) {
        console.error('获取消息数据失败', error);
        return [];
    }
};

// 批准帖子的函数
const approvePost = async (postId: number): Promise<any> => {
    const url = `/audit/question/posts/${postId}/?service=mundo`;
    const formdata = new FormData();
    formdata.append("decision", "approve");
    formdata.append("rejection_reason", "");
    try {
        const response = await api_register.post(url, formdata);
        return response.data;
    } catch (error) {
        handleError(error, '批准帖子时');
        throw error;
    }
};

// 拒绝帖子的函数
const rejectPost = async (postId: number, rejectionReason: string): Promise<any> => {
    const url = `/audit/question/posts/${postId}/`;
    const formdata = new FormData();
    formdata.append("decision", "reject");
    formdata.append("rejection_reason", rejectionReason);
    try {
        const response = await api_register.post(url, formdata);
        return response.data;
    } catch (error) {
        handleError(error, '拒绝帖子时');
        throw error;
    }
};

// 获取待审核更新请求的函数
const fetchPendingUpdateRequests = async () => {
    try {
        const response = await api_register.get("http://116.198.207.159:12349/api/audit/update/requests");
        return response.data;
    } catch (error) {
        console.error('获取待审核更新请求失败', error);
        return [];
    }
};

// 审核更新请求的函数
const reviewUpdateRequest = async (requestId: number, decision: string, rejectionReason: string) => {
    const url = `/audit/update/requests/${requestId}`;
    const formdata = new FormData();
    formdata.append("decision", decision);
    formdata.append("rejection_reason", rejectionReason);
    try {
        const response = await api_register.post(url, formdata);
        return response.data;
    } catch (error) {
        handleError(error, '审核更新请求时');
        throw error;
    }
};

// 获取待审核回答的函数
const fetchPendingAnswers = async () => {
    try {
        const response = await api_register.get("http://116.198.207.159:12349/api/audit/answer");
        return response.data;
    } catch (error) {
        console.error('获取待审核回答失败', error);
        return [];
    }
};

// 审核回答的函数
const reviewAnswer = async (answerId: number, decision: string, rejectionReason: string) => {
    const url = `/audit/answer/${answerId}`;
    const formdata = new FormData();
    formdata.append("decision", decision);
    formdata.append("rejection_reason", rejectionReason);
    try {
        const response = await api_register.post(url, formdata);
        return response.data;
    } catch (error) {
        handleError(error, '审核回答时');
        throw error;
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

// 处理 Base64 图片的组件
const SecureImage: React.FC<{ image: string }> = ({ image }) => {
    function base64ToBlobUrl(image: string) {
        let mimeType = "image/jpeg"; // 默认值
        if (image.startsWith("/9j/")) mimeType = "image/jpeg"; // JPG
        if (image.startsWith("iVBORw0KGgo")) mimeType = "image/png"; // PNG

        const byteCharacters = atob(image);
        const byteArrays = [];
        for (let i = 0; i < byteCharacters.length; i += 512) {
            const slice = byteCharacters.slice(i, i + 512);
            const byteNumbers = new Array(slice.length);
            for (let j = 0; j < slice.length; j++) {
                byteNumbers[j] = slice.charCodeAt(j);
            }
            byteArrays.push(new Uint8Array(byteNumbers));
        }
        const blob = new Blob(byteArrays, { type: mimeType });
        return URL.createObjectURL(blob);
    }

    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        const url = base64ToBlobUrl(image);
        setImageUrl(url);
        return () => URL.revokeObjectURL(url); // 组件卸载时释放 URL
    }, [image]);

    return imageUrl? <img src={imageUrl} alt="Image" className={styles.postPicture} /> : <p>加载中...</p>;
};

const Check: React.FC = () => {
    const [posts, setPosts] = useState<PostData[]>([]);
    const [updateRequests, setUpdateRequests] = useState<UpdateRequestData[]>([]);
    const [answers, setAnswers] = useState<AnswerData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAllData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [postResult, updateRequestResult, answerResult] = await Promise.all([
                fetchPendingPosts(),
                fetchPendingUpdateRequests(),
                fetchPendingAnswers()
            ]);

            if (postResult && Array.isArray(postResult.data)) {
                const validPosts = postResult.data.map((post) => ({
                   ...post,
                    rejectionReason: ''
                })).filter((post): post is PostData => {
                    return typeof post.id === 'number' && typeof post.title === 'string' && typeof post.content === 'string';
                });
                setPosts(validPosts);
            }

            if (updateRequestResult && Array.isArray(updateRequestResult.data)) {
                const validUpdateRequests = updateRequestResult.data.map((request) => ({
                   ...request,
                    rejectionReason: ''
                })).filter((request): request is UpdateRequestData => {
                    return typeof request.id === 'number';
                });
                setUpdateRequests(validUpdateRequests);
            }

            if (answerResult && Array.isArray(answerResult.data)) {
                const validAnswers = answerResult.data.map((answer) => ({
                   ...answer,
                    rejectionReason: ''
                })).filter((answer): answer is AnswerData => {
                    return typeof answer.id === 'number';
                });
                setAnswers(validAnswers);
            }
        } catch (err) {
            const errorMessage = err instanceof Error? err.message : '未知错误';
            console.error('获取数据时出错:', errorMessage);
            setError('获取数据时出错');
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprovePost = async (postId: number) => {
        console.log(`开始批准帖子，帖子 ID: ${postId}`);
        try {
            await approvePost(postId);
            console.log(`帖子 ID ${postId} 批准成功，重新获取帖子数据...`);
            await fetchAllData();
        } catch (err) {
            const errorMessage = err instanceof Error? err.message : '未知错误';
            setError('批准帖子时出错');
        }
    };

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
            await fetchAllData();
        } catch (err) {
            const errorMessage = err instanceof Error? err.message : '未知错误';
            setError('拒绝帖子时出错');
        }
    };

    const handleApproveUpdateRequest = async (requestId: number, index: number) => {
        console.log(`开始批准更新请求，请求 ID: ${requestId}`);
        const request = updateRequests[index];
        const rejectionReason = request.rejectionReason || '';
        try {
            await reviewUpdateRequest(requestId, 'approve', rejectionReason);
            console.log(`更新请求 ID ${requestId} 批准成功，重新获取数据...`);
            await fetchAllData();
        } catch (err) {
            const errorMessage = err instanceof Error? err.message : '未知错误';
            setError('批准更新请求时出错');
        }
    };

    const handleRejectUpdateRequest = async (requestId: number, index: number) => {
        console.log(`开始拒绝更新请求，请求 ID: ${requestId}`);
        const request = updateRequests[index];
        const rejectionReason = request.rejectionReason;
        if (!rejectionReason.trim()) {
            console.error('拒绝理由不能为空');
            return;
        }
        try {
            await reviewUpdateRequest(requestId, 'reject', rejectionReason);
            console.log(`更新请求 ID ${requestId} 拒绝成功，重新获取数据...`);
            await fetchAllData();
        } catch (err) {
            const errorMessage = err instanceof Error? err.message : '未知错误';
            setError('拒绝更新请求时出错');
        }
    };

    const handleApproveAnswer = async (answerId: number, index: number) => {
        console.log(`开始批准回答，回答 ID: ${answerId}`);
        const answer = answers[index];
        const rejectionReason = answer.rejectionReason || '';
        try {
            await reviewAnswer(answerId, 'approve', rejectionReason);
            console.log(`回答 ID ${answerId} 批准成功，重新获取数据...`);
            await fetchAllData();
        } catch (err) {
            const errorMessage = err instanceof Error? err.message : '未知错误';
            setError('批准回答时出错');
        }
    };

    const handleRejectAnswer = async (answerId: number, index: number) => {
        console.log(`开始拒绝回答，回答 ID: ${answerId}`);
        const answer = answers[index];
        const rejectionReason = answer.rejectionReason;
        if (!rejectionReason.trim()) {
            console.error('拒绝理由不能为空');
            return;
        }
        try {
            await reviewAnswer(answerId, 'reject', rejectionReason);
            console.log(`回答 ID ${answerId} 拒绝成功，重新获取数据...`);
            await fetchAllData();
        } catch (err) {
            const errorMessage = err instanceof Error? err.message : '未知错误';
            setError('拒绝回答时出错');
        }
    };

    useEffect(() => {
        deleteUnnecessaryCookies();
        fetchAllData();
    }, []);

    return (
        <div className={styles.checkContainer}>
            {isLoading && <div className={styles.loadingMessage}>正在加载...</div>}
            {error && <div className={styles.errorMessage}>{error}</div>}
            <div className={styles.reviewPageContainer}>
                {posts.map((post, index) => (
                    <div className={styles.postRow} key={post.id}>
                        <div className={styles.typeIndicator}>帖子</div>
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
                            {post.picture && post.picture.length > 0 && (
                                <div className={styles.postPictures}>
                                    {post.picture.map((pic, picIndex) => (
                                        <SecureImage key={picIndex} image={pic} />
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
                                <label htmlFor={`rejectionReason-post-${post.id}`} className={styles.rejectionReasonLabel}>
                                    拒绝理由:
                                </label>
                                <input
                                    type="text"
                                    id={`rejectionReason-post-${post.id}`}
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
                {updateRequests.map((request, index) => (
                    <div className={styles.postRow} key={request.id}>
                        <div className={styles.typeIndicator}>更新请求</div>
                        <div className={styles.postInfo}>
                            <div className={styles.postTitle}>{request.title || '无标题更新请求'}</div>
                            <div className={styles.postContent}>{request.content || '无内容更新请求'}</div>
                            <div className={styles.postMeta}>
                                {/* 可以根据实际情况添加更多更新请求的元信息展示 */}
                                <span>关联帖子 ID: {request.post_id}</span>
                                <span>状态: {request.status}</span>
                            </div>
                            {request.picture && request.picture.length > 0 && (
                                <div className={styles.postPictures}>
                                    {request.picture.map((pic, picIndex) => (
                                        <SecureImage key={picIndex} image={pic} />
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className={styles.reviewActions}>
                            <div className={styles.buttonGroup}>
                                <button className={styles.approveButton} onClick={() => handleApproveUpdateRequest(request.id, index)}>
                                    批准
                                </button>
                                <button className={styles.rejectButton} onClick={() => handleRejectUpdateRequest(request.id, index)}>
                                    拒绝
                                </button>
                            </div>
                            <div className={styles.rejectionReasonWrapper}>
                                <label htmlFor={`rejectionReason-update-${request.id}`} className={styles.rejectionReasonLabel}>
                                    拒绝理由:
                                </label>
                                <input
                                    type="text"
                                    id={`rejectionReason-update-${request.id}`}
                                    placeholder="请输入拒绝理由"
                                    value={request.rejectionReason || ''}
                                    onChange={(e) => {
                                        const newUpdateRequests = [...updateRequests];
                                        newUpdateRequests[index].rejectionReason = e.target.value;
                                        setUpdateRequests(newUpdateRequests);
                                    }}
                                    className={styles.rejectionReasonInput}
                                />
                            </div>
                        </div>
                    </div>
                ))}
                {answers.map((answer, index) => (
                    <div className={styles.postRow} key={answer.id}>
                        <div className={styles.typeIndicator}>回答</div>
                        <div className={styles.postInfo}>
                            <div className={styles.postContent}>{answer.content || '无内容回答'}</div>
                            <div className={styles.postMeta}>
                                <span>点赞数: {answer.like}</span>
                                <span>关联问题帖子 ID: {answer.question_post_id}</span>
                                <span>状态: {answer.status}</span>
                            </div>
                            {answer.picture && answer.picture.length > 0 && (
                                <div className={styles.postPictures}>
                                    {answer.picture.map((pic, picIndex) => (
                                        <SecureImage key={picIndex} image={pic} />
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className={styles.reviewActions}>
                            <div className={styles.buttonGroup}>
                                <button className={styles.approveButton} onClick={() => handleApproveAnswer(answer.id, index)}>
                                    批准
                                </button>
                                <button className={styles.rejectButton} onClick={() => handleRejectAnswer(answer.id, index)}>
                                    拒绝
                                </button>
                            </div>
                            <div className={styles.rejectionReasonWrapper}>
                                <label htmlFor={`rejectionReason-answer-${answer.id}`} className={styles.rejectionReasonLabel}>
                                    拒绝理由:
                                </label>
                                <input
                                    type="text"
                                    id={`rejectionReason-answer-${answer.id}`}
                                    placeholder="请输入拒绝理由"
                                    value={answer.rejectionReason || ''}
                                    onChange={(e) => {
                                        const newAnswers = [...answers];
                                        newAnswers[index].rejectionReason = e.target.value;
                                        setAnswers(newAnswers);
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
