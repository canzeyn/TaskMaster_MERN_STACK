import "../styles/header.scss";
import { Dropdown } from "react-bootstrap";
import { Offcanvas, Modal, Button } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {

  type UserInfo = {
    name: string;
    profilePictureUrl?: string;

  }
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userInfo , setUserInfo] = useState<UserInfo  | null> (null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handleLogOut = async () => {
    try {
      await axios.get("http://localhost:3000/logout", {
        withCredentials: true,
      });
      
      navigate("/");
    } catch (err) {
      console.log("(Header.tsx) çıkış yapma işleminde hata var", err);
    }
  };

  const fetchUsername = async () => {
    const response = await axios.get("http://localhost:3000/get-user" , {withCredentials:true})
    setUserInfo(response.data);
    console.log(userInfo);
  }

  useEffect(() => {
    fetchUsername();
  },[]);

  console.log(userInfo);

   const navigateToProfileSettings = () => {
    navigate("/profileSettings"); }

    const renderUserProfile = () => {
      try {
        // Eğer profil fotoğrafı varsa, URL'sini döndür
        if (userInfo && userInfo.profilePictureUrl) {
          return <img src={userInfo.profilePictureUrl} alt="Profil" className="profile-photo" />;
        }
        // Eğer profil fotoğrafı yoksa, kullanıcının adını döndür
        // else if (userInfo && userInfo.name) {
        //   return <div className="profile-initial">{userInfo.name.charAt(0)}</div>;
        // }
        // Eğer userInfo boşsa veya beklenmedik bir durum varsa
        // else {
        //   return 'Kullanıcı bilgisi mevcut değil';
        // }
      } catch (error) {
        console.error('renderUserProfile fonksiyonunda hata:', error);
        return 'Bir hata oluştu.';
      }
    };


  return (
    <>
      <div className="header-box">
        <div>
          <h3 className="title-header">TaskMaster</h3>
        </div>

        <div className="menu">
          <p>New Todo</p>
          <p>all Todos</p>
          <p>finished Works</p>

          <Dropdown>
            <Dropdown.Toggle
              id="dropdown-basic"
              className="profile-photo-header"
            >
                {renderUserProfile()}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={navigateToProfileSettings}>
                Profil Düzenle
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
            <p className="text-white">New Todo</p>
            <p className="text-white">All Todos</p>
            <p className="text-white">Finished Works</p>
            <Dropdown>
              <Dropdown.Toggle
                id="dropdown-basic"
                className="profile-photo-header"
                
              >
                  {renderUserProfile()}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={navigateToProfileSettings}>
                  Profil Düzenle
                </Dropdown.Item>
                <Dropdown.Item onClick={handleShowModal}>Çıkış Yap</Dropdown.Item>
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
