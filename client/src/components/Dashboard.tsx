import React from "react";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { Offcanvas, OffcanvasHeader, OffcanvasBody } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import Users from "./AdminContent/Users";
import "../styles/Dashboard.scss";
import AllTodos from "./AdminContent/AllTodos";
import axios from "axios";
import BackupRestore from "./AdminContent/BackupRestore";

const Dashboard: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<String | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const selectComponent = async (selectComponent: string) => {
    setSelectedComponent(selectComponent); // state içine atılıyor
    setIsOpen(false); // menü kapatılıyor

    try {
      // Sunucuya loglama isteği gönder
      await axios.post(
        "http://localhost:3000/dashboard",
        {
          path: selectComponent,
          timestamp: new Date().toISOString(),
        },
        { withCredentials: true }
      );

      console.log("Component selection logged successfully");
    } catch (error) {
      console.error("Error logging component selection:", error);
    }
  };

  const renderComponent = () => {
    // burada switch case yapısı ile eğer menüden seçenek seçilmişse o seçenek ekrana geliyor seçilmiş yoksa default çalışıyor
    switch (
      selectedComponent // seçili kısım state içinden alınıyor
    ) {
      case "Users":
        return <Users />;
      case "AllTodos":
        return <AllTodos />;
      case "BackupRestore":
        return <BackupRestore />;

      default:
        return <p>bir sayfa seçiniz menüden</p>;
    }
  };

  return (
    <>
      <div className="dashboardContainer">
        {/* ikon alanı */}
        <div>
          <AiOutlineMenuUnfold className="menuIconDashboard" onClick={toggle} />
        </div>

        {/* içerik alanı */}
        <div>{renderComponent()}</div>
      </div>

      <div>
        <Offcanvas isOpen={isOpen} toggle={toggle} scrollable>
          <OffcanvasHeader toggle={toggle}>Admin Dashboard</OffcanvasHeader>
          <OffcanvasBody>
            <div className="canvasBodyMenu">
              <p onClick={() => selectComponent("Users")}>Users</p>
              <p onClick={() => selectComponent("AllTodos")}>Todos</p>
              <p onClick={() => selectComponent("BackupRestore")}>
                Backup Data
              </p>
            </div>
          </OffcanvasBody>
        </Offcanvas>
      </div>
    </>
  );
};

export default Dashboard;
