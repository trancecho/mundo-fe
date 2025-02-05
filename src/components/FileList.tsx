import { FC, useState } from 'react';
import '../pages/FileManager/filemanager.css';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface File {
    id: string;
    filename: string;
    modifiedTime: string;
    parentFolderId: number;
    size: string;
    fileUrl: string; // 文件的下载 URL
}

interface Folder {
    id: number;
    name: string;
    parentFolderId: number;
}

interface FileListProps {
    CurrentFolderid: number;
    Folders: Folder[]; // 目录列表
    Files: File[]; // 文件列表
    handleDeleteFile: (id: string) => void; // 删除文件操作
    handleFolderClick: (folderId: string) => void; // 点击文件夹切换
    handleDeleteFolder: (id: number) => void; // 删除文件夹操作
    handleRenameFile: (id: string, newName: string) => void; // 重命名文件操作
    handleRenameFolder: (id: number, newName: string) => void; // 重命名文件夹操作
    handleDownloadFile: (folderId: number, name: string) => void; // 下载文件操作
}

const FileList: FC<FileListProps> = ({
                                         CurrentFolderid,
                                         Folders,
                                         Files,
                                         handleDeleteFile,
                                         handleFolderClick,
                                         handleDeleteFolder,
                                         handleRenameFile,
                                         handleRenameFolder,
                                         handleDownloadFile,
                                     }) => {
    const [renameFileId, setRenameFileId] = useState<string | null>(null);
    const [renameFolderId, setRenameFolderId] = useState<number | null>(null);
    const [newName, setNewName] = useState<string>('');

    const handleRename = (itemId: string | number, itemType: 'file' | 'folder') => {
        if (itemType === 'file') {
            setRenameFileId(itemId as string);
        } else {
            setRenameFolderId(itemId as number);
        }
        setNewName(
            itemType === 'file'
                ? Files.find((f) => f.id === itemId)?.filename || ''
                : Folders.find((f) => f.id === itemId)?.name || ''
        );
    };

    const handleRenameSubmit = (itemType: 'file' | 'folder') => {
        if (itemType === 'file' && renameFileId && newName) {
            handleRenameFile(renameFileId, newName);
        } else if (itemType === 'folder' && renameFolderId && newName) {
            handleRenameFolder(renameFolderId, newName);
        }
        setRenameFileId(null);
        setRenameFolderId(null);
        setNewName('');
    };

    return (
        <div>
            {Folders.length === 0 && Files.length === 0 ? (
                <p>No items available</p>
            ) : (
                <ul>
                    {/* 渲染文件夹 */}
                    {Folders.map((folder) => (
                        <li key={folder.id} className="folder-item">
                            {/* 文件夹名称 */}
                            <span onClick={(e) => handleFolderClick(folder.id.toString())}>
                                {renameFolderId === folder.id ? (
                                    <input
                                        type="text"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        placeholder="Enter new folder name"
                                    />
                                ) : (
                                    folder.name
                                )}
                            </span>

                            {/* 操作菜单 */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem
                                        onClick={(e) => {
                                            e.stopPropagation(); // 阻止事件冒泡
                                            handleRename(folder.id, 'folder');
                                        }}
                                    >
                                        Rename folder
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={(e) => {
                                            e.stopPropagation(); // 阻止事件冒泡
                                            handleDeleteFolder(folder.id);
                                        }}
                                    >
                                        Delete folder
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* 确认重命名按钮 */}
                            {renameFolderId === folder.id && (
                                <div className="rename-controls">
                                    <Button
                                        onClick={(e) => {
                                            e.stopPropagation(); // 阻止事件冒泡
                                            handleRenameSubmit('folder');
                                        }}
                                    >
                                        Rename
                                    </Button>
                                    <Button
                                        onClick={(e) => {
                                            e.stopPropagation(); // 阻止事件冒泡
                                            setRenameFolderId(null);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            )}
                        </li>
                    ))}

                    {/* 渲染文件 */}
                    {Files.map((file) => (
                        <li key={file.id}>
                            <span>
                                {renameFileId === file.id ? (
                                    <input
                                        type="text"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        placeholder="Enter new file name"
                                    />
                                ) : (
                                    `${file.filename} - ${file.size} bytes`
                                )}
                            </span>

                            {/* 操作菜单 */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => handleRename(file.id, 'file')}>
                                        Rename file
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDeleteFile(file.id)}>
                                        Delete file
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            handleDownloadFile(CurrentFolderid, [file.filename])
                                        }
                                    >
                                        Download file
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* 确认重命名按钮 */}
                            {renameFileId === file.id && (
                                <div className="rename-controls">
                                    <button onClick={() => handleRenameSubmit('file')}>Rename</button>
                                    <button onClick={() => setRenameFileId(null)}>Cancel</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FileList;
