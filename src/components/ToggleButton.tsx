import React, { useState } from 'react';
import { ResumeIcon as Resume, PauseIcon as Pause } from '@radix-ui/react-icons'; // 引入组件库的组件

interface ToggleButtonProps {
  taskId: number;
  onResume: (id: number) => void;
  onPause: (id: number) => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ taskId, onResume, onPause }) => {
  const [isPaused, setIsPaused] = useState(true); // 初始状态为暂停

  const handleClick = () => {
    if (isPaused) {
      onResume(taskId); // 调用 Resume 方法
    } else {
      onPause(taskId); // 调用 Pause 方法
    }
    setIsPaused(!isPaused); // 切换状态
  };

  return (
    <div onClick={handleClick}>
      {isPaused ? (
        <Resume/> // Resume 图标
      ) : (
        <Pause/> // Pause 图标
      )}
    </div>
  );
};

export default ToggleButton;
