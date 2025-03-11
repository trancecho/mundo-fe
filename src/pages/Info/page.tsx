'use client';
import React, { useState, useEffect } from 'react';
import styles from './Info.module.css';
import { Link } from 'react-router-dom';
import TeamList from '@/components/TeamList.tsx';


// 定义Team接口
interface Team {
    id: string;
    teamname: string;
    introduction: string;
    Now: number;
    MAX: number;
}

interface User {
    id: string;
    img: string;
    name: string;
    email: string;
}

const InfoManage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null) // 设置头像的状态
    const [teamList, setTeamList] = useState<Team[]>([]);  // 设置团队列表的状态

    // 获取团队列表数据 (此处模拟获取数据)
    useEffect(() => {
        // 假设这是从API获取的数据
        const fetchedTeams: Team[] = [
            { id: '1', teamname: 'Team A', introduction: 'Team A Introduction', Now: 5, MAX: 10 },
            { id: '2', teamname: 'Team B', introduction: 'Team B Introduction', Now: 3, MAX: 5 },
        ];
        setTeamList(fetchedTeams);
    }, []);

    useEffect(() => {
        const fetchedUser: User = {id: '1', img: '2', name: '你好', email:'123321@qq.com'};
        setUser(fetchedUser);
    }, []);

    // 删除团队的处理函数
    const handleDeleteTeam = (teamId: string) => {
        setTeamList(prevTeams => prevTeams.filter(team => team.id !== teamId));
    };

    // 编辑团队的处理函数
    const handleEditTeam = (teamId: string) => {
        // 编辑团队的逻辑，可以是跳转到编辑页面或弹出编辑框
        console.log(`Editing team with id: ${teamId}`);
    };

    return (
        <div className={styles.body}> 
            <div className={styles.container}>
                <div className={styles.image}>
                    <img src={user?.img || ''} alt="UserImage" className={styles.UserImage}/>
                </div>
                <div className={styles.username}> {user?.name}</div>
                <div className={styles.email}>{user?.email}</div>
                <div className={styles.change}>
                    <Link to="/InfoChange">修改个人信息</Link>
                </div>

                <div className={styles.teamlist}>
                    <div className={styles.listname}>
                        我的队伍
                    </div>
                    <div className={styles.teamup}>
                        <Link to="/InfoTeam"> 创建新队伍</Link>
                    </div>
                    <TeamList
                        Teams={teamList}   // 传递团队列表
                        handleDeleteTeam={handleDeleteTeam}  // 删除团队的回调
                        handleEditTeam={handleEditTeam}  // 编辑团队的回调
                    />
                </div>
            </div>
        </div>
    );
};

export default InfoManage;
