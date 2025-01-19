import React, { useState , useEffect} from 'react';
import randomatic from 'randomatic';
import style from './Login.module.css'; 
import { useAuth } from '../../context/AuthContext.tsx';
import { loginUser, getWechatLoginQR, checkWechatLoginCallback,bindWeChatEmail,bindHDUEmail,checkHelperLoginCallback,verifyEmail } from '../../router/api'; // 导入登录函数
// import { useHistory } from 'react-router-dom'; // React Router 的 hook，确保在登录成功后跳转到其他页面
import { useNavigate,useSearchParams,Link,useLocation } from 'react-router-dom';
import { AxiosError } from 'axios'; // 导入 AxiosError 类型
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [ticket, setTicket] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('等待扫码...');
  const [polling, setPolling] = useState<boolean>(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [bind,setBind]=useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [authtokenflag, setAuthtokenflag] = useState<boolean>(false);
  const [token1, setToken1] = useState<string | null>(null);
  const {longtoken,setTokenFunc}=useAuth();
  // const code = searchParams.get('code'); // 从 URL 获取 code
  // const state = searchParams.get('state'); // 从 URL 获取 state
  const [code, setCode] = useState<string | null>(null);
  const [state, setState] = useState<string | null>(null);
  const emailbind =searchParams.get('email'); // 从 URL 获取 email
  const {external,setExternalFunc}=useAuth();
  // const external=searchParams.get('external'); // 从 URL 获取 external
  // 获取二维码
  const fetchQRCode = async () => {
    try {
      const data = await getWechatLoginQR();
      setTicket(data.data.ticket);
      setStatus('请使用微信扫码登录');
      setQrCodeUrl(`https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${encodeURIComponent(data.data.ticket)}`);
      console.log('二维码获取成功:', data);
      console.log('QRURL', qrCodeUrl);
      startPolling(); // 获取二维码后开始轮询登录状态
    } catch (error) {
      setStatus('获取二维码失败，请刷新重试');
      console.error('获取微信二维码失败:', error);
    }
  };
  // 使用 useEffect 来确保 URL 中的 external 被同步到 Context 中
  useEffect(() => {
    const urlExternal = searchParams.get('external');
    if (urlExternal) {
      console.log("external 更新:", external);
      setExternalFunc(urlExternal);  // 如果 URL 中有 external，更新 Context 中的值
    }
  }, [location.search, setExternalFunc]);  // 依赖 location.search，确保 URL 变化时更新

  useEffect(() => {
    const updateParams = () => {
      const searchParams = new URLSearchParams(window.location.search);
      setCode(searchParams.get('code'));
      setState(searchParams.get('state'));
    };
    // 初始化时读取参数
    updateParams();
    // 监听 URL 变化
    window.addEventListener('popstate', updateParams);
    // 清理监听器
    return () => {
      window.removeEventListener('popstate', updateParams);
    };
  }, []); // 空依赖数组只会在组件挂载时运行一次

  //监听longtoken
  useEffect(() => {
    if (longtoken) {
      // 当 longtoken 更新后执行的逻辑
      console.log("longToken 更新:", longtoken);
    }
  }, [longtoken]);  // 依赖 longtoken，当 token 变化时会触发

  // 监听 ticket 的变化，一旦 ticket 更新，启动轮询
  // useEffect(() => {
  //   if (ticket) {
  //     startPolling(); // ticket 更新后开始轮询
  //   }
  // }, [ticket]); // 依赖 ticket，ticket 更新时执行
  // useEffect(() => {
  //   // 监听 qrCodeUrl 的变化
  //   if (qrCodeUrl) {
  //     console.log('最新的 QRURL:', qrCodeUrl);
  //   }
  // }, [qrCodeUrl]);  // 依赖 qrCodeUrl，当其变化时执行
  // 开启轮询检查扫码登录状态
  useEffect(() => {
    // 从 URL 获取 token 参数
    const urlParams = new URLSearchParams(location.search);
    const tokenFromUrl = urlParams.get('token');
    
    // 只有当 token 为空时才更新状态，避免重复设置
    if (tokenFromUrl && token !== tokenFromUrl) {
      setToken(tokenFromUrl); // 设置 token 状态
    }
  }, [location.search, token]); // 依赖 location.search 和 token

  // 使用 useEffect 来监听 token1 的变化
  // useEffect(() => {
  //   if (token1) {
  //     console.log("更新后的 token1:", token1);
  //   }
  // }, [token1]); // 每次 token1 更新时，执行此副作用

  const startPolling = () => {
    if (polling || !ticket) return;
  
    setPolling(true);
    setStatus('正在检查登录状态...');
    const id = setInterval(async () => {
      try {
        const result = await checkWechatLoginCallback(ticket);
        console.log('轮询结果:', result);
        if (result.code === 200) {
          setStatus('登录成功！');
          navigate('/qanda');
          setPolling(false);
          if (intervalId) clearInterval(intervalId);
        } else if (result.code === 400) {
          setStatus('等待用户扫码或确认...');
        }
      } catch (error) {
        const external="wechat"
        // 使用类型断言将 error 转换为 AxiosError 类型
        const axiosError = error as AxiosError;
        console.log('bind',bind);
        console.log('data',axiosError.response.data.data.code);
        // 确保 response 和 data 存在后再访问 code
        if (axiosError.response?.data?.data.code === 400001) {
          setBind(true);
          navigate('/bindregister',{state:{ external }}); // 使用 navigate() 进行路由跳转
        } else {
          setStatus('检查登录状态失败，请稍后重试');
          setPolling(false);
          if (intervalId) clearInterval(intervalId);
          console.error('检查扫码登录状态失败:', error);
        }
      }
    }, 3000);  // 这里结束了 setInterval 的定义
  
    setIntervalId(id);  // 设置 intervalId
  };
  
  // // 类型保护函数，判断 error 是否是 AxiosError 类型
  // const isAxiosError = (error: unknown): error is AxiosError => {
  //   return (error as AxiosError).isAxiosError !== undefined;
  // };
  // 清理轮询
  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  // 监听 helper 回传
  const startPollingHelper = () => {
    if (polling || !state || !code ) return;
    setPolling(true);
    setStatus('正在检查登录状态...');
    if(longtoken&&state&&code){
      bindLogin();
    }
    const id = setInterval(async () => {
      try {
        console.log('state',state,'code',code);
        const result = await checkHelperLoginCallback(state, code);
        console.log('轮询结果:', result);
        if (result.code === 200) {
          setStatus('登录成功！');
          navigate('/qanda');
          setPolling(false);
          if (intervalId) clearInterval(intervalId);
        } else if (result.code === 400) {
          setStatus('等待用户鉴权确认...');
        }
      } catch (error) {
        const external="hduhelp"
        // 使用类型断言将 error 转换为 AxiosError 类型
        const axiosError = error as AxiosError;
        console.log('bind',bind);
        console.log('state',state,'code',code);
        console.log('data',axiosError.response.data.data.code);
        // 确保 response 和 data 存在后再访问 code
        if (axiosError.response?.data?.data.code === 400001) {
          
          setBind(true);
          navigate('/bindregister',{state:{ external }}); // 使用 navigate() 进行路由跳转
        } else {
          setStatus('检查登录状态失败，请稍后重试');
          setPolling(false);
          if (intervalId) clearInterval(intervalId);
          console.error('检查扫码登录状态失败:', error);
        }
      }
    }, 3000);  // 这里结束了 setInterval 的定义
  
    setIntervalId(id);  // 设置 intervalId
  };
  // 监听 helper 回传
  useEffect(() => {
    if (code && state && state === '1a') {
      console.log('code:', code);
      console.log('state:', state);

      // 确保 code 和 state 都存在
      if (code && state) {
        startPollingHelper();
      } else {
        setStatus('缺少必要的参数');
      }
    }
  }, [code, state]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

//   const handleLogin = () => {
//     // Implement login logic here
//     console.log('Email:', email);
//     console.log('Password:', password);
//   };
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const data = await loginUser(email, password); // 调用登录函数
      console.log('登录成功:', data);
      navigate('/qanda');
    } catch (err) {
      setError('登录失败，请检查您的电子邮件和密码');
    }
  };

