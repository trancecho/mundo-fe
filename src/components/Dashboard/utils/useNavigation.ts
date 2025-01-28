// useNavigation.ts
import { useNavigate } from 'react-router-dom';

export const useNavigation = () => {
    const navigate = useNavigate();

    // 定义 handleNavigationToAbout 函数的参数类型
    const handleNavigationToAbout = (text: string): void => {
        switch (text) {
            case 'multiPersonChat':
                navigate('/houtai/multiPersonChat');
                break;
            case 'faq':
                navigate('/houtai/faq');
                break;
            case 'check':
                navigate('/houtai/check');
                break;
            case 'dashboardfrontpage':
                navigate('/houtai/dashboardfrontpage');
                break;
            default:
                break;
        }
    };

    return handleNavigationToAbout;
};
