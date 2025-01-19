import {Component} from 'react'
import {useState, useEffect} from 'react';
import Navbar from "./Navbar";
import ItemList from "./ItemList";
import Header from '@/components/ui/Header/Header.tsx'

const App: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<string>("高数");
    const [activeTab, setActiveTab] = useState<string>("hot");

    return (
        <div
        style={{
            display:"flex",
            height:"100vh",
            width:"100vw",
            margin:"0 auto",
            justifyContent:"center"
        }}>
            <Header/>
            <div 
            style={{
                display:"flex",
                flexDirection:"row",
                marginTop:"80px"
            }}
            >
                <Navbar activeCategory={activeCategory} setActiveCategory={setActiveCategory}/>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        paddingTop: "200px",
                        backgroundColor: "#fff", // 设置大背景为白色
                        minHeight: "100vh", // 确保页面内容填充整个视口高度
                        color: "#000", // 所有文字显示为黑色
                        width: "60vw",
                        // margin: "0 auto", // 水平居中
                    }}
                >
                    <div style={{display: "flex", width: "80%"}}>
                        
                        <ItemList activeCategory={activeCategory} activeTab={activeTab}/>
                    </div>
                </div>            
            </div>    
        </div>
        

    );
};

export default App;
