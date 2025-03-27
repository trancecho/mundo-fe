import React, { useEffect, useState, useRef } from "react";
import Style from "./DetailMessage.module.css";
import { useParams } from "react-router-dom";
import { useAuth } from '@/context/AuthContext';
import { Dispatch, SetStateAction } from "react";
import { getDetail,sendAnswer } from "@/router/api";
import Header from '@/components/ui/Header/Header.tsx';


interface Answer {
    id: number;
    uid: number;
    content: string;
    question_post_id: number;
    picture: string[];
    like: number;
    tags: string[] | null;
    // 建议添加时间字段（如果后端返回）
    created_at?: string;
}

interface MessageDetail {
    id: number;
    uid: number;
    title: string;
    content: string;
    tags: string[];
    views: number;
    collection: number;
    created_at: string;
    is_official: boolean;
    pictures: string[];
    answer_count: number;
    answers: Answer[];
}

interface FormData {
    content: string;
    picture: File[];
};

interface InputboxProps {
    id: string | undefined;
}

interface DetailQuestionProps {
    title: string;
    question: string;
    id: string | undefined
    longtoken: string | null;
    views: number
}
// 创建一个上下文，用于传递问题相关的图片和标签数据到 DetailQuestion 组件
const QuestionContext = React.createContext<{
    picture: string[];
    tags: string[];
}>({
    picture: [],
    tags: [],
});

const DetailQuestion: React.FC<DetailQuestionProps> = ({ title, question,views }) => {
    const { picture, tags } = React.useContext(QuestionContext); // 通过上下文获取图片和标签数据
    return (
        <div className={Style.DetailQuestion}>
            <div className={Style.detailTitle}>
                <div className={Style.Title}>{title}</div>
                <div className={Style.tagBoard}>
                    <p>标签：</p>
                    {tags.map((tag) => (
                        <div key={tag} className={Style.tag}>
                            {tag}
                        </div>
                    ))}
                </div>
            </div>
            <div className={Style.detailQuestion}>{question}</div>
            {picture.length > 0 && (
                <div className={Style.questionPictures}>
                    {picture.map((pic: string, index: number) =>
                        <SecureImage key={index} image={pic} />
                    )}
                </div>
            )}
            <div className={Style.views}><span>view : {views}</span></div>
        </div>
    );
};

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
        setTimeout(() => {
            const url = base64ToBlobUrl(image);
            setImageUrl(url);
            return () => URL.revokeObjectURL(url);
        }, 0); // 组件卸载时释放 URL
    }, [image]);

    return imageUrl ? <img src={imageUrl} alt="Image" className={Style.img} /> : <p>加载中...</p>;
}

// 定义 DetailReply 组件类型，接收 answerData 作为属性，类型为 Answer
const DetailReply: React.FC<{ answerData: Answer }> = ({ answerData }) => {
    return (
        <div className={Style.DetailReply}>
            <div className={Style.user}>
                <div className={Style.profile}></div>
                <div className={Style.username}>用户名</div>
            </div>
            <div className={Style.content}>
                <div className={Style.replyTime}>{answerData.content}</div>
                {answerData.picture.length > 0 && (
                    <div className={Style.answerPictures}>
                        {answerData.picture.map((pic: string, index: number) => (
                            <SecureImage key={index} image={pic} />
                        ))}
                    </div>
                )}
                <div className={Style.information}>
                    <div className=""><span>{answerData.created_at}</span></div>
                    <div className=""><span className="material-symbols-outlined">thumb_up</span></div>
                    <div className=""><span className="material-symbols-outlined">sms</span></div>
                </div>
            </div>
        </div>
    );
};

