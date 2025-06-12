import React, { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { ResetKey } from '../../router/api.ts'
import style from '../Login/Login.module.css'
const Reset: React.FC = () => {
  const [password, setPassword] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const email = searchParams.get('email') // 从 URL 获取 email
  const token = searchParams.get('token') // 从 URL 获取 token
  //console.log(email, token);

  const handleVerify = async () => {
    if (!password || !email || !token) {
      alert('缺少必要的信息，请检查链接或填写密码！')
      return
    }

    try {
      await ResetKey(email, token, password)
      setIsVerified(true)
      alert('密码重置成功！')
      navigate('/login') // 跳转到登录页面
    } catch (error) {
      console.error('重置失败:', error)
      alert('重置失败，请稍后再试！')
    }
  }

  return (
    <>
      <div className={style.body}>
        <div className='specialBox mt-[2rem] flex justify-center items-center h-[20rem] w-[24rem]'>
          <div className='flex flex-col rounded gap-2'>
            <h2 className='authTitle mb-[10px]'>Mundo 激活账户</h2>
            {isVerified ? (
              <p className='text-normal text-base text-white'>
                重置成功！即将跳转到登录页面。
              </p>
            ) : (
              <>
                <div className={style.inputGroup}>
                  <label
                    htmlFor='password'
                    className='text-normal text-base text-white'
                    style={{ color: 'white' }}
                  >
                    设置密码：
                  </label>
                  <input
                    id='password'
                    type='password'
                    value={password}
                    className='text-black'
                    onChange={e => setPassword(e.target.value)}
                    placeholder='请输入密码'
                  />
                </div>
                <button className='specialButton' onClick={handleVerify}>
                  重置密码
                </button>
              </>
            )}

            <p className='mt-[10px] text-normal text-xs text-white'>
              无需重置？
              <Link to='/login' className='text-normal text-xs text-white'>
                去登录
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Reset
