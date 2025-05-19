import React from "react";
import style from "./teamup.module.css";

const SkeletonCard = () => (
  <div className={style.teamGrid}>
    <div className={`${style.teamCard} ${style.skeleton}`}>
      <div className={style.skeletonHeader}></div>
      <div className={style.skeletonLine}></div>
      <div className={style.skeletonFooter}></div>
    </div>
  </div>
);

export default SkeletonCard;
