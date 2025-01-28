// TaskList.tsx
import React from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import ToggleButton from "./ToggleButton";

interface Task {
  id: number;
  name: string;
  duration: number;
  is_completed: boolean;
  start_time: string;
  status: string;
  total_time: number;
}

interface TaskListProps {
  tasks: Task[];
  handleStartTask: (id: number) => void;
  handlePauseTask: (id: number) => void;
  handleCompleteTask: (id: number) => void;
  handleDeleteTask: (id: number) => void;
  handleResetTask: (id: number) => void; // 新增重置任务处理函数
}

const formatTimeWithUnit = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${hours}h ${minutes}m ${secs}s`;
};

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  handleStartTask,
  handlePauseTask,
  // handleCompleteTask,
  handleDeleteTask,
  handleResetTask, // 新增重置任务处理函数
}) => {
  return (
    <div className="todo-list-box">
      <div className="bar-message">
        <input
          type="button"
          value="全部标记完成"
          className="btn btm-label btn-allFinish"
        />
        <input
          type={"text"}
          placeholder={"今日是今日必"}
          className="w-full bar-message-text"
        />
      </div>
      <ul className={"todo-list list-none"}>
        {/* <ul className={'list-none p-0'}> */}
        {tasks.map((task: Task) => {
          const delay = task.id * 150;
          // console.log(task);
          const progress = (task.duration / task.total_time) * 100;
          return (
            <li
              key={task.id}
              data-delay={delay}
              draggable={true}
              className={"todo-item"}
              // className={'border-b p-4 flex justify-between items-center'}
            >
              <div className="todo-content">
                <span className={"flex-grow w-2/3"}>
                  {task.name} —— {formatTimeWithUnit(task.duration)} /{" "}
                  {formatTimeWithUnit(task.total_time)} ({progress.toFixed(2)}%)
                </span>

                <span>{task.status}</span>

                <div className="w-full h-4 overflow-hidden bg-white rounded-full progress-bar">
                  <div
                    className="h-full progress bg-submit"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
              <div className="todo-btn btn-finish"></div>
              <div className="todo-btn btn-toggle">
                <ToggleButton
                  taskId={task.id}
                  onResume={handleStartTask}
                  onPause={handlePauseTask}
                />
                {/* <button
                    onClick={() => handleStartTask(task.id)}
                    className={'p-2 rounded bg-green-500 text-white w-20'}
                  >
                    Start
                  </button>
                  <button
                    onClick={() => handlePauseTask(task.id)}
                    className={'p-2 rounded bg-yellow-500 text-white w-20'}
                  >
                    Pause
                  </button> */}
              </div>
              <div
                onClick={() => handleResetTask(task.id)}
                className="todo-btn btn-reset"
              >
                <ReloadIcon />
              </div>
              <div
                onClick={() => handleDeleteTask(task.id)}
                className="todo-btn btn-delete"
              >
                <img
                  src={
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNS4wOTkzIDE3Ljc1OTdDMTUuNzk0OSAxOC4yMDk4IDE2LjcyMzUgMTguMDEwOCAxNy4xNzM2IDE3LjMxNTJDMTcuNjIzNiAxNi42MTk3IDE3LjQyNDYgMTUuNjkxMSAxNi43MjkxIDE1LjI0MUMxMy4zMDc5IDEzLjAyNzMgMTAuODIwOSAxMC45OTU5IDguOTIyNTEgOS4wMzczOUM5LjA5NzQyIDguODQ5ODIgOS4yNzI5MSA4LjY2NTcxIDkuNDQ4ODggOC40ODUzNEMxMS44ODY0IDUuOTg2OTIgMTQuMjQ3MiA0LjM4MDY2IDE2LjI5NDQgMy45NzEyMkMxNy4xMDY3IDMuODA4NzUgMTcuNjMzNSAzLjAxODUyIDE3LjQ3MTEgMi4yMDYxOEMxNy4zMDg2IDEuMzkzODQgMTYuNTE4NCAwLjg2NzAxMyAxNS43MDYgMS4wMjk0OEMxMi43NTMyIDEuNjIwMDUgOS44NjQwNiAzLjc2Mzc5IDcuMzAxNTQgNi4zOTAzN0M3LjE4MTUxIDYuNTEzNCA3LjA2MTgxIDYuNjM3ODkgNi45NDI0OSA2Ljc2Mzc1QzUuNDIwMDEgNC44MDQzMyA0LjM3MDU4IDIuODc2MzIgMy40MjU5MSAwLjg2MzE2NEMzLjA3Mzk5IDAuMTEzMjAyIDIuMTgwNzMgLTAuMjA5NDc1IDEuNDMwNzcgMC4xNDI0NDVDMC42ODA4MDkgMC40OTQzNjUgMC4zNTgxMzIgMS4zODc2MiAwLjcxMDA1MSAyLjEzNzU4QzEuODIwODggNC41MDQ4MSAzLjA3ODk5IDYuNzY1MTEgNC45MjkzMiA5LjA1MzA2QzMuMjIyMDYgMTEuMTM0MSAxLjYyNjY5IDEzLjQzMjggMC4yMjI3MjMgMTUuNzE0MkMtMC4yMTE0NTMgMTYuNDE5NyAwLjAwODUyNzUyIDE3LjM0MzcgMC43MTQwNjQgMTcuNzc3OEMxLjQxOTYgMTguMjEyIDIuMzQzNTIgMTcuOTkyIDIuNzc3NyAxNy4yODY1QzQuMDQ4MTkgMTUuMjIyIDUuNDY0MDUgMTMuMTcyNiA2Ljk1NTU5IDExLjMxNjhDOC45ODUgMTMuMzc2NSAxMS41OTU5IDE1LjQ5MjggMTUuMDk5MyAxNy43NTk3WiIgZmlsbD0iIzMzMzIyRSIvPgo8L3N2Zz4K"
                  }
                  alt="删除"
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TaskList;