//杭助跳转
const handleHelperLogin = () => {
  const url=`https://api.hduhelp.com/oauth/authorize?response_type=code&client_id=jvbarBgwFKD78LMh&redirect_uri=http://localhost:5173/login&state=1a`
  window.location.href=url;//当前窗口打开
  // window.open(url,'_blank');//新窗口打开
}

const handleVerify = () => {
  return new Promise((resolve, reject) => {
    if (!emailbind || !token) {
      alert('缺少必要的信息，请检查链接或填写密码！');
      reject('缺少必要的信息');
      return;
    }
    const randomString = randomatic('a0', 6);
    // 调用 verifyEmail，并获取返回的新 token
    verifyEmail(emailbind, token, randomString)
      .then((newData) => {
        console.log('新 token:', newData.data.token);
        setTokenFunc(newData.data.token as string); 
        // resolve("");
        setToken1(newData.data.token); // 更新 token
        console.log("token1", token1); // 这儿还会是之前的 token, 因为 setState 是异步的
        setAuthtokenflag(true); // 设置 token 状态
        resolve(newData.data.token as string); // 返回新 token
      })
      .catch((error) => {

        console.error('激活失败:', error);
        console.log('emailbind',emailbind,'token',token,'randomString',randomString,'external',external);
        // alert('激活失败，请稍后再试！');
        reject('激活失败');
        console.log('verifyEmail激活失败');
      });
  });
};
const handleBindEmail = (longtoken: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (longtoken) {
        console.log('token:', longtoken, 'external:', external, 'state:', state, 'code:', code);

        // 根据 external 的值判断是绑定微信还是 HDUHelper
        if (external === 'wechat') {
          bindWeChatEmail(longtoken)
            .then(resolve)
            .catch(() => {
              console.error('微信绑定失败');
              reject('微信绑定失败');
            });
        } else if (external === 'hduhelp') {
          if (!state || !code) {
            // 如果没有 state 或 code，执行 HDUHelper 登录
            handleHelperLogin()
              // .then(resolve)
              // .catch((error) => {
              //   console.error('HDUHelper 登录失败:', error);
              //   reject('HDUHelper 登录失败');
              // });
          } else {
            // 否则绑定 HDUHelper 邮箱
            bindHDUEmail(longtoken, state, code)
              .then(resolve)
              .catch((error) => {
                console.error('绑定 HDUHelper 邮箱失败:', error);
                reject('绑定 HDUHelper 邮箱失败');
              });
          }
        } else {
          // 如果 external 不是 wechat 或 hduhelp，返回错误
          reject('无效的 external 值');
        }
      } else {
        console.log('longtoken 无效:', longtoken);
        reject('longtoken 无效');
      }
    }, 2000);
  });
};

