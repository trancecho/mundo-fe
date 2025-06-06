import React, { useState, useEffect } from 'react'
import style from './mobileteamup.module.css'
import { useAuth } from '@/context/AuthContext'
import { getteamup, searchTeam } from '../../router/api'
import { Notification, Modal } from '@arco-design/web-react'

type detail = {
  ID: number
  Name: string
  Introduction: string
  Require: string
  Contact: string
  Number: number
  Publisher: string
}

const Detail = ({
  detail,
  visible,
  onClose
}: {
  detail: detail
  visible: boolean
  onClose: () => void
}) => {
  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={null}
      title={detail.Name}
      style={{ maxWidth: '90%' }}
    >
      <div className={style.modalContent}>
        <div className={style.teamMeta}>
          <div className={style.label}>发布者</div>
          <div>{detail.Publisher}</div>
        </div>
        <div className={style.teamDescription}>
          <div className={style.label}>项目描述</div>
          <div>{detail.Introduction}</div>
        </div>
        <div className={style.teamMeta}>
          <div className={style.label}>招募要求</div>
          <div>{detail.Require}</div>
        </div>
        <div className={style.teamMeta}>
          <div className={style.label}>联系方式</div>
          <div>{detail.Contact}</div>
        </div>
        <div className={style.teamMeta}>
          <div className={style.label}>招募人数</div>
          <div>{detail.Number} 人</div>
        </div>
      </div>
    </Modal>
  )
}

const Item = ({ detail, onClick }: { detail: detail; onClick: () => void }) => {
  return (
    <div className={style.teamCard} onClick={onClick}>
      <div className={style.header}>
        <h3 className={style.teamName}>{detail.Name}</h3>
      </div>
      <div className={style.teamDescription}>{detail.Introduction}</div>
      <div className={style.teamMetaNumber}>
        <div>人数：{detail.Number}</div>
      </div>
    </div>
  )
}

const TeamContent = () => {
  const { longtoken } = useAuth()
  const [data, setData] = useState<detail[]>([])
  const [selectedTeam, setSelectedTeam] = useState<detail | null>(null)

  const handleTeamClick = (team: detail) => {
    let longtoken = localStorage.getItem('longtoken')
    if (!longtoken) {
      Notification.info({
        closable: false,
        title: '请先登录',
        content: '请先登录后再进行操作。'
      })
      return
    }
    setSelectedTeam(team)
  }

  useEffect(() => {
    getteamup().then(data => {
      setData(data.data.data.Team.Content)
    })
  }, [longtoken])

  useEffect(() => {
    const handleSearch = (event: CustomEvent<{ searchText: string }>) => {
      const searchQuery = event.detail.searchText
      if (searchQuery) {
        searchTeam(searchQuery)
          .then(response => {
            if (response.data && response.data.data.FilteredTeam) {
              const formattedData = response.data.data.FilteredTeam.map((item: any) => ({
                ID: item.id,
                Name: item.name,
                Introduction: item.introduction,
                Require: item.require,
                Contact: item.contact,
                Number: item.number,
                Publisher: item.publisher
              }))
              setData(formattedData)
            } else {
              setData([])
            }
          })
          .catch(error => {
            setData([])
          })
      } else {
        getteamup().then(data => {
          if (
            data.data &&
            data.data.data &&
            data.data.data.Team &&
            data.data.data.Team.Content
          ) {
            setData(data.data.data.Team.Content)
          }
        })
      }
    }

    window.addEventListener('doTeamSearch', handleSearch as EventListener)

    return () => {
      window.removeEventListener('doTeamSearch', handleSearch as EventListener)
    }
  }, [])

  return (
    <div className={style.container}>
      <div className={style.teamGrid}>
        {data.map(item => (
          <Item key={item.ID} detail={item} onClick={() => handleTeamClick(item)} />
        ))}
      </div>
      {selectedTeam && (
        <Detail
          detail={selectedTeam}
          visible={!!selectedTeam}
          onClose={() => setSelectedTeam(null)}
        />
      )}
    </div>
  )
}

const TeamUp = () => {
  return <TeamContent />
}

export default TeamUp
