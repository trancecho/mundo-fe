import React, { useState } from 'react'
import { deleteTeam, getMyTeam } from '@/router/api'
import { Popconfirm, Message, Button, Modal, Input } from '@arco-design/web-react'

export interface Team {
  id: number
  teamname: string
  introduction: string
  Now: number
  MAX: number
  require: string
  contact: string
}

interface TeamProps {
  Teams: Team[]
  onUpdateTeam: (team: Team) => Promise<void>
  fetchTeams?: () => Promise<void>
}

const TeamList: React.FC<TeamProps> = ({ Teams, onUpdateTeam, fetchTeams }) => {
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)

  const handleEditClick = (team: Team) => {
    setCurrentTeam(team)
    setEditModalVisible(true)
  }

  const handleInputChange = (value: string, field: keyof Team) => {
    if (!currentTeam) return
    setCurrentTeam({
      ...currentTeam,
      [field]: value
    })
  }

  const handleNumberChange = (value: string, field: 'Now' | 'MAX') => {
    if (!currentTeam) return
    setCurrentTeam({
      ...currentTeam,
      [field]: Number(value)
    })
  }

  const handleSubmit = async () => {
    if (!currentTeam) return
    setIsSubmitting(true)
    try {
      await onUpdateTeam(currentTeam)
      Message.success({
        content: '更新成功'
      })
    } finally {
      setIsSubmitting(false)
      setEditModalVisible(false)
    }
  }

  return (
    <div>
      {Teams.length === 0 ? (
        <p> No Items here</p>
      ) : (
        <>
          <div className='flex py-2 w-full self-strech'>
            <ul className='flex flex-col gap-2 w-full'>
              {Teams.map(team => (
                <li
                  key={team.id}
                  className='bg-[var(--surface-light)] rounded-xl p-[10px] border relative text-left border-[var(--border-color)]'
                >
                  <div className='text-[16px] font-medium '>{team.teamname}</div>
                  <p className=' mt-[5px] mb-[5px] text-[14px] max-w-[90%] overflow-hidden text-ellipsis whitespace-nowrap'>
                    {team.introduction}
                  </p>
                  <p className='text-sm text-gray-500 m-[0px] mt-[10px] text-[13px]'>
                    {' '}
                    人数: {team.Now}/{team.MAX}
                  </p>
                  <div className='flex gap-2 items-center justify-center rounded absolute bottom-[10px] right-[10px]'>
                    <Button
                      type='primary'
                      className='rounded'
                      onClick={() => handleEditClick(team)}
                    >
                      编辑
                    </Button>
                    <Popconfirm
                      focusLock
                      title='确认删除？'
                      content={`你确定要删除这个${team.teamname}队伍吗？`}
                      onOk={async () => {
                        const response = await deleteTeam(team.id)
                        if (response.code === 200) {
                          Message.info({
                            content: '删除成功'
                          })
                          await fetchTeams?.()
                        } else {
                          Message.error({
                            content: '删除失败，请稍后再试'
                          })
                        }
                      }}
                    >
                      <Button status='danger' className='rounded'>
                        删除
                      </Button>
                    </Popconfirm>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      <Modal
        title='组队资料'
        visible={editModalVisible}
        onOk={handleSubmit}
        onCancel={() => setEditModalVisible(false)}
        autoFocus={false}
        focusLock={true}
        style={{ width: '384px' }}
        okButtonProps={{ loading: isSubmitting }}
      >
        {currentTeam && (
          <div className='flex flex-col gap-2'>
            <div className='flex flex-row w-full items-start'>
              <p className='m-0 font-medium text-[16px] text-white'>标题：</p>
              <Input
                type='text'
                title='标题'
                value={currentTeam.teamname}
                onChange={value => handleInputChange(value, 'teamname')}
                className=' mx-2 flex-1 rounded-sm border border-gray-300 h-[1.5rem] focus:border-blue-500 focus:ring-blue-500'
              />
            </div>
            <div className='flex flex-row w-full items-start'>
              <p className='m-0 font-medium text-[16px] text-white'>描述：</p>
              <Input.TextArea
                title='描述'
                value={currentTeam.introduction}
                onChange={value => handleInputChange(value, 'introduction')}
                className=' mx-2 p-[20px] flex-1 rounded-sm border border-gray-300 h-[6rem] focus:border-blue-500 focus:ring-blue-500'
                style={{ height: '60px' }}
              />
            </div>
            <div className='flex flex-row w-full items-start'>
              <p className='m-0 font-medium text-[16px] text-white'>要求：</p>
              <Input.TextArea
                title='要求'
                value={currentTeam.require || ''}
                onChange={value => handleInputChange(value, 'require')}
                className=' mx-2 p-[20px] flex-1 rounded-sm border border-gray-300 h-[6rem] focus:border-blue-500 focus:ring-blue-500'
                style={{ height: '60px' }}
              />
            </div>
            <div className='flex flex-row w-full items-start'>
              <p className='m-0 font-medium text-[16px] text-white'>联系方式：</p>
              <Input
                type='text'
                title='联系方式'
                value={currentTeam.contact || ''}
                onChange={value => handleInputChange(value, 'contact')}
                className=' mx-2 flex-1 rounded-sm border border-gray-300 h-[1.5rem] focus:border-blue-500 focus:ring-blue-500'
              />
            </div>
            <div className='flex flex-row w-full text-black items-start'>
              <p className='m-0 font-medium text-[16px] text-white'>人数：</p>
              <Input
                title='人数1'
                type='number'
                value={currentTeam.Now.toString()}
                onChange={value => handleNumberChange(value, 'Now')}
                className=' mx-2 p-0 pl-[2px] pr-[2px] h-[1.5rem] rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                style={{ width: '40px' }}
              />
              <p className='m-0 font-medium text-[16px] text-white'>/</p>
              <Input
                title='人数2'
                type='number'
                value={currentTeam.MAX.toString()}
                onChange={value => handleNumberChange(value, 'MAX')}
                className=' mx-2 p-0 pl-[2px] pr-[2px] h-[1.5rem] rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                style={{ width: '40px' }}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default TeamList
