import React, { useState, useEffect } from "react";
import Header from '@/components/ui/Header/Header.tsx'
import style from "./teamup.module.css";
import { useAuth } from '@/context/AuthContext';
type detail = {
  ID: number
  Name: string;
  Introduction: string;
  Require: string;
  Contact: string;
  Number: number;
  Publisher: string;
}

const Detail = ({ detail, jumpto , apply }: { detail: detail; jumpto: () => void; apply:()=>void }) => {

  return (
    <div className={style.information}>
      <div className={style.alert__close} onClick={jumpto}>&times;</div>
      <div className={style.header}>
        <div><h3>{detail.Name}</h3></div>
        <div className={style.name}>
          <span>{detail.Publisher}</span>
          <div className={style.image}></div>
        </div>
      </div>
      <div className={style.detail}>{detail.Introduction}</div>
      <div className={style.require}>
        <span>要求：</span>
        <span>{detail.Require}</span>
      </div>
      <div className={style.contact}>
        <span>联系方式：</span>
        <span>{detail.Contact}</span>
      </div>
      <div className={style.bottom}>
        <div className={style.people}>人数：{detail.Number}</div>
        <div className={style.buttonWrapper}>
          <button className={style.button2}>
            <span className={style.buttonText} onClick={apply}>加入</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const Item = ({ detail, jumpto, check }: { detail: detail; jumpto: () => void; check: number | undefined }) => {
  return (
    <div className={style.item}>
      <div className={check !== undefined && check === detail.ID ? style.econtent : style.content}>
        <div className={style.header}>
          <div><h3>{detail.Name}</h3></div>
          <div className={style.name}>
            <span>{detail.Publisher}</span>
            <div className={style.image}></div>
          </div>
        </div>
        <div className={style.detail}>{detail.Introduction}</div>
        <div className={style.bottom}>
          <div className={style.people}>人数：{detail.Number}</div>
          <button className={style.button} onClick={jumpto}>
            <span className={style.buttonName}>Learn more</span>
            <i className={`${style.buttonIcon} fa fa-arrow-right`}></i>
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
    console.log(id);
  };

  useEffect(() => {
    fetch('http://116.198.207.159:12349/api/allteam?service=mundo', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${longtoken}`
      }
    }).then(res => res.json()).then(data => {
      console.log(data.data.Team.Content);
      setData(data.data.Team.Content);
    });
  }, [longtoken]);

  const apply = async (id:number)=>{
    const response= await fetch('http://116.198.207.159:12349/api/allteam?ID=1&service=mundo',{
      method:'POST',
      headers: {
        'Authorization': `Bearer ${longtoken}`,
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        id:id
      })
    })
    const data = await response.json();
    console.log(data);
    alert(data.message);
  }

  return (
    <div style={{ all: 'initial' }}>
      <div className={style.body}>
        <Header />
        <div className={style.container}>
          <div className={style.list}>
            {data.map((item) => (
              <Item key={item.ID} detail={item} jumpto={() => jumpto(item.ID)} check={check} />
            ))}
          </div>
          {result && <Detail detail={result} jumpto={() => jumpto(undefined)} apply={()=>apply(result.ID)} />}
        </div>
      </div>
    </div>
  );
};

export default TeamUp;
