import React, { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Cross2Icon, ReloadIcon } from '@radix-ui/react-icons'
import { deleteTeam, getMyTeam } from '@/router/api'
import { Popconfirm, Message, Button } from '@arco-design/web-react'
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
  const token = localStorage.getItem('longtoken')
  const handleEditClick = (team: Team) => {
    setCurrentTeam(team)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof Team
  ) => {
    if (!currentTeam) return
    setCurrentTeam({
      ...currentTeam,
      [field]: e.target.value
    })
  }

  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'Now' | 'MAX'
  ) => {
    if (!currentTeam) return

    setCurrentTeam({
      ...currentTeam,
      [field]: Number(e.target.value)
    })
  }

  const handleSubmit = async () => {
    if (!currentTeam) return
    setIsSubmitting(true)
    try {
      await onUpdateTeam(currentTeam)
      // await updateTeam(token as string,currentTeam.id as number,currentTeam.teamname,currentTeam.Now,currentTeam.MAX,currentTeam.introduction,currentTeam.require as string,currentTeam.contact as string);
    } finally {
      setIsSubmitting(false)
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
                  className='bg-[var(--surface-light)] rounded-xl p-4 border relative text-left border-[var(--border-color)]'
                >
                  <h3 className='font-bold text-lg mb-1'>{team.teamname}</h3>
                  <p className='text-sm  mb-2 max-w-[90%] overflow-hidden text-ellipsis whitespace-nowrap'>
                    {team.introduction}
                  </p>
                  <p className='text-sm text-gray-500 m-[0px] mt-[1rem]'>
                    {' '}
                    人数: {team.Now}/{team.MAX}
                  </p>
                  <div className='flex gap-2 items-center justify-center rounded absolute bottom-4 right-4'>
                    <Dialog.Root>
                      <Dialog.Trigger asChild>
                        {/* <div className='px-3 py-1 rounded absolute bottom-4 right-4'> */}
                        <Button
                          type='primary'
                          className='rounded'
                          onClick={() => handleEditClick(team)}
                        >
                          编辑
                        </Button>
                        {/* </div> */}
                      </Dialog.Trigger>
                      {currentTeam && (
                        <Dialog.Portal>
                          <Dialog.Overlay className='fixed inset-0 bg-black/50' />
                          <Dialog.Content className='fixed top-1/2 left-1/2 w-96 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg'>
                            <div className='flex flex-col gap-1.5'>
                              <Dialog.Title className='text-[1.5rem] font-bold text-center text-black'>
                                组队资料
                              </Dialog.Title>

                              <div className='mt-4 flex flex-row w-full items-center'>
                                <p className='font-medium text-[1.25rem] text-black '>
                                  标题：
                                </p>
                                <input
                                  type='text'
                                  title='标题'
                                  value={currentTeam.teamname}
                                  onChange={e => handleInputChange(e, 'teamname')}
                                  className='mt-1 mx-2 flex-1 rounded-sm border border-gray-300 h-[1.5rem] focus:border-blue-500 focus:ring-blue-500'
                                />
                              </div>
                              <div className='flex flex-row w-full items-center'>
                                <p className='font-medium text-[1.25rem] text-black '>
                                  描述：
                                </p>
                                <textarea
                                  title='描述'
                                  // type='text'
                                  value={currentTeam.introduction}
                                  onChange={e => handleInputChange(e, 'introduction')}
                                  className='mt-1 mx-2 p-[20px] flex-1 rounded-sm border border-gray-300 h-[6rem] focus:border-blue-500 focus:ring-blue-500'
                                />
                              </div>
                              <div className='flex flex-row w-full items-center'>
                                <p className='font-medium text-[1.25rem] text-black '>
                                  要求：
                                </p>
                                <textarea
                                  title='要求'
                                  // type='text'
                                  value={currentTeam.require || ''}
                                  onChange={e => handleInputChange(e, 'require')}
                                  className='mt-1 mx-2 p-[20px] flex-1 rounded-sm border border-gray-300 h-[6rem] focus:border-blue-500 focus:ring-blue-500'
                                />
                              </div>
                              <div className='mt-4 flex flex-row w-full items-center'>
                                <p className='font-medium text-[1.25rem] text-black '>
                                  联系方式：
                                </p>
                                <input
                                  type='text'
                                  title='联系方式'
                                  value={currentTeam.contact || ''}
                                  onChange={e => handleInputChange(e, 'contact')}
                                  className='mt-1 mx-2 flex-1 rounded-sm border border-gray-300 h-[1.5rem] focus:border-blue-500 focus:ring-blue-500'
                                />
                              </div>
                              {/* <div className='mt-4 flex flex-row w-full items-center'>
                              <p className='font-medium text-[1.25rem] text-black '>
                                联系途径：
                              </p>
                              <input
                                type='text'
                                title='联系途径'
                                value={currentTeam.contact || ''}
                                onChange={e => handleInputChange(e, 'contact')}
                                className='mt-1 mx-2 flex-1 rounded-sm border border-gray-300 h-[1.5rem] focus:border-blue-500 focus:ring-blue-500'
                              />
                            </div> */}
                              <div className='flex flex-row w-full text-black items-center'>
                                <p className='font-medium text-[1.25rem] text-black '>
                                  人数：
                                </p>
                                <input
                                  title='人数1'
                                  type='number'
                                  value={currentTeam.Now}
                                  onChange={e => handleNumberChange(e, 'Now')}
                                  className='mt-1 mx-2 p-0 pl-[2px] w-[2rem] h-[1.5rem] rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                />
                                <p className='font-medium text-[1.25rem] text-black '>
                                  /
                                </p>
                                <input
                                  title='人数2'
                                  type='number'
                                  value={currentTeam.MAX}
                                  onChange={e => handleNumberChange(e, 'MAX')}
                                  className='mt-1 mx-2 p-0 pl-[2px] w-[2rem] h-[1.5rem] rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                />
                              </div>

                              <div className='mt-2 flex justify-center gap-10 w-full'>
                                <Dialog.Close asChild>
                                  <button
                                    disabled={isSubmitting}
                                    className={`px-8 py-2 rounded-md ${
                                      isSubmitting
                                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                        : 'bg-blue-600 text-white'
                                    }`}
                                    onClick={handleSubmit}
                                  >
                                    {isSubmitting ? (
                                      <ReloadIcon className='animate-spin' />
                                    ) : (
                                      '保存修改'
                                    )}
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
                      )}
                    </Dialog.Root>
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
                      // onCancel={() => {
                      //   Message.error({
                      //     content: 'cancel'
                      //   })
                      // }}
                    >
                      <Button
                        status='danger'
                        className='rounded'
                        onClick={() => handleEditClick(team)}
                      >
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
    </div>
  )
}

export default TeamList
