import React, { useState, useEffect, useRef } from 'react'
import TeamList from '@/pages/Info/TeamList'
import Header from '@/components/Header/Header'
import { useNavigate } from 'react-router-dom'
import * as Dialog from '@radix-ui/react-dialog'
import { Cross2Icon, ReloadIcon } from '@radix-ui/react-icons'
import {
  getAvatar,
  generateAvatar,
  updateAvatar,
  updatePerson,
  addTeam,
  getMyTeam,
  getProfile
} from '@/router/api'
import styles from '@/components/Header/Header.module.css'
import { Contact } from 'lucide-react'
import type { Team } from '@/pages/Info/TeamList'

import { updateTeam as updatedTeamAPI } from '@/router/api'

// interface Team {
//   id: string;
//   teamname: string;
//   introduction: string;
//   Now: number;
//   MAX: number;
// }
interface User {
  id: string
  name: string
  email: string
}

const InfoManage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)
  const [teamList, setTeamList] = useState<Team[]>([])
  const DEFAULT_AVATAR =
    'https://cdn.pixabay.com/photo/2018/05/31/15/06/see-no-evil-3444212_1280.jpg'
  const [avatar, setAvatar] = useState<string | null>(DEFAULT_AVATAR)
  const navigate = useNavigate()
  const token = localStorage.getItem('longtoken')
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [username, setUsername] = useState('')

  //以下是组队资料
  const [TeamTitle, setTeamTitle] = useState<String | null>('')
  const [TeamDiscribe, setTeamDiscribe] = useState<String | null>('')
  const [TeamRequest, setTeamRequest] = useState<String | null>('')
  const [TeamTel, setTeamTel] = useState<String | null>('')
  const [TeamWay, setTeamWay] = useState<String | null>('')
  const [TeamNowNumber, setTeamNowNumber] = useState<number | null>(null)
  const [TeamTotalNumber, setTeamTotalNumber] = useState<number | null>(null)

  const isFormValid = () => {
    return (
      TeamTitle !== null &&
      TeamTitle.trim() !== '' &&
      TeamDiscribe !== null &&
      TeamDiscribe.trim() !== '' &&
      TeamRequest !== null &&
      TeamRequest.trim() !== '' &&
      TeamTel !== null &&
      TeamTel.trim() !== '' &&
      TeamNowNumber !== null &&
      TeamTotalNumber !== null
    )
  }
  // 获取队伍列表
  const fetchTeams = async () => {
    try {
      const data = await getMyTeam(token as string)
      const fetchedTeams: Team[] = data.map((team: any) => ({
        id: team.ID,
        teamname: team.Name,
        introduction: team.Introduction,
        Now: parseInt(team.Number.split('/')[0]),
        MAX: parseInt(team.Number.split('/')[1]),
        require: team.Require,
        contact: team.Contact
      }))
      setTeamList(fetchedTeams)
    } catch (error) {
      console.error('获取队伍列表失败：', error)
    }
  }
  //更新team
  const handleUpdateTeam = async (updateTeam: Team) => {
    try {
      await updatedTeamAPI(
        token as string,
        updateTeam.id as number,
        updateTeam.teamname,
        updateTeam.Now,
        updateTeam.MAX,
        updateTeam.introduction,
        updateTeam.require as string,
        updateTeam.contact as string
      )
      setTeamList(teamList.map(t => (t.id === updateTeam.id ? updateTeam : t)))
    } catch (error) {
      console.error('更新失败', error)
      throw error
    }
  }
  //获取个人信息
  const fetchProfile = async () => {
    try {
      const data = await getProfile(token as string)
      const fetchedUser: User = {
        id: data.data.id,
        name: data.data.username,
        email: data.data.email
      }
      setUser(fetchedUser)
    } catch (error) {
      console.error('获取个人信息失败：', error)
    }
  }
  useEffect(() => {
    const begin = async () => {
      await fetchProfile()
      await fetchTeams()
    }
    begin()
  }, [])

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const avatarBlob = await getAvatar(token as string)
        if (!avatarBlob) {
          setAvatar(DEFAULT_AVATAR)
          return
        }
        if (avatar) {
          URL.revokeObjectURL(avatar)
        }
        const avatarUrl = URL.createObjectURL(avatarBlob)
        setAvatar(avatarUrl)
      } catch (error) {
        console.error('获取头像失败', error)
        setAvatar(DEFAULT_AVATAR)
      }
    }
    fetchAvatar()
    return () => {
      if (avatar) {
        URL.revokeObjectURL(avatar)
      }
    }
  }, [token])

  // 生成随机头像
  const handleGenerateAvatar = async () => {
    try {
      const response = await generateAvatar(token as string)
      //console.log("avatar", response);
      if (response.code === 200) {
        const avatarData = await getAvatar(token as string)
        const avatarUrl = URL.createObjectURL(avatarData as Blob)
        setAvatar(avatarUrl)
      } else {
        throw new Error('生成头像失败')
      }
    } catch (error) {
      console.error('生成头像失败', error)
    }
  }

  // 点击头像触发文件上传
  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  // 处理头像上传
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      console.warn('未选择文件')
      return
    }
    try {
      const response = await updateAvatar(token as string, file)
      const avatarBlob = await getAvatar(token as string)
      if (!avatarBlob) {
        setAvatar(DEFAULT_AVATAR)
        return
      }
      if (avatar) {
        URL.revokeObjectURL(avatar)
      }
      const avatarUrl = URL.createObjectURL(avatarBlob)
      setAvatar(avatarUrl)
    } catch (error) {
      console.error('头像上传失败', error)
    }
  }

  // 处理个人信息更新
  const handleSubmitUpdate = async () => {
    try {
      const response = await updatePerson(token as string, username)
      //console.log('更新成功:', response.data);
    } catch (error) {
      console.error('更新失败:', error)
    }
  }

  // 新建队伍
  const handleSubmitTeamAdd = async () => {
    try {
      await addTeam(
        token as string,
        TeamTitle as string,
        TeamNowNumber as number,
        TeamTotalNumber as number,
        TeamDiscribe as string,
        TeamRequest as string,
        TeamWay?.concat(':').concat(TeamTel as string) as string
      )
      fetchTeams()
    } catch (error) {
      //console.log('添加组队信息失败', error);
    }
  }
  return (
    <>
      <div className='flex flex-col min-h-screen w-full mx-auto relative justify-center'>
        {/* <Header /> */}
        <div className='flex flex-col mt-[12vh]  items-center mb-8 p-8 rounded-xl bg-[var(--surface)] backdrop-blur-md border border-[var(--border-color)] shadow-lg flex-1 overflow-auto max-w-[900px] min-w-[600px] transition-all duration-300 ease-in-out mx-auto'>
          <div className='flex flex-row w-full relative'>
            <div className='w-[6.25rem] h-[6.25rem] rounded-full ml-[1.25rem] mt-[1.25rem] overflow-hidden'>
              <img
                src={avatar ? avatar : DEFAULT_AVATAR}
                className='w-full h-full object-cover '
                alt='UserImage'
              />
            </div>
            <div className='flex flex-col ml-[0.625rem] mt-[1.25rem] text-left gap-2 h-[6.25rem] justify-center align-center'>
              <p className='font-bold text-[1.25rem] text-white'>{user?.name}</p>
              <p className='text-[1rem] text-white'>{user?.email}</p>
            </div>
            <div className='flex p-[0.2rem_0.5rem] absolute right-[1rem] top-[1rem]'>
              <div className={styles.searchButton}>
                <Dialog.Root>
                  <Dialog.Trigger asChild>
                    <p className='text-[1rem] text-white cursor-pointer'>修改个人信息</p>
                  </Dialog.Trigger>
                  <Dialog.Portal>
                    <Dialog.Overlay className='fixed inset-0 bg-black/50' />
                    <Dialog.Content className='fixed top-1/2 left-1/2 w-96 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg'>
                      <div className='flex flex-col gap-4'>
                        <Dialog.Title className='text-[1.5rem] font-bold text-center text-white'>
                          个人资料编辑
                        </Dialog.Title>
                        <div className='mt-4 flex flex-col items-center relative'>
                          <div className='relative w-20 h-20 rounded-full bg-gray-300 overflow-hidden cursor-pointer'>
                            <img
                              src={avatar ? avatar : DEFAULT_AVATAR}
                              alt='头像'
                              className='w-full h-full object-cover'
                              onClick={handleAvatarClick}
                            />
                            <button
                              title='随机'
                              onClick={handleGenerateAvatar}
                              className='absolute right-0 bottom-0 bg-white p-1 rounded-full shadow-md'
                            >
                              <ReloadIcon className='w-5 h-5 text-gray-500 hover:text-gray-700' />
                            </button>
                          </div>
                          <p className='text-xs text-gray-500 absolute right-0 bottom-0'>
                            点击头像上传新头像
                          </p>
                          <input
                            title='inputAvatar'
                            type='file'
                            ref={fileInputRef}
                            className='hidden'
                            accept='image/*'
                            onChange={event => {
                              handleFileChange(event)
                            }}
                          />
                        </div>
                        <div className='mt-4 flex flex-row w-full justify-center items-center'>
                          <p className='font-medium text-[1.25rem] text-black '>
                            用户名：
                          </p>
                          <input
                            title='username'
                            type='text'
                            onChange={e => setUsername(e.target.value)}
                            className='mx-2 flex-1 rounded-sm border border-gray-300 h-[2rem] focus:border-blue-500 focus:ring-blue-500'
                          />
                        </div>
                        <div className='mt-2 flex justify-center gap-10 w-full'>
                          <Dialog.Close asChild>
                            <button
                              className={styles.searchButton}
                              onClick={handleSubmitUpdate}
                            >
                              提交表单
                            </button>
                          </Dialog.Close>
                        </div>
                      </div>
                      <Dialog.Close asChild>
                        <div className='absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700'>
                          <Cross2Icon />
                        </div>
                      </Dialog.Close>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>
              </div>
            </div>
          </div>

          <div className='flex flex-col justify-center w-full p-[1.25rem]'>
            <div className='flex flex-row justify-between items-center relative w-full'>
              <p className='font-bold text-[1.25rem] text-white'>我的队伍</p>
              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <p className='text-[1rem] text-blue-500'> 创建新队伍</p>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className='fixed inset-0 bg-black/50' />
                  <Dialog.Content className='fixed top-1/2 left-1/2 w-96 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg'>
                    <div className='flex flex-col gap-1.5'>
                      <Dialog.Title className='text-[1.5rem] font-bold text-center text-black'>
                        组队资料
                      </Dialog.Title>

                      <div className='mt-4 flex flex-row w-full items-center'>
                        <p className='font-medium text-[1.25rem] text-black '>标题：</p>
                        <input
                          type='text'
                          title='标题'
                          onChange={e => setTeamTitle(e.target.value)}
                          className='mt-1 mx-2 flex-1 rounded-sm border border-gray-300 h-[1.5rem] focus:border-blue-500 focus:ring-blue-500'
                        />
                      </div>
                      <div className='flex flex-row w-full  items-center'>
                        <p className='font-medium text-[1.25rem] text-black '>描述：</p>
                        <textarea
                          title='描述'
                          // type='text'
                          onChange={e => setTeamDiscribe(e.target.value)}
                          className='mt-1 mx-2 flex-1 p-[20px] rounded-sm border border-gray-300 h-[6rem] focus:border-blue-500 focus:ring-blue-500'
                        />
                      </div>
                      <div className='flex flex-row w-full  items-center'>
                        <p className='font-medium text-[1.25rem] text-black '>要求：</p>
                        <textarea
                          title='要求'
                          // type='text'
                          onChange={e => setTeamRequest(e.target.value)}
                          className='mt-1 mx-2 flex-1 p-[20px] rounded-sm border border-gray-300 h-[6rem] focus:border-blue-500 focus:ring-blue-500'
                        />
                      </div>
                      <div className='mt-4 flex flex-row w-full items-center'>
                        <p className='font-medium text-[1.25rem] text-black '>
                          联系方式：
                        </p>
                        <input
                          type='text'
                          title='联系方式'
                          onChange={e => setTeamTel(e.target.value)}
                          className='mt-1 mx-2 flex-1 rounded-sm border border-gray-300 h-[1.5rem] focus:border-blue-500 focus:ring-blue-500'
                        />
                      </div>
                      <div className='mt-4 flex flex-row w-full items-center'>
                        <p className='font-medium text-[1.25rem] text-black '>
                          联系途径：
                        </p>
                        <input
                          type='text'
                          title='联系途径'
                          onChange={e => setTeamWay(e.target.value)}
                          className='mt-1 mx-2 flex-1 rounded-sm border border-gray-300 h-[1.5rem] focus:border-blue-500 focus:ring-blue-500'
                        />
                      </div>
                      <div className='flex flex-row w-full items-center'>
                        <p className='font-medium text-[1.25rem] text-black '>人数：</p>
                        <input
                          title='人数1'
                          type='number'
                          onChange={e => setTeamNowNumber(Number(e.target.value))}
                          className='mt-1 mx-2 p-0 pl-[2px] w-[2rem] h-[1.5rem] rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                        />
                        <p className='font-medium text-[1.25rem] text-black '>/</p>
                        <input
                          title='人数2'
                          type='number'
                          onChange={e => setTeamTotalNumber(Number(e.target.value))}
                          className='mt-1 mx-2 p-0 pl-[2px] w-[2rem] h-[1.5rem] rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                        />
                      </div>

                      <div className='mt-2 flex justify-center gap-10 w-full'>
                        <Dialog.Close asChild>
                          <button
                            disabled={!isFormValid()}
                            className={`px-8 py-2 rounded-md ${isFormValid()
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                              }`}
                            onClick={handleSubmitTeamAdd}
                          >
                            提交表单
                          </button>
                        </Dialog.Close>
                      </div>
                    </div>
                    <Dialog.Close asChild>
                      <button
                        title='关闭'
                        className='absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700'
                      >
                        <Cross2Icon />
                      </button>
                    </Dialog.Close>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            </div>
            <TeamList
              Teams={teamList}
              fetchTeams={fetchTeams}
              onUpdateTeam={handleUpdateTeam}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default InfoManage
