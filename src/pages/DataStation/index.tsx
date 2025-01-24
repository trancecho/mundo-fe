import { Outlet } from 'react-router-dom';
import Navbar from "./Navbar";
import Header from '@/components/ui/Header/Header.tsx'

const DataStation: React.FC = () => {
    return (
        <div style={{
            display: "flex",
            minHeight: "100vh",
            width: "100vw",
            margin: "0 auto",
            justifyContent: "center"
        }}>
            <Header/>
            <div style={{
                display: "flex",
                flexDirection: "row",
                marginTop: "80px",
                flex: 1,
                overflow: "auto"
            }}>
                <Navbar />
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    paddingTop: "20px",
                    backgroundColor: "#fff",
                    flex: 1,
                    overflow: "auto",
                    maxWidth: "730px",
                    margin: "0 auto"
                }}>
                    <div style={{
                        display: "flex", 
                        width: "100%",
                        flexDirection: "column",
                        flex: 1
                    }}>
                        <Outlet />
                    </div>
                </div>            
            </div>    
        </div>
    );
};

export default DataStation;
