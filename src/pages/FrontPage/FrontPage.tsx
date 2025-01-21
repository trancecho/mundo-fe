import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import styles from './FrontPage.module.css';
export default class FrontPage extends Component {
  render() {
    return (
      <div className={styles.body}>
        <div className={styles.box}>
            <h2 className={styles.dashboardHeader}>MUNDO</h2>
            <p className={styles.dashboardWelcome}>欢迎进入MUNDO！</p>
            <nav className={styles.dashboardNav}>
                <ul className={styles.goto}>
                    <li><Link to="/login">去登录</Link></li>
                    <li><Link to="/register">去注册</Link></li>
                    <li><Link to="/qanda">去首页</Link></li>
                    <li><Link to="/houtai">去后台</Link></li>
                </ul>
            </nav>
        </div>        
      </div>

    );
  }
}