const bindLogin = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!longtoken) {
      handleVerify()
        .then((newtoken) => {
          return handleBindEmail(newtoken as string);
        })
        .then((data) => {
          // 如果绑定成功，执行 resolve
          console.log('绑定成功:', data);
          navigate('/qanda');
          resolve();  // 绑定成功时返回成功
        })
        .catch((error) => {
          // 发生错误时，执行 reject 并传递错误信息
          setStatus('激活失败或 longtoken无效，请重新激活');
          console.error(error);
          reject(new Error('激活失败或 longtoken无效，请重新激活'));
        });
    } else {
      handleBindEmail(longtoken as string)
        .then((data) => {
          console.log('绑定成功:', data);
          navigate('/qanda');
          resolve();  // 绑定成功时返回成功
        })
        .catch((error) => {
          console.error('绑定失败:', error);
          setStatus('绑定邮箱失败，请刷新重试');
          reject(new Error('绑定邮箱失败，请刷新重试'));  // 绑定失败时返回失败
        });
    }
  });
};

  return (
    <div className={style.body}>
      <div className={style.loginBox}>
          <h2 className={style.loginTitle}>Mundo 登录</h2>
          <div className={style.inputGroup}>
              <label htmlFor="email">邮箱：</label>
              <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="请输入邮箱"
              required
              />
          </div>
          <div className={style.inputGroup}>
              <label htmlFor="password">密码：</label>
              <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="请输入密码"
              required
              />
          </div>
          <button className={style.loginBtn} onClick={handleLogin}>登录</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div className={style.otherLogin}>
              <button className={style.loginOption}>邮箱验证登录</button>
              <button className={style.loginOption}>手机号登录</button>
              <button className={style.loginOption} onClick={fetchQRCode}>微信登录</button>
              <button className={style.loginOption} onClick={handleHelperLogin}>HDUHelper登录</button>
          </div>
          {qrCodeUrl ? (
            <div>
              <p>{status}</p>
              <img src={qrCodeUrl} alt="微信登录二维码" style={{ width: '200px', height: '200px' }} />
              {!polling && <button onClick={startPolling}>开始检查登录状态</button>}
            </div>
          ) : (
            <p>{status}</p>
          )}
          <button className={style.loginOption} onClick={bindLogin}>邮箱绑定</button>
          <p className={style.registerLink}>还没有账号？<Link to="/register">去注册</Link></p>

      </div>      
    </div>

  );
};

export default Login;
