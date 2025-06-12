import React, { useState, useEffect } from 'react'
import style from '@/pages/Login/Auth.module.css'
import Header from '@/components/Header/Header'

// 定义API响应类型
interface ApiResponse {
  code?: number
  err_code?: number
  message?: string
}

// 定义URL参数类型
interface UrlParams {
  token: string | null
  email: string | null
}

// 定义组件状态类型
interface VerificationState {
  password: string
  confirmPassword: string
  turnstileToken: string
  message: string
  isSuccess: boolean
  isLoading: boolean
  tokenValid: boolean
}

const EmailVerification: React.FC = () => {
  const [state, setState] = useState<VerificationState>({
    password: '',
    confirmPassword: '',
    turnstileToken: '',
    message: '',
    isSuccess: false,
    isLoading: false,
    tokenValid: true
  })

  // 从URL获取参数
  const getUrlParams = (): UrlParams => {
    const query = new URLSearchParams(window.location.search)
    return {
      token: query.get('token'),
      email: query.get('email')
    }
  }

  // 更新状态辅助函数
  const updateState = (partialState: Partial<VerificationState>) => {
    setState(prev => ({ ...prev, ...partialState }))
  }

  // 验证密码是否匹配
  const validatePasswords = (): boolean => {
    return (
      state.password.length > 0 &&
      state.confirmPassword.length > 0 &&
      state.password === state.confirmPassword
    )
  }

  // 验证表单是否可提交
  const validateForm = (): boolean => {
    return validatePasswords() && state.turnstileToken.length > 0
  }

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    updateState({ isLoading: true })

    const params = getUrlParams()
    if (!params.token || !params.email) {
      showResult('验证参数无效，请检查链接是否完整', false)
      updateState({ isLoading: false })
      return
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_authURL}/verify-complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: params.token,
          email: params.email,
          password: state.password,
          'cf-turnstile-response': state.turnstileToken
        })
      })

      const data: ApiResponse = await response.json()

      // @ts-ignore
      if (data.err_code === 200000 || data.err_code === 'Success') {
        showResult('邮箱验证成功！您的账号已创建，3秒后将跳转到登录页面...', true)
        setTimeout(() => {
          // window.location.href = import.meta.env.VITE_callback + "/login";
          window.location.href = '/login'
        }, 3000)
      } else {
        showResult(data.message || '验证失败，请重新注册', false)
      }
    } catch (error) {
      showResult('验证过程中发生错误，请稍后重试', false)
      console.error('Verification error:', error)
    } finally {
      updateState({ isLoading: false })
    }
  }

  // 显示结果消息
  const showResult = (msg: string, success: boolean) => {
    updateState({
      message: msg,
      isSuccess: success
    })
  }

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    updateState({
      [id]: value,
      message: '' // 清空错误信息当用户重新输入时
    } as Pick<VerificationState, keyof VerificationState>)
  }

  // 初始化检查token
  useEffect(() => {
    const checkToken = async () => {
      const params = getUrlParams()
      if (!params.token || !params.email) {
        showResult('验证参数缺失，请检查链接是否完整', false)
        updateState({ tokenValid: false })
        return
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_authURL}/check-token?token=${params.token}&email=${params.email}`
        )
        const data: ApiResponse = await response.json()

        if (data.code !== 200) {
          showResult(`${data.message || '验证令牌无效，请重新注册'}`, false)
          updateState({ tokenValid: false })
        }
      } catch (error) {
        showResult('验证过程中发生错误，请稍后重试', false)
        console.error('Token check error:', error)
        updateState({ tokenValid: false })
      }
    }

    checkToken()
  }, [])

  // // 加载Turnstile脚本
  // useEffect(() => {
  //   const script = document.createElement('script')
  //   script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
  //   script.async = true
  //   script.defer = true
  //   document.body.appendChild(script)
  //
  //   return () => {
  //     document.body.removeChild(script)
  //   }
  // }, [])

  // 声明Turnstile回调函数到window对象
  // useEffect(() => {
  //   ;(window as any).turnstileCallback = (token: string) => {
  //     updateState({ turnstileToken: token })
  //   }
  //
  //   return () => {
  //     delete (window as any).turnstileCallback
  //   }
  // }, [])

  return (
    <>
      <div className={style.authContainer}>
        <div className={style.authCard}>
          <h1>邮箱验证</h1>
          <p>您正在验证 Mundo 账号的邮箱地址。请设置您的账号密码并完成人机验证。</p>
          <div className={style.authCard}>
            <form onSubmit={handleSubmit}>
              <div className={style.inputGroup}>
                <input
                  type='password'
                  id='password'
                  className={style.authInput}
                  placeholder='请输入密码'
                  required
                  value={state.password}
                  onChange={handleInputChange}
                />
              </div>

              <div className={style.inputGroup}>
                <input
                  type='password'
                  id='confirmPassword'
                  className={style.authInput}
                  placeholder='请再次输入密码'
                  required
                  value={state.confirmPassword}
                  onChange={handleInputChange}
                />
              </div>

              {/*{state.tokenValid && (*/}
              {/*  <div className='turnstile'>*/}
              {/*    <div*/}
              {/*      className='cf-turnstile'*/}
              {/*      data-sitekey='0x4AAAAAABCu_mdkNh8Woksu'*/}
              {/*      data-callback='turnstileCallback'*/}
              {/*    ></div>*/}
              {/*  </div>*/}
              {/*)}*/}

              <button
                type='submit'
                // disabled={!validateForm() || state.isLoading}
                className={style.primaryButton}
              >
                {state.isLoading ? '处理中...' : '完成验证'}
              </button>

              {state.message && (
                <div className={`result ${state.isSuccess ? 'success' : 'error'}`}>
                  {state.message}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default EmailVerification
