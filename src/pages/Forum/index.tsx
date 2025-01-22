import React, { Component } from "react";
import Header from "@/components/ui/Header/Header.tsx";
import style from "./forum.module.css";
export default class Forum extends Component {
  render() {
    return <div>Forum</div>;
    return (
      <div className={style.body}>
        <Header />
        <div style={{ marginTop: "100px" }}>Forum</div>
      </div>
    );
  }
}
