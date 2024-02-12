import React from "react";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import {  Offcanvas, OffcanvasHeader, OffcanvasBody } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import Users from "./AdminContent/Users";
import "../styles/Dashboard.scss";

const Dashboard: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<String | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const selectComponent = (selectComponent: string) => { // seçili seçenek burada işleniyor
    setSelectedComponent(selectComponent); // state içine atılıyor
    setIsOpen(false); // menü kapatılıyor
  }; 

  const renderComponent = () => { // burada switch case yapısı ile eğer menüden seçenek seçilmişse o seçenek ekrana geliyor seçilmiş yoksa default çalışıyor
    switch (selectedComponent) { // seçili kısım state içinden alınıyor
      case "Users":
        return <Users />;

      default:
        return <p>bir sayfa seçiniz menüden</p>;
    }
  };

  return (
    <>
      <div className="dashboardContainer">
        {/* ikon alanı */}
        <div>
          <AiOutlineMenuUnfold  className="menuIconDashboard" onClick={toggle} />
        </div>

        {/* içerik alanı */}
        <div>
        {renderComponent()}
        </div>
      </div>

      <div>
       
      
        <Offcanvas isOpen={isOpen} toggle={toggle} scrollable>
          <OffcanvasHeader toggle={toggle}>Admin Dashboard</OffcanvasHeader>
          <OffcanvasBody>
            <div className="canvasBodyMenu">
              <p onClick={() => selectComponent("Users")}>Users</p>
              <p>Todos</p>
              <p>Deleted Todos</p>
              <p>Completed Todos</p>
              <p>UnCompleted Todos</p>
            </div>
          </OffcanvasBody>
        </Offcanvas>
      </div>
    </>
  );
};

export default Dashboard;
