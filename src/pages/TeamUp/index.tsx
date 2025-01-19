import React, { Component } from 'react'
import Header from '@/components/ui/Header/Header.tsx'
import style from './teamup.module.css';

export default class TeamUp extends Component {
  render() {
    return (
      <div className={style.body}>
        <Header/>
        <div style={{marginTop:'180px'}}>
        TeamUp
        </div>
      </div>
    )
  }
}
