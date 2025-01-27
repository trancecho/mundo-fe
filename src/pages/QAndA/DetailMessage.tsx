import React, { useEffect, useState, useRef } from "react";
import Style from "./DetailMessage.module.css";
import { useParams } from "react-router-dom";
import { useAuth } from '@/context/AuthContext';
import { Dispatch, SetStateAction } from "react";

// 定义问题帖子的数据类型
interface QuestionPost {
    id: number;
    uid: number;
    title: string;
    content: string;
    picture: string[];
    view: number;
    collection: number;
    is_completed: false;
    answer_count: number;
    tags: string[];
}

interface AlertProps {
    judge: boolean | null;
    setjudge: Dispatch<SetStateAction<boolean | null>>;
}

type FormData = {
    content: string;
    picture: File[];
};
// 定义答案的数据类型
interface Answer {
    id: number;
    uid: number;
    content: string;
    question_post_id: number;
    picture: string[];
    like: number;
    tags: string[] | null;
}

interface DetailQuestionProps {
    title: string;
    question: string;
    id: string | undefined
    longtoken: string | null;
}

interface InputboxProps {
    id: string | undefined;
    longtoken: string | null;
    setjudge: Dispatch<SetStateAction<boolean | null>>;
}
// 创建一个上下文，用于传递问题相关的图片和标签数据到 DetailQuestion 组件
const QuestionContext = React.createContext<{
    picture: string[];
    tags: string[];
}>({
    picture: [],
    tags: [],
});

const Alert: React.FC<AlertProps> = ({ judge, setjudge }) => {
    return (
        <div className={Style.wrapper}>
            {judge == true ? <div className={Style.alert + " " + Style["alert--success"]}>
                <svg
                    className={Style.alert__icon}
                    width="64"
                    height="64"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle className={Style.alert__iconPath} cx="32" cy="32" r="30.5" stroke="currentColor" stroke-width="3" />
                    <path
                        className={Style.alert__iconPath + " " + Style["alert__iconPath--type"]}
                        d="M15 33.5L25 43.5L48.5 20"
                        stroke="currentColor"
                        stroke-width="3"
                    />
                </svg>
                <div className={Style.alert__message}>everything is working.</div>
                <div className={Style.alert__close} onClick={() => { setjudge(null) }}>&times;</div>
            </div> : judge == false ?
                <div className={Style.alert + " " + Style["alert--danger"]}>
                    <svg
                        className={Style.alert__icon}
                        width="64"
                        height="64"
                        viewBox="0 0 64 64"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle
                            className={Style.alert__iconPath}
                            cx="32"
                            cy="32"
                            r="30.5"
                            stroke="currentColor"
                            strokeWidth="3"
                        />
                        <path
                            className={Style.alert__iconPath + " " + Style["alert__iconPath--type"]}
                            d="M20 44L44 20"
                            stroke="currentColor"
                            stroke-width="2"
                        />
                        <path
                            className={Style.alert__iconPath + " " + Style["alert__iconPath--type"]}
                            d="M44 44L20 20"
                            stroke="currentColor"
                            stroke-width="2"
                        />
                    </svg>
                    <div className={Style.alert__message}>OH NO, something went wrong</div>
                    <div className={Style.alert__close} onClick={() => { setjudge(null) }}>&times;</div>
                </div> : null}
        </div>
    );
};
// 定义 DetailQuestion 组件类型，调整此处使其内部渲染图片和标签更合理
const DetailQuestion: React.FC<DetailQuestionProps> = ({ title, question, id, longtoken }) => {
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
                    {picture.map((pic: string, index: number) => {
                        const trimmedPicture = pic.slice(2);
                        return (
                            <SecureImage
                                key={index}
                                imageUrl={`/api/question/posts/${id}/?service=mundo/${trimmedPicture}`}
                                token={longtoken}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
};


const SecureImage: React.FC<{ imageUrl: string; token: string | null }> = ({ imageUrl, token }) => {
    const [blobUrl, setBlobUrl] = useState<string | null>(null);
    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await fetch(imageUrl, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch image');
                }
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                setBlobUrl(url);
            } catch (error) {
                console.error('Error fetching image:', error);
            }
        };
        fetchImage();
        return () => {
            if (blobUrl) {
                URL.revokeObjectURL(blobUrl);
            }
        };
    }, [imageUrl, token]);

    if (blobUrl) {
        console.log(blobUrl);

        return <img src={blobUrl} alt="安全图片" />;
    }
};
// 定义 DetailReply 组件类型，接收 answerData 作为属性，类型为 Answer
const DetailReply: React.FC<{ answerData: Answer }> = ({ answerData }) => {
    return (
        <div className={Style.DetailReply}>
            <div className={Style.user}>
                <div className={Style.profile}></div>
                <div className={Style.username}>用户名</div>
                <div className={Style.more}>
                    <button className={Style["folder-collapse-button"]} id="js_folder-collapse-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" opacity="0.5" viewBox="0 0 24 24">
                            <path d="M6 12c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zm9 0c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zm9 0c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z" />
                        </svg>
                    </button>
                </div>
            </div>
                <div className={Style.content}>
                    <div className={Style.replyTime}>{answerData.content}</div>
                    {answerData.picture.length > 0 && (
                        <div className={Style.answerPictures}>
                            {answerData.picture.map((pic: string, index: number) => (
                                <img key={index} src={pic} alt={`问题相关图片${index + 1}`} />
                            ))}
                        </div>
                    )}
                    <div className={Style.information}>
                        <div className=""><span>time</span></div>
                        <div className=""><span className="material-symbols-outlined">thumb_up</span></div>
                        <div className=""><span className="material-symbols-outlined">sms</span></div>
                    </div>
                </div>
            </div>
    );
};

