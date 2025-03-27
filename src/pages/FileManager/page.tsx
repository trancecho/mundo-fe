'use client';
import { useState, useEffect } from 'react';
import styles from './filemanager.module.css'; // 已经引入
import { getFolder, createFolder, deleteFolder, uploadFile, deleteFile, getFiles,getFileUrl,updateFile,updateFolder,getparentFolderId } from '@/router/api'; // 导入更新后的 API 函数
import FileList from '@/components/FileList'; // 用于展示文件列表的组件
import {Button} from '@/components/ui/button.tsx';

interface File {
    id: string;
    filename: string;
    parentFolderId: number;
    modifiedTime: string;
    size: string;
    fileUrl: string; // 文件下载的 URL
}

interface Folder {
    id: number;
    name: string;
    parentFolderId: number;
}

export default function FileManager() {
    const [items, setItems] = useState<(File | Folder)[]>([]); // 文件和文件夹的统一列表
    const [newFolderName, setNewFolderName] = useState<string>(''); // 输入的新文件夹名称
    const [currentFolderId, setCurrentFolderId] = useState<string>('0'); // 当前文件夹 ID，默认为根文件夹（0）
    const [parentFolderId, setParentFolderId] = useState<string>('0');

    useEffect(() => {
        fetchItems(); // 默认加载文件夹和文件列表
    }, [currentFolderId]);

    // 获取当前文件夹内的文件和文件夹
    const fetchItems = async () => {
        try {
            // 获取文件夹列表
            const folderResponse = await getFolder(currentFolderId);
            //console.log(folderResponse);
            // 获取文件列表
            const filesResponse = await getFiles(currentFolderId);


            // 获取文件夹id
            const IdResponse = await getparentFolderId(currentFolderId);
            //console.log(IdResponse);
            setParentFolderId(IdResponse);
            //console.log(parentFolderId);

            // 提取文件夹数据
            const folders: Folder[] = await Promise.all(folderResponse.map(async (folder: any) => {
                return{
                    id: folder.id,
                    name: folder.name,
                    parentFolderId: folder.parent_folder_id
                };
            })) || [];

            // 提取文件数据
            const files: File[] = await Promise.all(filesResponse.map(async (file: any) => {
                return {
                    id: file.id.toString(), // 保证 ID 是字符串类型
                    filename: file.name,
                    parentFolderId: file.folder_id,
                    modifiedTime: new Date().toISOString(), // 假设你没有返回修改时间，自己填充
                    size: file.size.toString(), // 文件大小转为字符串
                    fileUrl: {} // 使用 getFileUrl 获取的 URL
                };
            })) || [];

            // 合并文件夹和文件
            setItems([...folders, ...files]);
            //console.log(items); // 查看items是否正确更新
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    // 文件重命名
    const handleRenameFile = async (id: string, newName: string) => {
        try {
            await updateFile(Number(id), newName);  // 调用重命名API
            await fetchItems();  // 重新加载文件列表
        } catch (error) {
            console.error('Error renaming file:', error);
        }
    };

    // 文件夹重命名
    const handleRenameFolder = async (id: number, newName: string) => {
        try {
            await updateFolder(newName, id);  // 调用重命名API
            await fetchItems();  // 重新加载文件夹列表
        } catch (error) {
            console.error('Error renaming folder:', error);
        }
    };

    // 处理文件下载
    const handleDownloadFile = async (currentFolderId: number,name:string) => {
        const fileUrl = await getFileUrl(Number(currentFolderId), name); // 获取文件的下载 URL
        window.open(fileUrl, '_blank');
    }

    // 处理文件上传
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileInput = e.target;
        if (fileInput?.files && fileInput.files[0]) {
            const file = fileInput.files[0];
            //console.log(file);
            //console.log(file.name);
            try {
                // 上传文件到指定文件夹
                //console.log(currentFolderId.toString());
                await uploadFile(file, file.name, currentFolderId.toString()); // 调用 API 上传文件
                //console.log("chuansong");
                fetchItems();
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
    };

    // 删除文件
    const handleDeleteFile = async (id: string) => {
        try {
            await deleteFile(Number(id)); // 调用 API 删除文件
            await fetchItems();
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    // 创建文件夹
    const handleCreateFolder = async () => {
        if (newFolderName.trim()) {
            const newFolderData: Folder = {
                name: newFolderName,
                parentFolderId: Number(currentFolderId), // 传递当前文件夹 ID
                id: 0, // 假设服务器会返回创建文件夹后的 ID
            };
            try {
                await createFolder(newFolderData.name, newFolderData.parentFolderId); // 调用 API 创建文件夹
                fetchItems();
            } catch (error) {
                console.error('Error creating folder:', error);
            }
        }
    };

    // 删除文件夹
    const handleDeleteFolder = async (id: number) => {
        try {
            await deleteFolder(id); // 调用 API 删除文件夹
            await fetchItems();
        } catch (error) {
            console.error('Error deleting folder:', error);
        }
    };

    // 切换到指定文件夹
    const handleFolderClick = (folderId: string) => {
        setCurrentFolderId(folderId); // 更新当前文件夹 ID
        //console.log(currentFolderId);
    };

    // 返回上一级目录
    const handleGoUp = () => {
        setCurrentFolderId(parentFolderId);
    };

    const handleHome = () => {
        setCurrentFolderId('0');
    }

    return (
        <div className={styles.body}>
            <h1 className={styles.title}>Welcome to File Manager</h1>

            <div className={styles.container}>
                <div className="mb-4 flex flex-col items-center w-full">
                    <div className="upload-content-wrapper w-full">
                        <input
                            type="file"
                            onChange={handleFileUpload}
                            className={styles.fileInput} // 使用模块化类
                            accept="*/*"
                        />
                    </div>

                    <div className={styles.folderActions}>
                        {currentFolderId !== '0' && (
                            <Button onClick={handleGoUp} className={styles.goUpBtn}>Go Up</Button>
                        )}

                        {currentFolderId !== '0' && (
                            <Button onClick={handleHome} className={styles.goUpBtn}>Go Home</Button>
                        )}

                        <input
                            type="text"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            placeholder="Enter folder name"
                            className={styles.folderInput} // 使用模块化类
                        />
                        <Button onClick={handleCreateFolder} className={styles.createFolderBtn}>Create Folder</Button>
                    </div>

                    <FileList
                        CurrentFolderid={Number(currentFolderId)}
                        Folders={items.filter((item) => 'name' in item)}
                        Files={items.filter((item) => 'filename' in item)}
                        handleDeleteFile={handleDeleteFile}
                        handleFolderClick={handleFolderClick}
                        handleDeleteFolder={handleDeleteFolder}
                        handleRenameFile={handleRenameFile}
                        handleRenameFolder={handleRenameFolder}
                        handleDownloadFile={handleDownloadFile}
                    />
                </div>
            </div>
        </div>
    );
}
