import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import styles from '../components/Dashboard/Dashboardpage.module.css';
export default class FrontPage extends Component {
  render() {
    return (
        <div className={styles.body}>
            <h2 className={styles.dashboardHeader}>MUNDO</h2>
            <p className={styles.dashboardWelcome}>欢迎进入MUNDO！</p>
            <nav className={styles.dashboardNav}>
                <ul>
                    <li><Link to="/login">去登录</Link></li>
                    <li><Link to="/register">去注册</Link></li>
                </ul>
            </nav>
        </div>
    );
  }
}
