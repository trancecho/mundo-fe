import React, { useState, useEffect } from "react";
import Header from '@/components/ui/Header/Header.tsx'
import style from "./teamup.module.css";
import { useAuth } from '@/context/AuthContext';
import { getteamup,apply} from "../../router/api";

type detail = {
  ID: number
  Name: string;
  Introduction: string;
  Require: string;
  Contact: string;
  Number: number;
  Publisher: string;
}



const Detail = ({ detail, jumpto, apply }: { detail: detail; jumpto: () => void; apply: () => void }) => {
  return (
    <div className={style.teamCard}>
      <div className={style.alert__close} onClick={jumpto}>&times;</div>
      <div className={style.header}>
        <h3 className={style.teamName}>{detail.Name}</h3>
        <div className={style.teamMeta}>
          <span>{detail.Publisher}</span>
          <div className={style.image}></div>
        </div>
      </div>
      <div className={style.teamDescription}>{detail.Introduction}</div>
      <div className={style.teamMeta}>
        <span>要求：</span>
        <span>{detail.Require}</span>
      </div>
      <div className={style.teamMeta}>
        <span>联系方式：</span>
        <span>{detail.Contact}</span>
      </div>
      <div className={style.teamMeta}>
        <div>人数：{detail.Number}</div>
        <button className={style.joinButton} onClick={apply}>
          <span>加入</span>
        </button>
      </div>
    </div>
  );
};

const Item = ({ detail, jumpto, check }: { detail: detail; jumpto: () => void; check: number | undefined }) => {
  return (
    <div className={style.teamGrid}>
      <div className={check !== undefined && check === detail.ID ? `${style.teamCard} ${style.active}` : style.teamCard}>
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

const TeamUp = () => {
  const { longtoken } = useAuth();
  const [data, setData] = useState<detail[]>([]);
  const [check, setcheck] = useState<number | undefined>(undefined);
  const result = check ? data.find(item => item.ID === check) : undefined;

  const jumpto = (id: number | undefined) => {
    setcheck(id);
    //console.log(id);
  };

  useEffect(() => {
    getteamup().then(data => {
      console.log(data.data.data.Team.Content);
      setData(data.data.data.Team.Content);
    });
  }, [longtoken]);

  return (
    <div className={style.container}>
      <Header />
      <div className={style.teamGrid}>
        {data.map((item) => (
          <Item key={item.ID} detail={item} jumpto={() => jumpto(item.ID)} check={check} />
        ))}
      </div>
      {result && <Detail detail={result} jumpto={() => jumpto(undefined)} apply={() => apply(result.ID)} />}
    </div>
  );
};

export default TeamUp;
