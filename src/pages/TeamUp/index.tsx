import React, { useState, useEffect, useRef } from "react";
import Header from '@/components/ui/Header/Header.tsx'
import style from "./teamup.module.css";
import { useAuth } from '@/context/AuthContext';
import { getteamup, apply } from "../../router/api";
import { SearchProvider, useSearch } from "@/components/ui/Header/SearchContext";

type detail = {
  ID: number
  Name: string;
  Introduction: string;
  Require: string;
  Contact: string;
  Number: number;
  Publisher: string;
}



const Detail = ({ detail, jumpto, apply }: { detail: detail; jumpto: () => void; apply: () => Promise<any> }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const applyto = () => {
    apply().then(res => {
      if (res.data.code === 200) {
        alert('申请成功！');
        jumpto(); 
      }
    }).catch(err => {
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
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [jumpto, ref]);
  return (
    <div className={style.mask}>
      <div className={style.teampick} ref={ref}>
        <div className={style.alert__close} onClick={jumpto}>&times;</div>
        <div className={style.header}>
          <h3 className={style.teamName}>{detail.Name}        
          </h3>
          <div className={style.teamMeta}>
              <span>{detail.Publisher}</span>
              <div className={style.image}></div>
          </div>
        </div>
        <div className={style.teamDescription}>描述：{detail.Introduction}</div>
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
          <button className={style.joinButton} onClick={applyto}>
            <span>加入</span>
          </button>
        </div>
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

const TeamContent = () => {
  const { longtoken } = useAuth();
  const [data, setData] = useState<detail[]>([]);
  const [check, setcheck] = useState<number | undefined>(undefined);
  const { searchText } = useSearch();
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const result = check !== undefined ? data.find(item => item.ID === check) : undefined;

  const filteredTeams = data.filter((team) => {
    const categoryMatch = selectedCategory === '全部' || team.Require.includes(selectedCategory);
    const searchMatch = !searchText || [
      team.Name,
      team.Introduction,
      team.Publisher,
      team.Require
    ].some((text) => text.toLowerCase().includes(searchText.toLowerCase()));
    return categoryMatch && searchMatch;
  });

  const jumpto = (id: number | undefined) => {
    setcheck(id);
  };

  useEffect(() => {
    getteamup().then(data => {
      setData(data.data.data.Team.Content);
    });
  }, [longtoken]);

  return (
    <div className={style.container}>
      <Header />
      <div className={style.teamGrid}>
        {filteredTeams.map((item) => (
          <Item key={item.ID} detail={item} jumpto={() => jumpto(item.ID)} check={check} />
        ))}
      </div>
      {result && <Detail detail={result} jumpto={() => jumpto(undefined)} apply={() => apply(result.ID)} />}
    </div>
  );
};

const TeamUp = () => {
  return (
    <SearchProvider>
      <TeamContent />
    </SearchProvider>
  );
};

export default TeamUp;
