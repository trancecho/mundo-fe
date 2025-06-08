import React, { useState, useEffect, useRef } from 'react'
import MobileTeamList from '@/pages/Info/MobileTeamList'
import { useNavigate } from 'react-router-dom'
import { ReloadIcon } from '@radix-ui/react-icons'
import {
  getAvatar,
  generateAvatar,
  updateAvatar,
  updatePerson,
  addTeam,
  getMyTeam,
  getProfile
} from '@/router/api'
import type { Team } from '@/pages/Info/TeamList'
import { updateTeam as updatedTeamAPI } from '@/router/api'
import styles from './MobilePage.module.css'
import { Modal, Input, Message } from '@arco-design/web-react'

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

  const [visible, setVisible] = useState(false)
  const [teamModalVisible, setTeamModalVisible] = useState(false)

  const resetForm = () => {
    setTeamTitle('')
    setTeamDiscribe('')
    setTeamRequest('')
    setTeamTel('')
    setTeamWay('')
    setTeamNowNumber(null)
    setTeamTotalNumber(null)
  }

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
      setVisible(false)
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
      Message.success('创建成功')
      setTeamModalVisible(false)
      resetForm()
    } catch (error) {}
  }

  return (
    <>
      <div className={styles.container}>
        <div className='flex flex-col items-center p-[10px] rounded-xl bg-[var(--surface)] backdrop-blur-md border border-[var(--border-color)] shadow-lg flex-1 overflow-auto w-full transition-all duration-300 ease-in-out mx-auto'>
          <div className='flex flex-row w-full relative pl-[10px] pt-[10px] items-center'>
            <div className='w-[3rem] h-[3rem] rounded-full overflow-hidden'>
              <img
                src={avatar ? avatar : DEFAULT_AVATAR}
                className='w-full h-full object-cover '
                alt='UserImage'
              />
            </div>
            <div className='flex flex-col text-left ml-[10px] h-[60px] justify-center align-center'>
              <p className='font-bold text-[16px] m-0 text-white'>{user?.name}</p>
              <p className='text-[14px] m-0 text-white'>{user?.email}</p>
            </div>
            <div className='flex absolute right-[0px] top-[10px]'>
              <div className={styles.searchButton}>
                <p
                  className='text-[14px] m-0 text-white cursor-pointer'
                  onClick={() => setVisible(true)}
                >
                  修改个人信息
                </p>
              </div>
            </div>
          </div>

          <div className='flex flex-col justify-center w-full p-[10px] px-[0px] mt-[10px]'>
            <div className='flex flex-row justify-between items-center relative w-full'>
              <p className='font-medium text-[16px] m-0 text-white'>我的队伍</p>
              <p
                className='text-[14px] m-0 text-blue-500 cursor-pointer'
                onClick={() => setTeamModalVisible(true)}
              >
                创建新队伍
              </p>
            </div>
            <MobileTeamList
              Teams={teamList}
              fetchTeams={fetchTeams}
              onUpdateTeam={handleUpdateTeam}
            />
          </div>
        </div>
      </div>
      <Modal
        title='个人资料编辑'
        visible={visible}
        onOk={handleSubmitUpdate}
        onCancel={() => setVisible(false)}
        autoFocus={false}
        focusLock={true}
        style={{ width: '384px' }}
      >
        <div className='flex flex-col gap-4'>
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
            <p className='font-medium text-[16px] text-white'>用户名：</p>
            <Input
              title='username'
              onChange={e => setUsername(e)}
              style={{ marginLeft: '8px', flex: 1 }}
            />
          </div>
        </div>
      </Modal>
      <Modal
        title='组队资料'
        visible={teamModalVisible}
        onOk={handleSubmitTeamAdd}
        onCancel={() => {
          setTeamModalVisible(false)
          resetForm()
        }}
        afterOpen={() => resetForm()}
        autoFocus={false}
        focusLock={true}
        style={{ width: '384px' }}
        okButtonProps={{ disabled: !isFormValid() }}
      >
        <div className='flex flex-col gap-1.5'>
          <div className='mt-4 flex flex-row w-full items-center'>
            <p className='font-medium text-[16px] text-white'>标题：</p>
            <Input
              type='text'
              title='标题'
              value={TeamTitle as string}
              onChange={e => setTeamTitle(e)}
              style={{ marginLeft: '8px', flex: 1 }}
            />
          </div>
          <div className='flex flex-row w-full items-start'>
            <p className='font-medium text-[16px] mt-0 text-white'>描述：</p>
            <Input.TextArea
              title='描述'
              value={TeamDiscribe as string}
              onChange={e => setTeamDiscribe(e)}
              style={{ marginLeft: '8px', flex: 1, height: '60px' }}
            />
          </div>
          <div className='flex flex-row w-full items-start'>
            <p className='font-medium text-[16px] mt-0 text-white'>要求：</p>
            <Input.TextArea
              title='要求'
              value={TeamRequest as string}
              onChange={e => setTeamRequest(e)}
              style={{ marginLeft: '8px', flex: 1, height: '60px' }}
            />
          </div>
          <div className='mt-4 flex flex-row w-full items-center'>
            <p className='font-medium text-[16px] text-white'>联系方式：</p>
            <Input
              type='text'
              title='联系方式'
              value={TeamTel as string}
              onChange={e => setTeamTel(e)}
              style={{ marginLeft: '8px', flex: 1 }}
            />
          </div>
          <div className='mt-4 flex flex-row w-full items-center'>
            <p className='font-medium text-[16px] text-white'>联系途径：</p>
            <Input
              type='text'
              title='联系途径'
              value={TeamWay as string}
              onChange={e => setTeamWay(e)}
              style={{ marginLeft: '8px', flex: 1 }}
            />
          </div>
          <div className='flex flex-row w-full items-center'>
            <p className='font-medium text-[16px] text-white'>人数：</p>
            <Input
              title='人数1'
              type='number'
              value={TeamNowNumber?.toString()}
              onChange={e => setTeamNowNumber(Number(e))}
              style={{ marginLeft: '8px', width: '40px', paddingRight: '5px' }}
            />
            <p className='font-medium text-[16px] text-white mx-2'>/</p>
            <Input
              title='人数2'
              type='number'
              value={TeamTotalNumber?.toString()}
              onChange={e => setTeamTotalNumber(Number(e))}
              style={{ width: '40px', paddingRight: '5px' }}
            />
          </div>
        </div>
      </Modal>
    </>
  )
}

export default InfoManage
