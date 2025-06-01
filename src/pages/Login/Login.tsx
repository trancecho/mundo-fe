import React, { useState, useEffect } from 'react'
import randomatic from 'randomatic'
import { Message, Alert } from '@arco-design/web-react'
// import style from "./Login.module.css";
import style from './Auth.module.css'
import { useAuth } from '../../context/AuthContext.tsx'
import {
  loginUser,
  getWechatLoginQR,
  checkWechatLoginCallback,
  bindWeChatEmail,
  bindHDUEmail,
  checkHelperLoginCallback,
  verifyEmail
} from '../../router/api.ts' // 导入登录函数
import { useNavigate, useSearchParams, Link, useLocation } from 'react-router-dom'
import { AxiosError } from 'axios'
import PrivacyPolicyModal from "@/components/PrivacyPolicy.tsx";
import TermsOfServiceModal from "@/components/TermsOfService.tsx";
import Header from '@/components/ui/Header/Header.tsx' // 导入 AxiosError 类型
const Login = () => {
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [ticket, setTicket] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('等待扫码...')
  const [polling, setPolling] = useState<boolean>(false)
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)
  const [bind, setBind] = useState<boolean>(false)
  const [token, setToken] = useState<string | null>(null)
  const [authtokenflag, setAuthtokenflag] = useState<boolean>(false)
  const [token1, setToken1] = useState<string | null>(null)
  const { longtoken, setTokenFunc } = useAuth()
  const [code, setCode] = useState<string | null>(null)
  const [state, setState] = useState<string | null>(null)
  const emailbind = searchParams.get('email') // 从 URL 获取 email
  const { external, setExternalFunc } = useAuth()
  const [error, setError] = useState<string | null>(null)
  // 使用 useEffect 来确保 URL 中的 external 被同步到 Context 中
  useEffect(() => {
    const urlExternal = searchParams.get('external')
    if (urlExternal) {
      //console.log("external 更新:", external);
      setExternalFunc(urlExternal) // 如果 URL 中有 external，更新 Context 中的值
      bindLogin()
    }
  }, [location.search, setExternalFunc]) // 依赖 location.search，确保 URL 变化时更新

  useEffect(() => {
    const updateParams = () => {
      const searchParams = new URLSearchParams(window.location.search)
      setCode(searchParams.get('code'))
      setState(searchParams.get('state'))
    }
    // 初始化时读取参数
    updateParams()
    // 监听 URL 变化
    window.addEventListener('popstate', updateParams)
    // 清理监听器
    return () => {
      window.removeEventListener('popstate', updateParams)
    }
  }, []) // 空依赖数组只会在组件挂载时运行一次

  //监听longtoken
  useEffect(() => {
    if (longtoken) {
      // 当 longtoken 更新后执行的逻辑
      //console.log("longToken 更新:", longtoken);
    }
  }, [longtoken]) // 依赖 longtoken，当 token 变化时会触发

  useEffect(() => {
    // 从 URL 获取 token 参数
    const urlParams = new URLSearchParams(location.search)
    const tokenFromUrl = urlParams.get('token')
    // 只有当 token 为空时才更新状态，避免重复设置
    if (tokenFromUrl && token !== tokenFromUrl) {
      setToken(tokenFromUrl) // 设置 token 状态
    }
  }, [location.search, token]) // 依赖 location.search 和 token
  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [intervalId])
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      if (!isAgreed) {
        Message.error('请先勾选同意隐私条款和服务条款');
        return;
      }
    try {
      const data = await loginUser(email, password); // 调用登录函数
      //console.log("登录成功:", data);
      setTokenFunc(data.data.token as string);
      setToken1(data.data.token);
      setAuthtokenflag(true);
      navigate("/qanda");
    } catch (err) {
      Message.error(err?.response?.data?.message || "登录失败，请稍后重试");
    }
  };
  /*
    三方登录——微信
  */
  // 获取二维码
  const fetchQRCode = async () => {
    try {
      const data = await getWechatLoginQR()
      setTicket(data.data.ticket)
      setStatus('请使用微信扫码登录')
      setQrCodeUrl(
        `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${encodeURIComponent(
          data.data.ticket
        )}`
      )
      //console.log("二维码获取成功:", data);
      setPolling(false)
      // startPolling(); // 获取二维码后开始轮询登录状态
    } catch (error) {
      setStatus('获取二维码失败，请刷新重试')
      console.error('获取微信二维码失败:', error)
    }
  }
  const startPolling = () => {
    if (polling || !ticket) {
      //console.log("polling", polling, "ticket", ticket);
      return
    }
    setPolling(true)
    setStatus('正在检查登录状态...')
    const id = setInterval(async () => {
      try {
        const result = await checkWechatLoginCallback(ticket)
        //console.log("轮询结果:", result);
        if (result.code === 200) {
          setStatus('登录成功！')
          setTokenFunc(result.data.token as string)
          setToken1(result.data.token)
          setAuthtokenflag(true)
          navigate('/qanda')
          setPolling(false)
          if (intervalId) clearInterval(intervalId)
        } else if (result.code === 400) {
          setStatus('等待用户扫码或确认...')
        }
      } catch (error) {
        const external = 'wechat'
        // 使用类型断言将 error 转换为 AxiosError 类型
        const axiosError = error as AxiosError
        //console.log("bind", bind);
        //console.log("data", axiosError.response.data.data.code);
        // 确保 response 和 data 存在后再访问 code
        if (axiosError.response?.data?.data.code === 400001) {
          setBind(true)
          navigate('/bindregister', { state: { external } }) // 使用 navigate() 进行路由跳转
        } else {
          setStatus('检查登录状态失败，请稍后重试')
          setPolling(false)
          if (intervalId) clearInterval(intervalId)
          console.error('检查扫码登录状态失败:', error)
        }
      }
    }, 3000)

    setIntervalId(id)
  }

  /*
    三方登录——杭助
  */
  // 监听 helper 回传
  const startPollingHelper = () => {
    if (polling || !state || !code) return
    setPolling(true)
    setStatus('正在检查登录状态...')
    if (longtoken && state && code) {
      bindLogin()
    }
    const id = setInterval(async () => {
      try {
        //console.log("state", state, "code", code);
        const result = await checkHelperLoginCallback(state, code)
        //console.log("轮询结果:", result);
        if (result.code === 200) {
          setStatus('登录成功！')
          setTokenFunc(result.data.token as string)
          setToken1(result.data.token)
          setAuthtokenflag(true)
          navigate('/qanda')
          setPolling(false)
          if (intervalId) clearInterval(intervalId)
        } else if (result.code === 400) {
          setStatus('等待用户鉴权确认...')
        }
      } catch (error) {
        const external = 'hduhelp'
        // 使用类型断言将 error 转换为 AxiosError 类型
        const axiosError = error as AxiosError
        //console.log("bind", bind);
        //console.log("state", state, "code", code);
        //console.log("data", axiosError.response.data.data.code);
        // 确保 response 和 data 存在后再访问 code
        if (axiosError.response?.data?.data.code === 400001) {
          localStorage.setItem('stuffid', axiosError.response?.data?.data?.data?.id)
          setBind(true)
          navigate('/bindregister', { state: { external } }) // 使用 navigate() 进行路由跳转
        } else {
          setStatus('检查登录状态失败，请稍后重试')
          setPolling(false)
          if (intervalId) clearInterval(intervalId)
          console.error('检查扫码登录状态失败:', error)
        }
      }
    }, 3000) // 这里结束了 setInterval 的定义

    setIntervalId(id) // 设置 intervalId
  }
  // 监听 helper 回传
  useEffect(() => {
    if (code && state && state === '1a') {
      //console.log("code:", code);
      //console.log("state:", state);
      // 确保 code 和 state 都存在
      if (code && state) {
        startPollingHelper()
      } else {
        setStatus('缺少必要的参数')
      }
    }
  }, [code, state])

  //杭助跳转
  const handleHelperLogin = () => {
    const url = `https://api.hduhelp.com/oauth/authorize?response_type=code&client_id=jvbarBgwFKD78LMh&redirect_uri=${import.meta.env.VITE_callbackURL}/login&state=1a`
    window.location.href = url //当前窗口打开
    // window.open(url,'_blank');//新窗口打开
  }

  const handleVerify = () => {
    return new Promise((resolve, reject) => {
      if (!emailbind || !token) {
        // alert('缺少必要的信息，请检查链接或填写密码！');
        reject('缺少必要的信息')
        return
      }
      const randomString = randomatic('a0', 6)
      // 调用 verifyEmail，并获取返回的新 token
      verifyEmail(emailbind, token, randomString)
        .then(newData => {
          //console.log("新 token:", newData.data.token);
          setTokenFunc(newData.data.token as string)
          // resolve("");
          setToken1(newData.data.token) // 更新 token
          //console.log("token1", token1); // 这儿还会是之前的 token, 因为 setState 是异步的
          setAuthtokenflag(true) // 设置 token 状态
          resolve(newData.data.token as string) // 返回新 token
        })
        .catch(error => {
          // alert('激活失败，请稍后再试！');
          reject('激活失败')
          //console.log("verifyEmail激活失败");
        })
    })
  }
  const handleBindEmail = (longtoken: string) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (longtoken) {
          if (external === 'wechat') {
            bindWeChatEmail(longtoken)
              .then(resolve)
              .catch(() => {
                console.error('微信绑定失败')
                reject('微信绑定失败')
              })
          } else if (external === 'hduhelp') {
            if (!state || !code) {
              handleHelperLogin()
            } else {
              bindHDUEmail(longtoken, state, code)
                .then(resolve)
                .catch(error => {
                  console.error('绑定 HDUHelper 邮箱失败:', error)
                  reject('绑定 HDUHelper 邮箱失败')
                })
            }
          } else {
            reject('无效的 external 值')
          }
        } else {
          //console.log("longtoken 无效:", longtoken);
          reject('longtoken 无效')
        }
      }, 2000)
    })
  }

  const bindLogin = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!longtoken) {
        handleVerify()
          .then(newtoken => {
            return handleBindEmail(newtoken as string)
          })
          .then(data => {
            //console.log("绑定成功:", data);
            navigate('/qanda')
            resolve() // 绑定成功时返回成功
          })
          .catch(error => {
            setStatus('激活失败或 longtoken无效，请重新激活')
            console.error(error)
            reject(new Error('激活失败或 longtoken无效，请重新激活'))
          })
      } else {
        handleBindEmail(longtoken as string)
          .then(data => {
            //console.log("绑定成功:", data);
            navigate('/qanda')
            resolve() // 绑定成功时返回成功
          })
          .catch(error => {
            console.error('绑定失败:', error)
            setStatus('绑定邮箱失败，请刷新重试')
            reject(new Error('绑定邮箱失败，请刷新重试')) // 绑定失败时返回失败
          })
      }
    })
  }

  const [isAgreed, setIsAgreed] = useState(false)

  // return (
  //   <div className={style.body}>
  //     <div className={style.loginBox}>
  //       <h2 className={style.loginTitle}>Mundo 登录</h2>
  //       <div className={style.inputGroup}>
  //         <label htmlFor="email">邮箱：</label>
  //         <input
  //           type="email"
  //           id="email"
  //           value={email}
  //           onChange={handleEmailChange}
  //           placeholder="请输入邮箱"
  //           required
  //         />
  //       </div>
  //       <div className={style.inputGroup}>
  //         <label htmlFor="password">密码：</label>
  //         <input
  //           type="password"
  //           id="password"
  //           value={password}
  //           onChange={handlePasswordChange}
  //           placeholder="请输入密码"
  //           required
  //         />
  //       </div>
  //       <button className={style.loginBtn} onClick={handleLogin}>
  //         登录
  //       </button>
  //       {error && <p style={{ color: "red" }}>{error}</p>}
  //       <div className={style.otherLogin}>
  //         <button className={style.loginOption}>邮箱验证登录</button>
  //         <button className={style.loginOption}>手机号登录</button>
  //         <button className={style.loginOption} onClick={fetchQRCode}>
  //           微信登录
  //         </button>
  //         <button className={style.loginOption} onClick={handleHelperLogin}>
  //           HDUHelper登录
  //         </button>
  //       </div>
  //       {qrCodeUrl ? (
  //         <div>
  //           <p>{status}</p>
  //           <img
  //             src={qrCodeUrl}
  //             alt="微信登录二维码"
  //             style={{ width: "200px", height: "200px" }}
  //           />
  //           {!polling && (
  //             <button onClick={startPolling}>开始检查登录状态</button>
  //           )}
  //         </div>
  //       ) : (
  //         <p>{status}</p>
  //       )}
  //       {/* <button className={style.loginOption} onClick={bindLogin}>邮箱绑定</button> */}
  //       <p className={style.registerLink}>
  //         还没有账号？<Link to="/register">去注册</Link>
  //       </p>
  //       <p className={style.registerLink}>
  //         <Link to="/findKey">忘记密码？</Link>
  //       </p>
  //     </div>
  //   </div>
  // );
  return (
    <>
      <div className={style.authContainer}>
        {/* <Header /> */}

        <div className={style.gradientBackground}></div>

        <div className={style.authCard}>
          <div className={style.authHeader}>
            <h1 className={style.authTitle}>
              Welcome to <span>MUNDO</span>
            </h1>
            <p className={style.authSubtitle}>连接全球求知者 · 构建智慧共同体</p>
          </div>

          <div className={style.authBody}>
            <div className={style.authMain}>
              <div className={style.inputGroup}>
                <input
                  title='email'
                  type='email'
                  className={style.authInput}
                  placeholder=' '
                  value={email}
                  onChange={handleEmailChange}
                />
                <label className={style.inputLabel}>电子邮箱</label>
                <div className={style.inputUnderline}></div>
              </div>

              <div className={style.inputGroup}>
                <input
                  title='password'
                  type='password'
                  className={style.authInput}
                  placeholder=' '
                  value={password}
                  onChange={handlePasswordChange}
                />
                <label className={style.inputLabel}>登录密码</label>
                <div className={style.inputUnderline}></div>
              </div>

              <div className={style.inputGroup}>
                <div className={`${style.checkboxWrapper} ${!isAgreed ? style.hasError : ''}`}>
                  <input
                    type="checkbox"
                    id="agreement"
                    className={style.checkboxInput}
                    checked={isAgreed}
                    onChange={(e) => setIsAgreed(e.target.checked)}
                  />
                  <label htmlFor="agreement" className={style.checkboxLabel}>
                    我已阅读并同意
                    <span className={style.link} onClick={() => setPrivacyModalVisible(true)}>
                      《隐私政策》
                    </span> 和
                    <span className={style.link} onClick={() => setTermsModalVisible(true)}>
                      《服务条款》
                    </span>
                  </label>
                </div>

                  {!isAgreed && (
                      <p className={style.errorTip}>请先勾选同意隐私条款和服务条款</p>
                  )}
              </div>

              <button className={style.primaryButton} onClick={handleLogin}>
                <span>立即登录</span>
                <div className={style.buttonHover}></div>
              </button>

              <div className={style.socialAuth}>
                <button
                  className={`${style.socialButton} ${style.wechat}`}
                  onClick={fetchQRCode}
                >
                  <i className='icon-wechat'></i>
                  微信登录
                </button>
                <button
                  className={`${style.socialButton} ${style.hdu}`}
                  onClick={handleHelperLogin}
                >
                  <i className='icon-school'></i>
                  HDU Helper
                </button>
              </div>
            </div>

            <div className={style.authFooter}>
              <div className={style.footerLinks}>
                <Link to='/register' className={style.footerLink}>
                  创建新账号
                </Link>
                <div className={style.linkDivider}></div>
                <Link to='/findKey' className={style.footerLink}>
                  找回密码
                </Link>
              </div>
            </div>
          </div>

          {qrCodeUrl && (
            <div className={style.qrModal}>
              <div className={style.qrContainer}>
                <h3>微信扫码登录</h3>
                <img src={qrCodeUrl} alt='微信登录二维码' />
                <p className={style.qrStatus}>{status}</p>
                {!polling && (
                  <button className={style.secondaryButton} onClick={startPolling}>
                    已扫码，开始验证
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

    <PrivacyPolicyModal 
      visible={privacyModalVisible} 
      onClose={() => setPrivacyModalVisible(false)} 
    />
    <TermsOfServiceModal 
      visible={termsModalVisible} 
      onClose={() => setTermsModalVisible(false)} 
    />
      
    </>
  )
}

export default Login
