import React from "react";
import style from "../../pages/TeamUp/teamup.module.css";

type detail = {
  ID: number;
  Name: string;
  Introduction: string;
  Require: string;
  Contact: string;
  Number: number;
  Publisher: string;
};

const Item = ({
  detail,
  jumpto,
  check,
}: {
  detail: detail;
  jumpto: () => void;
  check: number | undefined;
}) => {
  return (
    <div className={style.teamGrid}>
      <div
        className={
          check !== undefined && check === detail.ID
            ? `${style.teamCard} ${style.active}`
            : style.teamCard
        }
      >
        <div className={style.header}>
          <h3 className={style.teamName}>{detail.Name}</h3>
          <div className={style.teamMeta}>
            <span>{detail.Publisher}</span>
            <div className={style.image}></div>
          </div>
        </div>
        <div className={style.teamDescription}>{detail.Introduction}</div>
        <div className={style.teamMeta}>
          <div>人数：{detail.Number}</div>
          <button className={style.joinButton} onClick={jumpto}>
            <span>了解更多</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Item;