const Inputbox: React.FC<InputboxProps> = ({ id }) => {
    const [loading, setloading] = useState(false);
    const editableDivRef = useRef<HTMLDivElement>(null);
    const [formdata, setformdata] = useState<FormData>({
        content: '',
        picture: []
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (formdata.picture.length >= 3) {
            alert("最多上传3张图片");
            return;
        }
        if (file) {
            setformdata((prevData) => ({
                ...prevData,
                picture: [...prevData.picture, file],
            }));
        }
    };

    const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
        const content = e.currentTarget.textContent || '';
        setformdata((prevData) => ({
            ...prevData,
            content
        }));
    };

    const submit = async () => {
        if (formdata.content.length == 0) {
            return;
        }
        const formDataToSend = new FormData();
        formDataToSend.append("content", formdata.content);
        formdata.picture.forEach((file) => {
            formDataToSend.append(`picture`, file);
        });
        setloading(true);
        sendAnswer(Number(id),formDataToSend).then((response)=>{
            try {
                if (response.status==200) {
                    if (editableDivRef.current) {
                        editableDivRef.current.innerHTML = ''; // 清空内容
                    }
                    console.log('上传成功：', response);
                    setformdata({
                        content: '',
                        picture: [],
                    });
                }
            } catch (error) {
                alert("上传失败")
                console.error('上传失败：', error);
            } finally {
                console.log(formdata);
                setloading(false);
            }
        })
    };
    return (
        <div className={Style.inputbox}>
            <div
                ref={editableDivRef}
                className={Style.richinput}
                contentEditable="true"
                data-placeholder="平等表达，友善交流"
                onInput={handleContentChange}
            ></div>
            <div className={Style.picturelist}>
                {formdata.picture && formdata.picture.map((photo, index) => {
                    return (
                        <div className={Style["image-view"]} key={index}>
                            <img
                                src={URL.createObjectURL(photo)}
                                alt={'图片预览'}
                                style={{ width: 100, marginTop: '10px', marginRight: "10px" }}
                            />
                        </div>)
                }
                )}
            </div>
            <div className={Style.inputTools}>
                <div className={Style.icons}>
                    <label htmlFor="fileUpload" style={{ cursor: 'pointer' }}>
                        <span className="material-symbols-outlined">add_photo_alternate</span>
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        name="picture"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        id="fileUpload"
                    />
                    <button className={Style.delete}>
                        <span className="material-symbols-outlined" onClick={() =>
                            setformdata((prev) => ({ ...prev, picture: [] }))
                        }>
                            delete
                        </span>
                    </button>

                </div>
                <div>
                    <span className={Style.wordlimit}>{formdata.content.length}/200</span>
                    <button className={Style.send} onClick={submit} style={{ opacity: formdata.content.length > 0 ? "1" : "0.6" }}>
                        {loading ? (
                            <div className={Style.box}>
                                <div className={Style.spinner}></div>
                            </div>
                        ) : (
                            <span>send</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

const DetailMessage: React.FC = () => {
    const { longtoken } = useAuth();
    const { id } = useParams();
    const [finalMessage, setFinalMessage] = useState<MessageDetail>({
        id: 0,
        uid: 0,
        title: "",
        content: "",
        pictures: [],
        views: 0,
        collection: 0,
        answer_count: 0,
        is_official: false,
        created_at: '',
        tags: [],
        answers: []
    });

    useEffect(() => {
        // 调用获取详情的API函数
        getDetail(Number(id)).then((res) => {
            if (res.status >= 200 && res.status < 300) {
                const apiData = res.data.data.QuestionPost;
                console.log(res.data.data);
                setFinalMessage({
                  id: apiData.id,
                  uid: apiData.uid,
                  title: apiData.title,
                  content: apiData.content,
                  pictures: apiData.picture || [],
                  views: apiData.view || 0,
                  collection: apiData.collection,
                  answer_count: apiData.answer_count,
                  is_official: apiData.officials || false,
                  created_at: apiData.created_at || new Date().toISOString(),
                  tags: apiData.tags || [],
                  answers: res.data.data.Answers || []
                });
            } else {
                throw new Error(res.data?.message || "请求失败");
            }
        }).catch((error) => console.log("error", error));
    }, [id, longtoken]); // 依赖项：当id或longtoken变化时重新执行

    return (
        <div style={{ all: "initial" }}>
            <Header />
            {finalMessage.title.length > 0 && <div className={Style.background}>
                <QuestionContext.Provider
                    value={{ picture: finalMessage.pictures, tags: finalMessage.tags }}
                >
                    <div className={Style.DetailMessage}>
                        <div className={Style.question}>
                            <DetailQuestion
                                title={finalMessage.title}
                                question={finalMessage.content}
                                id={id}
                                longtoken={longtoken}
                                views={finalMessage.views}
                            />
                        </div>
                        <div className={Style.detailAnswer}>
                            <div className={Style.createNewReply}>
                                回答 {finalMessage.answer_count}
                            </div>
                            <Inputbox id={id}/>
                            <div className={Style.replyList}>
                                {finalMessage.answers.length > 0 ? (
                                    finalMessage.answers.map((answer, index) => (
                                        <DetailReply key={index} answerData={answer} />
                                    ))
                                ) : (
                                    <div className={Style.noAnswerTip}>暂时没有回答</div>
                                )}
                            </div>
                        </div>
                    </div>
                </QuestionContext.Provider>
            </div>}
        </div>
    );
};

export default DetailMessage;