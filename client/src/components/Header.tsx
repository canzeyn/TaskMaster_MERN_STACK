import "../styles/header.scss";
import { Dropdown } from "react-bootstrap";
import { Offcanvas, Modal, Button } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdOutlineLanguage } from "react-icons/md";

const Header: React.FC = () => {
  type UserInfo = {
    name: string;
    profilePictureUrl?: string;
  };
  const navigate = useNavigate();
  const [show, setShow] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [userRoleData , setUserRoleData] = useState<string>("")

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handleLogOut = async () => {
    try {
      await axios.get("http://localhost:3000/logout", {
        // sunucuya istek atılıyor
        withCredentials: true,
      });

      navigate("/"); // çıkış işlemi başarılı olursa anasayfaya yönlendiriliyor
    } catch (err) {
      console.log("(Header.tsx) çıkış yapma işleminde hata var", err);
    }
  };

  const fetchUsername = async () => {
    const response = await axios.get("http://localhost:3000/get-user", {
      withCredentials: true,
    });
    setUserInfo(response.data);
    console.log(userInfo);
  };

 useEffect(() => {
    fetchUsername();
  }, []);

  const fetchRoleData = async () => {
    const roleData =  await axios.get("http://localhost:3000/auth/check", {
      withCredentials: true,
    });
    setUserRoleData(roleData.data.role);
  };

  useEffect(() => {
       fetchRoleData();
  },[])

 


  console.log(userInfo);

  const navigateToProfileSettings = () => {
    navigate("/profileSettings");
  };

  const navigateToDashboard = () => {
    navigate("/dashboard");
  };

  const renderUserProfile = () => {
    try {
      // Eğer profil fotoğrafı varsa, URL'sini döndür
      if (userInfo && userInfo.profilePictureUrl) {
        return (
          <img
            src={userInfo.profilePictureUrl}
            alt="Profil"
            className="profile-photo"
          />
        );
      }
      // Eğer profil fotoğrafı yoksa, kullanıcının adını döndür
      else if (userInfo && userInfo.name) {
        return <div className="profile-initial" style={{color:"black" , fontSize:"20px" , marginTop:"7px" , fontWeight:"700" , border:"1px solid", padding:"10px" , borderRadius:"80%"}}>{userInfo.name.charAt(0)}</div>;
      }
      // Eğer userInfo boşsa veya beklenmedik bir durum varsa
      else {
        return "Kullanıcı bilgisi mevcut değil";
      }
    } catch (error) {
      console.error("renderUserProfile fonksiyonunda hata:", error);
      return "Bir hata oluştu.";
    }
  };

  const navigateToFinishedWorks = () => {
    navigate("/finishedWorks");
  };

  const navigateToChart = () => {
    navigate("/chart")
  }

  return (
    <>
      <div className="header-box">
        <div>
          <h3 className="title-header">TaskMaster</h3>
        </div>

        <div className="menu">
          {
           userRoleData === "admin" &&  <p onClick={navigateToDashboard}>dashboard</p>
          }
         
          <p onClick={navigateToFinishedWorks}>Finished Works</p>

          <p onClick={navigateToChart}>Reports</p>

          <Dropdown>
            <Dropdown.Toggle
              id="dropdown-basic"
              className="profile-photo-header bg-transparent border-0"
            >
              {renderUserProfile()}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={navigateToProfileSettings}>
                Profil Düzenle
              </Dropdown.Item>
              <Dropdown.Item className="headerLanguageArea" onClick={navigateToProfileSettings}>
              <MdOutlineLanguage className="headerLanguageIcon" />  <p className="headerLanguageSelect">TR</p>
              </Dropdown.Item>

              <Dropdown.Item className="headerLanguageArea" onClick={navigateToProfileSettings}>
              <MdOutlineLanguage className="headerLanguageIcon" />  <p className="headerLanguageSelect">EN</p>
              </Dropdown.Item>

              
              <Dropdown.Item onClick={handleShowModal}>Çıkış Yap</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div className="hamburger-menu" onClick={handleShow}>
          <FaBars />
        </div>

        <Offcanvas show={show} onHide={handleClose} placement="start">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menü</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="bg-dark">
           
            <p onClick={navigateToFinishedWorks} className="text-white">
              Finished Works
            </p>
            <Dropdown>
              <Dropdown.Toggle
                id="dropdown-basic"
                className="profile-photo-header bg-transparent"
              >
                {renderUserProfile()}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={navigateToProfileSettings}>
                  Profil Düzenle
                </Dropdown.Item>
                <Dropdown.Item onClick={handleShowModal}>
                  Çıkış Yap
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            {/* Diğer menü öğeleri */}
          </Offcanvas.Body>
        </Offcanvas>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Çıkış Yap</Modal.Title>
          </Modal.Header>
          <Modal.Body>Çıkış yapmak istediğinize emin misiniz?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              İptal
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                handleLogOut();
              }}
            >
              Çıkış Yap
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default Header;
