import { Outlet } from 'react-router-dom';
import Navbar from "./Navbar";
import Header from '@/components/ui/Header/Header.tsx'

const DataStation: React.FC = () => {
    return (
        <div style={{
            display: "flex",
            height: "100vh",
            width: "100vw",
            margin: "0 auto",
            justifyContent: "center"
        }}>
            <Header/>
            <div style={{
                display: "flex",
                flexDirection: "row",
                marginTop: "80px"
            }}>
                <Navbar />
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    paddingTop: "200px",
                    backgroundColor: "#fff",
                    minHeight: "100vh",
                    color: "#000",
                    width: "60vw",
                }}>
                    <div style={{display: "flex", width: "80%"}}>
                        <Outlet />
                    </div>
                </div>            
            </div>    
        </div>
    );
};

export default DataStation;
