import React from 'react';
import styles from '../Info.module.css'

const InfoChange: React.FC = () =>{

    return (
        <div className={styles.body}>
            <div className={styles.container}>

                <div className={styles.title}> 个人资料编辑</div>

                <div>
                    <img src="" alt=""/>
                </div>

                <div>
                    <label htmlFor="username"> 用户名 </label>
                    <input className={styles.input} id="username"/>
                </div>
                <div>
                    <label htmlFor="email"> 邮箱 </label> <input className={styles.input} id="email"/>
                </div>

                <div>
                    <label htmlFor=""></label>
                </div>

            </div>
        </div>
    )
}


export default InfoChange;