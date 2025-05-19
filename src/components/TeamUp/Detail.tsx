import React, { useEffect, useRef } from "react";
import style from "./teamup.module.css";

type detail = {
  ID: number;
  Name: string;
  Introduction: string;
  Require: string;
  Contact: string;
  Number: number;
  Publisher: string;
};

const Detail = ({
  detail,
  jumpto,
  apply,
}: {
  detail: detail;
  jumpto: () => void;
  apply: () => Promise<any>;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const applyto = () => {
    apply()
      .then((res) => {
        if (res.data.code === 200) {
          alert("申请成功！");
          jumpto();
        }
      })
      .catch((err) => {
        alert(err.response.data.message);
        jumpto();
      });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        jumpto();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [jumpto]);

  return (
    <div className={style.mask}>
      <div className={style.teampick} ref={ref}>
        <div className={style.alert__close} onClick={jumpto}>
          &times;
        </div>
        <div className={style.header}>
          <h3 className={style.teamName}>{detail.Name}</h3>
          <div className={style.teamMeta}>
            <span>{detail.Publisher}</span>
            <div className={style.image}></div>
          </div>
        </div>
        <div className={style.teamDescription}>描述：{detail.Introduction}</div>
        <div className={style.teamMeta}>
          <span>联系方式：</span>
          <span>{detail.Contact}</span>
        </div>
        <div className={style.teamMeta}>
          <div>人数：{detail.Number}</div>
          <div>请自行联系负责人</div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