const Inputbox: React.FC<InputboxProps> = ({ id, longtoken, setjudge }) => {
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
        console.log(id);
        setloading(true);
        try {
            const response = await fetch(`http://116.198.207.159:12349/api/question/posts/${id}/answers?service=mundo`, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${longtoken}`,
                },
                body: formDataToSend,
            });
            const result = await response.json();
            if (response.ok) {
                if (editableDivRef.current) {
                    editableDivRef.current.innerHTML = ''; // 清空内容
                }
                setjudge(true);
                console.log('上传成功：', result.data);
                setformdata({
                    content: '',
                    picture: [],
                });
            }
        } catch (error) {
            console.error('上传失败：', error);
            setjudge(false);
        } finally {
            console.log(formdata);
            setloading(false);
        }
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
                <div>
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
    const [judge, setjudge] = useState<boolean | null>(null);
    const [answersData, setAnswersData] = useState<Answer[]>([]);
    const [finalMessage, setFinalMessage] = useState<QuestionPost>({
        id: 0,
        uid: 0,
        title: "",
        content: "",
        picture: [],
        view: 0,
        collection: 0,
        is_completed: false,
        answer_count: 0,
        tags: [],
    });

    useEffect(() => {
        const myHeaders = new Headers();
        myHeaders.append("User-Agent", "Apifox/1.0.0 (https://apifox.com)");
        myHeaders.append(
            "Authorization",
            `Bearer ${longtoken}`
        );

        const requestOptions: RequestInit = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };

        fetch(
            `http://116.198.207.159:12349/api/question/posts/${id}?service=mundo`,
            requestOptions
        )
            .then((response) => response.json())
            .then(
                (result: {
                    code: number;
                    data: { Answers: Answer[]; QuestionPost: QuestionPost };
                }) => {
                    console.log(result);
                    if (result.code === 200 && result.data && result.data.Answers) {
                        setAnswersData(result.data.Answers);
                        setFinalMessage(result.data.QuestionPost);
                    }
                }
            )
            .catch((error) => console.log("error", error));
    }, [id, longtoken]);

    return (
        <div style={{ all: "initial" }}>
            <div className={Style.background}>
                <Alert judge={judge} setjudge={setjudge} />
                <QuestionContext.Provider
                    value={{ picture: finalMessage.picture, tags: finalMessage.tags }}
                >
                    <div className={Style.DetailMessage}>
                        <div className={Style.question}>
                            <DetailQuestion
                                title={finalMessage.title}
                                question={finalMessage.content}
                                id={id}
                                longtoken={longtoken}
                            />
                        </div>
                        <div className={Style.detailAnswer}>
                            <div className={Style.createNewReply}>
                                回答 {finalMessage.answer_count}
                            </div>
                            <Inputbox id={id} longtoken={longtoken} setjudge={setjudge} />
                            <div className={Style.replyList}>
                                {answersData.length > 0 ? (
                                    answersData.map((answer, index) => (
                                        <DetailReply key={index} answerData={answer} />
                                    ))
                                ) : (
                                    <div className={Style.noAnswerTip}>暂时没有回答</div>
                                )}
                            </div>
                        </div>
                    </div>
                </QuestionContext.Provider>
            </div>
        </div>
    );
};

export default DetailMessage;