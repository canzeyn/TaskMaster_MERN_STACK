
import "../styles/header.scss";
import { Dropdown } from "react-bootstrap";
import { Offcanvas, Modal, Button } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Header: React.FC = () => {
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
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
              a
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#/profil-duzenle">
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
              a
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#/profil-duzenle">
                Profil Düzenle
              </Dropdown.Item>
              <Dropdown.Item href="#/cikis-yap">Çıkış Yap</Dropdown.Item>
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
          <Button variant="primary" onClick={() => { /* Çıkış yapma işlemleri */ }}>
            Çıkış Yap
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
    </>
  );
};

export default Header;
