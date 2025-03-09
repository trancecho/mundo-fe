import { FC, useState } from 'react';
import styles from '../pages/Info/Info.module.css';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Team {
    id: string;
    teamname: string;
    introduction: string;
    Now: number;
    MAX: number;
}

interface TeamProps{
    Teams: Team[];
    handleDeleteTeam: (id: string) => void;
    handleEditTeam: (id: string) => void;
}

const TeamList: React.FC<TeamProps> = ({
                                            Teams,
                                            handleDeleteTeam,
                                            handleEditTeam,
                                       }) => {
    return (
        <div>
            {Teams.length === 0 ? (
                <p> No Items here</p>
            ):(
                <ul className={styles.ul}>
                    {Teams.map((team) => (
                        <li key={team.id} className={styles.li}>
                            <span className={styles.name}>{team.teamname}</span>
                            <span className={styles.introduction}>{team.introduction}</span>
                            <span className={styles.number}> 人数: {team.Now}/{team.MAX}</span>

                            <div className={styles.action}>
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
                                                handleEditTeam(team.id);
                                            }}
                                        >
                                            Edit Team
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={(e) => {
                                                e.stopPropagation(); // 阻止事件冒泡
                                                handleDeleteTeam(team.id);
                                            }}
                                        >
                                            Delete Team
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default TeamList;