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
            justifyContent: "center",
            position: "relative",
        }}>
            <Header/>
            <div style={{
                display: "flex",
                flexDirection: "row",
                marginTop: "110px",
                flex: 1,
                overflow: "auto",
            }}>
                <Navbar />
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    paddingTop: "0px",
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                    flex: 1,
                    overflow: "auto",
                    maxWidth: "900px",
                    margin: "0 auto",
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
