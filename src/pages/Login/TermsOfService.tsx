import React from "react";
import { Link } from "react-router-dom";
import style from "./TermsOfService.module.css";

const TermsOfService = () => {
  return (
    <div className={style.container}>
      <div className={style.header}>
        <h1>服务条款</h1>
        <Link to="/login" className={style.backButton}>
          返回登录
        </Link>
      </div>
      
      <div className={style.content}>
        <h2>1. 用户权利与义务</h2>
        <p>用户需遵守社区规范，不得发布违法或侵权内容...</p>

        <h2>2. 平台责任</h2>
        <p>我们致力于提供安全可靠的服务，但不保证绝对无瑕疵...</p>

        {/* 更多条款内容 */}
      </div>
    </div>
  );
};

export default TermsOfService;